/* Gonagamuwa Stores | Standalone JavaScript | Preserves original app logic */
// Only stores a visual preference, never supplier/credit data.
  try {
    document.documentElement.dataset.theme = localStorage.getItem('tea_v2_theme') === 'dark' ? 'dark' : 'light';
  } catch (_) { document.documentElement.dataset.theme = 'light'; }


// Standalone downloaded bill HTML must include styling, even though the app
// itself now loads its CSS from a separate local style.css file.
function collectExportStyles(){
  return Array.from(document.styleSheets).map(sheet=>{
    try { return Array.from(sheet.cssRules || []).map(rule=>rule.cssText).join('\n'); }
    catch (_) { return ''; } // Ignore stylesheets not accessible to this origin.
  }).join('\n');
}

// Settings opens as a non-fullscreen right-side panel; existing theme/logout actions are reused.
const settingsTrigger=document.getElementById('settingsTrigger');
const settingsPanel=document.getElementById('settingsPanel');
const settingsBackdrop=document.getElementById('settingsBackdrop');
const settingsClose=document.getElementById('settingsClose');
const settingsDataOpen=document.getElementById('settingsDataOpen');
const settingsDataView=document.getElementById('settingsDataView');
const settingsDataBack=document.getElementById('settingsDataBack');
const settingsDataClose=document.getElementById('settingsDataClose');
const settingsPrimarySections=[settingsPanel.querySelector('.settings-panel-header'),settingsPanel.querySelector('.settings-content'),settingsPanel.querySelector('.settings-panel-footer')];
function openSettingsData(){
  settingsDataView.querySelector('.settings-data-scroll').scrollTop=0;
  settingsPanel.classList.add('data-open');
  settingsDataView.inert=false;
  settingsDataView.setAttribute('aria-hidden','false');
  settingsDataOpen.setAttribute('aria-expanded','true');
  settingsPrimarySections.forEach(node=>{if(node)node.inert=true});
  settingsDataBack.focus();
}
function closeSettingsData(restoreFocus=true){
  if(!settingsPanel.classList.contains('data-open'))return;
  settingsPanel.classList.remove('data-open');
  settingsDataView.inert=true;
  settingsDataView.setAttribute('aria-hidden','true');
  settingsDataOpen.setAttribute('aria-expanded','false');
  settingsPrimarySections.forEach(node=>{if(node)node.inert=false});
  if(restoreFocus)settingsDataOpen.focus();
}
settingsDataOpen.addEventListener('click',openSettingsData);
settingsDataBack.addEventListener('click',()=>closeSettingsData());
settingsDataClose.addEventListener('click',()=>closeSettings());
document.getElementById('settingsBackupBtn').addEventListener('click',()=>backup());
document.getElementById('settingsRestoreBtn').addEventListener('click',()=>document.getElementById('restoreFile').click());
document.getElementById('settingsPrintBtn').addEventListener('click',()=>{closeSettings(false);window.print()});
const settingsBehind=[document.querySelector('.glass-topbar'),document.querySelector('nav'),document.querySelector('main')];
function openSettings(){
  if(document.getElementById('appRoot').hidden)return;
  document.body.classList.add('settings-open');
  settingsPanel.classList.add('is-open');
  settingsPanel.setAttribute('aria-hidden','false');
  settingsTrigger.setAttribute('aria-expanded','true');
  settingsPanel.inert=false;
  settingsBehind.forEach(node=>{if(node)node.inert=true});
  settingsClose.focus();
}
function closeSettings(restoreFocus=true){
  closeSettingsData(false);
  document.body.classList.remove('settings-open');
  settingsPanel.classList.remove('is-open');
  settingsPanel.setAttribute('aria-hidden','true');
  settingsTrigger.setAttribute('aria-expanded','false');
  settingsPanel.inert=true;
  settingsBehind.forEach(node=>{if(node)node.inert=false});
  if(restoreFocus && !document.getElementById('appRoot').hidden)settingsTrigger.focus();
}
settingsTrigger.addEventListener('click',openSettings);
settingsClose.addEventListener('click',()=>closeSettings());
settingsBackdrop.addEventListener('click',()=>closeSettings());
document.addEventListener('keydown',event=>{
  const resetDialog=document.getElementById('resetConfirmDialog');
  if(resetDialog && !resetDialog.hidden){
    if(event.key==='Escape'){event.preventDefault();cancelResetConfirmation();return}
    if(event.key==='Tab'){
      const items=[document.getElementById('resetPassword'),document.getElementById('resetCancelBtn'),document.getElementById('resetProceedBtn')];
      const idx=items.indexOf(document.activeElement);
      if(idx!==-1 && ((event.shiftKey && idx===0)||(!event.shiftKey && idx===items.length-1))){event.preventDefault();items[(idx+(event.shiftKey?-1:1)+items.length)%items.length].focus()}
    }
    return;
  }
  const confirmDialog=document.getElementById('restoreConfirmDialog');
  if(confirmDialog && !confirmDialog.hidden){
    if(event.key==='Escape'){event.preventDefault();cancelRestoreConfirmation();return}
    if(event.key==='Tab'){
      const buttons=[document.getElementById('restoreConfirmCancel'),document.getElementById('restoreConfirmProceed')];
      const current=buttons.indexOf(document.activeElement);
      if(current!==-1 && ((event.shiftKey && current===0) || (!event.shiftKey && current===buttons.length-1))){
        event.preventDefault();buttons[(current+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();
      }
    }
    return;
  }
  if(!settingsPanel.classList.contains('is-open'))return;
  if(event.key==='Escape'){event.preventDefault();if(settingsPanel.classList.contains('data-open'))closeSettingsData();else closeSettings();return}
  if(event.key==='Tab'){
    const focusScope=settingsPanel.classList.contains('data-open')?settingsDataView:settingsPanel;
    const focusables=Array.from(focusScope.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')).filter(el=>!el.closest('[inert]') && el.getClientRects().length);
    if(!focusables.length)return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus()}
  }
});

// Dark / Light preference is independent of the Admin login session and tea records.
const THEME_STORAGE_KEY = 'tea_v2_theme';
function setTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-checked', String(dark));
    btn.setAttribute('aria-label', dark ? 'Light Mode සක්‍රිය කරන්න' : 'Dark Mode සක්‍රිය කරන්න');
    btn.querySelector('.theme-icon').textContent = dark ? '☀️' : '🌙';
    btn.querySelector('.theme-state').textContent = dark ? 'Light' : 'Dark';
  });
  try { localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light'); } catch (_) {}
}
document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}));
setTheme(document.documentElement.dataset.theme);

// Offline convenience PIN only. The PIN is visible in the page source and is NOT
// server-side security; do not use it to protect financial data on a public website.
const ADMIN_PASSWORD = '2964';
const SESSION_KEY = 'tea_v2_admin_session';
const pinInput = document.getElementById('adminPassword');
const pinError = document.getElementById('loginError');
const pinLoginPanel = document.querySelector('.pin-login-panel');
const pinProgressDots = [...document.querySelectorAll('.pin-progress-dot')];
const pinSmallScreen = window.matchMedia('(max-width:760px)');
function adaptPinInput(){
  // The on-screen glass keypad replaces the Android native keyboard on mobile.
  pinInput.readOnly = pinSmallScreen.matches;
  if (!pinSmallScreen.matches && !document.getElementById('loginGate').hidden) pinInput.focus({preventScroll:true});
}
function paintPinProgress(){
  const count = pinInput.value.length;
  pinProgressDots.forEach((dot,i) => dot.classList.toggle('is-filled',i<count));
}
function clearPinError(){pinError.textContent='';pinLoginPanel.classList.remove('pin-invalid');}
function setLoggedIn(isLoggedIn){
  document.getElementById('appRoot').hidden = !isLoggedIn;
  document.getElementById('loginGate').hidden = isLoggedIn;
  document.body.classList.toggle('locked', !isLoggedIn);
  if (!isLoggedIn){
    pinInput.value='';clearPinError();paintPinProgress();
    requestAnimationFrame(adaptPinInput);
  }
}
function attemptPinLogin(){
  if (document.getElementById('loginGate').hidden) return;
  const pin = pinInput.value.replace(/\D/g,'').slice(0,4);
  pinInput.value=pin;paintPinProgress();
  if (pin.length!==4) return;
  if (pin === ADMIN_PASSWORD){
    sessionStorage.setItem(SESSION_KEY, '1');
    pinInput.value='';clearPinError();paintPinProgress();
    setLoggedIn(true); // Directly show the existing dashboard; no second tap required.
  } else {
    pinError.textContent='PIN අංකය වැරදියි. නැවත උත්සාහ කරන්න.';
    pinLoginPanel.classList.remove('pin-invalid');
    // Trigger a shake even for consecutive incorrect attempts.
    void pinLoginPanel.offsetWidth;
    pinLoginPanel.classList.add('pin-invalid');
    pinInput.value='';paintPinProgress();
    if (!pinSmallScreen.matches) pinInput.focus({preventScroll:true});
  }
}
pinInput.addEventListener('input',()=>{
  const cleaned=pinInput.value.replace(/\D/g,'').slice(0,4);
  if (pinInput.value!==cleaned) pinInput.value=cleaned;
  clearPinError();paintPinProgress();
  if (pinInput.value.length===4) attemptPinLogin();
});
document.querySelectorAll('[data-pin-key]').forEach(btn=>btn.addEventListener('click',()=>{
  if (pinInput.value.length>=4) return;
  clearPinError();
  pinInput.value+=btn.dataset.pinKey;
  paintPinProgress();
  if (pinInput.value.length===4) attemptPinLogin();
}));
document.querySelector('[data-pin-backspace]').addEventListener('click',()=>{
  pinInput.value=pinInput.value.slice(0,-1);
  clearPinError();paintPinProgress();
});
document.getElementById('loginForm').addEventListener('submit',event=>{
  event.preventDefault();
  if (pinInput.value.length===4) attemptPinLogin();
  else { pinError.textContent='අංක 4ක PIN එක ඇතුළත් කරන්න.'; if (!pinSmallScreen.matches) pinInput.focus({preventScroll:true}); }
});
if (pinSmallScreen.addEventListener) pinSmallScreen.addEventListener('change',adaptPinInput);
else pinSmallScreen.addListener(adaptPinInput);
document.getElementById('logoutBtn').addEventListener('click', ()=>{
  closeSettings(false);
  sessionStorage.removeItem(SESSION_KEY);
  setLoggedIn(false);
});
setLoggedIn(sessionStorage.getItem(SESSION_KEY)==='1');

const $=id=>document.getElementById(id);
const localDB=window.GonagamuwaOffline;
if(!localDB)throw new Error('Windows SQLite service not available. Open the installed Windows application.');
const load=k=>JSON.parse(localDB.read(k)||'[]');
const save=(k,v)=>localDB.save(k,v);
let people=load('tea_people'), leaves=load('tea_leaves'), credits=load('tea_credits'), deductions=load('tea_extra_deductions'); if(!Array.isArray(deductions))deductions=[];
let settlements=load('tea_confirmed_settlements'); if(!Array.isArray(settlements))settlements=[];
// One welfare amount per month, applied only when the selected supplier is a member.
// Store separately from the legacy per-supplier deduction ledger so old bills stay frozen.
let welfareMonthlySettings={};
try{const stored=JSON.parse(localDB.read('tea_monthly_welfare')||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))welfareMonthlySettings=stored;}catch(_){};
// Monthly rate/deduction are shared across suppliers; values never overwrite tea/credit records.
let billingSettings={};
try{const stored=JSON.parse(localDB.read('tea_billing_settings')||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))billingSettings=stored;}catch(_){};

const now=new Date(); const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-'); $('today').textContent=today;
['leafDate','creditDate','deductionDate'].forEach(x=>$(x).value=today); $('deductionMonth').value=today.slice(0,7); $('settleMonth').value=today.slice(0,7); $('creditMonth').value=today.slice(0,7);

// Read-only monthly sheet uses the existing tea_leaves records. No WhatsApp sending here.
const LEAF_PAGE_SIZE=50;
const SI_MONTHS=['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජූනි','ජූලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝබර්','නොවැම්බර්','දෙසැම්බර්'];
let sheetMonth=today.slice(0,7),leafPage=0,selectedDay=null,editingLeafIndex=null;
let highlightedLeaf=null; // {id,date} of the most recently added record; only used for the success message.
function sortedSuppliers(){return people.slice().sort((a,b)=>String(a.id).localeCompare(String(b.id),undefined,{numeric:true,sensitivity:'base'}))}
function pageForSelectedLeafSupplier(){
  const id=$('leafPerson').value;
  const index=sortedSuppliers().findIndex(p=>p.id===id);
  return index<0?0:Math.floor(index/LEAF_PAGE_SIZE);
}
function reflectSelectedLeafSupplier(){
  // Called on dropdown change and on searching. Does not require saving a record.
  const id=$('leafPerson').value;
  if(highlightedLeaf?.id!==id)highlightedLeaf=null;
  leafPage=pageForSelectedLeafSupplier();
  selectedDay=null;editingLeafIndex=null;
  renderLeafSheet();
  // Scroll only the sheet's own vertical area; leave the data-entry form in view.
  requestAnimationFrame(()=>{
    const row=$('sheetRows').querySelector('[data-selected-leaf-row="true"]');
    if(!row)return;
    const box=$('sheetRows').closest('.sheet-tablewrap');
    const rowTop=row.offsetTop;
    const rowHeight=row.offsetHeight;
    const visibleTop=box.scrollTop+43,visibleBottom=box.scrollTop+box.clientHeight;
    if(rowTop<visibleTop)box.scrollTop=Math.max(0,rowTop-60);
    else if(rowTop+rowHeight>visibleBottom)box.scrollTop=rowTop+rowHeight-box.clientHeight+55;
  });
}
function changeSheetMonth(n){
  const parts=sheetMonth.split('-').map(Number);
  const d=new Date(parts[0],parts[1]-1+n,1);
  sheetMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  leafPage=pageForSelectedLeafSupplier();selectedDay=null;editingLeafIndex=null;highlightedLeaf=null;renderLeafSheet();
}
function setSheetMonth(value){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))return;
  sheetMonth=value;leafPage=pageForSelectedLeafSupplier();selectedDay=null;editingLeafIndex=null;highlightedLeaf=null;renderLeafSheet();
}
function fmtKg(n){return (Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})}
function sheetPageTo(index){
  const pageCount=Math.max(1,Math.ceil(sortedSuppliers().length/LEAF_PAGE_SIZE));
  leafPage=Math.max(0,Math.min(pageCount-1,index));selectedDay=null;editingLeafIndex=null;renderLeafSheet();
}
function renderLeafSheet(){
  $('sheetMonth').value=sheetMonth;
  const [year,month]=sheetMonth.split('-').map(Number);
  const days=new Date(year,month,0).getDate();
  const suppliers=sortedSuppliers();
  const count=suppliers.length,pages=Math.max(1,Math.ceil(count/LEAF_PAGE_SIZE));
  leafPage=Math.min(leafPage,pages-1);
  const start=leafPage*LEAF_PAGE_SIZE,shown=suppliers.slice(start,start+LEAF_PAGE_SIZE);
  const selectedLeafId=$('leafPerson').value;
  const showingAddedMessage=highlightedLeaf&&highlightedLeaf.date.slice(0,7)===sheetMonth&&highlightedLeaf.id===selectedLeafId;
  const todaysColumn=sheetMonth===today.slice(0,7)?Number(today.slice(8,10)):null;
  const addedBox=$('sheetLastAdded');
  if(showingAddedMessage){
    const p=person(highlightedLeaf.id);
    addedBox.textContent=`✓ සටහන එකතු කළා: ${p?.id||highlightedLeaf.id} – ${p?.name||''} · ${highlightedLeaf.date}`;
    addedBox.hidden=false;
  }else{addedBox.textContent='';addedBox.hidden=true}
  // Aggregate repeated entries on the same day for the same supplier.
  const daily=new Map(),monthTotal=new Map();
  let grandTotal=0;
  for(const l of leaves){
    if(!l.date||!l.id||l.date.slice(0,7)!==sheetMonth)continue;
    const n=Number(l.kg);if(!Number.isFinite(n))continue;
    let key=l.id+'|'+l.date;
    daily.set(key,(daily.get(key)||0)+n);
    monthTotal.set(l.id,(monthTotal.get(l.id)||0)+n);
    grandTotal+=n;
  }
  $('sheetMonthTitle').textContent=`${SI_MONTHS[month-1]} ${year}`;
  $('sheetMonthSummary').textContent=`සැපයුම්කරුවන් ${count} · මාසයේ මුළු දලු ${fmtKg(grandTotal)} කි.ග්‍රෑ.`;
  $('sheetHead').innerHTML='<tr><th scope="col" class="pin-id">ID</th><th scope="col" class="pin-name">නම</th>'+Array.from({length:days},(_,i)=>{
    const isToday=todaysColumn===i+1;
    return `<th scope="col" class="${isToday?'sheet-today-column sheet-real-today':''}" ${isToday?'aria-current="date"':''}>${String(i+1).padStart(2,'0')}</th>`;
  }).join('')+'<th scope="col" class="pin-total">එකතුව</th></tr>';
  if(!shown.length){
    $('sheetRows').innerHTML=`<tr><td class="pin-id">—</td><td class="pin-name">සැපයුම්කරුවන් නැහැ</td><td colspan="${days+1}">පළමුව සැපයුම්කරුවන් ලියාපදිංචි කරන්න.</td></tr>`;
  } else {
    $('sheetRows').innerHTML=shown.map(p=>{
      const cells=Array.from({length:days},(_,i)=>{
        const date=`${sheetMonth}-${String(i+1).padStart(2,'0')}`;
        const kg=daily.get(p.id+'|'+date)||0;
        const isToday=todaysColumn===i+1;
        return `<td class="${isToday?'sheet-today-column':''}">${kg ? `<button type="button" class="kg-button" data-leaf-id="${esc(p.id)}" data-leaf-date="${date}" title="මෙදින සටහන් බලන්න">${fmtKg(kg)}</button>` : '<span class="empty-cell">–</span>'}</td>`;
      }).join('');
      const total=monthTotal.get(p.id)||0;
      const marked=selectedLeafId===p.id;
      return `<tr class="${marked?'leaf-highlight-row':''}" ${marked?'data-selected-leaf-row="true"':''}><td class="pin-id">${esc(p.id)}</td><td class="pin-name">${esc(p.name)}</td>${cells}<td class="pin-total">${fmtKg(total)}</td></tr>`;
    }).join('');
  }
  $('sheetPageInfo').textContent=`${count?start+1:0}–${Math.min(start+LEAF_PAGE_SIZE,count)} / ${count} සැපයුම්කරුවන් · පිටුව ${leafPage+1} / ${pages} (පිටුවකට ${LEAF_PAGE_SIZE})`;
  const controls=`<button type="button" data-leaf-page="${leafPage-1}" ${leafPage===0?'disabled':''} aria-label="පෙර පිටුව">‹ පෙර</button>`+
    Array.from({length:pages},(_,i)=>`<button type="button" data-leaf-page="${i}" class="${i===leafPage?'active':''}" aria-label="පිටුව ${i+1}" ${i===leafPage?'aria-current="page"':''}>${i+1}</button>`).join('')+
    `<button type="button" data-leaf-page="${leafPage+1}" ${leafPage>=pages-1?'disabled':''} aria-label="ඊළඟ පිටුව">ඊළඟ ›</button>`;
  $('sheetPaginationTop').innerHTML=controls;
  $('sheetPaginationBottom').innerHTML=controls;
  renderLeafDayDetails();
  scheduleTodayColumnScroll();
}
// The real date column remains in its chronological position in the 01–31 sheet.
// Scroll only the table's horizontal viewport so today's ORIGINAL column sits
// immediately to the left of the sticky monthly total, when geometry permits.
// We do NOT duplicate the today's column or rearrange the dates.
let todayScrollFrame=0;
function scheduleTodayColumnScroll(){
  if(todayScrollFrame)cancelAnimationFrame(todayScrollFrame);
  todayScrollFrame=requestAnimationFrame(()=>{
    todayScrollFrame=0;
    scrollTodayColumnIntoPlace();
  });
}
function scrollTodayColumnIntoPlace(){
  const wrap=document.querySelector('.sheet-tablewrap');
  if(!wrap||wrap.clientWidth===0)return; // hidden page; navigate to it first
  const real=$('sheetHead').querySelector('.sheet-real-today');
  if(!real){wrap.scrollLeft=0;return} // past/future month: start at day 01
  const pinnedTotal=$('sheetHead').querySelector('.pin-total');
  if(!pinnedTotal)return;
  const dayRect=real.getBoundingClientRect();
  const totalRect=pinnedTotal.getBoundingClientRect();
  const delta=dayRect.right-totalRect.left;
  const maximum=Math.max(0,wrap.scrollWidth-wrap.clientWidth);
  // Move the actual sheet rather than inserting a fixed copy of today's value.
  wrap.scrollLeft=Math.max(0,Math.min(maximum,wrap.scrollLeft+delta));
}
const sheetScroller=document.querySelector('.sheet-tablewrap');
window.addEventListener('resize',scheduleTodayColumnScroll,{passive:true});

