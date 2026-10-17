/* Connect Edu PR v8: fluxos locais mais completos.
   Persistência via localStorage; não substitui API/autenticação de produção. */
(() => {
  'use strict';
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const prettyDate = value => { if (!value) return 'Sem prazo'; const d = new Date(`${value}T12:00:00`); return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('pt-BR'); };
  let taskFilter = 'all';

  // Perfis profissionais não podem ser abertos pela navegação comum do aluno.
  const originalShowPage = window.showPage;
  window.showPage = function(pageId, button) {
    const page = document.getElementById(pageId);
    if (page?.classList.contains('role-page')) {
      const roleNeeded = page.classList.contains('role-professor') ? 'professor' : page.classList.contains('role-pedagogo') ? 'pedagogo' : page.classList.contains('role-responsavel') ? 'responsavel' : page.classList.contains('role-admin') ? 'admin' : '';
      if (roleNeeded && currentRole !== roleNeeded && currentRole !== 'admin') {
        if (typeof window.openModal === 'function') window.openModal('Acesso restrito', 'Esta área é exclusiva do perfil autorizado. Entre com o perfil correspondente para continuar.');
        return;
      }
    }
    originalShowPage(pageId, button);
    const navArea = ({inicio:'inicio', 'hub-escola':'hub-escola', atividades:'hub-escola', plataformas:'hub-escola', calendario:'hub-escola', escola:'hub-escola', docente:'hub-escola', pedagogico:'hub-escola', familia:'hub-escola', 'hub-treinar':'hub-treinar', banco:'hub-treinar', disciplinas:'hub-treinar', habilidades:'hub-treinar', biblioteca:'hub-treinar', ia:'hub-treinar', 'hub-score':'hub-score', pet:'hub-score', conquistas:'hub-score', 'hub-desempenho':'hub-desempenho', progresso:'hub-desempenho', ranking:'hub-desempenho'}[pageId]);
    if (navArea) document.querySelectorAll('.menu button').forEach(b => b.classList.toggle('active', (b.getAttribute('onclick') || '').includes("showPage('" + navArea + "'")));
    if (pageId === 'hub-score') renderScoreSummary();
    if (pageId === 'hub-desempenho') renderPerformanceSummary();
    if (pageId === 'ranking') renderClassRanking();
    if (pageId === 'escola') { localStorage.setItem('connectEduVisitedSchool','1'); renderAchievementsV8(); }
    if (pageId === 'calendario') renderCalendarV8();
    if (pageId === 'progresso') renderProgressV8();
    if (pageId === 'pedagogico') renderPedActionsV8();
    if (pageId === 'docente') renderAssignmentsV8();
    if (pageId === 'familia' && typeof window.renderFamily === 'function') window.renderFamily();
  };

  // Atividades: criação, conclusão e exclusão com persistência local.
  const originalFilterTasks = window.filterTasks;
  window.filterTasks = function(filter, button) {
    taskFilter = filter;
    document.querySelectorAll('.filters .filter').forEach(b => b.classList.toggle('active', b === button));
    renderTasksV8(filter);
  };
  window.toggleTaskForm = function(show) {
    const form = document.getElementById('taskCreateForm'); if (!form) return;
    form.hidden = show === undefined ? !form.hidden : !show;
    if (!form.hidden) document.getElementById('newTaskTitle')?.focus();
  };
  window.createTask = function() {
    const title = document.getElementById('newTaskTitle')?.value.trim();
    if (!title) { alert('Informe o título da atividade.'); return; }
    const deadline = document.getElementById('newTaskDeadline')?.value || '';
    const task = { id: Date.now(), title, subject: document.getElementById('newTaskSubject').value, platform: document.getElementById('newTaskPlatform').value.trim() || 'Atividade pessoal', icon: '', deadline: prettyDate(deadline), deadlineISO: deadline, completed: false, createdAt: new Date().toISOString() };
    tasks.unshift(task); write('schoolTasks', tasks);
    ['newTaskTitle','newTaskDeadline','newTaskPlatform'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    window.toggleTaskForm(false); taskFilter='all';
    document.querySelectorAll('.filters .filter').forEach((b,i)=>b.classList.toggle('active',i===0));
    renderTasksV8(); renderDashboardV8(); renderProgressV8();
    if (typeof window.updatePendingCount==='function') window.updatePendingCount();
    if (typeof window.renderRoleSummaries==='function') window.renderRoleSummaries();
  };
  window.deleteTask = function(id) {
    if (!confirm('Excluir esta atividade? Esta ação não pode ser desfeita.')) return;
    tasks = tasks.filter(t => String(t.id) !== String(id)); write('schoolTasks', tasks);
    renderTasksV8(taskFilter); renderDashboardV8(); renderProgressV8();
    if (typeof window.updatePendingCount==='function') window.updatePendingCount();
    if (typeof window.renderRoleSummaries==='function') window.renderRoleSummaries();
  };
  const originalToggleTask = window.toggleTask;
  window.toggleTask = function(id) {
    originalToggleTask(id);
    const completedTask = tasks.find(t => String(t.id) === String(id));
    if (completedTask?.completed) { const days=read('connectEduStudyDays',[]); const day=todayISO(); if(!days.includes(day)){days.push(day);write('connectEduStudyDays',days);} }
    renderTasksV8(taskFilter); renderDashboardV8(); renderProgressV8();
    if (typeof window.renderRoleSummaries==='function') window.renderRoleSummaries();
  };
  function renderTasksV8(filter = taskFilter) {
    const container=document.getElementById('taskList'); if(!container || !Array.isArray(tasks)) return;
    taskFilter=filter;
    const list=tasks.filter(t=>filter==='pending'?!t.completed:filter==='completed'?t.completed:true);
    container.innerHTML=list.length?list.map(t=>`<article class="task ${t.completed?'completed':''}"><div class="task-left"><button class="task-checkbox" type="button" aria-label="${t.completed?'Marcar como pendente':'Marcar como concluída'}" onclick="toggleTask(${JSON.stringify(t.id)})">${t.completed?'':''}</button><div><h3>${'<svg class="visual-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 10h8M8 14h8M8 18h5"/></svg>'} ${esc(t.title)}</h3><p style="color:var(--muted);font-size:12px;margin-top:5px">${esc(t.subject)} · ${esc(t.platform||'Atividade')}</p><p style="color:var(--muted);font-size:12px;margin-top:3px">Prazo: ${esc(t.deadline||'Sem prazo')}</p></div></div><div style="display:flex;align-items:center;gap:10px"><span class="task-status">${t.completed?'Concluída':'Pendente'}</span><button class="btn btn-secondary" type="button" onclick="deleteTask(${JSON.stringify(t.id)})" aria-label="Excluir ${esc(t.title)}">Excluir</button></div></article>`).join(''):'<div class="empty-state"> Nenhuma atividade nesta lista. Use “Nova atividade” para criar uma.</div>';
  }
  function renderDashboardV8() {
    const c=document.getElementById('dashboardActivities'); if(!c) return;
    const pending=tasks.filter(t=>!t.completed).slice(0,4);
    c.innerHTML=pending.length?pending.map(t=>`<div class="activity"><div class="activity-left"><span class="activity-icon">${'<svg class="visual-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 10h8M8 14h8M8 18h5"/></svg>'}</span><div><strong>${esc(t.title)}</strong><p>${esc(t.subject)} · Prazo: ${esc(t.deadline||'Sem prazo')}</p></div></div><button class="btn btn-secondary" onclick="showPage('atividades')">Abrir</button></div>`).join(''):'<div class="empty-state">Todas as atividades estão concluídas. Que tal criar uma nova meta?</div>';
  }

  window.renderTasks = renderTasksV8;
  window.renderDashboard = renderDashboardV8;

  // Calendário: eventos criados pelo usuário são exibidos no mês e podem ser removidos.
  window.toggleCalendarEditor = function(show) {
    const form=document.getElementById('calendarEditor'); if(!form)return;
    form.hidden=show===undefined?!form.hidden:!show;
    const date=document.getElementById('eventDate'); if(!form.hidden && date && !date.value) date.value=todayISO();
  };
  window.saveCalendarEvent = function() {
    const date=document.getElementById('eventDate').value, title=document.getElementById('eventTitle').value.trim();
    if(!date||!title){alert('Informe a data e o título do evento.');return;}
    const items=read('connectEduCalendarEvents',[]);
    items.push({id:Date.now(),date,title,type:document.getElementById('eventType').value,description:document.getElementById('eventDescription').value.trim(),createdAt:new Date().toISOString()});
    items.sort((a,b)=>a.date.localeCompare(b.date)); write('connectEduCalendarEvents',items);
    document.getElementById('eventTitle').value='';document.getElementById('eventDescription').value='';window.toggleCalendarEditor(false);
    const target=new Date(`${date}T12:00:00`); if(currentDate){currentDate.setFullYear(target.getFullYear(),target.getMonth(),1);}
    renderCalendarV8();
  };
  window.deleteCalendarEvent = function(id) { if(!confirm('Remover este evento do calendário?'))return; write('connectEduCalendarEvents',read('connectEduCalendarEvents',[]).filter(e=>String(e.id)!==String(id)));renderCalendarV8(); };
  function allCalendarEvents() {
    const base=events||{}; const saved=read('connectEduCalendarEvents',[]); const map={};
    Object.entries(base).forEach(([date,values])=>map[date]=(Array.isArray(values)?values:[]).map((v,i)=>({id:`base-${date}-${i}`,date,title:String(v),type:'Evento escolar',description:'Evento pré-carregado para demonstração',base:true})));
    saved.forEach(e=>(map[e.date] ||= []).push(e)); return map;
  }
  function renderCalendarV8() {
    const title=document.getElementById('monthTitle'), container=document.getElementById('calendarDays'); if(!title||!container||!currentDate)return;
    const current=currentDate, year=current.getFullYear(), month=current.getMonth();
    title.textContent=new Date(year,month,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).replace(/^./,x=>x.toUpperCase());
    const firstDay=new Date(year,month,1).getDay(), total=new Date(year,month+1,0).getDate(), today=todayISO(), all=allCalendarEvents();
    container.innerHTML='';
    for(let i=0;i<firstDay;i++){const blank=document.createElement('div');blank.className='day';blank.setAttribute('aria-hidden','true');container.appendChild(blank);}
    for(let day=1;day<=total;day++){
      const date=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`, cell=document.createElement('div'); cell.className='day'; if(date===today)cell.classList.add('today');
      const entries=all[date]||[]; cell.innerHTML=`<div class="day-number">${day}</div>`+entries.slice(0,2).map(e=>`<div class="event" title="${esc(e.title)}">${esc(e.title)}</div>`).join('')+(entries.length>2?`<small>+${entries.length-2} eventos</small>`:'');
      cell.tabIndex=0;cell.setAttribute('role','button');cell.setAttribute('aria-label',`${day} de ${current.toLocaleDateString('pt-BR',{month:'long'})}, ${entries.length} eventos`);
      const open=()=>{const description=entries.length?entries.map(e=>`<strong>${esc(e.type||'Evento')} — ${esc(e.title)}</strong>${e.description?`<p>${esc(e.description)}</p>`:''}`).join('<hr style="margin:10px 0;border:0;border-top:1px solid var(--border)">'):'Nenhum evento registrado para este dia. Você pode adicionar um usando o botão acima.';window.openModal(`Agenda — ${prettyDate(date)}`,description);};
      cell.addEventListener('click',open);cell.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});container.appendChild(cell);
    }
    const list=document.getElementById('customEventList'); if(list){const items=read('connectEduCalendarEvents',[]).filter(e=>e.date.slice(0,7)===`${year}-${String(month+1).padStart(2,'0')}`).sort((a,b)=>a.date.localeCompare(b.date));list.innerHTML=items.length?`<h3>Seus eventos neste mês</h3>`+items.map(e=>`<article class="event-row"><div><strong>${esc(e.title)}</strong><p>${prettyDate(e.date)} · ${esc(e.type)}${e.description?' — '+esc(e.description):''}</p></div><button class="btn btn-secondary" onclick="deleteCalendarEvent(${JSON.stringify(e.id)})">Remover</button></article>`).join(''):'<p class="muted">Nenhum evento personalizado neste mês.</p>';}
  }
  const originalChangeMonth=window.changeMonth; window.changeMonth=function(value){originalChangeMonth(value);renderCalendarV8();};
  const originalGoToday=window.goToday; window.goToday=function(){originalGoToday();renderCalendarV8();};
  window.renderCalendar = renderCalendarV8;

  // Plano de estudos e indicadores calculados a partir das atividades existentes.
  window.toggleStudyPlan=function(show){const f=document.getElementById('studyPlanForm');if(!f)return;f.hidden=show===undefined?!f.hidden:!show;};
  window.saveStudyPlan=function(){const goal=document.getElementById('studyGoal').value.trim();if(!goal){alert('Informe o objetivo do plano.');return;}const plans=read('connectEduStudyPlans',[]);plans.unshift({id:Date.now(),goal,subject:document.getElementById('studySubject').value,minutes:Number(document.getElementById('studyMinutes').value)||25,reviewDate:document.getElementById('studyReviewDate').value,steps:document.getElementById('studySteps').value.trim(),createdAt:new Date().toISOString()});write('connectEduStudyPlans',plans);['studyGoal','studyReviewDate','studySteps'].forEach(id=>document.getElementById(id).value='');window.toggleStudyPlan(false);renderStudyPlansV8();};
  window.deleteStudyPlan=function(id){if(!confirm('Excluir este plano de estudos?'))return;write('connectEduStudyPlans',read('connectEduStudyPlans',[]).filter(p=>String(p.id)!==String(id)));renderStudyPlansV8();};
  function renderStudyPlansV8(){const c=document.getElementById('studyPlanList');if(!c)return;const plans=read('connectEduStudyPlans',[]);c.innerHTML=plans.length?'<h3>Planos salvos</h3>'+plans.map(p=>`<article class="study-plan-row"><div><strong>${esc(p.goal)}</strong><p>${esc(p.subject)} · ${p.minutes} min/dia · Revisão: ${prettyDate(p.reviewDate)}</p><p>${esc(p.steps||'Defina pequenos passos para cumprir esta meta.')}</p></div><button class="btn btn-secondary" onclick="deleteStudyPlan(${JSON.stringify(p.id)})">Excluir</button></article>`).join(''):'<p class="muted">Você ainda não salvou um plano de estudos.</p>';}
  function renderProgressV8(){
    const grid=document.getElementById('progressDetailGrid');if(!grid)return;
    const subjects=[...new Set(tasks.map(t=>t.subject).filter(Boolean))];
    if(!subjects.length){grid.innerHTML='<div class="empty-state">Crie atividades para começar a acompanhar seu progresso.</div>';return;}
    grid.innerHTML=subjects.map(subject=>{const all=tasks.filter(t=>t.subject===subject),done=all.filter(t=>t.completed).length,pct=Math.round(done/all.length*100);return `<article class="progress-subject"><strong>${esc(subject)}</strong><div class="progress-top"><span>${done} de ${all.length} concluídas</span><strong>${pct}%</strong></div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><small>${all.length-done?`${all.length-done} atividade(s) pendente(s)`:'Tudo concluído nesta disciplina!'}</small></article>`;}).join('');
    renderStudyPlansV8();
  }
  const originalSaveProfile=window.saveProfile;window.saveProfile=function(){originalSaveProfile();const n=document.getElementById('nameInput')?.value.trim();if(n){localStorage.setItem('connectEduProfileUpdatedAt',new Date().toISOString());const label=document.getElementById('profileSavedStatus');if(label)label.textContent='Perfil salvo neste navegador.';}};

  // Professor: prazos, status de acompanhamento e exclusão de atividades atribuídas.
  window.saveAssignment=function(){
    if(currentRole!=='professor'&&currentRole!=='admin'){alert('Somente o perfil de professor pode atribuir atividades.');return;}
    const title=document.getElementById('assignmentTitle').value.trim();if(!title){alert('Informe um título para a atividade.');return;}
    const dueDate=document.getElementById('assignmentDueDate')?.value||'';
    localAssignments.unshift({id:Date.now(),title,subject:document.getElementById('assignmentSubject').value,klass:document.getElementById('assignmentClass').value,instructions:document.getElementById('assignmentInstructions').value.trim(),dueDate,date:new Date().toLocaleDateString('pt-BR'),status:'Publicada'});
    write('connectEduAssignments',localAssignments);renderAssignmentsV8();window.closeAssignmentForm();['assignmentTitle','assignmentInstructions','assignmentDueDate'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  };
  window.updateAssignmentStatus=function(id,status){localAssignments=localAssignments.map(a=>String(a.id)===String(id)?{...a,status}:a);write('connectEduAssignments',localAssignments);renderAssignmentsV8();};
  window.deleteAssignment=function(id){if(currentRole!=='professor'&&currentRole!=='admin')return;if(!confirm('Excluir esta atividade atribuída?'))return;localAssignments=localAssignments.filter(a=>String(a.id)!==String(id));write('connectEduAssignments',localAssignments);renderAssignmentsV8();};
  function renderAssignmentsV8(){const list=document.getElementById('assignmentList');if(!list)return;const assignments=localAssignments||[];const b=document.getElementById('teacherBankCount'),a=document.getElementById('teacherAssignments'),s=document.getElementById('teacherSkillsCount');if(b)b.textContent=(bankCatalog||[]).length;if(a)a.textContent=assignments.length;if(s)s.textContent=(skillCatalog||[]).length;list.innerHTML=assignments.length?assignments.map(x=>`<article class="assignment-item"><div><strong>${esc(x.title)}</strong><p>${esc(x.subject)} · ${esc(x.klass)} · Criada em ${esc(x.date)} · Entrega: ${prettyDate(x.dueDate)}</p><p>${esc(x.instructions||'Sem instruções adicionais.')}</p></div><div style="display:grid;gap:8px"><select class="status-select" aria-label="Status da atividade" onchange="updateAssignmentStatus(${JSON.stringify(x.id)},this.value)">${['Publicada','Em andamento','Concluída','Arquivada'].map(v=>`<option ${x.status===v?'selected':''}>${v}</option>`).join('')}</select><button class="btn btn-secondary" onclick="deleteAssignment(${JSON.stringify(x.id)})">Excluir</button></div></article>`).join(''):'<div class="empty-state">Nenhuma atividade criada. Use “Criar atividade” para atribuir uma à turma.</div>';}
  const originalRenderAssignments=window.renderAssignments;window.renderAssignments=renderAssignmentsV8;

  // Pedagogo: encaminhamentos persistentes no navegador.
  window.togglePedActionForm=function(show){if(currentRole!=='pedagogo'&&currentRole!=='admin'){alert('Área exclusiva da equipe pedagógica.');return;}const f=document.getElementById('pedActionForm');if(f)f.hidden=show===undefined?!f.hidden:!show;};
  window.savePedAction=function(){if(currentRole!=='pedagogo'&&currentRole!=='admin'){alert('Acesso não autorizado.');return;}const focus=document.getElementById('pedActionFocus').value.trim(),action=document.getElementById('pedActionText').value.trim();if(!focus||!action){alert('Informe o foco e a ação combinada.');return;}const items=read('connectEduPedActions',[]);items.unshift({id:Date.now(),focus,owner:document.getElementById('pedActionOwner').value.trim(),date:document.getElementById('pedActionDate').value,action,createdAt:new Date().toISOString()});write('connectEduPedActions',items);['pedActionFocus','pedActionOwner','pedActionDate','pedActionText'].forEach(id=>document.getElementById(id).value='');window.togglePedActionForm(false);renderPedActionsV8();};
  window.deletePedAction=function(id){if(currentRole!=='pedagogo'&&currentRole!=='admin')return;if(!confirm('Remover este encaminhamento?'))return;write('connectEduPedActions',read('connectEduPedActions',[]).filter(x=>String(x.id)!==String(id)));renderPedActionsV8();};
  function renderPedActionsV8(){const c=document.getElementById('pedActionList');if(!c)return;const items=read('connectEduPedActions',[]);c.innerHTML=items.length?items.map(x=>`<article class="assignment-item"><div><strong>${esc(x.focus)}</strong><p>${esc(x.owner||'Responsável não informado')} · Retorno: ${prettyDate(x.date)}</p><p>${esc(x.action)}</p></div><button class="btn btn-secondary" onclick="deletePedAction(${JSON.stringify(x.id)})">Remover</button></article>`).join(''):'<div class="empty-state">Nenhum encaminhamento registrado neste navegador.</div>';}

  function renderAchievementsV8() {
    const days=read('connectEduStudyDays',[]), done=tasks.filter(t=>t.completed), reading=done.filter(t=>/leitura|livro|portugu[eê]s|redação/i.test(`${t.title} ${t.subject}`)).length;
    const quizCount=Object.values(typeof quizAttempts!=='undefined'?quizAttempts:{}).reduce((a,b)=>a+Number(b||0),0);
    const states={
      streak:{unlocked:days.length>=7,progress:`${Math.min(days.length,7)}/7 dias de estudo registrados`},
      reader:{unlocked:reading>=5,progress:`${Math.min(reading,5)}/5 atividades de leitura/linguagens concluídas`},
      performance:{unlocked:false,progress:'Conclua quizzes avaliativos para construir este indicador'},
      first:{unlocked:done.length>=1,progress:`${done.length} atividade(s) concluída(s)`},
      assistant:{unlocked:localStorage.getItem('connectEduUsedAssistant')==='1',progress:localStorage.getItem('connectEduUsedAssistant')==='1'?'Assistente utilizado':'Envie uma pergunta ao assistente'},
      school:{unlocked:localStorage.getItem('connectEduVisitedSchool')==='1',progress:localStorage.getItem('connectEduVisitedSchool')==='1'?'Área da escola visitada':'Explore a área Minha escola'}
    };
    document.querySelectorAll('[data-achievement]').forEach(card=>{const state=states[card.dataset.achievement];if(!state)return;card.classList.toggle('achievement-unlocked',state.unlocked);let status=card.querySelector('.achievement-status');if(!status){status=document.createElement('p');status.className='achievement-status';card.appendChild(status);}status.textContent=state.unlocked?' Conquistada':state.progress;});
  }
  const originalSendMessageV8=window.sendMessage;
  window.sendMessage=function(){localStorage.setItem('connectEduUsedAssistant','1');originalSendMessageV8();renderAchievementsV8();};


  // Painéis agregadores: as áreas internas continuam acessíveis por cartões.
  function renderScoreSummary(){
    const done=tasks.filter(t=>t.completed).length, coins=Number(localStorage.getItem('connectEduCoins')||0), pet=read('connectEduPet',{level:1,xp:0,name:'Pipoca'});
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
    set('scoreCoins',coins);set('scorePetLevel',pet.level||1);set('scoreCompleted',done);
  }
  function renderPerformanceSummary(){
    const done=tasks.filter(t=>t.completed).length,coins=Number(localStorage.getItem('connectEduCoins')||0),pet=read('connectEduPet',{level:1});
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
    set('performanceCompleted',done);set('performanceCoins',coins);set('performancePet',`Nível ${pet.level||1}`);
  }
  window.renderClassRanking=function(){
    const target=document.getElementById('classRankingList');if(!target)return;
    const studentName=localStorage.getItem('studentName')||'Você';
    const petStateNow=read('connectEduPet',{level:1,cap:false,aura:false});
    const current={name:studentName,coins:Number(localStorage.getItem('connectEduCoins')||0),pet:Number(petStateNow.level||1),cap:!!petStateNow.cap,aura:!!petStateNow.aura,isCurrent:true};
    const peers=[{name:'Ana Clara',coins:185,pet:4,cap:true,aura:true},{name:'Lucas Henrique',coins:160,pet:3,cap:true,aura:false},{name:'Sofia Martins',coins:140,pet:4,cap:true,aura:false},{name:'Miguel Santos',coins:115,pet:2,cap:false,aura:false},{name:'Beatriz Lima',coins:90,pet:3,cap:true,aura:true},{name:'Gabriel Alves',coins:75,pet:2,cap:true,aura:false}];
    const petScore=item=>item.pet*10+(item.cap?5:0)+(item.aura?5:0);
    const all=[...peers,current],sort=document.getElementById('rankingSort')?.value||'coins';
    all.sort((a,b)=>sort==='pet'?(petScore(b)-petScore(a)||b.coins-a.coins):(b.coins-a.coins||petScore(b)-petScore(a)));
    const safe=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    target.innerHTML=all.map((item,index)=>`<article class="ranking-row ${item.isCurrent?'current':''}"><div class="ranking-position">${index===0?'':index===1?'':index===2?'':index+1}</div><div class="ranking-person"><strong>${safe(item.name)} ${item.isCurrent?'(você)':''}</strong><small>Pet nível ${item.pet} · ${Number(!!item.cap)+Number(!!item.aura)}/2 acessórios</small></div><div class="ranking-metric"> ${item.coins} pontos</div><div class="ranking-metric"> ${petScore(item)} pts de pet</div></article>`).join('')+'<p class="ranking-note">Os nomes e valores dos colegas são fictícios e servem apenas para demonstrar o ranking. Uma turma real exige dados compartilhados no servidor e autorização da escola.</p>';
  };

  // Preferências de acessibilidade com persistência local.
  const setClassPref=(key,cls,enabled)=>{document.body.classList.toggle(cls,enabled);localStorage.setItem(key,enabled?'1':'0');};
  window.toggleReadableFont=function(){const on=!document.body.classList.contains('readable-font');setClassPref('connectEduReadableFont','readable-font',on);const b=document.getElementById('readFontToggle');if(b)b.textContent=on?'Desativar fonte amigável':'Ativar fonte amigável';};
  window.toggleReadingSpacing=function(){const on=!document.body.classList.contains('reading-spacing');setClassPref('connectEduReadingSpacing','reading-spacing',on);const b=document.getElementById('spacingToggle');if(b)b.textContent=on?'Desativar espaçamento':'Aumentar espaçamento';};
  window.toggleReducedMotion=function(){const on=!document.body.classList.contains('reduced-motion');setClassPref('connectEduReducedMotion','reduced-motion',on);const b=document.getElementById('motionToggle');if(b)b.textContent=on?'Movimento reduzido ativado':'Reduzir movimento';};
  window.toggleReadingGuide=function(){let band=document.getElementById('readingGuideBand');if(!band){band=document.createElement('div');band.id='readingGuideBand';band.setAttribute('aria-hidden','true');document.body.appendChild(band);}const on=!band.classList.contains('active');band.classList.toggle('active',on);localStorage.setItem('connectEduReadingGuide',on?'1':'0');const b=document.getElementById('readingGuideToggle');if(b)b.textContent=on?'Desativar guia de leitura':'Ativar guia de leitura';};
  window.readCurrentPage=function(){const status=document.getElementById('speechStatus');if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){if(status)status.textContent='Leitura em voz alta não está disponível neste navegador.';return;}window.speechSynthesis.cancel();const page=document.querySelector('.page.active');const text=(page?.innerText||'').replace(/\s+/g,' ').trim().slice(0,12000);if(!text){if(status)status.textContent='Não há conteúdo para ler.';return;}const utterance=new SpeechSynthesisUtterance(text);utterance.lang='pt-BR';utterance.rate=Number(localStorage.getItem('connectEduSpeechRate')||1);utterance.onstart=()=>{if(status)status.textContent='Lendo o conteúdo da área atual…';};utterance.onend=()=>{if(status)status.textContent='Leitura concluída.';};utterance.onerror=()=>{if(status)status.textContent='Não foi possível concluir a leitura.';};window.speechSynthesis.speak(utterance);};
  window.stopReadingPage=function(){if('speechSynthesis' in window)window.speechSynthesis.cancel();const status=document.getElementById('speechStatus');if(status)status.textContent='Leitura interrompida.';};
  function restoreAccessExtras(){
    [['connectEduReadableFont','readable-font','readFontToggle','Desativar fonte amigável','Ativar fonte amigável'],['connectEduReadingSpacing','reading-spacing','spacingToggle','Desativar espaçamento','Aumentar espaçamento'],['connectEduReducedMotion','reduced-motion','motionToggle','Movimento reduzido ativado','Reduzir movimento']].forEach(([key,cls,id,onText,offText])=>{const on=localStorage.getItem(key)==='1';document.body.classList.toggle(cls,on);const b=document.getElementById(id);if(b)b.textContent=on?onText:offText;});
    if(localStorage.getItem('connectEduReadingGuide')==='1'){let band=document.getElementById('readingGuideBand');if(!band){band=document.createElement('div');band.id='readingGuideBand';band.setAttribute('aria-hidden','true');document.body.appendChild(band);}band.classList.add('active');const b=document.getElementById('readingGuideToggle');if(b)b.textContent='Desativar guia de leitura';}
  }
  document.addEventListener('mousemove',e=>{const band=document.getElementById('readingGuideBand');if(band?.classList.contains('active'))band.style.top=Math.max(0,Math.min(window.innerHeight-54,e.clientY-27))+'px';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){window.stopReadingPage();const band=document.getElementById('readingGuideBand');if(band){band.classList.remove('active');localStorage.setItem('connectEduReadingGuide','0');}return;}if(!e.altKey)return;const map={'1':'inicio','2':'hub-escola','3':'hub-treinar','4':'hub-score','5':'hub-desempenho'};if(map[e.key]){e.preventDefault();window.showPage(map[e.key]);}});
  const resetAccessOriginal=window.resetAccessibility;
  window.resetAccessibility=function(){if(resetAccessOriginal)resetAccessOriginal();['connectEduReadableFont','connectEduReadingSpacing','connectEduReducedMotion','connectEduReadingGuide'].forEach(k=>localStorage.removeItem(k));document.body.classList.remove('readable-font','reading-spacing','reduced-motion');const band=document.getElementById('readingGuideBand');if(band)band.classList.remove('active');restoreAccessExtras();};
  restoreAccessExtras();

  // Inicialização dos módulos v9 após os scripts anteriores.
  document.addEventListener('DOMContentLoaded', () => {});
  renderTasksV8();renderDashboardV8();renderCalendarV8();renderProgressV8();renderStudyPlansV8();renderAssignmentsV8();renderPedActionsV8();renderAchievementsV8();renderScoreSummary();renderPerformanceSummary();
})();
