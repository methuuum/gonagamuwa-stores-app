#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rand::Rng;
use rusqlite::{params, Connection};
use serde_json::{Map, Value};
use std::{fs, path::PathBuf, sync::Mutex};
use tauri::{Manager, State};

const KEYS: [(&str, &str, bool); 7] = [
    ("tea_people", "people", true),
    ("tea_leaves", "leaves", true),
    ("tea_credits", "credits", true),
    ("tea_extra_deductions", "deductions", true),
    ("tea_billing_settings", "billingSettings", false),
    ("tea_confirmed_settlements", "settlements", true),
    ("tea_monthly_welfare", "welfareMonthlySettings", false),
];

struct AppState { db: Mutex<Connection>, root: PathBuf }
fn db_lock(s: &AppState) -> Result<std::sync::MutexGuard<'_,Connection>,String> { s.db.lock().map_err(|_| "Database lock poisoned".into()) }
fn is_key(k: &str) -> bool { KEYS.iter().any(|(x,_,_)| x == &k) }
// Backup files are created only on explicit user request and saved to the
// Windows Save As destination. They are never silently rotated or uploaded.
fn write_manual_backup(s: &AppState, destination: &str) -> Result<String,String> {
    let path=PathBuf::from(destination);
    if !path.is_absolute() || path.extension().and_then(|v|v.to_str()).map_or(true,|ext|!ext.eq_ignore_ascii_case("json")) {
        return Err("Please choose an absolute .json file destination".into());
    }
    let parent=path.parent().ok_or("Invalid backup destination")?;
    if !parent.is_dir(){return Err("The selected backup folder is unavailable".into())}
    let data=export_payload(s)?;
    // Write the complete snapshot first; replace the target only after it is complete.
    let file_name=path.file_name().ok_or("Invalid filename")?;
    let temporary=parent.join(format!(".{}.{}.tmp",file_name.to_string_lossy(),rand::thread_rng().gen::<u32>()));
    let result=(|| -> std::io::Result<()> {
        use std::io::Write;
        let mut file=fs::OpenOptions::new().write(true).create_new(true).open(&temporary)?;
        file.write_all(&data)?;
        file.sync_all()?;
        // Windows does not allow rename-overwrite; only remove existing target
        // after the new backup is safely written to its temporary file.
        if path.exists(){fs::remove_file(&path)?;}
        fs::rename(&temporary,&path)?;
        Ok(())
    })();
    if result.is_err(){let _=fs::remove_file(&temporary);}
    result.map_err(|e|format!("Backup write failed: {e}"))?;
    Ok(path.to_string_lossy().into_owned())
}
fn export_payload(s: &AppState) -> Result<Vec<u8>,String> {
    let db=db_lock(s)?;
    let mut obj=Map::new();
    for (key,dest,is_array) in KEYS {
        let value: Option<String>=db.query_row("SELECT json FROM app_data WHERE key=?1",[key],|row|row.get(0)).optional().map_err(|e|e.to_string())?;
        let parsed=match value {Some(v)=>serde_json::from_str(&v).map_err(|e|e.to_string())?,None=>if is_array{Value::Array(vec![])}else{Value::Object(Map::new())}};
        obj.insert(dest.to_string(),parsed);
    }
    serde_json::to_vec_pretty(&Value::Object(obj)).map_err(|e|e.to_string())
}
use rusqlite::OptionalExtension;
#[tauri::command]
fn load_all(state:State<'_,AppState>)->Result<std::collections::HashMap<String,Option<String>>,String>{
    let db=db_lock(&state)?;let mut ret=std::collections::HashMap::new();
    for (key,_,_) in KEYS {
        let v=db.query_row("SELECT json FROM app_data WHERE key=?1",[key],|r|r.get(0)).optional().map_err(|e|e.to_string())?;
        ret.insert(key.to_string(),v);
    }Ok(ret)
}
#[tauri::command]
fn write_batch(state:State<'_,AppState>,entries:Vec<(String,Option<String>)>)->Result<(),String>{
    if entries.len()>KEYS.len(){return Err("Too many entries".into())}
    for (key,v) in &entries {
        if !is_key(key){return Err("Unknown database key".into())}
        if let Some(json)=v {
            if json.len()>30_000_000 {return Err("Record too large".into())}
            let parsed: Value=serde_json::from_str(json).map_err(|e|e.to_string())?;
            if !parsed.is_array() && !parsed.is_object(){return Err("Invalid JSON structure".into())}
        }
    }
    let mut db=db_lock(&state)?;
    let tx=db.transaction().map_err(|e|e.to_string())?;
    for (key,v) in entries {
        match v {Some(json)=>{tx.execute("INSERT INTO app_data(key,json) VALUES(?1,?2) ON CONFLICT(key) DO UPDATE SET json=excluded.json",params![key,json]).map_err(|e|e.to_string())?;},
        None=>{tx.execute("DELETE FROM app_data WHERE key=?1",[key]).map_err(|e|e.to_string())?;}}
    }
    tx.commit().map_err(|e|e.to_string())
}
#[tauri::command]
fn save_backup_to(state:State<'_,AppState>,destination:String)->Result<String,String>{
    write_manual_backup(&state,&destination)
}
fn main(){
    tauri::Builder::default()
      .plugin(tauri_plugin_dialog::init())
      .setup(|app| {
        let root=app.path().app_data_dir()?;
        fs::create_dir_all(&root)?;
        let dbpath=root.join("gonagamuwa-stores.sqlite");
        // First run: import a v3 Electron database without touching its original file.
        if !dbpath.exists() {
            if let Some(roaming)=std::env::var_os("APPDATA") {
                let old=PathBuf::from(roaming).join("Gonagamuwa Stores").join("gonagamuwa-stores.sqlite");
                if old.is_file() {
                    // Using SQLite's backup API avoids unsafe copies of a WAL database.
                    let old_db=Connection::open_with_flags(old,rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY)?;
                    let mut fresh=Connection::open(&dbpath)?;
                    let backup=rusqlite::backup::Backup::new(&old_db,&mut fresh)?;
                    backup.step(-1)?;
                }
            }
        }
        let db=Connection::open(&dbpath)?;
        db.execute_batch("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; CREATE TABLE IF NOT EXISTS app_data (key TEXT PRIMARY KEY, json TEXT NOT NULL) STRICT;")?;
        let state=AppState{db:Mutex::new(db),root};
        app.manage(state);
        Ok(())
      })
      .invoke_handler(tauri::generate_handler![load_all,write_batch,save_backup_to])
      .run(tauri::generate_context!())
      .expect("Failed to launch Gonagamuwa Stores");
}
