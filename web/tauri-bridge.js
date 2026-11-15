/* Tauri v2 bridge. The old UI has synchronous reads. We preload its seven keys,
   and serialize all asynchronous writes. Backups and app exit await all writes. */
const {core:{invoke},window:{getCurrentWindow},dialog:{save:chooseBackupSavePath}} = window.__TAURI__;
const KEYS = new Set(['tea_people','tea_leaves','tea_credits','tea_extra_deductions','tea_billing_settings','tea_confirmed_settlements','tea_monthly_welfare']);
const fatal = e => { console.error(e); document.body.textContent = 'Database එක Open කිරීම අසාර්ථකයි: '+String(e); };
async function main(){
  const cache=await invoke('load_all');
  let pending=Promise.resolve();
  let failed=null;
  const q=(name,args)=>{
    // Keep UI saves in the same order in which the user performed them.
    const request=pending.then(()=>invoke(name,args));
    pending=request.catch(error=>{failed=error;console.error('Database save error',error);alert('දත්ත සුරැකීම අසාර්ථකයි: '+error);});
    return request;
  };
  async function flush(){await pending;if(failed)throw new Error(String(failed));}
  const db={
    read(key){if(!KEYS.has(key))throw Error('Invalid key');return cache[key]??null;},
    save(key,value){if(!KEYS.has(key))throw Error('Invalid key');const json=JSON.stringify(value);cache[key]=json;void q('write_batch',{entries:[[key,json]]});},
    batch(entries){if(!Array.isArray(entries)||entries.some(([k,v])=>!KEYS.has(k)||(v!==null&&typeof v!=='string')))throw Error('Invalid batch');for(const [k,v] of entries)cache[k]=v;void q('write_batch',{entries});},
    async flush(){await flush();},
    async backupToChosenLocation(){
      // The user chooses the destination every time, including USB/Drive folders.
      await flush();
      const today=new Date();
      const stamp=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
      const destination=await chooseBackupSavePath({title:'Backup ගොනුව සුරකින්න',defaultPath:'Gonagamuwa_Backup_'+stamp+'.json',filters:[{name:'JSON Backup',extensions:['json']}]});
      if(!destination)return null;
      await flush();
      return invoke('save_backup_to',{destination});
    }
  };
  Object.defineProperty(window,'GonagamuwaOffline',{value:db,writable:false,configurable:false});
  // Closing waits for pending SQLite writes, but creates no automatic backup.
  const win=getCurrentWindow();
  await win.onCloseRequested(async event=>{
    event.preventDefault();
    try {await flush();await win.destroy();}
    catch(error){alert('දත්ත සුරැකීම අසාර්ථකයි. App එක Close කළේ නැහැ: '+error);}
  });
  const script=document.createElement('script');script.src='script.js';document.body.appendChild(script);
}
main().catch(fatal);