function renderLeafDayDetails(){
  const box=$('leafDayDetails');
  if(!selectedDay){box.hidden=true;box.innerHTML='';return}
  const {id,date}=selectedDay;
  const records=leaves.map((l,i)=>({...l,i})).filter(l=>l.id===id&&l.date===date);
  const name=person(id)?.name||id;
  box.hidden=false;
  box.innerHTML=`<div class="sheet-detail-header"><h4>${esc(name)} (${esc(id)}) — ${esc(date)}</h4><button type="button" class="secondary" id="closeLeafDetail">වසන්න ✕</button></div>`+
    (records.length?`<div class="sheet-detail-list">${records.map(l=>{
      const isEditing=editingLeafIndex===l.i;
      return `<div class="sheet-detail-record">${isEditing?
        `<div class="sheet-detail-edit"><label for="editLeafKg${l.i}">කි.ග්‍රෑ.</label><input type="number" id="editLeafKg${l.i}" data-leaf-edit-input="${l.i}" min="0.01" step="0.01" value="${Number(l.kg)}" aria-label="දලු ප්‍රමාණය වෙනස් කරන්න"></div>`:
        `<strong>${fmtKg(Number(l.kg))} කි.ග්‍රෑ.</strong>`}
      <div class="sheet-detail-buttons">${isEditing?
        `<button type="button" data-save-leaf="${l.i}">සුරකින්න</button><button type="button" class="secondary" data-cancel-edit-leaf="${l.i}">අවලංගු කරන්න</button>`:
        `<button type="button" class="secondary" data-edit-leaf="${l.i}">වෙනස් කරන්න</button><button type="button" class="danger" data-delete-leaf="${l.i}">සටහන මකන්න</button>`}</div></div>`;
    }).join('')}</div>`:'<p class="note">මෙදින දලු සටහන් නොමැත.</p>');
}
document.getElementById('sheetPrevMonth').addEventListener('click',()=>changeSheetMonth(-1));
document.getElementById('sheetNextMonth').addEventListener('click',()=>changeSheetMonth(1));
document.getElementById('sheetMonth').addEventListener('change',e=>setSheetMonth(e.target.value));
document.getElementById('leaves').addEventListener('click',event=>{
  const pageBtn=event.target.closest('[data-leaf-page]');
  if(pageBtn&&!pageBtn.disabled){sheetPageTo(Number(pageBtn.dataset.leafPage));return}
  const kgBtn=event.target.closest('[data-leaf-id][data-leaf-date]');
  if(kgBtn){selectedDay={id:kgBtn.dataset.leafId,date:kgBtn.dataset.leafDate};editingLeafIndex=null;renderLeafDayDetails();$('leafDayDetails').scrollIntoView({block:'nearest',behavior:'smooth'});return}
  const editBtn=event.target.closest('[data-edit-leaf]');
  if(editBtn){
    editingLeafIndex=Number(editBtn.dataset.editLeaf);renderLeafDayDetails();
    const input=$('leafDayDetails').querySelector(`[data-leaf-edit-input="${editingLeafIndex}"]`);
    if(input){input.focus();input.select()}
    return;
  }
  const cancelBtn=event.target.closest('[data-cancel-edit-leaf]');
  if(cancelBtn){editingLeafIndex=null;renderLeafDayDetails();return}
  const saveBtn=event.target.closest('[data-save-leaf]');
  if(saveBtn){
    const i=Number(saveBtn.dataset.saveLeaf);
    const input=$('leafDayDetails').querySelector(`[data-leaf-edit-input="${i}"]`);
    const newKg=Number(input?.value);
    if(!input||!input.value.trim()||!Number.isFinite(newKg)||newKg<=0||!input.checkValidity()){
      alert('නිවැරදි දලු ප්‍රමාණයක් ඇතුළත් කරන්න (කි.ග්‍රෑ. 0 ට වඩා වැඩි අගයක්).');
      input?.focus();return;
    }
    if(!selectedDay||!leaves[i]||leaves[i].id!==selectedDay.id||leaves[i].date!==selectedDay.date){
      alert('මෙම සටහන සොයාගත නොහැක.');return;
    }
    if(closedLeaf(leaves[i].id,leaves[i].date.slice(0,7))){alert('මෙම මාසයේ බිල තහවුරු කර ඇති නිසා දලු ගාන වෙනස් කළ නොහැක.');return}
    leaves[i].kg=newKg;
    save('tea_leaves',leaves);
    editingLeafIndex=null;
    render(); // Update the clicked day's quantity, the monthly total, and the details.
    return;
  }
  const removeBtn=event.target.closest('[data-delete-leaf]');
  if(removeBtn){editingLeafIndex=null;del(leaves,'tea_leaves',Number(removeBtn.dataset.deleteLeaf));return}
  if(event.target.closest('#closeLeafDetail')){selectedDay=null;editingLeafIndex=null;renderLeafDayDetails()}
});

document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.page).classList.add('active');render()});
function esc(value){return String(value ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function person(id){return people.find(p=>p.id===id)}
function money(n){return 'රු. '+Number(n||0).toLocaleString('en-US',{maximumFractionDigits:2})}
let editingPersonId=null;
function cancelPersonEdit(){
  editingPersonId=null;
  ['pid','pname','phone'].forEach(id=>$(id).value='');
  $('personWelfare').checked=false;updatePersonWelfareLabel();
  $('personEditBanner').hidden=true;
  $('personCancelBtn').hidden=true;
  $('personSaveBtn').textContent='සුරකින්න';
}
function startPersonEdit(id){
  const p=person(id);
  if(!p){alert('සැපයුම්කරු සොයාගත නොහැක.');return}
  // A supplier has been explicitly selected: clear the filter and restore the list.
  if($('peopleSearch').value){$('peopleSearch').value='';renderPeople()}
  editingPersonId=id;
  $('pid').value=p.id;
  $('pname').value=p.name;
  $('phone').value=p.phone||'';
  $('personWelfare').checked=!!p.welfareMember;updatePersonWelfareLabel();
  $('personEditBanner').hidden=false;
  $('personCancelBtn').hidden=false;
  $('personSaveBtn').textContent='වෙනස්කම් සුරකින්න';
  $('personEditor').scrollIntoView({block:'start',behavior:'smooth'});
  $('pid').focus();
}
function updatePersonWelfareLabel(){$('personWelfareLabel').textContent=$('personWelfare').checked?'සම්බන්ධයි':'සම්බන්ධ නැහැ'}
$('personWelfare').addEventListener('change',updatePersonWelfareLabel);
function addPerson(){
  const id=$('pid').value.trim(), name=$('pname').value.trim(), phone=$('phone').value.trim(),welfareMember=$('personWelfare').checked;
  if(!id||!name){alert('ID සහ නම ඇතුළත් කරන්න');return}
  // Allow a supplier to retain their own ID, but reject another supplier's ID.
  if(people.some(p=>p.id.toLocaleLowerCase()===id.toLocaleLowerCase() && p.id!==editingPersonId)){
    alert('මෙම ID එක දැනටමත් ඇත');return;
  }
  if(editingPersonId!==null){
    const current=person(editingPersonId);
    if(!current){alert('වෙනස් කිරීමට තෝරාගත් සැපයුම්කරු සොයාගත නොහැක.');cancelPersonEdit();return}
    const oldId=editingPersonId;
    if(typeof reportState!=="undefined"&&reportState.personId===oldId)reportState.personId=id;
    const selectedLeaf=$('leafPerson').value,selectedCredit=$('creditPerson').value,selectedSettle=$('settlePerson').value,selectedDeduct=$('deductionPerson').value;
    current.id=id;current.name=name;current.phone=phone;current.welfareMember=welfareMember;
    if(oldId!==id){
      // Keep existing kilograms, debt and repayments attached to this supplier.
      leaves.forEach(l=>{if(l.id===oldId)l.id=id});
      credits.forEach(c=>{if(c.id===oldId)c.id=id}); deductions.forEach(c=>{if(c.id===oldId)c.id=id});save('tea_extra_deductions',deductions);
      settlements.forEach(s=>{if(s.supplierId===oldId){s.supplierId=id;s.id=`${s.month}|${id}`}});saveSettlements();
      if(selectedDay?.id===oldId)selectedDay.id=id;
      if(highlightedLeaf?.id===oldId)highlightedLeaf.id=id;
      save('tea_leaves',leaves);
      save('tea_credits',credits);
    }
    save('tea_people',people);
    cancelPersonEdit();
    if(selectedLeaf===oldId){
      $('leafPersonSearch').value=''; // Clear stale search after ID/name update.
      const nextIndex=sortedSuppliers().findIndex(p=>p.id===id);
      if(nextIndex>=0)leafPage=Math.floor(nextIndex/LEAF_PAGE_SIZE);
    }
    render({leafId:selectedLeaf===oldId?id:selectedLeaf,
            creditId:selectedCredit===oldId?id:selectedCredit,
            settleId:selectedSettle===oldId?id:selectedSettle,
            deductId:selectedDeduct===oldId?id:selectedDeduct});
  } else {
    people.push({id,name,phone,welfareMember});save('tea_people',people);
    cancelPersonEdit();render();
  }
}
function renderPeople(){
  const query=$('peopleSearch').value.trim().toLocaleLowerCase();
  const matching=people.map((p,i)=>({...p,originalIndex:i})).filter(p=>
    p.id.toLocaleLowerCase().includes(query)||p.name.toLocaleLowerCase().includes(query));
  $('peopleSearchCount').textContent=`${matching.length} / ${people.length} සැපයුම්කරුවන්`;
  $('peopleRows').innerHTML=matching.length?matching.map(p=>
    `<tr><td>${esc(p.id)}</td><td>${esc(p.name)}${p.welfareMember?'<span class="welfare-member-badge" title="සුභසාධන අරමුදලේ සාමාජිකයි">✓ සම්බන්ධයි</span>':''}</td><td>${esc(p.phone||'')}</td><td><div class="actions" style="margin-top:0"><button type="button" class="secondary supplier-edit-btn" data-edit-person-index="${p.originalIndex}">✏️ වෙනස් කරන්න</button><button type="button" class="danger supplier-edit-btn" data-delete-person-index="${p.originalIndex}">මකන්න</button></div></td></tr>`).join(''):
    '<tr><td colspan="4" class="note">ගැළපෙන සැපයුම්කරුවන් හමු නොවුණා.</td></tr>';
}
// WhatsApp Click-to-Chat: the exact kg entered in the "දලු ප්‍රමාණය" field
// or, immediately after saving, the kg of that last saved individual entry.
// This only composes a message; sending happens in WhatsApp at the user's choice.
let lastSavedWhatsAppLeaf = null;
function whatsappPhone(raw){
  const digits=String(raw??'').trim().replace(/[\s().-]/g,'');
  if(/^07\d{8}$/.test(digits))return '94'+digits.slice(1);
  if(/^7\d{8}$/.test(digits))return '94'+digits;
  if(/^947\d{8}$/.test(digits))return digits;
  if(/^\+947\d{8}$/.test(digits))return digits.slice(1);
  if(/^00947\d{8}$/.test(digits))return digits.slice(2);
  return null;
}
function leafQuantityToShare(supplierId,date){
  const typed=$('leafKg').value.trim();
  if(typed!==''){
    const kg=Number(typed);
    return Number.isFinite(kg)&&kg>0&&kg<=1000000?{kg,unsaved:true}:null;
  }
  // After a normal Save, leafKg is cleared; offer the kg just saved instead.
  if(lastSavedWhatsAppLeaf && lastSavedWhatsAppLeaf.id===supplierId && lastSavedWhatsAppLeaf.date===date){
    // The saved record must still exist (e.g. not deleted via the leaf sheet).
    const {id,kg,entry}=lastSavedWhatsAppLeaf;
    if(leaves.includes(entry)&&Number(entry.kg)===kg)return {kg,unsaved:false};
  }
  return null;
}
function updateWhatsappButton(){
  const selected=person($('leafPerson').value);
  const button=$('sendWhatsappBtn');
  const hint=$('leafWhatsappHint');
  const hasContact=Boolean(selected&&String(selected.phone||'').trim());
  button.hidden=!hasContact;
  if(!hasContact){
    button.disabled=true;
    hint.textContent='WhatsApp යැවීමට සැපයුම්කරුගේ දුරකථන අංකය සුරකින්න.';
    return;
  }
  const phone=whatsappPhone(selected.phone);
  const leaf=leafQuantityToShare(selected.id,$('leafDate').value);
  button.disabled=!(phone&&leaf);
  if(!phone){
    button.title='WhatsApp අංකය නිවැරදි කරන්න. උදා: 0771234567';
    hint.textContent='WhatsApp අංකය වලංගු නැහැ. සැපයුම්කරුගේ අංකය නිවැරදි කරන්න.';
  }else if(!leaf){
    button.title='යැවීමට දලු ප්‍රමාණයක් ඇතුළත් කරන්න.';
    hint.textContent='දලු ප්‍රමාණයක් ඇතුළත් කළාම WhatsApp Button එක සක්‍රිය වෙයි.';
  }else{
    button.title='ඇතුළත් කළ දලු ප්‍රමාණය WhatsApp මඟින් යවන්න.';
    hint.textContent=`WhatsApp පණිවිඩයේ දලු ප්‍රමාණය: ${fmtKg(leaf.kg)} kg${leaf.unsaved?' · මෙම අගය තවම Save කරලා නැහැ':''}.`;
  }
}
function createLeafWhatsAppMessage(supplier,date,kg){
  const [year,month,day]=date.split('-');
  return [
    `ආයුබෝවන්! ${year}/${month}/${day} දින දලු කිලෝ ${fmtKg(kg)}ක් අප වෙත ලබා දී ඇත.`,
    '',
    'ස්තූතියි.',
    'B.V.P.කරුණාරත්න.'
  ].join('\n');
}
const whatsAppDialog=$('whatsappPreviewDialog');
let pendingWhatsAppRecipient=null;
function closeLeafWhatsApp(){
  if(whatsAppDialog.open)whatsAppDialog.close();
  pendingWhatsAppRecipient=null;
}
$('sendWhatsappBtn').addEventListener('click',()=>{
  const supplier=person($('leafPerson').value),date=$('leafDate').value;
  if(!supplier)return;
  const phone=whatsappPhone(supplier.phone);
  const leaf=leafQuantityToShare(supplier.id,date);
  if(!phone){alert('WhatsApp අංකය නිවැරදි කරන්න (උදා: 0771234567).');return}
  if(!leaf||!validISODate(date)){alert('නිවැරදි දිනයක් සහ දලු ප්‍රමාණයක් ඇතුළත් කරන්න.');return}
  pendingWhatsAppRecipient={phone};
  $('waRecipient').textContent=`${supplier.name} (${supplier.id}) · +${phone}`;
  $('waMessageText').value=createLeafWhatsAppMessage(supplier,date,leaf.kg);
  $('waUnsavedHint').hidden=!leaf.unsaved;
  whatsAppDialog.showModal();
});
$('waCloseBtn').addEventListener('click',closeLeafWhatsApp);
$('waCancelBtn').addEventListener('click',closeLeafWhatsApp);
whatsAppDialog.addEventListener('close',()=>{pendingWhatsAppRecipient=null});
$('waOpenBtn').addEventListener('click',()=>{
  if(!pendingWhatsAppRecipient)return;
  const message=$('waMessageText').value.trim();
  if(!message){alert('පණිවිඩය හිස්ව තියන්න බැහැ.');return}
  const phone=pendingWhatsAppRecipient.phone;
  // WhatsApp official pre-filled compose link. Send is always manual.
  const url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const anchor=document.createElement('a');
  anchor.href=url;anchor.target='_blank';anchor.rel='noopener noreferrer';
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  closeLeafWhatsApp();
});
$('leafDate').addEventListener('change',updateWhatsappButton);
$('leafDate').addEventListener('input',updateWhatsappButton);
$('leafKg').addEventListener('input',updateWhatsappButton);
function renderLeafPersonOptions(preferredId,searchChanged=false){
  const field=$('leafPersonSearch');
  const select=$('leafPerson');
  const query=field.value.trim().toLocaleLowerCase();
  const matching=people.filter(p=>p.id.toLocaleLowerCase().includes(query)||p.name.toLocaleLowerCase().includes(query));
  const current=preferredId===undefined?select.value:preferredId;
  const visible=matching.some(p=>p.id===current);
  const selected=visible?current:(query?(matching.length===1?matching[0].id:''):(matching[0]?.id||''));
  select.innerHTML=(matching.length?'<option value="">-- සැපයුම්කරු තෝරන්න --</option>':'<option value="">ගැළපෙන සැපයුම්කරුවෙක් නැහැ</option>')+
    matching.map(p=>`<option value="${esc(p.id)}">${esc(p.id)} - ${esc(p.name)}</option>`).join('');
  select.value=selected;
  if(!matching.length)select.value='';
  $('leafMatchCount').textContent=query?`ප්‍රතිඵල ${matching.length}ක්`:`සැපයුම්කරුවන් ${matching.length}ක්`;
  updateWhatsappButton();
}
$('peopleSearch').addEventListener('input',renderPeople);
$('peopleSearch').addEventListener('keydown',event=>{
  if(event.key!=='Enter')return;
  event.preventDefault();
  const query=$('peopleSearch').value.trim().toLocaleLowerCase();
  if(!query)return;
  const matches=people.filter(p=>p.id.toLocaleLowerCase().includes(query)||p.name.toLocaleLowerCase().includes(query));
  // When one person matches, Enter selects that person for editing and clears Search.
  if(matches.length===1)startPersonEdit(matches[0].id);
});
$('peopleRows').addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit-person-index]');
  if(edit){const p=people[Number(edit.dataset.editPersonIndex)];if(p)startPersonEdit(p.id);return}
  const delBtn=event.target.closest('[data-delete-person-index]');
  if(delBtn){const i=Number(delBtn.dataset.deletePersonIndex);const p=people[i];if(!p)return;
    if(leaves.some(l=>l.id===p.id)||credits.some(c=>c.id===p.id)||deductions.some(c=>c.id===p.id)){
      alert('මෙම සැපයුම්කරුට දලු හෝ ණය සටහන් තිබෙන නිසා මැකිය නොහැක. අවශ්‍ය නම් විස්තර වෙනස් කරන්න.');return;
    }
    if(editingPersonId===p.id)cancelPersonEdit();
    del(people,'tea_people',i);
  }
});
function clearLeafSearchKeepingSelection(){
  const selectedId=$('leafPerson').value;
  if(!$('leafPersonSearch').value)return;
  $('leafPersonSearch').value='';
  renderLeafPersonOptions(selectedId);
}
$('leafPersonSearch').addEventListener('input',()=>{renderLeafPersonOptions(undefined,true);reflectSelectedLeafSupplier()});
$('leafPersonSearch').addEventListener('keydown',event=>{
  // Enter commits a selected search result; never clear mid-typing.
  if(event.key==='Enter'&&$('leafPerson').value){
    event.preventDefault();clearLeafSearchKeepingSelection();reflectSelectedLeafSupplier();$('leafKg').focus();
  }
});
$('leafPersonClear').addEventListener('click',()=>{
  $('leafPersonSearch').value='';
  renderLeafPersonOptions();
  reflectSelectedLeafSupplier();
  $('leafPerson').focus();
});
$('leafPerson').addEventListener('change',()=>{
  // Explicit selection in the dropdown finishes the search.
  clearLeafSearchKeepingSelection();
  updateWhatsappButton();
  reflectSelectedLeafSupplier();
});
function addLeaf(){
  let id=$('leafPerson').value,kg=+$('leafKg').value,date=$('leafDate').value;
  if(!id||!Number.isFinite(kg)||kg<=0||!date)return alert('සියලු තොරතුරු නිවැරදිව ඇතුළත් කරන්න');
  if(closedLeaf(id,date.slice(0,7))){alert('මෙම මාසයේ බිල දැනටමත් තහවුරු කර ඇත. දලු සටහන් වෙනස් කළ නොහැක.');return}
  const newEntry={id,kg,date};
  leaves.push(newEntry);save('tea_leaves',leaves);
  lastSavedWhatsAppLeaf={id,date,kg,entry:newEntry};
  $('leafKg').value='';
  // A completed entry clears the search but retains the selected supplier.
  $('leafPersonSearch').value='';
  // Navigate to the supplier's page/month; selection already marks their full row.
  sheetMonth=date.slice(0,7);
  let sorted=sortedSuppliers(),index=sorted.findIndex(p=>p.id===id);
  if(index>=0)leafPage=Math.floor(index/LEAF_PAGE_SIZE);
  highlightedLeaf={id,date};
  selectedDay={id,date};render();
  requestAnimationFrame(()=>{
    const row=$('sheetRows').querySelector('[data-selected-leaf-row="true"]');
    const box=document.querySelector('.sheet-tablewrap');
    if(row&&box){box.scrollTop=Math.max(0,row.offsetTop-(box.clientHeight-row.offsetHeight)/2)}
    scrollTodayColumnIntoPlace();
  });
}

