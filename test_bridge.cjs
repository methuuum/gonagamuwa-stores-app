// Lightweight bridge test. Run: node test_bridge.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const calls=[];const store={tea_people:'[]'};
let closeHandler,opened=false,destroyed=false,dialogCount=0,chosenPath='C:\\Backups\\Tea.json';
const invoke=async (cmd,args={})=>{
  calls.push({cmd,args});
  if(cmd==='load_all')return {...store};
  if(cmd==='write_batch'){
    await new Promise(r=>setTimeout(r,5));
    for(const [key,value] of args.entries)store[key]=value;
    return;
  }
  if(cmd==='save_backup_to'){
    assert.equal(args.destination,chosenPath);
    assert.equal(JSON.parse(store.tea_people)[0].id,'ABC');
    return args.destination;
  }
  throw Error('Unexpected invocation: '+cmd);
};
const win={destroy:async()=>{destroyed=true},onCloseRequested:async fn=>{closeHandler=fn}};
const context={window:{__TAURI__:{core:{invoke},window:{getCurrentWindow:()=>win},dialog:{save:async()=>{dialogCount++;return chosenPath}}}},document:{body:{appendChild(el){if(el.src==='script.js')opened=true}},createElement(){return {}}},console,alert:msg=>{throw Error(msg)}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/web/tauri-bridge.js','utf8'),context);
(async()=>{
  for(let n=0;n<50&&!context.window.GonagamuwaOffline;n++)await new Promise(r=>setTimeout(r,5));
  const db=context.window.GonagamuwaOffline;
  assert.ok(db);assert.ok(opened);
  db.save('tea_people',[{id:'ABC'}]);
  assert.equal(await db.backupToChosenLocation(),chosenPath);
  assert.equal(dialogCount,1);
  chosenPath=null;assert.equal(await db.backupToChosenLocation(),null);
  assert.equal(dialogCount,2);
  const e={preventDefault(){this.prevented=true}};
  await closeHandler(e);
  assert.ok(e.prevented);assert.ok(destroyed);
  assert.equal(calls.filter(x=>x.cmd==='save_backup_to').length,1);
  assert.equal(calls.filter(x=>x.cmd==='backup_daily'||x.cmd==='backup_now').length,0);
  console.log('PASS: preloaded SQLite cache, serialized save, Save As, cancel, close without auto backup');
})().catch(e=>{console.error(e);process.exitCode=1});
