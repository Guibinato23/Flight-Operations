// Exibe botão Aprovação apenas para super admin
window.addEventListener('DOMContentLoaded', ()=>{
  if(user && user.email === 'guilherme@poitav.com' && document.getElementById('approvalBtn')){
    document.getElementById('approvalBtn').style.display = '';
  }
});

// Ao clicar em Aprovação, exibe interface de aprovação em um modal (pop-up)
if(document.getElementById('approvalBtn')){
  document.getElementById('approvalBtn').addEventListener('click', ()=>{
    const dialog = document.getElementById('adminApprovalDialog');
    if(dialog) {
      dialog.showModal();
      // Corrige usuários antigos no localStorage para garantir que todos tenham o campo 'approved'
      let usersFix = JSON.parse(localStorage.getItem('users') || '[]');
      let changed = false;
      usersFix = usersFix.map(u => {
        if (typeof u.approved === 'undefined') { u.approved = false; changed = true; }
        return u;
      });
      if (changed) localStorage.setItem('users', JSON.stringify(usersFix));
      // Debug: Confirma chamada e dados
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const pendentes = users.filter(u => !u.approved && u.email !== 'guilherme@poitav.com');
        console.log('[DEBUG script.js] users:', users);
        console.log('[DEBUG script.js] pendentes:', pendentes);
      } catch (e) { console.error('[DEBUG script.js] erro ao ler users:', e); }
      // Garante que renderPendingUsers está disponível
      if (typeof window.renderPendingUsers !== 'function') {
        try {
          if (typeof renderPendingUsers === 'function') {
            window.renderPendingUsers = renderPendingUsers;
          }
        } catch {}
      }
      if(typeof window.renderPendingUsers === 'function') {
        console.log('[DEBUG script.js] Chamando renderPendingUsers');
        window.renderPendingUsers();
      } else {
        console.log('[DEBUG script.js] Função renderPendingUsers não encontrada');
      }
      if(document.getElementById('refreshPending')) document.getElementById('refreshPending').onclick = window.renderPendingUsers;
      if(document.getElementById('closeApproval')) document.getElementById('closeApproval').onclick = ()=>dialog.close();
    }
    document.getElementById('profileDropdown').style.display = 'none';
  });
}
// ---------- UTIL (UTC) ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const pad = n => String(n).padStart(2, '0');
const toMinutes = hhmm => {const [h,m]=hhmm.split(':').map(Number);return h*60+m}
const fromMinutes = mins => `${pad(Math.floor(mins/60))}:${pad(mins%60)}`;
const hashColor = str => { let h=0; for (let i=0;i<str.length;i++){h = (h*31 + str.charCodeAt(i))>>>0} const hue = h % 360; return `hsl(${hue} 60% 38%)`; }
const fmtBR = (dUTC) => `${pad(dUTC.getUTCDate())}/${pad(dUTC.getUTCMonth()+1)}`;
function load(key, fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{ return fallback }}
function save(key, value){localStorage.setItem(key, JSON.stringify(value))}
function parseYMD(s){ const [y,m,d]=s.split('-').map(Number); return new Date(Date.UTC(y, m-1, d)); }
function ymdUTC(d){ return d.toISOString().slice(0,10); }
function weekStart(dateStr){
  const d = dateStr ? parseYMD(dateStr) : parseYMD(ymdUTC(new Date()));
  const dow = d.getUTCDay();                 // 0=Dom
  const s = new Date(d); s.setUTCDate(d.getUTCDate()-dow); s.setUTCHours(0,0,0,0); return s;
}
function addDaysUTC(d, n){ const x=new Date(d); x.setUTCDate(d.getUTCDate()+n); return x; }
function download(filename, text){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type:'text/plain'}));
  a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
function resetFilters(){
  ['fPrefix','fOrig','fDest'].forEach(id=>{ const el=$('#'+id); if(el) el.value=''; });
}

// ---------- ESTADO ----------
let flights = load('flights', []); // {id,date,prefix,orig,dest,dept,pax,dur,notes}
let fixedPrefixes = load('fixedPrefixes', ["PR-ABC","PT-XYZ","N909TT","PP-POIT"]);
let lastSelectedId = null;