// Tea is always a full calendar month. Unconfirmed credit is always counted up to
// the local CURRENT day; there is no manually selected debt cutoff date.
// On confirmation a frozen bill records the actual day/time, its credit offset and
// the remaining debt. Subsequent bills only include NEW transactions since then.
const DATE_RE=/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
function localBusinessToday(){
 const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
function validISODate(str){
 if(!DATE_RE.test(String(str)))return false;
 const dt=new Date(str+'T12:00:00');
 return !Number.isNaN(dt.valueOf())&&[dt.getFullYear(),String(dt.getMonth()+1).padStart(2,'0'),String(dt.getDate()).padStart(2,'0')].join('-')===str;
}
function shiftDay(str,delta){
 const dt=new Date(str+'T12:00:00');dt.setDate(dt.getDate()+delta);
 return [dt.getFullYear(),String(dt.getMonth()+1).padStart(2,'0'),String(dt.getDate()).padStart(2,'0')].join('-');
}
function monthAdd(month,delta){const [y,m]=month.split('-').map(Number);const dt=new Date(y,m-1+delta,1);return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`}
function previousConfirmed(id,month){
 return settlements.filter(s=>s.supplierId===id && s.month<month).sort((a,b)=>b.month.localeCompare(a.month))[0]||null;
}
function confirmedBill(id,month){return settlements.find(s=>s.supplierId===id&&s.month===month)||null}
function latestConfirmedByDate(id,date){
 return settlements.filter(s=>s.supplierId===id && s.cutoff<=date).sort((a,b)=>b.cutoff.localeCompare(a.cutoff))[0]||null;
}
function getCreditWindow(id,month){
 const prev=previousConfirmed(id,month),cutoff=localBusinessToday();
 // No confirmed bill yet? Collect ALL outstanding historic credit entries, not only
 // entries since the 10th or since the beginning of the selected tea month.
 const oldest=credits.concat(deductions.filter(d=>d.type!=='welfare'&&d.type!=='fertilizerPlan')).filter(c=>c.id===id&&validISODate(c.date)&&c.date<=cutoff)
  .reduce((min,c)=>!min||c.date<min?c.date:min,null);
 const start=prev?prev.cutoff:(oldest||cutoff);
 return {start,cutoff,prev};
}
function signedCredit(c){return (c.type==='repay'?-1:1)*Number(c.amount||0)}
function creditInPeriod(c,period){
 if(!validISODate(c.date)||c.date>period.cutoff||c.date<period.start)return false;
 if(!period.prev)return true;
 if(c.date>period.prev.cutoff)return true;
 if(c.date<period.prev.cutoff)return false;
 // Same calendar date as the previous close: only newly recorded transactions
 // AFTER that actual confirmation belong in the NEXT bill.
 return !!(c.createdAt&&period.prev.confirmedAt&&c.createdAt>period.prev.confirmedAt);
}
function creditsForBill(id,month,bill=null){
 const b=bill||confirmedBill(id,month),period=b?
  {start:b.creditStart,cutoff:b.cutoff,prev:previousConfirmed(id,month)}:
  getCreditWindow(id,month);
 return credits.map((c,i)=>({...c,originalIndex:i})).filter(c=>c.id===id&&creditInPeriod(c,period)
  &&(!b||!b.closed||!c.createdAt||!b.confirmedAt||c.createdAt<=b.confirmedAt));
}
function sumCredits(id,predicate){return round2(credits.filter(c=>c.id===id&&validISODate(c.date)&&predicate(c.date,c)).reduce((s,c)=>s+signedCredit(c),0))}
function debtAtDate(id,date){
 const raw=sumCredits(id,d=>d<=date);
 const alreadyOffset=round2(settlements.filter(s=>s.supplierId===id && s.cutoff<=date).reduce((sum,s)=>sum+Number(s.offset||0),0));
 return round2(Math.max(0,raw-alreadyOffset));
}
const FERTILIZER_KEYS=Array.from({length:12},(_,i)=>'fert'+(i+1));
const DEDUCTION_KEYS=['teaPowder',...FERTILIZER_KEYS,'dolomite','chemicals','bank','welfare'];
const DEDUCTION_RECORD_TYPES=[...DEDUCTION_KEYS,'fertilizerPlan'];
const DEDUCTION_LABELS={teaPowder:'තේ කුඩු',...Object.fromEntries(FERTILIZER_KEYS.map((key,i)=>[key,`පොහොර — ${i+1} වාරිකය`])),fertilizerPlan:'පොහොර — වාරික සැලසුම',welfare:'සුභසාධන',dolomite:'ඩොලමයිට්',chemicals:'කෘෂි රසායන',bank:'බැංකු ණය වාරික'};
const DEDUCTION_TABS={teaPowder:['teaPowder'],fertilizer:[...FERTILIZER_KEYS,'fertilizerPlan'],dolomite:['dolomite'],chemicals:['chemicals'],bank:['bank'],welfare:['welfare']};
// All new fertilizer purchases are ONE plan with a full price, a start month and
// the number of installments. No installment is charged in advance. For a total
// not evenly divisible into cents, only the final installment takes the remainder.
function fertilizerPlanValid(d){
 return d?.type==='fertilizerPlan'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(d.startMonth)&&
 Number.isInteger(Number(d.installments))&&Number(d.installments)>=1&&Number(d.installments)<=12&&
 Number.isFinite(Number(d.amount))&&Number(d.amount)>0&&Number(d.amount)<=1e9&&
 d.date===d.startMonth+'-01';
}
function fertilizerInstallmentAmount(plan,index){
 const cents=Math.round(Number(plan.amount)*100),count=Number(plan.installments),base=Math.floor(cents/count);
 return (base+(index===count-1?cents-base*count:0))/100;
}
function fertilizerInstallmentsForBill(id,month){
 const prev=previousConfirmed(id,month),afterMonth=prev?.month||'';
 return deductions.flatMap((plan,recordIndex)=>{
  if(plan.id!==id||!fertilizerPlanValid(plan))return [];
  return Array.from({length:Number(plan.installments)},(_,i)=>({
   type:'fert'+(i+1),number:i+1,month:monthAdd(plan.startMonth,i),
   amount:fertilizerInstallmentAmount(plan,i),planIndex:recordIndex,
   note:plan.note||'',total:Number(plan.amount),startMonth:plan.startMonth,
   totalInstallments:Number(plan.installments)
  })).filter(item=>item.month<=month&&item.month>afterMonth);
 });
}
function deductionBlank(){return Object.fromEntries(DEDUCTION_KEYS.map(k=>[k,0]))}
function deduceMoneyMap(map){const result=deductionBlank();for(const k of DEDUCTION_KEYS)result[k]=round2(Math.max(0,Number(map?.[k])||0));return result}
function deductionsForBill(id,month,bill=null){
 const snap=bill||confirmedBill(id,month),window=snap?
 {start:snap.creditStart,cutoff:snap.cutoff,prev:previousConfirmed(id,month)}:getCreditWindow(id,month);
 // Legacy per-supplier welfare entries remain in backups for audit, but are NOT
 // newly billed. Only the one shared monthly value can create new welfare dues.
 return deductions.map((d,i)=>({...d,originalIndex:i})).filter(d=>d.id===id&&d.type!=='welfare'&&DEDUCTION_KEYS.includes(d.type)
   &&creditInPeriod(d,window)
   &&(!snap||!snap.closed||!d.createdAt||!snap.confirmedAt||d.createdAt<=snap.confirmedAt));
}
function closedDeductionRecord(d){
 if(d.type==='fertilizerPlan')return settlements.some(s=>s.supplierId===d.id&&s.month>=d.startMonth);
 if(d.type==='welfare'){const bill=confirmedBill(d.id,d.month||d.date.slice(0,7));return !!(bill && (!d.createdAt || !bill.confirmedAt || d.createdAt<=bill.confirmedAt));}
 return closedCreditRecord(d);
}
function deductionSnapshotExtras(s){
 const blank=deductionBlank();
 return {extraOpeningByType:deduceMoneyMap(s.extraOpeningByType),extraAddedByType:deduceMoneyMap(s.extraAddedByType),extraDueByType:deduceMoneyMap(s.extraDueByType),extraAppliedByType:deduceMoneyMap(s.extraAppliedByType),extraCarryByType:deduceMoneyMap(s.extraCarryByType),extraAppliedTotal:round2(Number(s.extraAppliedTotal)||0),extraCarryTotal:round2(Number(s.extraCarryTotal)||0),extraDueTotal:round2(Number(s.extraDueTotal)||0)};
}
function computeBill(id,month,overrides=null){
 const snapshot=confirmedBill(id,month);
 if(snapshot)return {...snapshot,...deductionSnapshotExtras(snapshot),transportRate:Number(snapshot.transportRate||0),transportFee:Number(snapshot.transportFee||0),
  afterTransport:snapshot.afterTransport??snapshot.gross,closed:true,valid:true};
 const cfg=overrides||billMonthSetting(month);
 const rate=Number(cfg.rate),percent=Number(cfg.percent),transportRate=Number(cfg.transportRate);
 const valid=cfg.valid!==false&&cfg.rate!==null&&Number.isFinite(rate)&&rate>0&&Number.isFinite(percent)&&percent>=0&&percent<=100&&Number.isFinite(transportRate)&&transportRate>=0&&transportRate<=1e7;
 const kg=round2(leaves.filter(l=>l.id===id&&String(l.date).slice(0,7)===month).reduce((s,l)=>s+Number(l.kg||0),0));
 const deducted=round2(kg*(Number.isFinite(percent)?percent:0)/100);
 const netKg=round2(Math.max(0,kg-deducted));
 const gross=valid?round2(netKg*rate):null;
 const transportFee=valid?round2(netKg*transportRate):null;
 const afterTransport=valid?round2(Math.max(0,gross-transportFee)):null;
 const period=getCreditWindow(id,month);
 const inPeriod=creditsForBill(id,month);
 const byType=type=>round2(inPeriod.filter(c=>c.type===type).reduce((s,c)=>s+Number(c.amount||0),0));
 const opening=period.prev?round2(Number(period.prev.debtCarry)||0):0;
 const newDebt=byType('debt'),adjusted=byType('adjust'),repaid=byType('repay');
 const debtBeforeOffset=round2(Math.max(0,opening+newDebt+adjusted-repaid));
 const overpaid=round2(Math.max(0,-(opening+newDebt+adjusted-repaid)));
 // Assign each deduction to THIS bill's actual confirmation window.
 // Priority for scarce funds: transport → other deduction categories (form order) → shop credit.
 // Unpaid category balances are carried forward and never silently written off.
 const isWelfareMember=!!person(id)?.welfareMember;
 const previousExtras=period.prev?.extraCarryByType||{};
 const extraOpeningByType=deduceMoneyMap(previousExtras),extraAddedByType=deductionBlank(),extraDueByType=deductionBlank(),extraAppliedByType=deductionBlank(),extraCarryByType=deductionBlank();
 for(const d of deductionsForBill(id,month))extraAddedByType[d.type]=round2(extraAddedByType[d.type]+Number(d.amount||0));
 // Scheduled monthly fertilizer installments are accrued by MONTH, independently
 // of the credit transaction date window. This also catches months with no bill:
 // missed installments become due on the first subsequently confirmed bill.
 const fertilizerInstallments=fertilizerInstallmentsForBill(id,month);
 for(const part of fertilizerInstallments)extraAddedByType[part.type]=round2(extraAddedByType[part.type]+part.amount);
 // Exactly ONE shared monthly welfare charge per current member, even BEFORE
 // any settlement has been confirmed. Already confirmed bills return above as
 // immutable snapshots; editing the shared fee only affects open bill previews.
 // A blank month means no new charge; the amount is never multiplied by entries.
 const sharedWelfare=welfareMonthlySettings[month];
 if(isWelfareMember && sharedWelfare && Number.isFinite(Number(sharedWelfare.amount)) && Number(sharedWelfare.amount)>0)
  extraAddedByType.welfare=round2(Number(sharedWelfare.amount));
 let extraRemaining=afterTransport===null?0:Math.max(0,afterTransport);
 for(const type of DEDUCTION_KEYS){
  const due=round2(extraOpeningByType[type]+extraAddedByType[type]);
  const applied=afterTransport===null || (type==='welfare'&&!isWelfareMember)?0:round2(Math.min(extraRemaining,due));
  extraDueByType[type]=due;extraAppliedByType[type]=applied;extraCarryByType[type]=round2(Math.max(0,due-applied));
  extraRemaining=round2(Math.max(0,extraRemaining-applied));
 }
 const sumExtra=obj=>round2(DEDUCTION_KEYS.reduce((s,k)=>s+obj[k],0));
 const extraDueTotal=sumExtra(extraDueByType),extraAppliedTotal=afterTransport===null?null:sumExtra(extraAppliedByType),extraCarryTotal=afterTransport===null?null:sumExtra(extraCarryByType);
 const offset=afterTransport===null?null:round2(Math.min(extraRemaining,debtBeforeOffset));
 const payable=afterTransport===null?null:round2(Math.max(0,extraRemaining-offset));
 const debtCarry=afterTransport===null?null:round2(Math.max(0,debtBeforeOffset-offset));
 return {supplierId:id,month,creditStart:period.start,cutoff:period.cutoff,creditStartAfter:period.prev?.confirmedAt||null,
 rate:valid?rate:null,percent,transportRate:valid?transportRate:null,transportFee,afterTransport,
 givenKg:kg,deductedKg:deducted,netKg,gross,openingDebt:opening,newDebt,adjusted,repaid,
 debtBeforeOffset,offset,payable,debtCarry,overpaid,
 extraOpeningByType,extraAddedByType,extraDueByType,extraAppliedByType,extraCarryByType,
 extraDueTotal,extraAppliedTotal,extraCarryTotal,fertilizerInstallments,welfareMemberAtBill:isWelfareMember,closed:false,valid};
}
// ─── Shared monthly welfare management: no supplier picker, no per-day records ───
function welfareValidMonth(month){return /^\d{4}-(0[1-9]|1[0-2])$/.test(month)}
function welfareMonthHistory(){return Object.entries(welfareMonthlySettings)
 .filter(([month,cfg])=>welfareValidMonth(month)&&cfg&&Number.isFinite(Number(cfg.amount))&&Number(cfg.amount)>0)
 .sort(([a],[b])=>b.localeCompare(a))}
function renderGlobalWelfare(){
 const month=$('deductionMonth').value,valid=welfareValidMonth(month),cfg=valid?welfareMonthlySettings[month]:null;
 const confirmedCount=settlements.filter(s=>s.month===month).length,members=people.filter(p=>p.welfareMember).length;
 $('welfareGlobalMonthLabel').textContent=valid?reportMonthHeading(month):'මාසයක් තෝරන්න';
 $('welfareGlobalAmount').value=cfg?Number(cfg.amount):'';
 $('welfareGlobalNote').value=cfg?.note||'';
 $('welfareGlobalAmount').disabled=!valid;
 $('welfareGlobalNote').disabled=!valid;
 $('welfareGlobalSave').disabled=!valid;
 $('welfareGlobalDelete').hidden=!cfg;
 $('welfareGlobalDelete').disabled=!valid;
 // A confirmed bill is a frozen accounting snapshot, but the COMMON MONTHLY
 // welfare setting remains editable for every *not-yet-confirmed* supplier.
 $('welfareGlobalLocked').hidden=!confirmedCount;
 $('welfareGlobalLocked').textContent=confirmedCount?`ℹ️ මෙම මාසයේ බිල් ${confirmedCount}ක් දැනටමත් තහවුරුයි. පොදු සුභසාධන මුදල තවම වෙනස් කළ හැක. අලුත් අගය තහවුරු නොකළ බිල්වලට වහාම පෙන්වයි; පරණ තහවුරු කළ බිල්වල ගණන් නොවෙනස්ව පවතී.`:'';
 $('welfareMemberCount').textContent=members.toLocaleString('en-US');
 $('welfareMemberRate').textContent=money(cfg?.amount||0);
 $('welfareGroupTotal').textContent=money(round2(members*Number(cfg?.amount||0)));
 const legacy=deductions.filter(d=>d.type==='welfare'&&(d.month||String(d.date||'').slice(0,7))===month);
 $('welfareLegacyNotice').hidden=!legacy.length;
 $('welfareLegacyNotice').textContent=legacy.length?`⚠️ මෙම මාසයේ පරණ Version එකෙන් තනි සැපයුම්කරුවන්ට ඇතුළත් කළ සුභසාධන සටහන් ${legacy.length}ක් තියෙනවා. ඒවා පොදු ගාස්තුවට ස්වයංක්‍රීයව පරිවර්තනය කර නැහැ. පරණ තහවුරු කළ බිල් නොවෙනස් වේ. තහවුරු නොකළ බිල් සඳහා ඉහත පොදු ගාස්තුව සකසන්න.`:'';
 const entries=welfareMonthHistory();
 $('welfareMonthRows').innerHTML=entries.length?entries.map(([m,item])=>`<tr><td>${esc(reportMonthHeading(m))}</td><td>${money(item.amount)}</td><td>${esc(item.note||'—')}</td><td>${settlements.some(s=>s.month===m)?'✓ සංශෝධනය කළ හැක · තහවුරු කළ බිල් නොවෙනස්':'✓ සුරැකී ඇත · සංශෝධනය කළ හැක'}</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center" class="note">තවම මාසික සුභසාධන ගාස්තු නැහැ.</td></tr>';
}
function saveGlobalWelfare(){
 const month=$('deductionMonth').value,amount=Number($('welfareGlobalAmount').value),note=$('welfareGlobalNote').value.trim();
 if(!welfareValidMonth(month)||month>localBusinessToday().slice(0,7)){alert('වලංගු පසුගිය හෝ වර්තමාන මාසයක් තෝරන්න.');return}
 if(!Number.isFinite(amount)||amount<=0||amount>1e9){alert('0ට වැඩි වලංගු සුභසාධන මුදලක් ඇතුළත් කරන්න.');return}
 const next={...welfareMonthlySettings,[month]:{amount:round2(amount),note,updatedAt:new Date().toISOString()}};
 try{save('tea_monthly_welfare',next)}catch(_){alert('සුභසාධන ගාස්තුව සුරැකීමට නොහැකි වුණා.');return}
 welfareMonthlySettings=next;render();$('welfareGlobalMessage').textContent='✓ '+reportMonthHeading(month)+' මුදල සුරැකුණා. තහවුරු නොකළ සාමාජික බිල්වල පෙරදසුන යාවත්කාලීනයි.';
}
function deleteGlobalWelfare(){
 const month=$('deductionMonth').value;
 if(!welfareMonthlySettings[month]||!confirm(`${reportMonthHeading(month)} පොදු සුභසාධන ගාස්තුව ඉවත් කරන්නද?`))return;
 const next={...welfareMonthlySettings};delete next[month];
 try{save('tea_monthly_welfare',next)}catch(_){alert('ගාස්තුව ඉවත් කළ නොහැකි වුණා.');return}
 welfareMonthlySettings=next;render();$('welfareGlobalMessage').textContent='✓ මෙම මාසයේ පොදු සුභසාධන ගාස්තුව ඉවත් කළා.';
}
$('welfareGlobalSave').addEventListener('click',saveGlobalWelfare);
$('welfareGlobalDelete').addEventListener('click',deleteGlobalWelfare);
// ─── Deduction entry UI ───
let activeDeductionTab='teaPowder';
// Paid progress is based on SAVED bill snapshots, never on an unconfirmed preview.
// A separate queue per installment number mirrors the billing engine's
// fert1..fert12 allocation. Legacy hand-entered fertilizer charges are also
// queued, so their payments are not wrongly credited to a newer plan.
function fertilizerConfirmedProgress(id,throughMonth){
 const plans=deductions.map((plan,index)=>({plan,index}))
  .filter(({plan})=>plan.id===id&&fertilizerPlanValid(plan)&&plan.startMonth<=throughMonth);
 const bills=settlements.filter(s=>s.supplierId===id&&s.closed&&s.month<=throughMonth)
  .sort((a,b)=>a.month.localeCompare(b.month));
 if(!bills.length||!plans.length)return null;
 const obligationsByType=Object.fromEntries(FERTILIZER_KEYS.map(k=>[k,[]]));
 const stateByIndex=new Map();
 plans.forEach(({plan,index})=>{
  const entry={plan,index,paidCents:0,paidCount:0,installmentPaidCents:Array(Number(plan.installments)).fill(0)};
  stateByIndex.set(index,entry);
  for(let number=1;number<=Number(plan.installments);number++){
   const amountCents=Math.round(fertilizerInstallmentAmount(plan,number-1)*100);
   obligationsByType['fert'+number].push({kind:'plan',index,part:number-1,month:monthAdd(plan.startMonth,number-1),
    orderDate:monthAdd(plan.startMonth,number-1)+'-01',amountCents,paidCents:0,createdAt:plan.createdAt||''});
  }
 });
 deductions.forEach((d,index)=>{
  if(d.id!==id||!FERTILIZER_KEYS.includes(d.type)||!validISODate(d.date)||d.date.slice(0,7)>throughMonth)return;
  const cents=Math.round(Number(d.amount)*100);
  if(cents<=0)return;
  obligationsByType[d.type].push({kind:'legacy',index,month:d.date.slice(0,7),orderDate:d.date,
   amountCents:cents,paidCents:0,createdAt:d.createdAt||''});
 });
 for(const key of FERTILIZER_KEYS)obligationsByType[key].sort((a,b)=>
   a.orderDate.localeCompare(b.orderDate)||a.createdAt.localeCompare(b.createdAt)||a.index-b.index);
 // Allocate ONLY actual confirmed bill deductions. Bills confirmed before an
 // obligation was recorded cannot pay it. Full installments count when 100% paid.
 bills.forEach(b=>{
  for(const key of FERTILIZER_KEYS){
   let remainingCents=Math.max(0,Math.round(Number(b.extraAppliedByType?.[key]||0)*100));
   for(const obligation of obligationsByType[key]){
    if(!remainingCents)break;
    if(obligation.month>b.month)continue;
    if(obligation.kind==='legacy'&&obligation.orderDate>b.cutoff)continue;
    if(obligation.createdAt&&b.confirmedAt&&obligation.createdAt>b.confirmedAt)continue;
    const amount=Math.min(remainingCents,obligation.amountCents-obligation.paidCents);
    if(amount<=0)continue;
    obligation.paidCents+=amount;remainingCents-=amount;
    if(obligation.kind==='plan')stateByIndex.get(obligation.index).installmentPaidCents[obligation.part]+=amount;
   }
  }
 });
 const rows=plans.map(({plan,index})=>{
  const state=stateByIndex.get(index),paidCents=state.installmentPaidCents.reduce((a,b)=>a+b,0);
  const totalCents=Math.round(Number(plan.amount)*100);
  const paidCount=state.installmentPaidCents.filter((n,i)=>n>=Math.round(fertilizerInstallmentAmount(plan,i)*100)).length;
  return {startMonth:plan.startMonth,note:plan.note||'',totalInstallments:Number(plan.installments),totalCents,
   paidCount,paidCents,remainingCount:Number(plan.installments)-paidCount,remainingCents:Math.max(0,totalCents-paidCents)};
 });
 return {rows,billsCount:bills.length,latestConfirmedMonth:bills[bills.length-1].month,
  legacyCount:deductions.filter(d=>d.id===id&&FERTILIZER_KEYS.includes(d.type)).length,
  totalCents:rows.reduce((a,r)=>a+r.totalCents,0),paidCents:rows.reduce((a,r)=>a+r.paidCents,0),
  paidCount:rows.reduce((a,r)=>a+r.paidCount,0),remainingCount:rows.reduce((a,r)=>a+r.remainingCount,0),
  remainingCents:rows.reduce((a,r)=>a+r.remainingCents,0)};
}
function renderFertilizerProgress(id,month){
 const box=$('fertilizerProgressWrap');
 const progress=activeDeductionTab==='fertilizer'&&id&&welfareValidMonth(month)?fertilizerConfirmedProgress(id,month):null;
 box.hidden=!progress;
 if(!progress)return;
 $('fertilizerProgressSubtitle').textContent=`${reportMonthHeading(progress.latestConfirmedMonth)} දක්වා තහවුරු කළ බිල් මත ගණනය · පොහොර සැලසුම් ${progress.rows.length}`;
 $('fertilizerProgressTotal').textContent=money(progress.totalCents/100);
 $('fertilizerProgressPaidCount').textContent=String(progress.paidCount);
 $('fertilizerProgressPaidAmount').textContent=money(progress.paidCents/100);
 $('fertilizerProgressRemainingCount').textContent=String(progress.remainingCount);
 $('fertilizerProgressRemainingAmount').textContent=money(progress.remainingCents/100);
 $('fertilizerProgressRows').innerHTML=progress.rows.map(r=>`<tr><td><strong>${esc(reportMonthHeading(r.startMonth))}</strong><small>${r.totalInstallments} වාරික · ${esc(r.note||'පොහොර මිලදී ගැනීම')}</small></td><td>${money(r.totalCents/100)}</td><td>${r.paidCount} / ${r.totalInstallments}</td><td>${money(r.paidCents/100)}</td><td>${r.remainingCount}</td><td><strong>${money(r.remainingCents/100)}</strong></td></tr>`).join('');
 $('fertilizerProgressNote').textContent='ගෙවූ වාරික ලෙස ගණන් ගන්නේ සම්පූර්ණයෙන් හිලව් වූ වාරික පමණයි. කොටසක් හිලව් වුණොත් ඒ මුදල ගෙවූ මුදලට ඇතුළත් වෙනවා; වාරිකය තවම ඉතිරි ලෙස පෙන්වනවා.'+(progress.legacyCount?' පරණ අතින් ඇතුළත් කළ පොහොර වාරික වෙනම සටහන් වන නිසා මෙම නව වාරික සැලසුම් එකතුවට ඇතුළත් නොවේ.':'');
}
function deductionTabTypes(){return DEDUCTION_TABS[activeDeductionTab]||['teaPowder']}
function fertilizerPlanHint(){
 const panel=$('fertilizerPlanHint');panel.hidden=activeDeductionTab!=='fertilizer';
 if(activeDeductionTab!=='fertilizer')return;
 const count=Number($('deductionInstallment').value),amount=Number($('deductionAmount').value),month=$('deductionMonth').value;
 if(!Number.isFinite(amount)||amount<=0||!welfareValidMonth(month)){panel.textContent='පොහොර මුළු වටිනාකම සහ වාරික ගණන දාන්න. තෝරාගත් මාසයේ සිට සෑම මාසයකම වාරිකය ස්වයංක්‍රීයව බිලට යයි.';return}
 const plan={amount,installments:count},first=fertilizerInstallmentAmount(plan,0),last=fertilizerInstallmentAmount(plan,count-1);
 panel.textContent=`🌱 ${reportMonthHeading(month)} සිට ${count} වාරිකයි. මාසයකට ${money(first)}${first===last?'':` (අවසාන වාරිකය ${money(last)})`}. අවසාන මාසය: ${reportMonthHeading(monthAdd(month,count-1))}. ඉදිරි වාරික තවම බිලට කැපෙන්නේ නැහැ.`;
}
function deductionTabName(){return activeDeductionTab==='fertilizer'?'පොහොර':DEDUCTION_LABELS[activeDeductionTab]}
function renderDeductionSearch(){
 const q=$('deductionSupplierSearch').value.trim().toLocaleLowerCase(),box=$('deductionSearchResults');
 if(!q){box.hidden=true;box.innerHTML='';return}
 const found=sortedSuppliers().filter(p=>p.id.toLocaleLowerCase().includes(q)||p.name.toLocaleLowerCase().includes(q)).slice(0,40);
 box.innerHTML=found.length?found.map(p=>`<button type="button" role="option" data-deduction-supplier="${esc(p.id)}"><span>${esc(p.id)}</span>${esc(p.name)}</button>`).join(''):'<div class="billing-search-no-result">ගැළපෙන සැපයුම්කරුවෙක් නැහැ.</div>';
 box.hidden=false;
}
function chooseDeductionSupplier(id){
 if(!person(id))return;
 $('deductionPerson').value=id;$('deductionSupplierSearch').value='';$('deductionSearchResults').hidden=true;$('deductionSearchResults').innerHTML='';
 $('deductionMessage').textContent='';renderDeductionPreview();
}
function renderDeductionPreview(){
 const isGlobalWelfare=activeDeductionTab==='welfare';
 $('deductions').classList.toggle('welfare-global-mode',isGlobalWelfare);
 $('welfareGlobalWorkspace').hidden=!isGlobalWelfare;
 if(isGlobalWelfare){
  $('fertilizerProgressWrap').hidden=true;
  $('deductionEmpty').hidden=true;$('deductionWorkspace').hidden=true;$('deductionSelected').hidden=true;
  $('welfareMembershipNotice').hidden=true;
  document.querySelectorAll('[data-deduction-type]').forEach(btn=>{const selected=btn.dataset.deductionType===activeDeductionTab;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-selected',String(selected))});
  renderGlobalWelfare();return;
 }
 const id=$('deductionPerson').value,month=$('deductionMonth').value,p=person(id);
 $('deductionEmpty').hidden=!!p;$('deductionWorkspace').hidden=!p;$('deductionSelected').hidden=!p;
 const type=deductionTabTypes(),label=deductionTabName();
 $('deductionEntryTitle').textContent=label+' — අලුත් අඩුකිරීම';$('deductionPreviewTitle').textContent=label+' — ගිණුම් සාරාංශය';
 $('deductionInstallmentWrap').hidden=activeDeductionTab!=='fertilizer';
 $('deductionDateWrap').hidden=activeDeductionTab==='fertilizer';
 $('deductionAmountLabel').textContent=activeDeductionTab==='fertilizer'?'පොහොර මුළු වටිනාකම (රු.)':'අඩු කරන මුදල (රු.)';
 $('deductionRecordDateHead').textContent=activeDeductionTab==='fertilizer'?'ආරම්භක මාසය':'දිනය';
 $('deductionRecordAmountHead').textContent=activeDeductionTab==='fertilizer'?'මුළු වටිනාකම':'මුදල';
 $('deductionAddBtn').textContent=activeDeductionTab==='fertilizer'?'+ පොහොර වාරික සැලසුම සුරකින්න':'+ අඩුකිරීම සුරකින්න';
 fertilizerPlanHint();
 $('welfareMembershipNotice').hidden=true;
 $('deductionAddBtn').disabled=false;
 renderFertilizerProgress(p?.id||'',month);
 document.querySelectorAll('[data-deduction-type]').forEach(btn=>{const selected=btn.dataset.deductionType===activeDeductionTab;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-selected',String(selected))});
 if(!p)return;
 $('deductionSelected').innerHTML=`<strong>✓ තෝරාගත් සැපයුම්කරු</strong><span>${esc(p.id)} — ${esc(p.name)}</span>`;
 const b=computeBill(id,month),pStart=activeDeductionTab==='welfare'?'මාසය: '+month:b.creditStart+' – '+b.cutoff;
 const sum=(field)=>round2(type.filter(k=>DEDUCTION_KEYS.includes(k)).reduce((total,k)=>total+Number(b[field]?.[k]||0),0));
 const opening=sum('extraOpeningByType'),added=sum('extraAddedByType'),due=sum('extraDueByType'),applied=b.extraAppliedTotal===null?null:sum('extraAppliedByType'),carry=b.extraCarryTotal===null?null:sum('extraCarryByType');
 const row=(name,desc,value)=>billPreviewRow(name,desc,value);
 $('deductionIdentity').textContent=`${p.id} · ${p.name} · ${reportMonthHeading(month)} · ${pStart}`;
 $('deductionStatus').textContent=b.closed?'✓ තහවුරු කළා':'පෙරදසුන / DRAFT';
 $('deductionOpening').textContent=money(opening);$('deductionAdded').textContent=money(added);$('deductionApplied').textContent=applied===null?'බිල් මිල නැහැ':money(applied);
 $('deductionSummaryRows').innerHTML=[
  row('ඉදිරියට ගෙන ආ ශේෂය','කලින් තහවුරු කළ බිලෙන්',money(opening)),
  row('මෙම බිලට ඇතුළත් කළ '+label,pStart,'+ '+money(added)),
  ...(activeDeductionTab==='fertilizer'?FERTILIZER_KEYS.filter(k=>Number(b.extraDueByType[k])>0).map(k=>row(DEDUCTION_LABELS[k],'මෙම බිලට නියමිත / ඉදිරි ශේෂ',money(b.extraDueByType[k]))):[]),
  row('මුළු අඩු කළ යුතු මුදල','ඉදිරි ශේෂය + අලුත් ගනුදෙනු',money(due)),
  row('දලු බිලෙන් හිලව්ව',b.closed?'තහවුරු කර ඇත':'තහවුරු කළ පසු සුරැකේ',applied===null?'—':'− '+money(applied)),
  row('ඊළඟ බිලට ඉතිරි මුදල',b.closed?'තහවුරු කළ ඉතිරිය':'පෙරදසුන පමණයි',carry===null?'—':money(carry))
 ].join('');
 $('deductionPeriodNote').textContent=activeDeductionTab==='fertilizer'?
  'පොහොර සඳහා මුළු වටිනාකම එක් වරක් සටහන් කරන්න. ආරම්භක මාසයේ සිට වාරික ස්වයංක්‍රීයව බිල්වලට එකතු වේ. මඟහැරුණු මාසවල වාරික ඊළඟ තහවුරු කරන බිලට එකතු වේ. මුදල මදි නම් හිලව් නොවූ ගණන ඉදිරියට යයි.':
  (b.closed?'✓ මෙම බිල තහවුරු කර ඇත. මේ බිලට අදාළ අඩුකිරීම් අගුළු වැටී ඇත.':'මෙම බිල තහවුරු වන දිනය දක්වා ඇති අඩුකිරීම් එකතු කරයි. බිල තහවුරු කළ පසු හිලව්ව සිදු වී ඉතිරි මුදල ඊළඟ බිලට යයි. අඩුකිරීම් කඩ ණයට පෙර හිලව් කරයි.');
 const records=activeDeductionTab==='fertilizer'?deductions.map((d,i)=>({...d,originalIndex:i})).filter(d=>d.id===id&&type.includes(d.type)&&((d.type==='fertilizerPlan'&&d.startMonth<=month)||(d.type!=='fertilizerPlan'&&deductionsForBill(id,month,b).some(e=>e.originalIndex===d.originalIndex)))):
  deductionsForBill(id,month,b).filter(d=>type.includes(d.type));
 $('deductionRecordCount').textContent=`(${records.length})`;
 $('deductionRows').innerHTML=records.length?records.slice().reverse().map(d=>`<tr><td>${esc(d.type==='fertilizerPlan'?d.startMonth:d.type==='welfare'?(d.month||d.date.slice(0,7)):d.date)}</td><td>${esc(d.type==='fertilizerPlan'?`පොහොර — ${d.installments} වාරික`:DEDUCTION_LABELS[d.type])}${d.type==='fertilizerPlan'?`<br><small>${esc(d.startMonth)} → ${esc(monthAdd(d.startMonth,Number(d.installments)-1))} · මාසික: ${esc(money(fertilizerInstallmentAmount(d,0)))}</small>`:''}</td><td>${money(d.amount)}</td><td>${esc(d.note||'')}</td><td>${closedDeductionRecord(d)?'<small>තහවුරු කර ඇත</small>':`<button type="button" class="danger" data-deduction-delete="${d.originalIndex}">මකන්න</button>`}</td></tr>`).join(''):'<tr><td colspan="5" class="note" style="text-align:center">මෙම අඩුකිරීම් වර්ගයට සටහන් නැහැ.</td></tr>';
}
function addDeduction(){
 const id=$('deductionPerson').value,month=$('deductionMonth').value,amount=Number($('deductionAmount').value),date=$('deductionDate').value;
 const fertilizer=activeDeductionTab==='fertilizer';
 const kind=fertilizer?'fertilizerPlan':activeDeductionTab;
 if(!person(id)){alert('මුලින්ම සැපයුම්කරුවෙක් තෝරන්න.');return}
 if(!welfareValidMonth(month)||month>localBusinessToday().slice(0,7)){alert('වලංගු පසුගිය හෝ වර්තමාන මාසයක් තෝරන්න.');return}
 if(!Number.isFinite(amount)||amount<=0||amount>1e9||(!fertilizer&&(!DEDUCTION_KEYS.includes(kind)||!validISODate(date)||date>localBusinessToday()))){
  alert(fertilizer?'වලංගු පොහොර මුළු වටිනාකමක් ඇතුළත් කරන්න.':'වලංගු දිනයක් සහ 0ට වැඩි මුදලක් ඇතුළත් කරන්න.');return;
 }
 const count=Number($('deductionInstallment').value);
 if(fertilizer&&(!Number.isInteger(count)||count<1||count>12)){
  alert('වාරික 1 සිට 12 අතර ගණනක් තෝරන්න.');return;
 }
 const latest=settlements.filter(s=>s.supplierId===id).sort((a,b)=>b.month.localeCompare(a.month))[0];
 if(latest&&(month<=latest.month||(!fertilizer&&date<latest.cutoff))){
  alert('මෙම මාසයට අදාළ බිල දැනටමත් තහවුරු වී ඇත. ඊළඟ බිල් මාසය තෝරන්න.');return;
 }
 const record={id,type:kind,date:fertilizer?month+'-01':date,amount:round2(amount),note:$('deductionNote').value.trim(),createdAt:new Date().toISOString()};
 if(fertilizer){record.startMonth=month;record.installments=count;}
 deductions.push(record);
 try{save('tea_extra_deductions',deductions)}catch(_){deductions.pop();alert('අඩුකිරීම සුරැකීමට නොහැකි වුණා.');return}
 $('deductionAmount').value='';$('deductionNote').value='';
 render();$('deductionMessage').textContent=fertilizer?`✓ ${money(amount)} පොහොර මුදල ${count} වාරිකවලට සුරැකුණා. ${reportMonthHeading(month)} සිට මාසික වාරිකය පමණක් බිලට එකතු වේ.`:'✓ අඩුකිරීම සුරැකුණා. බිල තහවුරු වනතුරු ගණන් එකතු වේ.';
}
$('deductionAddBtn').addEventListener('click',addDeduction);
$('deductionMonth').addEventListener('change',()=>{$('deductionMessage').textContent='';renderDeductionPreview()});
['deductionAmount','deductionInstallment'].forEach(key=>$(key).addEventListener('input',fertilizerPlanHint));
$('deductionPerson').addEventListener('change',()=>{$('deductionSupplierSearch').value='';$('deductionSearchResults').hidden=true;$('deductionMessage').textContent='';renderDeductionPreview()});
$('deductionSupplierSearch').addEventListener('input',renderDeductionSearch);
$('deductionSupplierSearch').addEventListener('keydown',event=>{
 if(event.key==='Escape'){$('deductionSupplierSearch').value='';renderDeductionSearch();return}
 if(event.key==='Enter'){const btn=$('deductionSearchResults').querySelector('[data-deduction-supplier]');if(btn){event.preventDefault();chooseDeductionSupplier(btn.dataset.deductionSupplier)}}
});
$('deductionSearchResults').addEventListener('click',event=>{const btn=event.target.closest('[data-deduction-supplier]');if(btn)chooseDeductionSupplier(btn.dataset.deductionSupplier)});
$('deductionRows').addEventListener('click',event=>{
 const btn=event.target.closest('[data-deduction-delete]');if(!btn)return;
 const index=Number(btn.dataset.deductionDelete),item=deductions[index];
 if(!item||item.id!==$('deductionPerson').value||!deductionTabTypes().includes(item.type))return;
 if(closedDeductionRecord(item)){alert('තහවුරු කළ බිලකට අදාළ අඩුකිරීම මකා දැමිය නොහැක.');return}
 if(!confirm('මෙම අඩුකිරීම් සටහන මකන්නද?'))return;
 deductions.splice(index,1);save('tea_extra_deductions',deductions);render();
});
document.querySelectorAll('[data-deduction-type]').forEach(btn=>btn.addEventListener('click',()=>{
 activeDeductionTab=btn.dataset.deductionType;
 $('deductionMessage').textContent='';$('deductionSupplierSearch').value='';$('deductionSearchResults').hidden=true;
 renderDeductionPreview();
}));
document.addEventListener('click',event=>{if(!event.target.closest('.deduction-search-box'))$('deductionSearchResults').hidden=true});
function closedLeaf(id,month){return !!confirmedBill(id,month)}
function closedCreditRecord(c){
 return settlements.some(s=>s.supplierId===c.id &&
  (c.date<s.cutoff || (c.date===s.cutoff && (!c.createdAt || !s.confirmedAt || c.createdAt<=s.confirmedAt))));
}
function closedCreditDate(id,date){return closedCreditRecord({id,date})}
function saveSettlements(){save('tea_confirmed_settlements',settlements)}
function cannotConfirm(bill){
 if(bill.closed)return 'මෙම සැපයුම්කරුගේ බිල දැනටමත් තහවුරු කර ඇත.';
 if(!bill.valid)return 'පළමුව නිවැරදි කිලෝ මිල, අඩු කරන % සහ ප්‍රවාහන ගාස්තුව සුරකින්න.';
 if(bill.gross!==null && bill.transportFee>bill.gross)return 'ප්‍රවාහන ගාස්තුව දලු මුදලට වඩා වැඩියි. ගණන් පරීක්ෂා කරන්න.';
 if(!validISODate(bill.cutoff))return 'අද දිනය නිවැරදි නැහැ.';
 const [by,bm]=bill.month.split('-').map(Number);if(bill.cutoff<bill.month+'-'+new Date(by,bm,0).getDate())return 'දලු මාසය අවසන් වීමට පෙර බිල තහවුරු කළ නොහැක.';
 if(bill.cutoff!==localBusinessToday())return 'බිල තහවුරු කරන විට අද දිනයට ගණනය නැවත පරීක්ෂා කරන්න.';
 if(bill.creditStart>bill.cutoff)return 'පෙර තහවුරු කළ බිල් දිනය අද දිනයට පසුවයි. ගණන් පරීක්ෂා කරන්න.';
 if(settlements.some(s=>s.supplierId===bill.supplierId && s.month>bill.month))return 'මෙයට පසු මාසයක බිලක් දැනටමත් තහවුරු කර ඇත. පරණ බිලක් පසුකාලීනව තහවුරු කළ නොහැක.';
 return '';
}
function confirmSelectedBill(){
 const p=person($('settlePerson').value),month=$('settleMonth').value;
 if(!p)return;
 const b=computeBill(p.id,month),err=cannotConfirm(b);
 if(err){alert(err);return}
 const message=`${p.id} — ${p.name}\nදලු මාසය: ${month}\nණය කාලය: ${b.creditStart} සිට ${b.cutoff}\nමුළු දලු මුදල: ${money(b.gross)}\nප්‍රවාහන ගාස්තු (${fmtBill(b.transportRate)} රු./kg): ${money(b.transportFee)}\nප්‍රවාහන ගාස්තුවෙන් පසු: ${money(b.afterTransport)}\nඅනෙකුත් අඩුකිරීම් හිලව්ව: ${money(b.extraAppliedTotal)}\nඅනෙකුත් ඉතිරි අඩුකිරීම්: ${money(b.extraCarryTotal)}\nහිලව් කරන ණය: ${money(b.offset)}\nගෙවිය යුතු මුදල: ${money(b.payable)}\nඉදිරියට ගෙනයන ණය: ${money(b.debtCarry)}\n\nතහවුරු කළ පසු මෙම බිල හා සටහන් අගුළු වැටේ. දිගටම යන්නද?`;
 if(!confirm(message))return;
 settlements.push({...b,supplierName:p.name,supplierPhone:p.phone||'',closed:true,confirmedAt:new Date().toISOString(),id:`${month}|${p.id}`});saveSettlements();loadBillMonthSettings();
 reportState.mode='confirmed';reportState.month=month;reportState.personId=p.id;
 $('confirmedSearch').value='';render();document.querySelector('nav button[data-page="reports"]').click();
 alert('✓ බිල තහවුරු කළා. දැන් වාර්තා → තහවුරු කළ බිල්පත් යටතේ පෙන්වනවා.');
}
function confirmAllBills(){
 const month=$('settleMonth').value,cfg=billMonthSetting(month);
 if(cfg.rate===null){alert('පළමුව මාසික කිලෝ මිල සකසන්න.');return}
 const all=sortedSuppliers().filter(p=>!confirmedBill(p.id,month)).map(p=>computeBill(p.id,month));
 const eligible=all.filter(b=>b.givenKg>0||b.debtBeforeOffset>0||DEDUCTION_KEYS.some(k=>k!=='welfare'&&b.extraDueByType[k]>0));
 const failures=eligible.filter(b=>cannotConfirm(b));
 if(failures.length){alert('බිල්පත් වසා දැමීමට නොහැක: '+cannotConfirm(failures[0]));return}
 if(!eligible.length){alert('තහවුරු කිරීමට නව බිල්පත් නැහැ.');return}
 const gross=round2(eligible.reduce((s,b)=>s+b.gross,0)),transportTotal=round2(eligible.reduce((s,b)=>s+b.transportFee,0)),offset=round2(eligible.reduce((s,b)=>s+b.offset,0)),extraTotal=round2(eligible.reduce((s,b)=>s+b.extraAppliedTotal,0));
 if(!confirm(`${month} — සැපයුම්කරුවන් ${eligible.length} දෙනෙකුගේ බිල්පත් තහවුරු කරන්නද?\nදලු මුදල: ${money(gross)}\nප්‍රවාහන ගාස්තු: ${money(transportTotal)}\nඅනෙකුත් අඩුකිරීම්: ${money(extraTotal)}\nණය හිලව්ව: ${money(offset)}\n\nඅදාල දලු හා ණය සටහන් ඉන්පසු අගුළු වැටේ. පළමුව Backup එකක් ගන්න.`))return;
 const stamp=new Date().toISOString();
 settlements.push(...eligible.map(b=>({...b,supplierName:person(b.supplierId)?.name||b.supplierId,supplierPhone:person(b.supplierId)?.phone||'',closed:true,confirmedAt:stamp,id:`${month}|${b.supplierId}`})));saveSettlements();loadBillMonthSettings();
 reportState.mode='confirmed';reportState.month=month;reportState.personId='';
 $('confirmedSearch').value='';render();document.querySelector('nav button[data-page="reports"]').click();
 alert(`✓ බිල්පත් ${eligible.length}ක් තහවුරු කළා. දැන් වාර්තා ලැයිස්තුවේ පෙන්වනවා.`);
}
$('confirmBillBtn').addEventListener('click',confirmSelectedBill);
$('confirmAllBillsBtn').addEventListener('click',confirmAllBills);

function renderCreditSearchResults(){
  const box=$('creditSearchResults'),q=$('creditSupplierSearch').value.trim().toLocaleLowerCase();
  if(!q){box.hidden=true;box.innerHTML='';return}
  const matches=sortedSuppliers().filter(p=>p.id.toLocaleLowerCase().includes(q)||p.name.toLocaleLowerCase().includes(q)).slice(0,35);
  box.innerHTML=matches.length?matches.map(p=>`<button type="button" role="option" data-credit-supplier="${esc(p.id)}"><span>${esc(p.id)}</span>${esc(p.name)}</button>`).join(''):'<div class="billing-search-no-result">ගැළපෙන සැපයුම්කරුවෙක් නැහැ.</div>';
  box.hidden=false;
}
function chooseCreditSupplier(id){
  if(!person(id))return;
  $('creditPerson').value=id;
  $('creditSupplierSearch').value='';
  $('creditSearchResults').hidden=true;
  $('creditSearchResults').innerHTML='';
  $('creditRecordNotice').textContent='';
  renderCreditPreview();
}
function renderCreditPreview(){
 const id=$('creditPerson').value,month=$('creditMonth').value,p=person(id);
 $('creditWorkspace').hidden=!p;$('creditEmpty').hidden=!!p;$('creditChosenPerson').hidden=!p;
 if(!p)return;
 $('creditChosenPerson').innerHTML=`<strong>✓ තෝරාගත් සැපයුම්කරු</strong><span>${esc(p.id)} — ${esc(p.name)}</span>`;
 const b=computeBill(id,month),period=`${b.creditStart} – ${b.cutoff}`;
 $('creditPreviewIdentity').textContent=`${p.id} · ${p.name} · ${reportMonthHeading(month)} | ණය: ${period}`;
 const records=creditsForBill(id,month,b);
 $('creditStatOpening').textContent=money(b.openingDebt);
 $('creditStatNew').textContent=money(b.newDebt);
 $('creditStatClosing').textContent=money(b.closed?b.debtCarry:b.debtBeforeOffset);
 $('creditSummaryRows').innerHTML=[
  billPreviewRow('ඉදිරියට ගෙන ආ ණය','පෙර තහවුරු කළ බිලෙන් / මුල් ණය ශේෂය',money(b.openingDebt),'bill-soft'),
  billPreviewRow('අදාළ කාලයේ අලුත් ණය',period,'+ '+money(b.newDebt)),
  billPreviewRow('ණය සංශෝධන',period,'+ '+money(b.adjusted)),
  billPreviewRow('මුදල් ආපසු ගෙවීම්',period,'− '+money(b.repaid)),
  billPreviewRow('බිල් කපන දින ණය ශේෂය','දලු මුදලෙන් අඩු කිරීමට පෙර',money(b.debtBeforeOffset),'bill-soft'),
  billPreviewRow('තහවුරු කළ දලු බිලෙන් හිලව්ව',b.closed?'තහවුරු කළ ගෙවීම':'තවම තහවුරු කර නැහැ','− '+money(b.closed?b.offset:0)),
  billPreviewRow('ඉදිරියට ගෙන යාමට ඇති ණය',b.closed?'තහවුරු කළ ශේෂය':'තහවුරු කළ පසු නියම වේ',b.closed?money(b.debtCarry):'පෙරදසුන පමණයි','bill-accent')
 ].join('');
 $('creditCarryInfo').textContent=b.closed?'✓ '+month+' බිල්පත තහවුරු කර ඇත. මෙහි ණය හිලව්ව සැබෑ වාර්තාවට සුරැකී ඇත.':'මේ බිල තවම තහවුරු කර නැහැ. ණය කාලය: '+period+'; අද දක්වා ඇති ණය එකතු කර ඇත. මෙම ශේෂයට තවම දලු බිලේ හිලව්ව ඇතුළත් නොවේ.';
 $('creditRecordCount').textContent=`(${records.length})`;
 const labels={debt:'අලුත් ණය',repay:'මුදල් ආපසු ගෙවීම',adjust:'ණය සංශෝධනය'};
 $('creditRows').innerHTML=records.length?records.slice().reverse().map(c=>`<tr><td>${esc(c.date)}</td><td>${labels[c.type]||esc(c.type)}</td><td>${money(c.amount)}</td><td>${esc(c.note||'')}</td><td>${closedCreditRecord(c)?'<small>තහවුරු කර ඇත</small>':`<button type="button" class="danger" data-credit-delete="${c.originalIndex}">මකන්න</button>`}</td></tr>`).join(''):'<tr><td colspan="5" class="credit-no-entries">මෙම ණය කාලයට සටහන් නැහැ.</td></tr>';
}
$('creditMonth').addEventListener('change',()=>{
  const month=$('creditMonth').value;
  if(/^\d{4}-(0[1-9]|1[0-2])$/.test(month))$('creditDate').value=localBusinessToday();
  $('creditRecordNotice').textContent='';
  renderCreditPreview();
});
$('creditPerson').addEventListener('change',()=>{
  $('creditSupplierSearch').value='';$('creditSearchResults').hidden=true;$('creditRecordNotice').textContent='';renderCreditPreview();
});
$('creditSupplierSearch').addEventListener('input',renderCreditSearchResults);
$('creditSupplierSearch').addEventListener('keydown',event=>{
  if(event.key==='Escape'){$('creditSupplierSearch').value='';renderCreditSearchResults();return}
  if(event.key==='Enter'){
    const btn=$('creditSearchResults').querySelector('[data-credit-supplier]');
    if(btn){event.preventDefault();chooseCreditSupplier(btn.dataset.creditSupplier)}
  }
});
$('creditSearchResults').addEventListener('click',event=>{
  const btn=event.target.closest('[data-credit-supplier]');if(btn)chooseCreditSupplier(btn.dataset.creditSupplier);
});
$('creditRows').addEventListener('click',event=>{
  const button=event.target.closest('[data-credit-delete]');if(!button)return;
  const index=Number(button.dataset.creditDelete);
  if(Number.isInteger(index) && credits[index]?.id===$('creditPerson').value){del(credits,'tea_credits',index)}
});
document.addEventListener('click',event=>{
  if(!event.target.closest('.credit-search-box'))$('creditSearchResults').hidden=true;
});

function addCredit(){
  const id=$('creditPerson').value,amount=Number($('creditAmount').value),date=$('creditDate').value,type=$('creditType').value;
  const month=$('creditMonth').value;
  if(!person(id)){alert('පළමුව සැපයුම්කරුවෙක් තෝරන්න.');return}
  if(!date || !Number.isFinite(amount) || amount<=0 || !['debt','repay','adjust'].includes(type)){alert('දිනය, වර්ගය සහ 0 ට වැඩි මුදලක් ඇතුළත් කරන්න.');return}
  if(!validISODate(date)||date>localBusinessToday()){alert('අද හෝ ඊට පෙර වලංගු ගනුදෙනු දිනයක් තෝරන්න.');return}
  const latest=settlements.filter(s=>s.supplierId===id).sort((a,b)=>b.month.localeCompare(a.month))[0];
  if(latest && date<latest.cutoff){alert('මෙම දිනට අදාළ ණය ගිණුම දැනටමත් වසා ඇත. අලුත් ණය ඇතුළත් කරන්න බිලෙන් පසු දිනයක් තෝරන්න.');return}
  // 'createdAt' lets a same-day transaction entered AFTER confirming a bill
  // count towards the NEXT bill instead of being lost or charged twice.
  credits.push({id,amount:round2(amount),date,type,note:$('creditNote').value.trim(),createdAt:new Date().toISOString()});
  save('tea_credits',credits);
  $('creditAmount').value='';$('creditNote').value='';
  $('creditRecordNotice').textContent=latest&&month<=latest.month?'✓ ගනුදෙනුව සුරැකුණා. මෙය ඊළඟ බිල්පතට අදාළයි.':'✓ ගනුදෙනුව සුරැකුණා.';
  render();
}
function balance(id,month){return debtAtDate(id,month+'-'+String(new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate()).padStart(2,'0'))}
// Bill preview: selected supplier + month price and percentage, no settlement is posted.
function billMonthSetting(month){
 const s=billingSettings[month]||{};
 const isExisting=Object.prototype.hasOwnProperty.call(billingSettings,month);
 // New months start at Rs. 3.50/kg, while migrated existing settings retain zero
 // until explicitly changed, so historic previews cannot silently change.
 const oldValue=Object.prototype.hasOwnProperty.call(s,'transportRate') ? Number(s.transportRate) : (isExisting?0:3.5);
 const transportRate=Number.isFinite(oldValue)&&oldValue>=0&&oldValue<=1e7?oldValue:0;
 return {rate:Number.isFinite(Number(s.rate)) && Number(s.rate)>0 ? Number(s.rate):null,
 percent:Number.isFinite(Number(s.percent))&&Number(s.percent)>=0&&Number(s.percent)<=100?Number(s.percent):0,
 transportRate};
}
function monthLocked(month){return settlements.some(s=>s.month===month)}
function loadBillMonthSettings(){
 const month=$('settleMonth').value,setting=billMonthSetting(month),locked=monthLocked(month);
 $('rate').value=setting.rate??'';$('deductPercent').value=setting.percent;$('transportRate').value=setting.transportRate;
 ['rate','deductPercent','transportRate'].forEach(id=>$(id).disabled=locked);
 $('billConfigNotice').textContent=locked?'🔒 මෙම මාසයේ බිල්පත් තහවුරු කර ඇති නිසා පොදු සැකසුම් අගුළු වැටී ඇත.':'මාසික මිල, %, ප්‍රවාහන ගාස්තුව ස්වයංක්‍රීයව සුරැකේ. ණය අද දිනය දක්වා Auto ගණනය වේ.';
 $('billConfigNotice').classList.remove('billing-error');
}
function updateBillMonthlySetting(){
 const month=$('settleMonth').value;
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return;
 if(monthLocked(month)){loadBillMonthSettings();alert('මෙම මාසයේ බිල්පත් තහවුරු කර ඇති බැවින් සැකසුම් වෙනස් කළ නොහැක.');return}
 const rateStr=$('rate').value.trim(),pctStr=$('deductPercent').value.trim(),transStr=$('transportRate').value.trim();
 const rate=rateStr===''?null:Number(rateStr),percent=pctStr===''?0:Number(pctStr),transportRate=transStr===''?NaN:Number(transStr);
 const valid=(rate===null||(Number.isFinite(rate)&&rate>0&&rate<=1e7)) &&Number.isFinite(percent)&&percent>=0&&percent<=100 &&Number.isFinite(transportRate)&&transportRate>=0&&transportRate<=1e7;
 if(!valid){$('billConfigNotice').textContent='මිල, අඩු කරන % හෝ ප්‍රවාහන ගාස්තුව වලංගු නැහැ.';$('billConfigNotice').classList.add('billing-error');renderBillPreview({rate,percent,transportRate,valid:false});return}
 billingSettings[month]={rate,percent,transportRate};save('tea_billing_settings',billingSettings);
 $('billConfigNotice').textContent='✓ '+month+' මාසයේ මිල, %, ප්‍රවාහන ගාස්තුව සුරැකුණා.';
 $('billConfigNotice').classList.remove('billing-error');renderBillPreview();renderCreditPreview();renderReportPreview();updateDashboardGross();
}
function renderBillSearchResults(){
  const box=$('billSearchResults');
  const q=$('billSupplierSearch').value.trim().toLocaleLowerCase();
  if(!q){box.hidden=true;box.innerHTML='';return}
  const matches=sortedSuppliers().filter(p=>String(p.id).toLocaleLowerCase().includes(q)||String(p.name).toLocaleLowerCase().includes(q)).slice(0,35);
  box.innerHTML=matches.length?matches.map(p=>`<button type="button" role="option" data-bill-supplier="${esc(p.id)}"><span>${esc(p.id)}</span>${esc(p.name)}</button>`).join(''):'<div class="billing-search-no-result">ගැළපෙන සැපයුම්කරුවෙක් නැහැ.</div>';
  box.hidden=false;
}
function chooseBillSupplier(id){
  if(!person(id))return;
  $('settlePerson').value=id;
  $('billSupplierSearch').value='';
  $('billSearchResults').hidden=true;
  $('billSearchResults').innerHTML='';
  renderBillPreview();
}
function round2(n){return Math.round((Number(n)+Number.EPSILON)*100)/100}
function fmtBill(n){return Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function billPreviewRow(label,calc,amount,css=''){
  return `<tr class="${css}"><td>${label}</td><td>${calc}</td><td>${amount}</td></tr>`;
}
function renderBillPreview(overrides=null){
 const id=$('settlePerson').value,p=person(id),month=$('settleMonth').value;
 $('billPreview').hidden=!p;$('billPreviewEmpty').hidden=!!p;$('billChosenPerson').hidden=!p;
 const available=!!billingSettings[month] || !!billMonthSetting(month).rate;
 $('confirmAllBillsBtn').disabled=!billMonthSetting(month).rate;
 if(!p)return;
 const b=computeBill(id,month,overrides);
 $('billPreview').querySelector('.billing-draft-badge').textContent=b.closed?'✓ තහවුරු කළ බිල / CONFIRMED':'පෙරදසුන / DRAFT';
 $('billChosenPerson').innerHTML=`<strong>✓ තෝරාගත් සැපයුම්කරු</strong><span>${esc(p.id)} — ${esc(p.name)}</span>`;
 const k=n=>n===null?'—':fmtBill(n)+' kg',m=n=>n===null?'—':money(n);
 $('billPreviewIdentity').textContent=p.id+' · '+p.name+' · '+reportMonthHeading(month);
 const member=b.closed?!!b.welfareMemberAtBill:!!p.welfareMember;
 const welfareCfg=b.closed?null:welfareMonthlySettings[month];
 const welfareCharge=member?Number(b.extraAddedByType?.welfare||0):0;
 const welfareDue=member?Number(b.extraDueByType?.welfare||0):0;
 const welfareApplied=member?Number(b.extraAppliedByType?.welfare||0):0;
 $('billWelfareStatus').textContent=b.closed?'💚 සුභසාධන — තහවුරු කළ බිල':(member?'💚 සාමාජිකයාගේ මාසික සුභසාධන ගාස්තුව':'💚 සුභසාධන — සාමාජිකයෙක් නොවේ');
 $('billWelfareValue').textContent=member?money(welfareCharge):'අදාළ නැහැ';
 $('billWelfareDescription').textContent=!member?'සුභසාධන ගාස්තුවක් මෙම සැපයුම්කරුගෙන් අඩු නොවේ.':
   (b.closed?'මෙම බිල තහවුරු කළ දවසේ පොදු ගාස්තුව. පසුව කරන වෙනස්කම් මෙයට අදාළ නැහැ.':
   (welfareCfg?.note?`විස්තරය: ${welfareCfg.note} · `:'')+'දැනට බිලෙන් හිලව්ව: '+(b.extraAppliedTotal===null?'මිල සකසා නැහැ':money(welfareApplied))+
   (welfareDue>welfareApplied?' · ඉදිරියට ඉතිරි: '+money(welfareDue-welfareApplied):''));
 $('billStatTotal').textContent=k(b.givenKg);$('billStatDeduct').textContent=k(b.deductedKg);$('billStatNet').textContent=k(b.netKg);
 const [y,mth]=month.split('-').map(Number),endOfMonth=new Date(y,mth,0).getDate();
 $('billTeaPeriod').textContent=month+'-01 → '+month+'-'+endOfMonth;
 $('billCreditPeriod').textContent=b.creditStart+' → '+b.cutoff+(b.closed?' (තහවුරුයි)':' (අද දක්වා)');
 $('billCloseStatus').textContent=b.closed?'✓ තහවුරු කළා':'පෙරදසුන / තහවුරු නැහැ';
 $('billPreviewRows').innerHTML=[
  billPreviewRow('මාසයේ දලු බර','මාසයේ 01–අවසන් දිනය',k(b.givenKg)),
  billPreviewRow('අඩු කළ බර',fmtBill(b.percent)+'%',k(b.deductedKg)),
  billPreviewRow('ශුද්ධ දලු බර','සම්පූර්ණ බර − අඩු කළ බර',k(b.netKg),'bill-accent'),
  billPreviewRow('කිලෝවක මිල','මාසයට පොදු',m(b.rate)),
  billPreviewRow('මුළු දලු මුදල','ශුද්ධ බර × කිලෝ මිල',m(b.gross),'bill-accent'),
  billPreviewRow('ප්‍රවාහන ගාස්තු',fmtBill(b.transportRate)+' රු./kg × '+fmtBill(b.netKg)+' kg','− '+m(b.transportFee)),
  billPreviewRow('ප්‍රවාහන ගාස්තුවෙන් පසු දලු මුදල','මුළු මුදල − ප්‍රවාහන ගාස්තු',m(b.afterTransport),'bill-accent'),
  ...DEDUCTION_KEYS.filter(type=>!FERTILIZER_KEYS.includes(type)||Number(b.extraDueByType[type])>0).map(type=>type==='welfare'
    ? billPreviewRow('සුභසාධන අඩු කිරීම',member?('මාසික පොදු ගාස්තුව: '+money(welfareCharge)):'සාමාජිකයෙක් නොවේ',member?('− '+m(b.extraAppliedTotal===null?null:b.extraAppliedByType.welfare)):'—')
    : billPreviewRow(DEDUCTION_LABELS[type]+' අඩු කිරීම','බිල තහවුරු වනතුරු එකතු වූ මුදල','− '+m(b.extraAppliedTotal===null?null:b.extraAppliedByType[type]))),
  billPreviewRow('ඉදිරියට ගෙනයන අමතර අඩුකිරීම්','දලු මුදල ප්‍රමාණවත් නොවුණොත්',m(b.extraCarryTotal),'bill-soft'),
  billPreviewRow('ඉදිරියට ගෙන ආ ණය','පෙර තහවුරු කළ ශේෂය / මුල් ශේෂය',m(b.openingDebt)),
  billPreviewRow('මෙම ණය කාලයේ අලුත් ණය',b.creditStart+' – '+b.cutoff,'+ '+m(b.newDebt)),
  billPreviewRow('ණය සංශෝධන','ඇතුළත් කළ ගැළපීම්','+ '+m(b.adjusted)),
  billPreviewRow('මුදල් ආපසු ගෙවීම්','ණයෙන් අඩු වේ','− '+m(b.repaid)),
  billPreviewRow('බිල්පතෙන් අඩු කිරීමට පෙර ණය','පෙර ණය + අලුත් ණය − ගෙවීම්',m(b.debtBeforeOffset),'bill-soft'),
  billPreviewRow('දලු මුදලෙන් හිලව් කළ ණය',b.closed?'තහවුරු කළා':'තහවුරු කළ පසු පියවේ','− '+m(b.offset),'bill-accent')
 ].join('');
 $('billPayable').textContent=m(b.payable);$('billCarry').textContent=m(b.debtCarry);
 $('confirmBillBtn').disabled=!!cannotConfirm(b);
 $('settlementActionNote').textContent=!b.closed&&!b.valid?'⚠️ මෙම මාසයේ කිලෝවක මිල/ප්‍රවාහන ගාස්තුව පරීක්ෂා කරන්න. මිල නැති නම් මුදල් ගණනය නොවේ.':b.closed?'🔒 '+month+' බිල '+b.confirmedAt?.slice(0,10)+' දින තහවුරු කර ඇත.':(b.overpaid>0?'සැලකිල්ල: ණය ආපසු ගෙවීම් ණයට වඩා වැඩියි; අතිරික්තය '+money(b.overpaid)+' මෙහි ගෙවීමට එකතු කර නැහැ.':'මෙහි පෙන්වන්නේ තහවුරු කිරීමට පෙර ගණනයයි.');
}
// Reports tab is deliberately read-only. It never calls save(), edits arrays,
// updates billing settings, or records a monthly settlement.
let reportState={mode:'sheet',month:today.slice(0,7),personId:'',ledgerType:'credit'};
const selectedConfirmedIds=new Set(); // UI selection only; never writes to saved bills.
function reportMonthHeading(value){
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))return value;
  const [y,m]=value.split('-').map(Number);
  return `${SI_MONTHS[m-1]} ${y}`;
}
function reportPrintLabel(m){return Number(m).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function reportSelectedOption(){
  const selected=reportState.personId;
  $('reportPerson').innerHTML='<option value="">— සැපයුම්කරුවෙක් තෝරන්න —</option>'+sortedSuppliers().map(p=>`<option value="${esc(p.id)}">${esc(p.id)} - ${esc(p.name)}</option>`).join('');
  if(person(selected))$('reportPerson').value=selected;
  else{reportState.personId='';$('reportPerson').value=''}
}
function reportChoosePerson(id){
  reportState.personId=person(id)?id:'';
  $('reportPerson').value=reportState.personId;
  $('reportPersonSearch').value='';
  $('reportSearchResults').hidden=true;
  $('reportSearchResults').innerHTML='';
  renderReportPreview();
}
function renderReportSearch(){
  const q=$('reportPersonSearch').value.trim().toLocaleLowerCase(),box=$('reportSearchResults');
  if(!q){box.hidden=true;box.innerHTML='';return}
  const matches=sortedSuppliers().filter(p=>p.id.toLocaleLowerCase().includes(q)||p.name.toLocaleLowerCase().includes(q)).slice(0,40);
  box.innerHTML=matches.length?matches.map(p=>`<button type="button" role="option" data-report-person="${esc(p.id)}"><span>${esc(p.id)}</span>${esc(p.name)}</button>`).join(''):'<div class="billing-search-no-result">සැපයුම්කරුවෙක් හමු නොවුණා.</div>';
  box.hidden=false;
}
// Each report is a separate read-only daily matrix like the tea sheet.
// Columns show entry date; fertilizer installments / shared welfare belong to
// a calendar month, so their monthly due amount appears under day 01.
const REPORT_LEDGER_TYPES={
 credit:{title:'කඩ ණය',file:'Shop_Credit',note:'ණය දීම සහ ණය සංශෝධන ධන (+) අගයන් ලෙසත්, මුදල් ආපසු ගෙවීම් ඍණ (−) අගයන් ලෙසත් පෙන්වයි. මෙය මාසයේ සටහන් වූ ශුද්ධ ණය වෙනසයි; බිලෙන් හිලව් වූ ණය හෝ සමස්ත හිඟ ශේෂය නොවේ.'},
 teaPowder:{title:'තේ කුඩු',file:'Tea_Powder',note:'මෙම මාසයේ දින අනුව සටහන් කළ තේ කුඩු අඩුකිරීම්. බිලෙන් සැබෑවටම හිලව් කළ මුදල නොව සටහන් කළ මුදල පෙන්වයි.'},
 fertilizer:{title:'පොහොර',file:'Fertilizer',note:'අදාළ මාසයට නියමිත ස්වයංක්‍රීය පොහොර වාරිකය 01 තීරුවේ පෙන්වයි. පරණ අතින් දැමූ වාරික ඒවා සටහන් වූ දිනයේ පෙන්වයි. මෙය නියමිත වාරික මුදලයි; හිලව් නොවූ හිඟ ශේෂය හෝ ගෙවූ මුදල නොවේ.'},
 dolomite:{title:'ඩොලමයිට්',file:'Dolomite',note:'ඩොලමයිට් අඩුකිරීම් සටහන් කළ දිනය අනුව පෙන්වයි; තහවුරු කළ බිලේ හිලව් වූ මුදලට වඩා වෙනස් විය හැක.'},
 chemicals:{title:'කෘෂි රසායන',file:'Agricultural_Chemicals',note:'කෘෂි රසායන අඩුකිරීම් සටහන් කළ දිනය අනුව පෙන්වයි; තහවුරු කළ බිලේ හිලව් වූ මුදලට වඩා වෙනස් විය හැක.'},
 bank:{title:'බැංකු ණය වාරික',file:'Bank_Installments',note:'බැංකු ණය වාරික අඩුකිරීම් සටහන් කළ දිනය අනුව පෙන්වයි; තහවුරු කළ බිලේ හිලව් වූ මුදලට වඩා වෙනස් විය හැක.'},
 welfare:{title:'සුභසාධන',file:'Welfare',note:'එම මාසයට සකස් කළ පොදු සුභසාධන ගාස්තුව සාමාජිකයන්ට පමණක් 01 තීරුවේ පෙන්වයි. තහවුරු කළ බිල්පත් සඳහා එම බිලේ සුරැකි මුදල භාවිත කරයි. පැරණි තනි-පුද්ගල සුභසාධන සටහන් මෙහි නැවත අය නොකරයි.'}
};
function reportLedgerEntries(month,category){
 const out=new Map(),monthStart=month+'-01';
 const add=(id,date,amount)=>{
  if(!person(id)||!date||String(date).slice(0,7)!==month||!Number.isFinite(Number(amount)))return;
  const k=id+'|'+date;
  // Convert to cents so multiple daily entries never introduce rounding drift.
  out.set(k,(out.get(k)||0)+Math.round(Number(amount)*100));
 };
 if(category==='credit'){
  for(const c of credits){
   if(!c||!validISODate(c.date)||c.date.slice(0,7)!==month)continue;
   if(!['debt','repay','adjust'].includes(c.type))continue;
   add(c.id,c.date,(c.type==='repay'?-1:1)*Number(c.amount||0));
  }
 }else if(category==='welfare'){
  for(const p of people){
   const b=confirmedBill(p.id,month);
   // Saved bill snapshots take precedence over today's membership/settings.
   const frozen=b&&b.closed&&Object.prototype.hasOwnProperty.call(b,'welfareMemberAtBill');
   const member=frozen?!!b.welfareMemberAtBill:!!p.welfareMember;
   if(!member)continue;
   const savedAmount=b&&b.closed&&b.extraAddedByType&&Object.prototype.hasOwnProperty.call(b.extraAddedByType,'welfare')
    ? Number(b.extraAddedByType.welfare||0) : Number(welfareMonthlySettings[month]?.amount||0);
   if(savedAmount>0)add(p.id,monthStart,savedAmount);
  }
 }else{
  for(const d of deductions){
   if(!d||!person(d.id))continue;
   if(category==='fertilizer'){
    if(fertilizerPlanValid(d)){
     for(let i=0;i<Number(d.installments);i++){
      if(monthAdd(d.startMonth,i)===month)add(d.id,monthStart,fertilizerInstallmentAmount(d,i));
     }
    }else if(FERTILIZER_KEYS.includes(d.type)&&validISODate(d.date)&&d.date.slice(0,7)===month){
     add(d.id,d.date,Number(d.amount||0));
    }
   }else if(d.type===category&&validISODate(d.date)&&d.date.slice(0,7)===month){
    add(d.id,d.date,Number(d.amount||0));
   }
  }
 }
 return out;
}
function ledgerCurrencyCell(cents){
 if(!cents)return '–';
 const absolute=Math.abs(cents)/100;
 const readable=absolute.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
 return (cents<0?'−':'')+readable;
}
function renderReportLedger(){
 const month=reportState.month,cat=reportState.ledgerType;
 const config=REPORT_LEDGER_TYPES[cat]||REPORT_LEDGER_TYPES.credit;
 const [y,m]=month.split('-').map(Number),days=new Date(y,m,0).getDate();
 const q=$('reportLedgerSearch').value.trim().toLocaleLowerCase();
 const visible=sortedSuppliers().filter(p=>p.id.toLocaleLowerCase().includes(q)||p.name.toLocaleLowerCase().includes(q));
 const data=reportLedgerEntries(month,cat),colSums=Array(days).fill(0);
 let grandCents=0,nonzero=0;
 $('reportLedgerTitle').textContent=config.title+' වාර්තාව';
 $('reportLedgerMonthTitle').textContent=reportMonthHeading(month);
 $('reportLedgerNote').textContent=config.note;
 $('reportLedgerHead').innerHTML='<tr><th class="report-col-id" scope="col">ID</th><th class="report-col-name" scope="col">නම</th>'+Array.from({length:days},(_,i)=>`<th scope="col">${String(i+1).padStart(2,'0')}</th>`).join('')+'<th class="report-col-total" scope="col">එකතුව (රු.)</th></tr>';
 $('reportLedgerRows').innerHTML=visible.length?visible.map(p=>{
  let total=0;
  const cells=Array.from({length:days},(_,i)=>{
   const key=p.id+'|'+month+'-'+String(i+1).padStart(2,'0');
   const cents=data.get(key)||0;
   colSums[i]+=cents;total+=cents;
   return `<td${cents<0?' class="report-ledger-neg"':''}>${ledgerCurrencyCell(cents)}</td>`;
  }).join('');
  grandCents+=total;if(total)nonzero++;
  return `<tr class="report-ledger-person-row"><td class="report-col-id">${esc(p.id)}</td><td class="report-col-name">${esc(p.name)}</td>${cells}<td class="report-col-total${total<0?' report-ledger-neg':''}">${ledgerCurrencyCell(total)}</td></tr>`;
 }).join(''):`<tr><td colspan="${days+3}" style="text-align:center">${people.length?'සෙවුමට ගැළපෙන සැපයුම්කරුවන් නැහැ.':'සැපයුම්කරුවන් ලියාපදිංචි කර නැහැ.'}</td></tr>`;
 if(visible.length)$('reportLedgerRows').insertAdjacentHTML('beforeend','<tr class="report-ledger-grand-total"><td class="report-col-id">∑</td><td class="report-col-name">මුළු එකතුව</td>'+colSums.map(c=>`<td${c<0?' class="report-ledger-neg"':''}>${ledgerCurrencyCell(c)}</td>`).join('')+`<td class="report-col-total${grandCents<0?' report-ledger-neg':''}">${ledgerCurrencyCell(grandCents)}</td></tr>`);
 $('reportLedgerSummary').textContent=`සැපයුම්කරුවන් ${visible.length} / ${people.length} · ගනුදෙනු ඇති ${nonzero} · මාසික එකතුව ${grandCents<0?'−':''}${money(Math.abs(grandCents)/100)}`;
 document.querySelectorAll('[data-ledger-type]').forEach(btn=>{
  const active=btn.dataset.ledgerType===cat;
  btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));
 });
}
$('reportLedgerSearch').addEventListener('input',()=>{if(reportState.mode==='ledger')renderReportLedger()});
document.querySelectorAll('[data-ledger-type]').forEach(btn=>btn.addEventListener('click',()=>{
 reportState.ledgerType=btn.dataset.ledgerType;
 renderReportPreview();
}));

// Use the same monthly weight deduction as Billing. Confirmed bills are immutable:
// use their snapshotted weights instead of recomputing with any later settings.
function reportSheetWeightBreakdown(id,month,grossKg){
  const saved=confirmedBill(id,month);
  if(saved && saved.closed){
    return {deducted:round2(Number(saved.deductedKg)||0),net:round2(Number(saved.netKg)||0)};
  }
  const kg=round2(grossKg),percent=billMonthSetting(month).percent;
  const deducted=round2(kg*percent/100);
  return {deducted,net:round2(Math.max(0,kg-deducted))};
}
function renderReportSheet(){
  const month=reportState.month;
  const [y,m]=month.split('-').map(Number);
  const days=new Date(y,m,0).getDate();
  const all=sortedSuppliers();
  const dayTotals=new Map(),personTotals=new Map();
  for(const l of leaves){
    if(!l.date||String(l.date).slice(0,7)!==month||!person(l.id))continue;
    const kg=Number(l.kg);
    if(!Number.isFinite(kg))continue;
    const dayKey=l.id+'|'+l.date;
    dayTotals.set(dayKey,(dayTotals.get(dayKey)||0)+kg);
    personTotals.set(l.id,(personTotals.get(l.id)||0)+kg);
  }
  const dailySums=Array(days).fill(0);
  let grossTotal=0,deductedTotal=0,netTotal=0;
  $('reportSheetMonthTitle').textContent=reportMonthHeading(month);
  $('reportSheetHead').innerHTML='<tr><th class="report-col-id" scope="col">ID</th><th class="report-col-name" scope="col">නම</th>'+Array.from({length:days},(_,i)=>`<th scope="col">${String(i+1).padStart(2,'0')}</th>`).join('')+'<th class="report-col-total" scope="col">එකතුව (kg)</th><th class="report-col-deduct" scope="col">අඩු කළ බර (kg)</th><th class="report-col-net" scope="col">ශුද්ධ බර (kg)</th></tr>';
  $('reportSheetRows').innerHTML=all.length?all.map(p=>{
    const gross=round2(personTotals.get(p.id)||0);
    const {deducted,net}=reportSheetWeightBreakdown(p.id,month,gross);
    grossTotal=round2(grossTotal+gross);
    deductedTotal=round2(deductedTotal+deducted);
    netTotal=round2(netTotal+net);
    const cells=Array.from({length:days},(_,i)=>{
      const key=p.id+'|'+month+'-'+String(i+1).padStart(2,'0');
      const kg=dayTotals.get(key)||0;
      dailySums[i]=round2(dailySums[i]+kg);
      return `<td>${kg?fmtKg(kg):'–'}</td>`;
    }).join('');
    return `<tr><td class="report-col-id">${esc(p.id)}</td><td class="report-col-name">${esc(p.name)}</td>${cells}<td class="report-col-total">${fmtKg(gross)}</td><td class="report-col-deduct">${fmtKg(deducted)}</td><td class="report-col-net">${fmtKg(net)}</td></tr>`;
  }).join(''):`<tr><td colspan="${days+5}" style="text-align:center">සැපයුම්කරුවන් ලියාපදිංචි කර නැහැ.</td></tr>`;
  if(all.length)$('reportSheetRows').insertAdjacentHTML('beforeend',
    '<tr class="report-sheet-grand-total"><td class="report-col-id">∑</td><td class="report-col-name">මුළු එකතුව</td>'+
    dailySums.map(kg=>`<td>${kg?fmtKg(kg):'–'}</td>`).join('')+
    `<td class="report-col-total">${fmtKg(grossTotal)}</td><td class="report-col-deduct">${fmtKg(deductedTotal)}</td><td class="report-col-net">${fmtKg(netTotal)}</td></tr>`);
  $('reportSheetSummary').textContent=`සැපයුම්කරුවන් ${all.length} · මුළු දලු ${fmtBill(grossTotal)} kg · අඩු කළ බර ${fmtBill(deductedTotal)} kg · ශුද්ධ බර ${fmtBill(netTotal)} kg`;
}
function renderReportBill(){
 const p=person(reportState.personId),month=reportState.month;
 const archived=confirmedBill(reportState.personId,month);
 if(!p&&!archived)return;
 const b=archived||computeBill(p.id,month),hasRate=b.gross!==null;
 $('reportBillMonthTitle').textContent=reportMonthHeading(month);
 $('reportBillSupplierId').textContent=b.supplierId;
 $('reportBillSupplierName').textContent=b.closed?(b.supplierName||p?.name||b.supplierId):(p?.name||b.supplierId);
 $('reportBillSupplierPhone').textContent=b.closed?(b.supplierPhone||p?.phone||'—'):(p?.phone||'—');
 const kg=n=>reportPrintLabel(n)+' kg',rupees=n=>n===null?'—':'රු. '+reportPrintLabel(n);
 const row=(label,calc,value,cls='')=>`<tr class="${cls}"><td>${esc(label)}</td><td>${esc(calc)}</td><td>${esc(value)}</td></tr>`;
 $('reportBillRows').innerHTML=[
  row('සම්පූර්ණ දලු බර','මාසයේ 01–අවසාන දිනය',kg(b.givenKg)),
  row('අඩු කළ බර','බර අඩු කිරීම',kg(b.deductedKg)),
  row('ශුද්ධ දලු බර','සම්පූර්ණ බර − අඩු කළ බර',kg(b.netKg),'report-bill-emphasis'),
  row('කිලෝවක මිල','මාසයට පොදු',hasRate?rupees(b.rate):'මිල සකසා නැහැ'),
  row('මුළු දලු මුදල','ශුද්ධ බර × කිලෝ මිල',rupees(b.gross),'report-bill-emphasis'),
  row('ප්‍රවාහන ගාස්තුව','ශුද්ධ බර අනුව','− '+rupees(b.transportFee)),
  row('ප්‍රවාහන ගාස්තුවෙන් පසු දලු මුදල','මුළු මුදල − ප්‍රවාහන ගාස්තුව',rupees(b.afterTransport),'report-bill-emphasis'),
  ...DEDUCTION_KEYS.filter(type=>!FERTILIZER_KEYS.includes(type)||Number(b.extraDueByType[type])>0).map(type=>row(DEDUCTION_LABELS[type], 'අදාළ බිලට හිලව් කළ මුදල',rupees(b.extraAppliedTotal===null?null:b.extraAppliedByType[type]))),
  row('ඊළඟ බිලට අමතර අඩුකිරීම් ඉතිරිය','ප්‍රමාණවත් මුදලක් නොමැති නම්',rupees(b.extraCarryTotal)),
  row('ඉදිරියට ගෙන ආ ණය','පෙර තහවුරු කළ / මුල් ශේෂය',rupees(b.openingDebt)),
  row('බිල් කාලයේ කඩ ණය','ගිණුම් සටහන් අනුව',rupees(b.newDebt)),
  row('ණය සංශෝධන','ගැළපීම්',rupees(b.adjusted)),
  row('මුදල් ආපසු ගෙවීම්','ණයෙන් අඩු වේ','− '+rupees(b.repaid)),
  row('අත්තිකාරම් ලෙස හිලව් කළ කඩ ණය','හිලව් කළ මුදල',rupees(b.offset),'report-bill-emphasis')
 ].join('');
 // Other paper-form deductions remain blank until the user specifies their rules.
 $('reportBillGivenKg').textContent=reportPrintLabel(b.givenKg);
 $('reportBillDeductKg').textContent=reportPrintLabel(b.deductedKg);
 $('reportBillNetKg').textContent=reportPrintLabel(b.netKg);
 $('reportBillKgRate').textContent=hasRate?reportPrintLabel(b.rate):'—';
 $('reportBillGross').textContent=rupees(b.gross);
 $('reportBillTransportFee').textContent=rupees(b.transportFee);
 $('reportBillFertilizerRows').innerHTML=FERTILIZER_KEYS.filter(k=>Number(b.extraDueByType[k])>0 || Number(b.extraAppliedByType[k])>0).map(k=>
  `<tr><td>${esc(DEDUCTION_LABELS[k])}</td><td>${esc(rupees(b.extraAppliedTotal===null?null:b.extraAppliedByType[k]))}</td></tr>`).join('');
 $('reportBillKnownDeductions').textContent=rupees(b.gross===null?null:round2(b.transportFee+b.extraAppliedTotal+b.offset));
 for(const [key,target] of [['teaPowder','reportBillTeaPowder'],['dolomite','reportBillDolomite'],['chemicals','reportBillChemicals'],['bank','reportBillBank']])$(target).textContent=rupees(b.extraAppliedTotal===null?null:b.extraAppliedByType[key]);
 $('reportBillWelfare').textContent=(b.closed?b.welfareMemberAtBill:person(b.supplierId)?.welfareMember) && Number(b.extraAppliedByType.welfare||0)>0 ?rupees(b.extraAppliedTotal===null?null:b.extraAppliedByType.welfare):'';
 $('reportBillExtraCarry').textContent=rupees(b.extraCarryTotal);
 $('reportBillDebtAmount').textContent=rupees(b.offset);
 $('reportBillPayable').textContent=rupees(b.payable);
 $('reportBillCarry').textContent=rupees(b.debtCarry);
 $('reportBillMissingRate').hidden=hasRate;
 // Never invent a price or replace a historical transport rate. Explain missing
 // settings instead of leaving unexplained em dashes in the printed preview.
 const config=billingSettings[month];
 const missingRate=!b.closed && b.gross===null;
 const migratedNoTransport=!b.closed && config && !Object.prototype.hasOwnProperty.call(config,'transportRate');
 if(missingRate||migratedNoTransport){
  const info=[];
  if(missingRate)info.push('මෙම '+month+' මාසයට දලු කිලෝවක මිල ඇතුළත් කර නැහැ. ඒ නිසා මුළු මුදල සහ අවසාන ගෙවීම ගණනය නොවේ.');
  if(migratedNoTransport)info.push('පරණ මාසික සැකසුම්වල ප්‍රවාහන ගාස්තුව ඇතුළත් වී නැහැ. දැන් 0.00 රු./kg ලෙස පෙන්වෙනවා; අදාළ මාසයේ නිවැරදි අගය ඇතුළත් කරන්න.');
  $('reportMissingConfigText').textContent=info.join(' ');
  $('reportBillingConfigHint').hidden=false;
 }
}
function confirmedMonthBills(){
 return settlements.filter(s=>s.month===reportState.month&&s.closed).sort((a,b)=>String(a.supplierId).localeCompare(String(b.supplierId),undefined,{numeric:true,sensitivity:'base'}));
}
function archivedSupplierName(b){return b.supplierName||person(b.supplierId)?.name||b.supplierId}
function filteredConfirmedMonthBills(){
 const all=confirmedMonthBills(),query=$('confirmedSearch').value.trim().toLocaleLowerCase();
 return all.filter(b=>String(b.supplierId).toLocaleLowerCase().includes(query)||archivedSupplierName(b).toLocaleLowerCase().includes(query));
}
function selectedConfirmedMonthBills(){
 return confirmedMonthBills().filter(b=>selectedConfirmedIds.has(b.supplierId));
}
function renderConfirmedList(){
 const all=confirmedMonthBills(),matches=filteredConfirmedMonthBills();
 // Discard stale UI selections if a bill disappears after a reset/restore.
 const valid=new Set(all.map(b=>b.supplierId));
 for(const id of selectedConfirmedIds)if(!valid.has(id))selectedConfirmedIds.delete(id);
 $('confirmedBillCount').textContent=all.length;
 $('confirmedRows').innerHTML=matches.length?matches.map(b=>{
   const preview=reportState.personId===b.supplierId,checked=selectedConfirmedIds.has(b.supplierId);
   return `<tr tabindex="0" role="button" aria-label="${esc(b.supplierId)} ${esc(archivedSupplierName(b))} බිල පෙරදසුන" data-confirmed-id="${esc(b.supplierId)}" class="${preview?'is-selected ':''}${checked?'is-batch-selected':''}" aria-selected="${preview}"><td class="confirmed-select-col"><input type="checkbox" class="confirmed-row-check" data-confirmed-check="${esc(b.supplierId)}" aria-label="${esc(archivedSupplierName(b))} (${esc(b.supplierId)}) බිල තෝරන්න" ${checked?'checked':''}></td><td>${esc(b.supplierId)}</td><td>${esc(archivedSupplierName(b))}</td><td>${esc(String(b.confirmedAt||'').slice(0,10)||'—')}</td><td>${fmtBill(Number(b.netKg||0))} kg</td><td>${money(b.payable||0)}</td><td><span class="confirmed-pill">✓ තහවුරුයි</span></td></tr>`;
 }).join(''):`<tr><td colspan="7" style="text-align:center;padding:20px">${all.length?'Search එකට ගැළපෙන බිල්පත් නැහැ.':'මෙම මාසයට තහවුරු කළ බිල්පත් තවම නැහැ.'}</td></tr>`;
 const head=$('confirmedSelectAll');
 const visibleCount=matches.filter(b=>selectedConfirmedIds.has(b.supplierId)).length;
 head.disabled=matches.length===0;
 head.checked=matches.length>0&&visibleCount===matches.length;
 head.indeterminate=visibleCount>0&&visibleCount<matches.length;
 $('confirmedSelectionCount').textContent=`තෝරාගත් බිල්: ${selectedConfirmedIds.size} / ${all.length}`;
 $('confirmedClearSelection').disabled=selectedConfirmedIds.size===0;
 $('reportPrintSelectedBtn').disabled=selectedConfirmedIds.size===0;
 $('reportDownloadSelectedBtn').disabled=selectedConfirmedIds.size===0;
 $('reportPrintAllBtn').disabled=all.length===0;
 $('reportDownloadAllBtn').disabled=all.length===0;
}
function renderReportPreview(){
 $('reportBillingConfigHint').hidden=true;
 $('reportMonth').value=reportState.month;
 const billMode=reportState.mode==='bill',confirmedMode=reportState.mode==='confirmed';
 document.querySelectorAll('[data-report-mode]').forEach(b=>{
   const active=b.dataset.reportMode===reportState.mode;
   b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));
 });
 $('reportPersonFilters').hidden=!billMode;
 $('reportLedgerControls').hidden=reportState.mode!=='ledger';
 $('reportConfirmedPanel').hidden=!confirmedMode;
 $('reportBillPaperSizeWrap').hidden=!(billMode||confirmedMode);
 const hasPerson=billMode?!!person(reportState.personId):confirmedMode?!!confirmedBill(reportState.personId,reportState.month):false;
 $('reportEmpty').hidden=!( (billMode||confirmedMode) && !hasPerson );
 $('reportEmpty').querySelector('h3').textContent=confirmedMode?'තහවුරු කළ බිලක් තෝරන්න':'සැපයුම්කරුවෙක් තෝරන්න';
 $('reportEmpty').querySelector('p').textContent=confirmedMode?'ඉහත ලැයිස්තුවෙන් බිලක් Click කළාම අවසාන බිල පෙන්වනවා.':'ID එකෙන් හෝ නමෙන් Search කරලා මාසික බිල්පත බලන්න.';
 $('reportSheetPreview').hidden=reportState.mode!=='sheet';
 $('reportLedgerPreview').hidden=reportState.mode!=='ledger';
 $('reportBillPreview').hidden=!(billMode||confirmedMode)||!hasPerson;
 $('reportPrintBtn').hidden=confirmedMode&&!hasPerson;
 $('reportPrintBtn').disabled=(billMode||confirmedMode)&&!hasPerson;
 $('reportStatus').textContent=confirmedMode?(hasPerson?'🔒 තහවුරු කළ අවසාන බිල — කියවීම සහ මුද්‍රණය පමණයි.':'තෝරාගත් මාසයේ තහවුරු කළ බිල්පත් ලැයිස්තුව.'):billMode?(hasPerson?'තෝරාගත් සැපයුම්කරුගේ බිල්පත — කියවීම සහ මුද්‍රණය පමණයි.':'බිල්පත බැලීමට සැපයුම්කරුවෙක් තෝරන්න.'):reportState.mode==='ledger'?'තෝරාගත් ණය / අඩුකිරීම් වර්ගය අනුව මාසික සටහන් — කියවීම සහ මුද්‍රණය පමණයි.':'සියලු සැපයුම්කරුවන්ගේ දිනපතා දලු ෂීට් එක — කියවීම සහ මුද්‍රණය පමණයි.';
 if(confirmedMode)renderConfirmedList();
 if(billMode||confirmedMode){if(hasPerson)renderReportBill()}
 else if(reportState.mode==='ledger')renderReportLedger();
 else renderReportSheet();
}
$('reportGoBillingBtn').addEventListener('click',()=>{
 $('settleMonth').value=reportState.month;
 $('settleMonth').dispatchEvent(new Event('change',{bubbles:true}));
 document.querySelector('nav button[data-page="settle"]').click();
 $('rate').focus();
});
$('reportMonth').addEventListener('change',event=>{
  const month=event.target.value;
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return;
  reportState.month=month;
  selectedConfirmedIds.clear();
  if(reportState.mode==='confirmed')reportState.personId='';
  renderReportPreview();
});
document.querySelectorAll('[data-report-mode]').forEach(b=>b.addEventListener('click',()=>{
  reportState.mode=b.dataset.reportMode;
  reportState.personId='';
  $('reportPersonSearch').value='';$('reportSearchResults').hidden=true;
  $('confirmedSearch').value='';
  renderReportPreview();
}));
$('reportPerson').addEventListener('change',event=>reportChoosePerson(event.target.value));
$('reportPersonSearch').addEventListener('input',renderReportSearch);
$('reportPersonSearch').addEventListener('keydown',event=>{
  if(event.key==='Escape'){$('reportPersonSearch').value='';renderReportSearch();return}
  if(event.key==='Enter'){
    const found=$('reportSearchResults').querySelector('[data-report-person]');
    if(found){event.preventDefault();reportChoosePerson(found.dataset.reportPerson)}
  }
});
$('reportSearchResults').addEventListener('click',event=>{
  const found=event.target.closest('[data-report-person]');if(found)reportChoosePerson(found.dataset.reportPerson);
});
document.addEventListener('click',event=>{
  if(!event.target.closest('.report-search-box'))$('reportSearchResults').hidden=true;
});
$('confirmedSearch').addEventListener('input',()=>{if(reportState.mode==='confirmed')renderConfirmedList()});
function chooseConfirmedReport(id){
 if(!confirmedBill(id,reportState.month))return;
 reportState.personId=id;
 renderReportPreview();
 $('reportBillPreview').scrollIntoView({behavior:'smooth',block:'start'});
}
$('confirmedSelectAll').addEventListener('change',event=>{
 const checked=event.target.checked;
 // Select all currently visible/search-matched bills; preserve other selections.
 for(const b of filteredConfirmedMonthBills()){
   if(checked)selectedConfirmedIds.add(b.supplierId);
   else selectedConfirmedIds.delete(b.supplierId);
 }
 renderConfirmedList();
});
$('confirmedClearSelection').addEventListener('click',()=>{
 selectedConfirmedIds.clear();renderConfirmedList();
});
$('confirmedRows').addEventListener('change',event=>{
 const check=event.target.closest('[data-confirmed-check]');if(!check)return;
 if(check.checked)selectedConfirmedIds.add(check.dataset.confirmedCheck);
 else selectedConfirmedIds.delete(check.dataset.confirmedCheck);
 renderConfirmedList();
});
$('confirmedRows').addEventListener('click',event=>{
 if(event.target.closest('input[type="checkbox"]'))return; // checkbox selects, row previews
 const row=event.target.closest('[data-confirmed-id]');if(row)chooseConfirmedReport(row.dataset.confirmedId);
});
$('confirmedRows').addEventListener('keydown',event=>{
 if(event.target.closest('input[type="checkbox"]'))return;
 if(event.key!=='Enter'&&event.key!==' ')return;
 const row=event.target.closest('[data-confirmed-id]');if(row){event.preventDefault();chooseConfirmedReport(row.dataset.confirmedId)}
});
// Use a descriptive document title while the browser saves a PDF. Most desktop
// browsers suggest this title as the PDF filename; the Save dialog stays in the
// browser's control. Sinhala letters are intentionally preserved.
const systemPageTitle=document.title;
let printTitleActive=false;
function safeExportPart(input,fallback){
 const cleaned=String(input??'').normalize('NFC')
  .replace(/[^\p{L}\p{M}\p{N}_-]+/gu,'_')
  .replace(/_+/g,'_').replace(/^[_-]+|[_-]+$/g,'').slice(0,65);
 return cleaned||fallback;
}
function billExportStem(b){
 const [year,month]=String(b.month||reportState.month).split('-');
 const name=b.closed?archivedSupplierName(b):(person(b.supplierId)?.name||b.supplierName||b.supplierId);
 return [safeExportPart(b.supplierId,'ID'),safeExportPart(name,'Supplier'),
  safeExportPart(month,'Month'),safeExportPart(year,'Year')].join('_');
}
function batchExportStem(bills,scope){
 if(bills.length===1)return billExportStem(bills[0]);
 const [year,month]=reportState.month.split('-');
 return `Gonagamuwa_${scope==='selected'?'Selected_':''}Bills_${month}_${year}`;
}
function beginNamedPrint(filename){
 document.title=filename;
 printTitleActive=true;
 requestAnimationFrame(()=>window.print());
}
// Compile printable bill copies from saved confirmed snapshots ONLY; never writes ledgers.
function printableBillClone(){
 const node=$('reportBillPreview').cloneNode(true);
 node.hidden=false;node.classList.add('bulk-bill-page');node.removeAttribute('id');
 node.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 return node;
}
// A4 landscape is exactly two A5 portrait halves. Duplicate the SAME bill
// on both halves, with a center cut guide; don't post or alter settlements.
function twoCopyBillPage(billNode){
 const sheet=document.createElement('section');sheet.className='two-up-page';
 for(let i=0;i<2;i++){
   const cell=document.createElement('div');cell.className='two-up-copy';
   cell.appendChild(i===0?billNode:billNode.cloneNode(true));
   sheet.appendChild(cell);
 }
 return sheet;
}
function createConfirmedBillPages(bills){
 const host=$('reportBulkPreview');host.innerHTML='';
 if(!bills.length)return 0;
 const twoUp=$('reportBillPaperSize').value==='a4two';
 const original=reportState.personId;
 try{
   for(const saved of bills){
     reportState.personId=saved.supplierId;
     renderReportBill();
     const node=printableBillClone();
     host.appendChild(twoUp?twoCopyBillPage(node):node);
   }
 }finally{
   reportState.personId=original;
   if(original && (person(original)||confirmedBill(original,reportState.month)))renderReportBill();
 }
 return bills.length;
}
function createSingleTwoCopyBillPage(){
 const host=$('reportBulkPreview');host.replaceChildren(twoCopyBillPage(printableBillClone()));
 document.body.dataset.reportBatch='single-two';
}
function clearConfirmedBillPages(){
 $('reportBulkPreview').replaceChildren();
 delete document.body.dataset.reportBatch;
}
function printConfirmedBills(bills,scope){
 if(!bills.length)return;
 const count=createConfirmedBillPages(bills);if(!count)return;
 document.body.dataset.reportBatch=scope;
 document.body.dataset.paperSize=$('reportBillPaperSize').value;
 document.body.dataset.reportKind='bill';
 document.body.classList.add('printing-reports');
 beginNamedPrint(batchExportStem(bills,scope));
}
function downloadConfirmedBills(bills,scope){
 if(!bills.length)return;
 const count=createConfirmedBillPages(bills);if(!count)return;
 const inner=$('reportBulkPreview').innerHTML;
 const paperSize=$('reportBillPaperSize').value;
 const css=collectExportStyles()+`\n
 body{background:#fff!important;color:#111!important;margin:0;padding:0;font-family:system-ui,'Noto Sans Sinhala',sans-serif}
 .bulk-bill-page{max-width:100%;margin:0 auto!important;padding:0!important;border:0!important;box-shadow:none!important;background:white!important;color:#111!important;break-after:page;page-break-after:always}
 .bulk-bill-page:last-child{break-after:auto;page-break-after:auto}
 #reportBulkPreview{display:block!important}
 @page{size:A5 portrait;margin:6mm}
 @media print{.bulk-bill-page{padding:0!important;page-break-after:always;break-after:page}.bulk-bill-page:last-child{page-break-after:auto;break-after:auto}
 body[data-paper-size="a4two"] #reportBulkPreview .two-up-copy .bulk-bill-page{page-break-after:auto!important;break-after:auto!important}}
 `;
 const filename=batchExportStem(bills,scope);
 const result='<!doctype html><html lang="si"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(filename)+'</title><style>'+css+'</style></head><body class="printing-reports" data-report-kind="bill" data-paper-size="'+paperSize+'" data-report-batch="'+scope+'"><main id="reports"><div id="reportBulkPreview">'+inner+'</div></main></body></html>';
 const blob=new Blob([result],{type:'text/html;charset=utf-8'});
 if(window.GonagamuwaNative?.shareDownload){
   window.GonagamuwaNative.shareDownload(blob,filename+'.html').catch(error=>alert('ගොනුව Share කළ නොහැක: '+error.message));
 }else{
   const link=document.createElement('a'),url=URL.createObjectURL(blob);
   link.href=url;link.download=filename+'.html';
   document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),5000);
 }
 clearConfirmedBillPages();
}
$('reportPrintSelectedBtn').addEventListener('click',()=>printConfirmedBills(selectedConfirmedMonthBills(),'selected'));
$('reportDownloadSelectedBtn').addEventListener('click',()=>downloadConfirmedBills(selectedConfirmedMonthBills(),'selected'));
$('reportPrintAllBtn').addEventListener('click',()=>printConfirmedBills(confirmedMonthBills(),'all'));
$('reportDownloadAllBtn').addEventListener('click',()=>downloadConfirmedBills(confirmedMonthBills(),'all'));
$('reportPrintBtn').addEventListener('click',()=>{
  if(reportState.mode==='bill'&&!person(reportState.personId))return;
  if(reportState.mode==='confirmed'&&!confirmedBill(reportState.personId,reportState.month))return;
  // Printing does not change saved records. The print stylesheet isolates this report.
  document.body.dataset.reportKind=reportState.mode==='confirmed'?'bill':reportState.mode;
  document.body.dataset.paperSize=$('reportBillPaperSize').value;
  document.body.classList.add('printing-reports');
  const isBill=reportState.mode==='bill'||reportState.mode==='confirmed';
  if(isBill && $('reportBillPaperSize').value==='a4two')createSingleTwoCopyBillPage();
  const bill=isBill?(confirmedBill(reportState.personId,reportState.month)
     ||(person(reportState.personId)?computeBill(reportState.personId,reportState.month):null)):null;
  const [year,month]=reportState.month.split('-');
  const filename=bill?billExportStem(bill):reportState.mode==='ledger'
   ?`Gonagamuwa_${REPORT_LEDGER_TYPES[reportState.ledgerType]?.file||'Ledger'}_Report_${month}_${year}`
   :`Gonagamuwa_Tea_Sheet_${month}_${year}`;
  beginNamedPrint(filename);
});
window.addEventListener('afterprint',()=>{
  if(printTitleActive){document.title=systemPageTitle;printTitleActive=false}
  document.body.classList.remove('printing-reports');
  delete document.body.dataset.reportKind;
  delete document.body.dataset.paperSize;
  clearConfirmedBillPages();
});

