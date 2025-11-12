// ...código migrado do index.html...
(function(){
	// Escopo: roda apenas se a seção Flight Brief existir
	const root = document.getElementById('flightbrief');
	if(!root) return;

	const $ = s=>root.querySelector(s);
	const $$ = s=>Array.from(root.querySelectorAll(s));

	// ===== Basic bindings
	function fmtDate(v){ if(!v) return ''; const d=new Date(v+'T00:00:00'); return d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'}); }
	function bindText(inpSel,outSel,mode){
		const inp=$(inpSel); if(!inp) return; const out=outSel?$(outSel):null;
		function update(){
			const v=inp.value;
			if(mode==='date'){ if(out) out.textContent = fmtDate(v); return; }
			if(mode==='company'){ const co=$('#companyOut'); if(co) co.textContent = v || '{{company}}'; return; }
			if(out) out.textContent=v; }
		inp.addEventListener('input',update); update();
	}
	bindText('#slogan','#sloganOut');
	bindText('#company',null,'company');
	bindText('#date','#outDate','date');
	bindText('#departLT','#outDepart');
	bindText('#fromIcao','#outFromIcao');
	bindText('#fromName','#outFromName');
	bindText('#toIcao','#outToIcao');
	bindText('#toName','#outToName');
	bindText('#pax','#outPax');
	bindText('#flightTime','#outFtime');
	bindText('#arriveLT','#outArrive');
	bindText('#flightNo','#outFno');
	bindText('#acType','#outType');
	bindText('#acReg','#outReg');
	bindText('#acRest','#outRest');

	// ===== Images
	function bindImage(input, img){
		if(!input||!img) return;
		input.addEventListener('change',e=>{ const f=e.target.files?.[0]; if(!f) return; const fr=new FileReader(); fr.onload=()=>{ img.src=fr.result; }; fr.readAsDataURL(f); });
	}
	// Removido upload de logo; apenas fotos da aeronave permanecem
	$$('.picInput').forEach(inp=> bindImage(inp, $('#pic'+inp.dataset.pic)));

	// ===== Crew block
	// localStorage.getItem may return null; use 'null' fallback so JSON.parse doesn't throw on empty string
	let crewState = JSON.parse(localStorage.getItem('crewState')||'null') || [
		{role:'Captain', name:'', phone:''},
		{role:'First Officer', name:'', phone:''},
		{role:'Air Hostess', name:'', phone:''},
		{role:'Sales Team', name:'', phone:''}
	];
	function crewRowTemplate(i,v){return `<div class="row" data-i="${i}">
			<div><label>Função<input class="crew-role" value="${v.role||''}"></label></div>
			<div><label>Nome<input class="crew-name" value="${v.name||''}"></label></div>
			<div><label>Telefone<input class="crew-phone" value="${v.phone||''}"></label></div>
			<div><button type="button" class="btn remove-crew" style="margin-top:24px">Remover</button></div>
		</div>`}
	function renderCrewForm(){ const wrap=$('#crewWrap'); if(!wrap) return; wrap.innerHTML=''; crewState.forEach((c,i)=>wrap.insertAdjacentHTML('beforeend',crewRowTemplate(i,c)));
		wrap.querySelectorAll('.remove-crew').forEach((b,idx)=> b.addEventListener('click',()=>{ crewState.splice(idx,1); saveCrew(); renderCrewForm(); drawCrewTable(); }));
		wrap.querySelectorAll('input').forEach(inp=> inp.addEventListener('input',()=>{ syncCrewState(); saveCrew(); drawCrewTable(); }));
	}
	function syncCrewState(){ const rows=$$('#crewWrap .row'); crewState=rows.map(r=>({ role:r.querySelector('.crew-role').value, name:r.querySelector('.crew-name').value, phone:r.querySelector('.crew-phone').value })); }
	function saveCrew(){ try{ localStorage.setItem('crewState', JSON.stringify(crewState)); }catch(_){} }
	function drawCrewTable(){ const tb=$('#crewTable tbody'); tb.innerHTML=crewState.map(c=>`<tr><td>${c.role||''}</td><td>${c.name||''}</td><td>${c.phone||''}</td></tr>`).join(''); }
	renderCrewForm(); drawCrewTable();
	if($('#addCrew')) $('#addCrew').addEventListener('click',()=>{ crewState.push({role:'',name:'',phone:''}); saveCrew(); renderCrewForm(); drawCrewTable(); });

	// ===== Passengers block
	let paxState = JSON.parse(localStorage.getItem('paxState')||'null') || [];
	function paxRowTemplate(i,v){return `<div class="row" data-i="${i}">
			<div><label>Nome<input class="pax-name" value="${v.name||''}"></label></div>
			<div><label>Passaporte<input class="pax-passport" value="${v.passport||''}"></label></div>
			<div><label>Vencimento<input type="date" class="pax-exp" value="${v.exp||''}"></label></div>
			<div><label>Telefone<input class="pax-phone" value="${v.phone||''}"></label></div>
			<div style="grid-column:1 / -1"><button type="button" class="btn remove-pax">Remover</button></div>
		</div>`}
	function renderPaxForm(){ const wrap=$('#paxWrap'); if(!wrap) return; wrap.innerHTML=''; paxState.forEach((p,i)=>wrap.insertAdjacentHTML('beforeend',paxRowTemplate(i,p)));
		wrap.querySelectorAll('.remove-pax').forEach((b,idx)=> b.addEventListener('click',()=>{ paxState.splice(idx,1); savePax(); renderPaxForm(); drawPaxTable(); }));
		wrap.querySelectorAll('input').forEach(inp=> inp.addEventListener('input',()=>{ syncPaxState(); savePax(); drawPaxTable(); }));
	}
	function syncPaxState(){ const rows=$$('#paxWrap .row'); paxState=rows.map(r=>({ name:r.querySelector('.pax-name').value, passport:r.querySelector('.pax-passport').value, exp:r.querySelector('.pax-exp').value, phone:r.querySelector('.pax-phone').value })); }
	function savePax(){ try{ localStorage.setItem('paxState', JSON.stringify(paxState)); }catch(_){} }
	function drawPaxTable(){ const tb=$('#paxTable tbody'); tb.innerHTML=paxState.map(p=>`<tr><td>${p.name||''}</td><td>${p.passport||''}</td><td>${p.exp||''}</td><td>${p.phone||''}</td></tr>`).join(''); }
	renderPaxForm(); drawPaxTable();
	if($('#addPax')) $('#addPax').addEventListener('click',()=>{ paxState.push({name:'',passport:'',exp:'',phone:''}); savePax(); renderPaxForm(); drawPaxTable(); });

	// ===== Handling block
	let handState = JSON.parse(localStorage.getItem('handState')||'null') || [
		{airport:'', handling:'', address:'', phone:'', email:''},
		{airport:'', handling:'', address:'', phone:'', email:''}
	];
	function handRowTemplate(i,v){return `<div class="row" data-i="${i}">
			<div><label>Aeroporto<input class="hand-airport" value="${v.airport||''}"></label></div>
			<div><label>Handling<input class="hand-handling" value="${v.handling||''}"></label></div>
			<div><label>Endereço<input class="hand-address" value="${v.address||''}"></label></div>
			<div><label>Telefone<input class="hand-phone" value="${v.phone||''}"></label></div>
			<div><label>E-mail<input class="hand-email" value="${v.email||''}"></label></div>
			<div style="grid-column:1 / -1"><button type="button" class="btn remove-hand">Remover</button></div>
		</div>`}
	function renderHandForm(){ const wrap=$('#handWrap'); if(!wrap) return; wrap.innerHTML=''; handState.forEach((h,i)=>wrap.insertAdjacentHTML('beforeend',handRowTemplate(i,h)));
		wrap.querySelectorAll('.remove-hand').forEach((b,idx)=> b.addEventListener('click',()=>{ handState.splice(idx,1); saveHand(); renderHandForm(); drawHandTable(); }));
		wrap.querySelectorAll('input').forEach(inp=> inp.addEventListener('input',()=>{ syncHandState(); saveHand(); drawHandTable(); }));
	}
	function syncHandState(){ const rows=$$('#handWrap .row'); handState=rows.map(r=>({ airport:r.querySelector('.hand-airport').value, handling:r.querySelector('.hand-handling').value, address:r.querySelector('.hand-address').value, phone:r.querySelector('.hand-phone').value, email:r.querySelector('.hand-email').value })); }
	function saveHand(){ try{ localStorage.setItem('handState', JSON.stringify(handState)); }catch(_){} }
	function drawHandTable(){ const tb=$('#handTable tbody'); tb.innerHTML=handState.map(h=>`<tr><td>${h.airport||''}</td><td>${h.handling||''}</td><td>${h.address||''}</td><td>${h.phone||''}</td><td>${h.email||''}</td></tr>`).join(''); }
	renderHandForm(); drawHandTable();
	if($('#addHand')) $('#addHand').addEventListener('click',()=>{ handState.push({airport:'',handling:'',address:'',phone:'',email:''}); saveHand(); renderHandForm(); drawHandTable(); });

	// ===== Weather (Open-Meteo)
	const weatherCodes={0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Drizzle light',53:'Drizzle moderate',55:'Drizzle dense',56:'Freezing drizzle light',57:'Freezing drizzle dense',61:'Rain slight',63:'Rain moderate',65:'Rain heavy',66:'Freezing rain light',67:'Freezing rain heavy',71:'Snow fall slight',73:'Snow fall moderate',75:'Snow fall heavy',77:'Snow grains',80:'Rain showers slight',81:'Rain showers moderate',82:'Rain showers violent',85:'Snow showers slight',86:'Snow showers heavy',95:'Thunderstorm',96:'Thunderstorm w/ slight hail',99:'Thunderstorm w/ heavy hail'};
	function parseCityFromToName(){ const raw=$('#toName').value.trim(); if(!raw) return $('#toIcao').value.trim(); const parts=raw.split(',').map(s=>s.trim()).filter(Boolean); return parts[parts.length-1]||raw; }
	function ymd(){ return $('#date').value || ''; }
	function fmtC(v){ return `${Math.round(v)}°C`; }
	function setWxStatus(t){ const s=$('#wxStatus'); if(s) s.textContent=t; }
	async function geocodeCity(name){ const url=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`; const r=await fetch(url,{headers:{'Accept':'application/json'}}); if(!r.ok) throw new Error('geocoding'); const j=await r.json(); if(!j.length) throw new Error('not found'); const g=j[0]; return {lat:parseFloat(g.lat), lon:parseFloat(g.lon), label:g.display_name}; }
	async function updateWeather(){ try{ setWxStatus('Buscando previsão…'); const manualLat=parseFloat($('#wxLat').value); const manualLon=parseFloat($('#wxLon').value); const city=($('#wxCity').value||parseCityFromToName()).trim(); $('#wxCity').value=city; let lat,lon,label=city; if(Number.isFinite(manualLat)&&Number.isFinite(manualLon)){ lat=manualLat; lon=manualLon; label=`${city} (${lat.toFixed(3)}, ${lon.toFixed(3)})`; } else { const g=await geocodeCity(city); lat=g.lat; lon=g.lon; label=g.label; $('#wxLat').value=lat; $('#wxLon').value=lon; }
			const date=ymd(); if(!date){ setWxStatus('Defina a data do voo.'); return; }
			const paramsDaily=new URLSearchParams({latitude:lat, longitude:lon, timezone:'auto', start_date:date, end_date:date, daily:'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,weathercode'});
			const paramsHourly=new URLSearchParams({latitude:lat, longitude:lon, timezone:'auto', start_date:date, end_date:date, hourly:'temperature_2m,precipitation_probability,windspeed_10m,weathercode'});
			const [dRes,hRes]=await Promise.all([fetch('https://api.open-meteo.com/v1/forecast?'+paramsDaily.toString()), fetch('https://api.open-meteo.com/v1/forecast?'+paramsHourly.toString())]);
			if(!dRes.ok||!hRes.ok) throw new Error('forecast');
			const daily=await dRes.json(); const hourly=await hRes.json();
			const d=daily.daily; const code=d.weathercode?.[0];
			const summary=[ weatherCodes[code]||`Code ${code}`, `Min/Max: ${fmtC(d.temperature_2m_min[0])} / ${fmtC(d.temperature_2m_max[0])}`, `Wind max: ${Math.round(d.windspeed_10m_max[0])} km/h (gusts ${Math.round(d.windgusts_10m_max[0])} km/h)`, `Precip: ${Math.round(d.precipitation_probability_max[0]||0)}%` + (d.precipitation_sum?` • ${d.precipitation_sum[0]} mm`:'') ].join(' • ');
			let arrText='—'; const arr=$('#arriveLT').value; if(arr){ const times=hourly.hourly.time; const idx=times.findIndex(t=>t.startsWith(date+'T'+arr)); const pick=idx>=0?idx:times.findIndex(t=>t.startsWith(date+'T'+arr.slice(0,2))); if(pick>=0){ const t=times[pick].slice(11,16); const tt=hourly.hourly.temperature_2m[pick]; const pp=hourly.hourly.precipitation_probability[pick]; const ww=hourly.hourly.windspeed_10m[pick]; const wc=hourly.hourly.weathercode[pick]; arrText=`${t} local • ${weatherCodes[wc]||'—'} • ${fmtC(tt)} • Wind ${Math.round(ww)} km/h • Precip ${pp}%`; } }
			$('#outWxLoc').textContent=label; $('#outWxDate').textContent=new Date(date+'T00:00:00').toLocaleDateString(); $('#outWxSummary').textContent=summary; $('#outWxArrival').textContent=arrText; setWxStatus('Previsão atualizada.');
		}catch(e){ console.error(e); setWxStatus('Não foi possível obter a previsão. Preencha cidade/lat/lon e tente novamente.'); }
	}
	['#toName','#toIcao','#date','#arriveLT','#wxCity','#wxLat','#wxLon'].forEach(sel=>{ const el=$(sel); if(!el) return; el.addEventListener('change',()=>{ if(sel!=='#wxCity'&&sel!=='#wxLat'&&sel!=='#wxLon'){ const wxc=$('#wxCity'); if(wxc) wxc.value=parseCityFromToName(); } updateWeather(); }); });
	if($('#wxUpdate')) $('#wxUpdate').addEventListener('click',updateWeather);
	{ const wxc=$('#wxCity'); if(wxc) wxc.value=parseCityFromToName(); }

	// ===== Route Map (Leaflet + Nominatim)
	let map, fromMarker, toMarker, routeLine;
	function ensureMap(){
		if(map) return;
		const el = $('#routeMap'); if(!el) return;
		map = L.map(el, { zoomControl:true, attributionControl:true });
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 17,
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);
		// Default view
		map.setView([30,-20], 2);
	}

	async function geocodeIcaoOrName(icao, nameHint){
		const q = (icao||'').trim().toUpperCase();
		const query = q ? `${q} airport` : (nameHint||'').trim();
		if(!query) return null;
		const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
		const r = await fetch(url,{headers:{'Accept':'application/json'}});
		if(!r.ok) return null;
		const j = await r.json();
		if(!j || !j.length) return null;
		const g = j[0];
		return { lat: parseFloat(g.lat), lon: parseFloat(g.lon), label: g.display_name };
	}

	function setRouteHint(msg){ $('#routeHint').textContent = msg||''; }

	async function updateRoute(){
		const fromIcao = $('#fromIcao').value.trim().toUpperCase();
		const toIcao   = $('#toIcao').value.trim().toUpperCase();
		const fromName = $('#fromName').value.trim();
		const toName   = $('#toName').value.trim();

		ensureMap();

		if(!fromIcao || !toIcao){
			setRouteHint('Preencha os campos “De (ICAO)” e “Para (ICAO)” para visualizar a rota.');
			return;
		}

		setRouteHint('Localizando aeroportos…');
		try{
			const [A,B] = await Promise.all([
				geocodeIcaoOrName(fromIcao, fromName),
				geocodeIcaoOrName(toIcao, toName)
			]);

			if(!A || !B){
				setRouteHint('Não foi possível localizar um dos aeroportos. Verifique ICAO e nomes.');
				return;
			}

			// Limpa camadas antigas
			if(fromMarker) map.removeLayer(fromMarker);
			if(toMarker) map.removeLayer(toMarker);
			if(routeLine) map.removeLayer(routeLine);

			fromMarker = L.marker([A.lat, A.lon], {title: fromIcao}).addTo(map).bindPopup(`<b>${fromIcao}</b><br>${A.label}`);
			toMarker   = L.marker([B.lat, B.lon], {title: toIcao}).addTo(map).bindPopup(`<b>${toIcao}</b><br>${B.label}`);

			routeLine = L.polyline([[A.lat, A.lon],[B.lat, B.lon]], {weight:3}).addTo(map);

			const bounds = L.latLngBounds([[A.lat, A.lon],[B.lat, B.lon]]).pad(0.2);
			map.fitBounds(bounds);
			setRouteHint('');
			// Garante render correto após fit
			setTimeout(()=> map.invalidateSize(), 50);
		}catch(e){
			console.error(e);
			setRouteHint('Falha ao traçar a rota.');
		}
	}

	// Atualiza a rota quando ICAO/Nomes mudarem
	['#fromIcao','#toIcao','#fromName','#toName'].forEach(sel=>{ const el = $(sel); if(el) el.addEventListener('change', updateRoute); });

	// ===== Persist basic fields
	const persistIds=['slogan','company','date','departLT','fromIcao','fromName','toIcao','toName','pax','flightTime','arriveLT','flightNo','acType','acReg','acRest','wxCity','wxLat','wxLon'];
	persistIds.forEach(id=>{ const el=$("#"+id); if(!el) return; const key='fld:'+id; const stored=localStorage.getItem(key); if(stored!==null) el.value=stored; el.dispatchEvent(new Event('input')); el.addEventListener('input',()=>localStorage.setItem(key,el.value)); });
	// Chama uma vez ao carregar caso já tenha dados salvos:
	updateRoute();

	// ===== Buttons
	if($('#printBtn')) $('#printBtn').addEventListener('click',()=> {
		if(map){ setTimeout(()=>{ map.invalidateSize(); window.print(); }, 50); }
		else { window.print(); }
	});
	if($('#resetBtn')) $('#resetBtn').addEventListener('click',()=>{ if(!confirm('Limpar tudo e recarregar valores padrão?')) return; localStorage.clear(); location.reload(); });

	// Observações gerais -> saída
	const generalNotes = $('#generalNotes');
	const outGeneralNotes = $('#outGeneralNotes');
	if (generalNotes && outGeneralNotes) {
	  const sync = ()=>{ outGeneralNotes.textContent = generalNotes.value || '—'; };
	  generalNotes.addEventListener('input', sync);
	  sync();
	}
})();