// ---------- TABS ----------
const tabs = $$('.tab');
tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
function switchTab(id){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab===id));
  const cad=$('#cadastro'); const pai=$('#painel'); const fb=$('#flightbrief'); const pax=$('#pax');
  if(cad) cad.style.display = id==='cadastro' ? '' : 'none';
  if(pai) pai.style.display = id==='painel' ? '' : 'none';
  if(fb)  fb.style.display  = id==='flightbrief' ? '' : 'none';
  if(pax) pax.style.display = id==='pax' ? '' : 'none';
  if(id==='painel'){ resetFilters(); renderBoard(); applyRowHeight(load('rowHeight','54px')); }
  if(id==='pax'){ 
    console.log('[switchTab] Abrindo aba de passageiros');
    // Inicializar o módulo se ainda não foi inicializado
    if(typeof window.initPassengersModule === 'function' && !window.passengersModuleInitialized) {
      window.initPassengersModule().then(() => {
        window.passengersModuleInitialized = true;
        if(typeof renderTrips === 'function') {
          renderTrips();
        }
      });
    } else if(typeof renderTrips === 'function') {
      renderTrips();
    }
  }
}


// ---------- FLIGHT LIST (Cadastro) ----------
function renderFlightList() {
  const listDiv = document.getElementById('flightList');
  if(!listDiv) return;
  const today = ymdUTC(new Date());
  const futureFlights = flights.filter(f => f.date >= today);
  if(!futureFlights.length) {
    listDiv.innerHTML = '<div style="color:#7b7b8a;font-size:14px;">Nenhum voo cadastrado para hoje ou datas futuras.</div>';
    return;
  }
    function calcPouso(dept, dur) {
      if(!dept) return '';
      const [h, m] = dept.split(':').map(Number);
      const total = (h * 60 + m + (Number(dur)||0)) % 1440;
      const hh = String(Math.floor(total/60)).padStart(2,'0');
      const mm = String(total%60).padStart(2,'0');
      return `${hh}:${mm}`;
    }
    listDiv.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#f3f4f6;color:#232336;font-weight:600;">
        <th style="padding:6px 4px;text-align:left;">Prefixo</th>
        <th style="padding:6px 4px;text-align:left;">Data</th>
        <th style="padding:6px 4px;text-align:left;">Origem</th>
        <th style="padding:6px 4px;text-align:left;">Destino</th>
        <th style="padding:6px 4px;text-align:left;">Decolagem</th>
        <th style="padding:6px 4px;text-align:left;">Pouso</th>
        <th style="padding:6px 4px;text-align:left;">Pax</th>
      </tr></thead>
      <tbody>
        ${futureFlights.map(f=>`
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:5px 4px;">${f.prefix}</td>
            <td style="padding:5px 4px;">${f.date}</td>
            <td style="padding:5px 4px;">${f.orig}</td>
            <td style="padding:5px 4px;">${f.dest}</td>
            <td style="padding:5px 4px;">${f.dept}</td>
            <td style="padding:5px 4px;">${calcPouso(f.dept, f.dur)}</td>
            <td style="padding:5px 4px;">${f.pax}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

// Atualiza lista ao cadastrar novo voo
$('#flightForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    id: crypto.randomUUID(),
    prefix: $('#prefix').value.trim().toUpperCase(),
    date: $('#date').value,
    dept: $('#dept').value,
    orig: $('#orig').value.trim().toUpperCase(),
    dest: $('#dest').value.trim().toUpperCase(),
    pax: Number($('#pax').value || 0),
    dur: Number($('#dur').value || 90),
    notes: $('#notes').value.trim()
  };
  if(!data.date || !data.dept){ alert('Preencha data e horário.'); return }
  flights.push(data); save('flights', flights);
  if(!fixedPrefixes.includes(data.prefix)) { fixedPrefixes.push(data.prefix); save('fixedPrefixes', fixedPrefixes); renderPrefixChips(); }
  $('#flightForm').reset();
  resetFilters();
  renderFlightList();
  $('#boardDate').value = data.date; switchTab('painel');
});
$('#gotoBoard').addEventListener('click', ()=> switchTab('painel'));

// Validação do campo Passageiros - aceitar apenas números
const paxInput = $('#pax');
if(paxInput) {
  paxInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
  paxInput.addEventListener('blur', (e) => {
    if(e.target.value === '') e.target.value = '';
  });
}

// Renderiza lista ao carregar a aba Cadastro
if(document.getElementById('flightList')) renderFlightList();

// ---------- PREFIXOS ----------
function renderPrefixChips(){
  const box = $('#prefixList'); box.innerHTML='';
  fixedPrefixes.forEach(p => {
    const el = document.createElement('div'); el.className='chip';
    el.innerHTML = `<i style="background:${hashColor(p)}"></i><span>${p}</span> <button class="secondary remove" data-p="${p}" title="remover">×</button>`;
    box.appendChild(el);
  });
  box.addEventListener('click', e=>{
    if(e.target.matches('.remove')){
      const p = e.target.dataset.p; fixedPrefixes = fixedPrefixes.filter(x=>x!==p);
      save('fixedPrefixes', fixedPrefixes); renderPrefixChips(); renderBoard();
    }
  }, { once: true });
}
renderPrefixChips();
$('#addPrefix').addEventListener('click', ()=>{
  const p = $('#newPrefix').value.trim().toUpperCase(); if(!p) return;
  if(!fixedPrefixes.includes(p)) { fixedPrefixes.push(p); save('fixedPrefixes', fixedPrefixes); }
  $('#newPrefix').value=''; renderPrefixChips(); renderBoard();
});

// ---------- FILTROS ----------
function passesFilters(f){
  const p = $('#fPrefix').value.trim().toUpperCase();
  const o = $('#fOrig').value.trim().toUpperCase();
  const d = $('#fDest').value.trim().toUpperCase();
  if(p && !f.prefix.includes(p)) return false;
  if(o && !f.orig.includes(o)) return false;
  if(d && !f.dest.includes(d)) return false;
  return true;
}
['fPrefix','fOrig','fDest'].forEach(id=> $('#'+id).addEventListener('input', renderBoard));
$('#clearFilters').addEventListener('click', ()=>{ resetFilters(); renderBoard(); });

// ---------- PAINEL ----------
function updateWeekRange(startUTC){
  const range = `${fmtBR(startUTC)} – ${fmtBR(addDaysUTC(startUTC,6))}`;
  $('#weekRange').textContent = range;
}
function renderWeekHeader(startUTC){
  const header = $('#weekHeader'); header.innerHTML='';
  const names = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  for(let i=0;i<7;i++){
    const d = addDaysUTC(startUTC, i);
    const h = document.createElement('div');
    h.textContent = `${names[i]} ${fmtBR(d)}`;
    header.appendChild(h);
  }
  updateWeekRange(startUTC);
}

function renderBoard(){
  const baseDay = $('#boardDate').value || ymdUTC(new Date());
  $('#boardDate').value = baseDay;

  const start = weekStart(baseDay);
  renderWeekHeader(start);

  const boardWrap = $('#board'); boardWrap.innerHTML='';
  const withinWeek = new Set(Array.from({length:7}, (_,i)=> ymdUTC(addDaysUTC(start,i))));
  const flightsOfWeek = flights
    .filter(f => withinWeek.has(f.date) && passesFilters(f))
    .sort((a,b)=> a.date===b.date ? (toMinutes(a.dept) - toMinutes(b.dept)) : a.date.localeCompare(b.date));

  const prefixesSet = new Set([...fixedPrefixes, ...flightsOfWeek.map(f=>f.prefix)]);
  const prefixes = Array.from(prefixesSet);

  $('#emptyMsg').style.display = flightsOfWeek.length ? 'none' : '';
  $('#legend').innerHTML = prefixes.map(p=>`<div class="chip"><i style="background:${hashColor(p)}"></i>${p}</div>`).join('');

  const totalCols = 7 * 96; // 7 dias * 24h * 4 (15min)
  prefixes.forEach(prefix => {
    const lane = document.createElement('div'); lane.className='lane';

    const flightsOfPrefix = flightsOfWeek.filter(f=>f.prefix===prefix);
    const totalMins = flightsOfPrefix.reduce((s,f)=>s+(f.dur||90),0);
    const title = document.createElement('div');
    title.className='laneTitle';
    title.innerHTML = `${prefix} <small>– ${flightsOfPrefix.length} voos – ${(totalMins/60).toFixed(1)}h</small>`;
    lane.appendChild(title);

    const grid = document.createElement('div'); grid.className='grid cellGrid';
    grid.style.position='relative';
    grid.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;
    grid.style.setProperty('--totalHours', 7*24);

    flightsOfPrefix.forEach(f => {
      const dayIndex = Math.floor((parseYMD(f.date) - start) / (24*60*60*1000));
      const startCol = dayIndex*96 + Math.floor(toMinutes(f.dept)/15);
      const span  = Math.max(1, Math.round((f.dur||90)/15));
      const block = document.createElement('div'); block.className='flight'; block.dataset.id = f.id;
      block.style.gridColumn = `${startCol+1} / span ${span}`;
      block.style.background = hashColor(prefix);
      block.style.boxShadow = '0 2px 0 rgba(0,0,0,.25) inset, 0 6px 18px rgba(0,0,0,.25)';
      const hoverText = `${f.orig} → ${f.dest} – ${f.dept} – ${f.dur||90}min – ${f.pax||0} pax${f.notes?` – ${f.notes}`:''}`;
      block.title = hoverText;
      block.innerHTML = `
        <div class="tooltip">${hoverText}</div>
        <strong>${f.orig}</strong><small>→</small><strong>${f.dest}</strong>
        <span class="tag">${f.dept}</span>
        <small>${f.pax||0} pax</small>
      `;
      block.addEventListener('click', ()=> openEdit(f.id));
      block.addEventListener('mouseenter', ()=>{ lastSelectedId = f.id; $$('.selected').forEach(e=>e.classList.remove('selected')); block.classList.add('selected');});
      grid.appendChild(block);
    });

    lane.appendChild(grid); boardWrap.appendChild(lane);
  });
}

function removeFlight(id){ flights = flights.filter(x=>x.id!==id); save('flights', flights); }

// ---------- Navegação ----------
$('#todayBtn').addEventListener('click', ()=>{ $('#boardDate').value = ymdUTC(new Date()); renderBoard(); });
$('#prevWeek').addEventListener('click', ()=>{
  const s = weekStart($('#boardDate').value); const prev = addDaysUTC(s,-7);
  $('#boardDate').value = ymdUTC(prev); renderBoard();
});
$('#nextWeek').addEventListener('click', ()=>{
  const s = weekStart($('#boardDate').value); const next = addDaysUTC(s,7);
  $('#boardDate').value = ymdUTC(next); renderBoard();
});
$('#boardDate').addEventListener('change', renderBoard);
$('#backCadastro').addEventListener('click', ()=> switchTab('cadastro'));
$('#clearBtn').addEventListener('click', ()=>{
  const base = $('#boardDate').value; if(!base) return;
  const start = weekStart(base); const end = addDaysUTC(start, 6);
  if(confirm('Remover todos os voos desta semana?')){
    flights = flights.filter(f => {
      const d = parseYMD(f.date);
      return d < start || d > end;
    });
    save('flights', flights); renderBoard();
  }
});

// ---------- Zoom VISUAL (altura das linhas) ----------
function applyRowHeight(px){
  document.documentElement.style.setProperty('--rowHeight', px);
  save('rowHeight', px);
  // botão ativo
  $('#szCompact').classList.toggle('active', px==='36px');
  $('#szNormal').classList.toggle('active',  px==='54px');
  $('#szLarge').classList.toggle('active',   px==='72px');
}
$('#szCompact').addEventListener('click', ()=> applyRowHeight('36px'));
$('#szNormal').addEventListener('click',  ()=> applyRowHeight('54px'));
$('#szLarge').addEventListener('click',   ()=> applyRowHeight('72px'));

// ---------- Edição ----------
const editDialog = $('#editDialog');
function openEdit(id){
  const f = flights.find(x=>x.id===id); if(!f) return;
  lastSelectedId = id;
  $('#editId').value = f.id;
  $('#editOrig').value = f.orig;
  $('#editDest').value = f.dest;
  $('#editDept').value = f.dept;
  $('#editDate').value = f.date;
  $('#editDur').value  = f.dur || 90;
  $('#editPax').value  = f.pax || 0;
  $('#editNotes').value= f.notes || '';
  editDialog.showModal();
}
$('#board').addEventListener('click', (e)=>{
  const block = e.target.closest('.flight'); if(!block) return;
  openEdit(block.dataset.id);
});

$('#editForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const id = $('#editId').value;
  const idx = flights.findIndex(x=>x.id===id);
  if(idx<0) return;
  flights[idx] = {
    ...flights[idx],
    orig: $('#editOrig').value.trim().toUpperCase(),
    dest: $('#editDest').value.trim().toUpperCase(),
    dept: $('#editDept').value,
    date: $('#editDate').value,
    dur:  Number($('#editDur').value || flights[idx].dur || 90),
    pax:  Number($('#editPax').value || 0),
    notes: $('#editNotes').value.trim()
  };
  save('flights', flights);
  editDialog.close();
  renderBoard();
});
$('#deleteFlight').addEventListener('click', ()=>{
  const id = $('#editId').value;
  if(id && confirm('Excluir este voo?')){ removeFlight(id); editDialog.close(); renderBoard(); }
});

$('#closeEdit').addEventListener('click', ()=> editDialog.close());

// ---------- Exportar CSV ----------
$('#exportCSV').addEventListener('click', ()=>{
  const head = ['id','date','dept','dur','prefix','orig','dest','pax','notes'];
  const rows = flights.map(f=> head.map(k=> String(f[k]??'').replace(/"/g,'""')));
  const csv = [head.join(','), ...rows.map(r=> r.map(v=>`"${v}"`).join(','))].join('\n');
  download('flights.csv', csv);
});

// ---------- Inicialização ----------
const today = ymdUTC(new Date());
$('#date').value = today; $('#boardDate').value = today;
renderBoard();
applyRowHeight(load('rowHeight','54px')); // aplica preferêancia salva

// ---------- Usuário/avatar ----------
// Autenticação: busca usuário logado no localStorage
let user = JSON.parse(localStorage.getItem('loggedUser') || 'null');
if(!user || (!user.approved && user.email !== 'guilherme@poitav.com')) {
  localStorage.removeItem('loggedUser');
  window.location.href = 'login.html';
}
function setUserProfile() {
  const name = user && user.name ? user.name : 'Usuário';
  const avatar = name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
  $('#userName').textContent = name;
  $('#avatar').textContent = avatar;
}
if($('#userProfile')) setUserProfile();

// Dropdown de perfil
const profileDropdown = $('#profileDropdown');
const profileEditDialog = $('#profileEditDialog');
if($('#avatar')){
  $('#avatar').addEventListener('click', (e)=>{
    e.stopPropagation();
    if(profileDropdown.style.display==='block'){
      profileDropdown.style.display='none';
    } else {
      profileDropdown.style.display='block';
    }
  });
  // Fecha dropdown ao clicar fora
  document.addEventListener('click', (e)=>{
    if(profileDropdown && profileDropdown.style.display==='block'){
      if(!e.target.closest('#profileDropdown') && !e.target.closest('#avatar')){
        profileDropdown.style.display='none';
      }
    }
  });
}
if($('#editProfileBtn')){
  $('#editProfileBtn').addEventListener('click', ()=>{
    profileDropdown.style.display='none';
    $('#profileName').value = user.nome;
    $('#profileEmail').value = user.email;
    profileEditDialog.showModal();
  });
}
if($('#closeProfileEdit')){
  $('#closeProfileEdit').addEventListener('click', ()=> profileEditDialog.close());
}
if($('#profileForm')){
  $('#profileForm').addEventListener('submit', e=>{
    e.preventDefault();
    user.nome = $('#profileName').value.trim() || 'Usuário';
    user.email = $('#profileEmail').value.trim() || 'usuario@email.com';
    setUserProfile();
    profileEditDialog.close();
    alert('Perfil atualizado!');
  });
}
if($('#logoutBtn')){
  $('#logoutBtn').addEventListener('click', ()=>{
    profileDropdown.style.display='none';
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  });
}