function updateDashboardGross(){
  const m=today.slice(0,7),cfg=billMonthSetting(m);
  if(!cfg.rate){$('mGross').textContent='මිල සකසා නැහැ';return}
  const percent=cfg.percent;
  let total=0;
  for(const p of people){
    const kg=leaves.filter(l=>l.id===p.id&&String(l.date).slice(0,7)===m).reduce((s,l)=>s+(Number(l.kg)||0),0);
    const deducted=round2(kg*percent/100);
    total+=round2(round2(Math.max(0,kg-deducted))*cfg.rate);
  }
  $('mGross').textContent=money(round2(total));
}
$('settleMonth').addEventListener('change',()=>{loadBillMonthSettings();renderBillPreview();renderCreditPreview();updateDashboardGross()});
['rate','deductPercent','transportRate'].forEach(id=>$(id).addEventListener('input',updateBillMonthlySetting));
$('settlePerson').addEventListener('change',()=>{
  $('billSupplierSearch').value='';$('billSearchResults').hidden=true;renderBillPreview();
});
$('billSupplierSearch').addEventListener('input',renderBillSearchResults);
$('billSupplierSearch').addEventListener('keydown',event=>{
  if(event.key==='Escape'){$('billSupplierSearch').value='';renderBillSearchResults();return}
  if(event.key==='Enter'){
    const btn=$('billSearchResults').querySelector('[data-bill-supplier]');
    if(btn){event.preventDefault();chooseBillSupplier(btn.dataset.billSupplier)}
  }
});
$('billSearchResults').addEventListener('click',event=>{
  const btn=event.target.closest('[data-bill-supplier]');if(btn)chooseBillSupplier(btn.dataset.billSupplier)
});
document.addEventListener('click',event=>{
  if(!event.target.closest('.billing-search-box'))$('billSearchResults').hidden=true;
});

function del(arr,key,i){
 const item=arr[i];if(!item)return;
 if(key==='tea_leaves' && closedLeaf(item.id,String(item.date).slice(0,7))){alert('තහවුරු කළ බිලකට අදාළ දලු සටහන මකා දැමිය නොහැක.');return}
 if(key==='tea_credits' && closedCreditRecord(item)){alert('තහවුරු කළ බිලකට අදාළ ණය සටහන මකා දැමිය නොහැක.');return}
 if(key==='tea_people' && (settlements.some(s=>s.supplierId===item.id)||deductions.some(d=>d.id===item.id))){alert('මෙම සැපයුම්කරුට තහවුරු කළ බිල්පත් තිබෙන බැවින් මකා දැමිය නොහැක.');return}
 if(!confirm('මෙම සටහන මකා දමන්නද?'))return;arr.splice(i,1);save(key,arr);render()
}
function render(selection={}){
  const selectedLeaf=selection.leafId ?? $('leafPerson').value;
  const selectedCredit=selection.creditId ?? $('creditPerson').value;
  const selectedSettle=selection.settleId ?? $('settlePerson').value;
  const selectedDeduct=selection.deductId ?? $('deductionPerson').value;
  for(const [id,selected] of [['creditPerson',selectedCredit],['settlePerson',selectedSettle],['deductionPerson',selectedDeduct]]){
    const placeholder='<option value="">— සැපයුම්කරුවෙක් තෝරන්න —</option>';
    $(id).innerHTML=placeholder+sortedSuppliers().map(p=>`<option value="${esc(p.id)}">${esc(p.id)} - ${esc(p.name)}</option>`).join('');
    if(people.some(p=>p.id===selected))$(id).value=selected;
    else $(id).value='';
  }
  renderLeafPersonOptions(selectedLeaf);
  updateWhatsappButton();
  renderPeople();
  reportSelectedOption();
renderLeafSheet();
renderCreditPreview();renderDeductionPreview();
let m=today.slice(0,7),kg=leaves.filter(l=>l.date.slice(0,7)===m).reduce((s,l)=>s+l.kg,0);$('nPeople').textContent=people.length;$('mKg').textContent=kg.toFixed(2);$('mGross').textContent=money(kg*0);$('debtTotal').textContent=money(people.reduce((s,p)=>s+debtAtDate(p.id,today),0));updateDashboardGross();renderBillPreview();renderReportPreview();}
async function backup(){
  try{
    const output=await localDB.backupToChosenLocation();
    if(output)alert('Backup සාර්ථකව සුරැකිණි: '+output);
  }catch(error){alert('Backup සුරැකීම අසාර්ථකයි: '+error.message);}
}
let pendingRestore=null;
const restoreConfirmDialog=document.getElementById('restoreConfirmDialog');
const restoreFileInput=document.getElementById('restoreFile');
function validBackup(d){
  const obj=item=>item!==null && typeof item==='object' && !Array.isArray(item);
  if(!obj(d))return false;
  if(!['people','leaves','credits'].every(key=>Array.isArray(d[key]) && d[key].every(obj)))return false;
  if('deductions' in d && (!Array.isArray(d.deductions)||!d.deductions.every(e=>obj(e)&&typeof e.id==='string'&&typeof e.date==='string'&&validISODate(e.date)&&DEDUCTION_RECORD_TYPES.includes(e.type)&&Number.isFinite(Number(e.amount))&&Number(e.amount)>0&&(e.type!=='fertilizerPlan'||fertilizerPlanValid(e)))))return false;
  if('billingSettings' in d && !obj(d.billingSettings))return false;
  if('welfareMonthlySettings' in d && (!obj(d.welfareMonthlySettings)||!Object.entries(d.welfareMonthlySettings).every(([month,item])=>welfareValidMonth(month)&&obj(item)&&Number.isFinite(Number(item.amount))&&Number(item.amount)>0&&Number(item.amount)<=1e9&&(!('note' in item)||typeof item.note==='string'))))return false;
  if('settlements' in d && (!Array.isArray(d.settlements)||!d.settlements.every(s=>obj(s)&&typeof s.month==='string'&&typeof s.supplierId==='string'&&validISODate(s.cutoff)&&validISODate(s.creditStart)&&Number.isFinite(Number(s.offset))&&Number.isFinite(Number(s.debtCarry)))))return false;
  if(!d.people.every(p=>typeof p.id==='string' && typeof p.name==='string'))return false;
  if(!d.leaves.every(l=>typeof l.id==='string' && typeof l.date==='string' && Number.isFinite(Number(l.kg))))return false;
  if(!d.credits.every(c=>typeof c.id==='string' && typeof c.date==='string' && Number.isFinite(Number(c.amount))))return false;
  return true;
}
function openRestoreConfirmation(data,filename){
  pendingRestore=data;
  document.getElementById('restoreConfirmFile').textContent='ගොනුව: '+filename;
  document.getElementById('restoreConfirmPeople').textContent=data.people.length.toLocaleString();
  document.getElementById('restoreConfirmLeaves').textContent=data.leaves.length.toLocaleString();
  document.getElementById('restoreConfirmCredits').textContent=data.credits.length.toLocaleString();
  document.getElementById('restoreConfirmDeductions').textContent=(data.deductions||[]).length.toLocaleString();
  document.getElementById('restoreConfirmBilling').textContent=Object.keys(data.billingSettings||{}).length.toLocaleString();
  document.getElementById('restoreConfirmSettlements').textContent=(data.settlements||[]).length.toLocaleString();
  restoreConfirmDialog.hidden=false;
  document.getElementById('appRoot').inert=true;
  document.getElementById('restoreConfirmCancel').focus();
}
function cancelRestoreConfirmation(){
  pendingRestore=null;
  restoreConfirmDialog.hidden=true;
  restoreFileInput.value='';
  document.getElementById('appRoot').inert=false;
  if(settingsPanel.classList.contains('data-open'))document.getElementById('settingsRestoreBtn').focus();
}
function restore(e){
  const file=e.target.files && e.target.files[0];
  if(!file)return;
  if(file.size>20*1024*1024){e.target.value='';alert('Backup ගොනුව විශාල වැඩියි (20 MB ඉක්මවා ඇත).');return}
  const reader=new FileReader();
  reader.onload=()=>{
    let data;
    try{data=JSON.parse(reader.result)}catch(_){e.target.value='';alert('Backup ගොනුව කියවිය නොහැක. නිවැරදි JSON ගොනුවක් තෝරන්න.');return}
    if(!validBackup(data)){e.target.value='';alert('මෙය වලංගු Tea Management Backup ගොනුවක් නොවේ. දත්ත වෙනස් කළේ නැහැ.');return}
    openRestoreConfirmation(data,file.name);
  };
  reader.onerror=()=>{e.target.value='';alert('Backup ගොනුව කියවීම අසාර්ථකයි. දත්ත වෙනස් කළේ නැහැ.')};
  reader.readAsText(file);
}
async function confirmRestore(){
  if(!pendingRestore)return;
  const data=pendingRestore;
  const replacements={
    tea_people:JSON.stringify(data.people),
    tea_leaves:JSON.stringify(data.leaves),
    tea_credits:JSON.stringify(data.credits),
    tea_extra_deductions:JSON.stringify(data.deductions||[]),
    tea_billing_settings:JSON.stringify(data.billingSettings||{}),
    tea_monthly_welfare:JSON.stringify(data.welfareMonthlySettings||{}),
    tea_confirmed_settlements:JSON.stringify(data.settlements||[])
  };
  try{
    // Restore is user-confirmed; no automatic backup is created.
    localDB.batch(Object.entries(replacements));
    await localDB.flush();
  }catch(error){
    alert('Backup Restore අසාර්ථකයි. පැරණි දත්ත වෙනස් කළේ නැහැ: '+error.message);
    return;
  }
  people=data.people;
  leaves=data.leaves;
  credits=data.credits;
  deductions=data.deductions||[];
  billingSettings=data.billingSettings||{};
  welfareMonthlySettings=data.welfareMonthlySettings||{};
  settlements=data.settlements||[];
  cancelRestoreConfirmation();
  loadBillMonthSettings();
  render();
  alert('Backup දත්ත සාර්ථකව ප්‍රතිස්ථාපනය කළා!');
}
document.getElementById('restoreConfirmCancel').addEventListener('click',cancelRestoreConfirmation);
document.getElementById('restoreConfirmProceed').addEventListener('click',confirmRestore);

/* Scoped resets: only this app's seven localStorage keys are touched.
   Monthly invoices are linked to the source records; clear linked finalized bills
   whenever their dependent supplier/tea/credit records are cleared. */
const RESET_PASSWORD='0000'; // UI confirmation only; not secure access control.
const DATA_RESET_SCOPES={
  people:{title:'සැපයුම්කරුවන් Reset කරන්නද?',keys:['tea_people','tea_leaves','tea_credits','tea_extra_deductions','tea_monthly_welfare','tea_confirmed_settlements']},
  leaves:{title:'දලු සටහන් Reset කරන්නද?',keys:['tea_leaves','tea_confirmed_settlements']},
  credits:{title:'කඩ ණය Reset කරන්නද?',keys:['tea_credits','tea_confirmed_settlements']},
  deductions:{title:'අඩුකිරීම් Reset කරන්නද?',keys:['tea_extra_deductions','tea_monthly_welfare','tea_confirmed_settlements']},
  bills:{title:'බිල්පත් Reset කරන්නද?',keys:['tea_billing_settings','tea_confirmed_settlements']},
  all:{title:'සම්පූර්ණ දත්ත Reset කරන්නද?',keys:['tea_people','tea_leaves','tea_credits','tea_extra_deductions','tea_monthly_welfare','tea_billing_settings','tea_confirmed_settlements']}
};
const RESET_LABELS={tea_people:'සැපයුම්කරුවන්',tea_leaves:'දලු සටහන්',tea_credits:'ණය ගනුදෙනු',tea_extra_deductions:'අඩුකිරීම් ගනුදෙනු',tea_monthly_welfare:'මාසික පොදු සුභසාධන ගාස්තු',tea_billing_settings:'මාසික බිල් සැකසුම්',tea_confirmed_settlements:'තහවුරු කළ බිල්පත්'};
const resetConfirmDialog=document.getElementById('resetConfirmDialog');
const resetPasswordInput=document.getElementById('resetPassword');
let pendingResetScope=null;
function resetItemCount(key){
  switch(key){
    case 'tea_people':return people.length;
    case 'tea_leaves':return leaves.length;
    case 'tea_credits':return credits.length;
    case 'tea_extra_deductions':return deductions.length;
    case 'tea_monthly_welfare':return Object.keys(welfareMonthlySettings).length;
    case 'tea_billing_settings':return Object.keys(billingSettings).length;
    case 'tea_confirmed_settlements':return settlements.length;
    default:return 0;
  }
}
function openResetConfirmation(scope){
  const config=DATA_RESET_SCOPES[scope];if(!config)return;
  pendingResetScope=scope;
  document.getElementById('resetTitle').textContent=config.title;
  document.getElementById('resetDescription').textContent=scope==='all'
    ?'මෙම Browser එකේ ගබඩා කර ඇති සියලු ව්‍යාපාරික දත්ත මකනු ඇත. Theme හා Login සැකසුම් නොමැකේ.'
    :'මෙම කොටස සමඟ සම්බන්ධ තහවුරු කළ බිල්පත් ද ඉවත් වේ. අනෙකුත් සටහන් හැකි තාක් රැකේ.';
  const list=document.getElementById('resetImpactList');list.replaceChildren();
  config.keys.forEach(key=>{const li=document.createElement('li');li.textContent=`${RESET_LABELS[key]}: ${resetItemCount(key).toLocaleString('en-US')}`;list.appendChild(li)});
  resetPasswordInput.value='';
  document.getElementById('resetPasswordError').textContent='';
  resetConfirmDialog.hidden=false;
  document.getElementById('appRoot').inert=true;
  resetPasswordInput.focus();
}
function cancelResetConfirmation(){
  resetConfirmDialog.hidden=true;
  resetPasswordInput.value='';
  document.getElementById('resetPasswordError').textContent='';
  document.getElementById('appRoot').inert=false;
  const from=pendingResetScope;
  pendingResetScope=null;
  if(from && settingsPanel.classList.contains('data-open')){
    document.querySelector(`[data-reset-scope="${from}"]`)?.focus();
  }
}
async function confirmDataReset(){
  const config=DATA_RESET_SCOPES[pendingResetScope];if(!config)return;
  if(resetPasswordInput.value!==RESET_PASSWORD){
    document.getElementById('resetPasswordError').textContent='Password එක වැරදියි. Reset සිදු කළේ නැහැ.';
    resetPasswordInput.value='';resetPasswordInput.focus();return;
  }
  try{
    localDB.batch(config.keys.map(key=>[key,null]));
    await localDB.flush();
  }catch(error){
    document.getElementById('resetPasswordError').textContent='Reset අසාර්ථකයි: '+error.message;
    return;
  }
  pendingResetScope=null;
  // Rebuild app state on reload, keeping the active Admin session and theme.
  // No unrelated localStorage keys or other website data are cleared.
  window.location.reload();
}
document.querySelectorAll('[data-reset-scope]').forEach(button=>button.addEventListener('click',()=>openResetConfirmation(button.dataset.resetScope)));
document.getElementById('resetCancelBtn').addEventListener('click',cancelResetConfirmation);
document.getElementById('resetProceedBtn').addEventListener('click',confirmDataReset);
resetPasswordInput.addEventListener('input',()=>{document.getElementById('resetPasswordError').textContent=''});
resetPasswordInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();confirmDataReset()}});
resetConfirmDialog.addEventListener('click',event=>{if(event.target===resetConfirmDialog)cancelResetConfirmation()});

restoreConfirmDialog.addEventListener('click',event=>{if(event.target===restoreConfirmDialog)cancelRestoreConfirmation()});
loadBillMonthSettings();
// Hero shortcuts use the same existing tab navigation, preserving sheet auto-scroll.
document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector(`nav button[data-page="${button.dataset.go}"]`)?.click();
}));
render();

/* Purely visual enhancement: no edits to suppliers, kilos, bills or app navigation. */
(()=>{
  const targets='.sheet-tablewrap,.report-sheet-scroll,.tablewrap,.billing-table-wrap,.report-bill-table-wrap,.tc-table-scroll';
  const mobile=window.matchMedia('(max-width:780px)');
  const instances=new Map();
  let scheduled=false;
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

  function update(inst){
    const {scroller,bar,thumb}=inst;
    const width=scroller.clientWidth;
    const max=scroller.scrollWidth-width;
    const active=mobile.matches && width>0 && max>8 && scroller.getClientRects().length>0;
    bar.classList.toggle('is-visible',active);
    if(!active)return;
    const track=bar.querySelector('.glass-scrollbar-track');
    const tw=track.clientWidth;
    const thumbW=clamp(tw*width/scroller.scrollWidth,34,tw);
    const travel=Math.max(0,tw-thumbW);
    thumb.style.width=thumbW+'px';
    thumb.style.transform=`translateX(${max>0?(scroller.scrollLeft/max)*travel:0}px)`;
    bar.setAttribute('aria-valuenow',String(Math.round(max>0?100*scroller.scrollLeft/max:0)));
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;for(const inst of instances.values())update(inst)});
  }
  function install(scroller,index){
    if(instances.has(scroller))return;
    if(!scroller.id)scroller.id='glass-scroll-region-'+index;
    const bar=document.createElement('div');
    bar.className='glass-scrollbar';
    bar.tabIndex=0;
    bar.setAttribute('role','scrollbar');
    bar.setAttribute('aria-label','වගුව පැත්තට අනුචලනය කරන්න');
    bar.setAttribute('aria-orientation','horizontal');
    bar.setAttribute('aria-valuemin','0');
    bar.setAttribute('aria-valuemax','100');
    bar.setAttribute('aria-controls',scroller.id);
    bar.innerHTML='<div class="glass-scrollbar-track"><div class="glass-scrollbar-thumb"></div></div>';
    scroller.insertAdjacentElement('afterend',bar);
    const inst={scroller,bar,thumb:bar.querySelector('.glass-scrollbar-thumb')};
    instances.set(scroller,inst);
    function navigate(clientX){
      const rect=bar.querySelector('.glass-scrollbar-track').getBoundingClientRect();
      const pos=clamp((clientX-rect.left)/rect.width,0,1);
      const end=Math.max(0,scroller.scrollWidth-scroller.clientWidth);
      const thumbRatio=clamp(scroller.clientWidth/scroller.scrollWidth,0,1);
      const frac=clamp((pos-thumbRatio/2)/(1-thumbRatio),0,1);
      scroller.scrollLeft=end*frac;
      update(inst);
    }
    bar.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      bar.setPointerCapture(event.pointerId);
      navigate(event.clientX);
      event.preventDefault();
    });
    bar.addEventListener('pointermove',event=>{
      if(bar.hasPointerCapture(event.pointerId)){navigate(event.clientX);event.preventDefault()}
    });
    bar.addEventListener('keydown',event=>{
      const delta=event.key==='ArrowRight'?80:event.key==='ArrowLeft'?-80:0;
      if(delta){scroller.scrollLeft+=delta;event.preventDefault()}
    });
    scroller.addEventListener('scroll',()=>update(inst),{passive:true});
    new MutationObserver(schedule).observe(scroller,{subtree:true,childList:true,characterData:false});
    if('ResizeObserver' in window)new ResizeObserver(schedule).observe(scroller);
    update(inst);
  }
  document.querySelectorAll(targets).forEach(install);
  window.addEventListener('resize',schedule,{passive:true});
  mobile.addEventListener?.('change',schedule);
  // Existing UI changes visibility when navigating, so refresh on navigation, too.
  document.querySelectorAll('nav button[data-page]').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(schedule)));
  schedule();
})();


