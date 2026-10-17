

/* ================= DADOS ================= */

let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [

    {
        id:1,
        title:"Equações do 1º grau",
        subject:"Matemática",
        platform:"Khan Academy",
        icon:"",
        deadline:"Amanhã",
        completed:false
    },

    {
        id:2,
        title:"Redação: Meio ambiente",
        subject:"Português",
        platform:"Redação Paraná",
        icon:"",
        deadline:"22/08",
        completed:false
    },

    {
        id:3,
        title:"Quiz — Globalização",
        subject:"Geografia",
        platform:"Quizizz",
        icon:"",
        deadline:"24/08",
        completed:false
    },

    {
        id:4,
        title:"Revisão de Ciências",
        subject:"Ciências",
        platform:"Escola Paraná",
        icon:"",
        deadline:"26/08",
        completed:false
    },

    {
        id:5,
        title:"Leitura — Dom Casmurro",
        subject:"Português",
        platform:"Biblioteca Digital",
        icon:"",
        deadline:"28/08",
        completed:false
    }

];


/* ================= NAVEGAÇÃO ================= */

function showPage(pageId, button){

    document.querySelectorAll(".page")
        .forEach(page => page.classList.remove("active"));

    const page = document.getElementById(pageId);

    if(page){
        page.classList.add("active");
    }

    document.querySelectorAll(".menu button")
        .forEach(btn => btn.classList.remove("active"));

    if(button){
        button.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    if(window.innerWidth <= 800){
        document.getElementById("sidebar")
            .classList.remove("open");
    }
}


/* ================= MENU MOBILE ================= */

function toggleMenu(){

    document.getElementById("sidebar")
        .classList.toggle("open");

}


/* ================= ATIVIDADES ================= */

function renderTasks(filter="all"){

    const container =
        document.getElementById("taskList");

    if(!container) return;

    let filtered = tasks;

    if(filter === "pending"){
        filtered = tasks.filter(t => !t.completed);
    }

    if(filter === "completed"){
        filtered = tasks.filter(t => t.completed);
    }

    container.innerHTML = "";

    if(filtered.length === 0){

        container.innerHTML = `
            <div class="card" style="text-align:center;padding:50px;">
                <div style="font-size:50px;"></div>
                <h2>Nenhuma atividade aqui!</h2>
                <p style="color:var(--muted);margin-top:8px;">
                    Você está em dia.
                </p>
            </div>
        `;

        return;
    }

    filtered.forEach(task => {

        const element = document.createElement("div");

        element.className =
            "task " + (task.completed ? "completed" : "");

        element.innerHTML = `

            <div class="task-left">

                <div
                    class="task-checkbox"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "" : ""}
                </div>

                <div>

                    <h3>${task.icon} ${task.title}</h3>

                    <p style="color:var(--muted);font-size:12px;margin-top:5px;">
                        ${task.subject} • ${task.platform}
                    </p>

                    <p style="color:var(--muted);font-size:12px;margin-top:3px;">
                        Prazo: ${task.deadline}
                    </p>

                </div>

            </div>

            <span class="task-status">
                ${task.completed ? "Concluída" : "Pendente"}
            </span>

        `;

        container.appendChild(element);

    });

}


function toggleTask(id){

    const task = tasks.find(t => t.id === id);

    if(!task) return;

    task.completed = !task.completed;

    if(task.completed && !rewardedTasks.includes(task.id)){
        eduCoins += 10;
        if (typeof addPetXP === 'function') addPetXP(5, true);
        rewardedTasks.push(task.id);
        localStorage.setItem('connectEduRewardedTasks', JSON.stringify(rewardedTasks));
        persistCoins();
        alert('⭐ Atividade concluída! Você ganhou 10 moedas.');
    }

    localStorage.setItem(
        "schoolTasks",
        JSON.stringify(tasks)
    );

    renderPet();
    renderTasks();

    renderDashboard();

    updatePendingCount();

}


function filterTasks(filter,button){

    document.querySelectorAll(".filter")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    renderTasks(filter);

}


function updatePendingCount(){

    const pending =
        tasks.filter(t => !t.completed).length;

    document.getElementById("pendingCount")
        .textContent = pending;

}


/* ================= DASHBOARD ================= */

function renderDashboard(){

    const container =
        document.getElementById("dashboardActivities");

    if(!container) return;

    container.innerHTML = "";

    tasks
        .filter(t => !t.completed)
        .slice(0,3)
        .forEach(task => {

            container.innerHTML += `

                <div class="activity">

                    <div class="activity-left">

                        <div class="subject-icon">
                            ${task.icon}
                        </div>

                        <div>

                            <h4>${task.title}</h4>

                            <p>
                                ${task.subject} • ${task.platform}
                            </p>

                        </div>

                    </div>

                    <span class="deadline">
                        ${task.deadline}
                    </span>

                </div>

            `;

        });

}


/* ================= PLATAFORMAS ================= */

function openPlatform(name){

    openModal(
        name,
        `
        Esta é uma simulação da integração com
        <strong>${name}</strong>.

        <br><br>

        Em uma versão real, o aluno poderia
        acessar a plataforma através do Escola Conectada
        utilizando uma integração oficial ou login único.
        `
    );

}


/* ================= MODAL ================= */

function openModal(title,text){

    document.getElementById("modalTitle")
        .textContent = title;

    document.getElementById("modalText")
        .innerHTML = text;

    document.getElementById("modal")
        .classList.add("show");

}


function closeModal(){

    document.getElementById("modal")
        .classList.remove("show");

}


window.onclick = function(event){

    const modal =
        document.getElementById("modal");

    if(event.target === modal){
        closeModal();
    }

}


/* ================= CALENDÁRIO ================= */

let currentDate = new Date();


const events = {

    "2026-08-20":[
        "Atividade de Matemática"
    ],

    "2026-08-22":[
        "Entrega da redação"
    ],

    "2026-08-24":[
        "Quiz de Geografia"
    ],

    "2026-08-25":[
        "Prova de Ciências"
    ],

    "2026-08-28":[
        "Feira de Ciências"
    ]

};


function renderCalendar(){

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    document.getElementById("monthTitle")
        .textContent =
        `${monthNames[month]} ${year}`;

    const firstDay =
        new Date(year,month,1).getDay();

    const daysInMonth =
        new Date(year,month + 1,0).getDate();

    const container =
        document.getElementById("calendarDays");

    container.innerHTML = "";

    for(let i=0;i<firstDay;i++){

        const empty =
            document.createElement("div");

        empty.className = "day";

        container.appendChild(empty);

    }

    const today = new Date();

    for(let day=1;day<=daysInMonth;day++){

        const element =
            document.createElement("div");

        element.className = "day";

        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            element.classList.add("today");
        }

        const dateString =
            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        let html =
            `<div class="day-number">${day}</div>`;

        if(events[dateString]){

            events[dateString].forEach(event => {

                html += `
                    <div class="event">
                        ${event}
                    </div>
                `;

            });

        }

        element.innerHTML = html;

        element.onclick = function(){

            if(events[dateString]){

                openModal(
                    `Dia ${day}`,
                    events[dateString].join("<br><br>")
                );

            }else{

                openModal(
                    `Dia ${day}`,
                    "Nenhum evento registrado para este dia."
                );

            }

        };

        container.appendChild(element);

    }

}


function changeMonth(value){

    currentDate.setMonth(
        currentDate.getMonth() + value
    );

    renderCalendar();

}


function goToday(){

    currentDate = new Date();

    renderCalendar();

}


/* ================= IA SIMULADA ================= */

function sendMessage(){

    const input =
        document.getElementById("aiInput");

    const text =
        input.value.trim();

    if(!text) return;

    const chat =
        document.getElementById("chat");

    chat.innerHTML += `

        <div class="message user-msg">
            ${escapeHTML(text)}
        </div>

    `;

    input.value = "";

    setTimeout(() => {

        const response =
            generateAIResponse(text);

        chat.innerHTML += `

            <div class="message ai">
                ${response}
            </div>

        `;

        chat.scrollTop =
            chat.scrollHeight;

    },500);

}


function generateAIResponse(text){

    const question =
        text.toLowerCase();

    if(
        question.includes("atividade") ||
        question.includes("tarefas")
    ){

        const pending =
            tasks.filter(t => !t.completed);

        if(pending.length === 0){
            return " Você não possui atividades pendentes!";
        }

        return `
            Você possui <strong>${pending.length}</strong>
            atividades pendentes.
            <br><br>
            A mais próxima é:
            <strong>${pending[0].title}</strong>,
            com prazo para ${pending[0].deadline}.
        `;

    }

    if(
        question.includes("matemática") ||
        question.includes("matematica")
    ){

        return `
             Você está com <strong>82%</strong>
            de desempenho em Matemática.
            <br><br>
            Uma boa estratégia seria revisar
            equações e depois praticar exercícios.
        `;

    }

    if(
        question.includes("estudar") ||
        question.includes("prova")
    ){

        return `
             Posso sugerir um plano simples:
            <br><br>
            <strong>1.</strong> Revise o conteúdo.<br>
            <strong>2.</strong> Faça alguns exercícios.<br>
            <strong>3.</strong> Revise seus erros.<br>
            <strong>4.</strong> Faça um pequeno simulado.
        `;

    }

    return `
         Entendi sua pergunta!
        <br><br>
        Nesta versão de demonstração, posso ajudar
        principalmente com suas atividades,
        organização dos estudos e algumas disciplinas.
        <br><br>
        Experimente perguntar:
        <br>
        “Quais atividades eu tenho?”
        <br>
        “Como estudar para uma prova?”
        `;

}


function escapeHTML(text){

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= NOTIFICAÇÕES ================= */

function openNotifications(){

    openModal(
        " Notificações",
        `
        <strong>3 novas notificações</strong>
        <br><br>
         Nova atividade de Ciências.
        <br><br>
         Seu livro deve ser devolvido até 27/08.
        <br><br>
         A Feira de Ciências acontecerá em 28/08.
        `
    );

}


/* ================= PERFIL ================= */

function saveProfile(){

    const input =
        document.getElementById("nameInput");

    const name =
        input.value.trim();

    if(!name){

        alert("Digite seu nome.");

        return;

    }

    localStorage.setItem(
        "studentName",
        name
    );

    updateProfile();

    alert("Perfil atualizado!");

}


function updateProfile(){

    const saved =
        localStorage.getItem("studentName");

    if(!saved) return;

    document.getElementById("topName")
        .textContent = saved;

    document.getElementById("profileName")
        .textContent = saved;

    document.getElementById("nameInput")
        .value = saved;

}


/* ================= MODO ESCURO ================= */

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

}


function loadDarkMode(){

    const dark =
        localStorage.getItem("darkMode");

    if(dark === "true"){

        document.body.classList.add("dark");

    }

}


/* ================= BUSCA ================= */

function globalSearch(){

    const input =
        document.getElementById("searchInput");

    const value =
        input.value.toLowerCase().trim();

    if(!value) return;

    const found =
        tasks.find(task =>
            task.title.toLowerCase().includes(value) ||
            task.subject.toLowerCase().includes(value) ||
            task.platform.toLowerCase().includes(value)
        );

    if(found){

        showPage("atividades");

        setTimeout(() => {

            openModal(
                " Resultado encontrado",
                `
                <strong>${found.title}</strong>
                <br><br>
                ${found.subject}
                <br>
                ${found.platform}
                <br><br>
                Prazo: ${found.deadline}
                `
            );

        },100);

    }

}




/* ===== Connect Edu PR v5: login demonstrativo e gamificação ===== */
let eduCoins = Math.max(0, Number.parseInt(localStorage.getItem('connectEduCoins') || '0', 10) || 0);
let petState = (() => {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('connectEduPet') || '{}') || {}; } catch (_) { saved = {}; }
  const accessories = Object.assign({ cap: !!saved.cap, aura: !!saved.aura, glasses: false, bow: false }, saved.accessories || {});
  return {
    level: Math.max(1, Number.parseInt(saved.level, 10) || 1),
    xp: Math.max(0, Math.min(99, Number.parseInt(saved.xp, 10) || 0)),
    name: String(saved.name || 'Pipoca').slice(0, 24),
    cap: !!(saved.cap || accessories.cap), aura: !!(saved.aura || accessories.aura),
    accessories,
    color: ['oceano','lilas','pessego','floresta'].includes(saved.color) ? saved.color : 'oceano',
    happiness: Math.max(0, Math.min(100, Number.isFinite(Number(saved.happiness)) ? Number(saved.happiness) : 70)),
    careCount: Math.max(0, Number.parseInt(saved.careCount, 10) || 0)
  };
})();
let rewardedTasks = (() => { try { const value = JSON.parse(localStorage.getItem('connectEduRewardedTasks') || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } })();

function enterDemo(){
  const name = (document.getElementById('loginName')?.value || localStorage.getItem('studentName') || 'Estudante').trim();
  if(name) localStorage.setItem('studentName', name);
  document.getElementById('loginOverlay')?.classList.add('hidden');
  updateProfile(); renderPet();
}



function persistCoins(){
  localStorage.setItem('connectEduCoins', String(eduCoins));
  const ids = ['coinBalance','petCoinBalance','scoreCoins'];
  ids.forEach(id => { const element = document.getElementById(id); if (element) element.textContent = eduCoins; });
}
function persistPet(){
  petState.accessories = Object.assign({cap:!!petState.cap,aura:!!petState.aura,glasses:false,bow:false}, petState.accessories || {});
  petState.cap = !!petState.accessories.cap;
  petState.aura = !!petState.accessories.aura;
  localStorage.setItem('connectEduPet', JSON.stringify(petState));
  const level = document.getElementById('scorePetLevel'); if (level) level.textContent = petState.level;
}
function setPetStatus(message){
  const status = document.getElementById('petActionStatus');
  if (status) status.textContent = message;
}
function renderPet(){
  persistCoins(); persistPet();
  const avatar = document.getElementById('petAvatar');
  if (!avatar) return;
  const level = document.getElementById('petLevel');
  const name = document.getElementById('petNameDisplay');
  const mood = document.getElementById('petMood');
  const xpLabel = document.getElementById('petXpLabel');
  const xpFill = document.getElementById('petXpFill');
  const xpTrack = xpFill?.parentElement;
  const colors = {
    oceano: { light:'#7dd3fc', dark:'#0284c7', ear:'#bae6fd' },
    lilas: { light:'#c4b5fd', dark:'#7c3aed', ear:'#ddd6fe' },
    pessego: { light:'#fdba74', dark:'#ea580c', ear:'#fed7aa' },
    floresta: { light:'#86efac', dark:'#15803d', ear:'#bbf7d0' }
  };
  const palette = colors[petState.color] || colors.oceano;
  const accessories = petState.accessories || {};
  const capSvg = (accessories.cap || petState.cap) ? '<path d="M48 68Q90 39 132 68L129 75H51Z" fill="#0284c7" stroke="#075985" stroke-width="3" stroke-linejoin="round"/><path d="M45 75Q90 67 135 75Q128 85 90 84Q52 85 45 75Z" fill="#0ea5e9" stroke="#075985" stroke-width="3" stroke-linejoin="round"/>' : '';
  const glassesSvg = accessories.glasses ? '<g fill="none" stroke="#111827" stroke-width="3"><circle cx="70" cy="89" r="10"/><circle cx="110" cy="89" r="10"/><path d="M80 89h20M60 88l-5-3M120 88l5-3"/></g>' : '';
  const bowSvg = accessories.bow ? '<g stroke="#075985" stroke-width="2" stroke-linejoin="round"><path d="M119 62Q104 47 107 63Q108 74 120 68Z" fill="#0ea5e9"/><path d="M121 62Q137 47 134 63Q133 74 120 68Z" fill="#38bdf8"/><circle cx="120" cy="65" r="3.5" fill="#111827"/></g>' : '';
  avatar.innerHTML = `<svg class="pet-illustration" viewBox="0 0 180 180" role="img" aria-label="${String(petState.name || 'Pet').replace(/[&<>\"]/g, '')}, companheiro virtual personalizado" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="petBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.light}"/><stop offset="1" stop-color="${palette.dark}"/></linearGradient><linearGradient id="petEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${palette.ear}"/><stop offset="1" stop-color="${palette.light}"/></linearGradient></defs><ellipse cx="90" cy="151" rx="47" ry="10" fill="#0f172a" opacity=".13"/><path d="M47 69 38 31Q37 22 46 28L70 49M133 69l9-38q1-9-8-3l-24 21" fill="url(#petEar)" stroke="${palette.dark}" stroke-width="3" stroke-linejoin="round"/><path d="M54 59Q90 35 126 59Q149 78 141 113Q134 147 90 149Q46 147 39 113Q31 78 54 59Z" fill="url(#petBody)" stroke="${palette.dark}" stroke-width="3"/><path d="M53 100Q54 76 74 78Q90 79 90 96Q90 79 106 78Q126 76 127 100Q127 124 90 135Q53 124 53 100Z" fill="#f8fafc" opacity=".97"/><ellipse cx="70" cy="88" rx="5" ry="7" fill="#111827"/><ellipse cx="110" cy="88" rx="5" ry="7" fill="#111827"/><circle cx="72" cy="86" r="1.6" fill="#fff"/><circle cx="112" cy="86" r="1.6" fill="#fff"/><path d="M84 103q6-6 12 0l-6 6z" fill="#334155"/><path d="M90 109q-6 8-13 1M90 109q6 8 13 1" fill="none" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/><path d="M68 61q22-17 44 0" fill="none" stroke="#f8fafc" stroke-width="4" stroke-linecap="round" opacity=".8"/><circle cx="43" cy="113" r="5" fill="#facc15"/><circle cx="138" cy="101" r="4" fill="#facc15"/><path d="m123 42 3-8 3 8 8 3-8 3-3 8-3-8-8-3z" fill="#facc15"/>${capSvg}${glassesSvg}${bowSvg}</svg>`;
  avatar.classList.toggle('pet-has-cap', !!(accessories.cap || petState.cap));
  avatar.classList.toggle('pet-has-aura', !!(accessories.aura || petState.aura));
  avatar.classList.toggle('pet-has-glasses', !!accessories.glasses);
  avatar.classList.toggle('pet-has-bow', !!accessories.bow);
  if (level) level.textContent = `Nível ${petState.level} · ${petState.level >= 5 ? 'Lenda dos estudos' : petState.level >= 3 ? 'Aventureiro' : 'Companheiro'}`;
  if (name) name.textContent = petState.name || 'Pipoca';
  if (mood) mood.textContent = petState.happiness < 30 ? 'Estou precisando de um pouco de atenção.' : petState.happiness < 65 ? 'Que tal brincarmos um pouquinho?' : petState.xp >= 50 ? 'Uau! Estou evoluindo com você!' : 'Estou feliz por estudar com você!';
  if (xpLabel) xpLabel.textContent = `${petState.xp} / 100 XP`;
  if (xpFill) xpFill.style.width = Math.min(100, petState.xp) + '%';
  if (xpTrack) xpTrack.setAttribute('aria-valuenow', String(Math.min(100, petState.xp)));
  const happinessLabel = document.getElementById('petHappinessLabel');
  const happinessFill = document.getElementById('petHappinessFill');
  if (happinessLabel) happinessLabel.textContent = `${Math.round(petState.happiness)}%`;
  if (happinessFill) happinessFill.style.width = `${petState.happiness}%`;
  if (happinessFill?.parentElement) happinessFill.parentElement.setAttribute('aria-valuenow', String(Math.round(petState.happiness)));
  const colorSelect = document.getElementById('petColorSelect'); if (colorSelect && document.activeElement !== colorSelect) colorSelect.value = petState.color;
  const nameInput = document.getElementById('petNameInput'); if (nameInput && document.activeElement !== nameInput) nameInput.value = petState.name || 'Pipoca';
  const showcase = document.querySelector('.pet-showcase');
  if (showcase) showcase.style.boxShadow = (accessories.aura || petState.aura) ? 'inset 0 0 0 3px #0ea5e9, 0 0 28px rgba(14,165,233,.28)' : '';
  document.querySelectorAll('[data-pet-item]').forEach(button => {
    const item = button.getAttribute('data-pet-item');
    const owned = ['cap','aura','glasses','bow'].includes(item) && !!accessories[item];
    if (owned) { button.textContent = 'Adquirido'; button.disabled = true; button.setAttribute('aria-label', `${item}: já adquirido`); }
    else { const price = item === 'cap' ? 30 : item === 'aura' ? 40 : item === 'glasses' ? 35 : item === 'bow' ? 25 : item === 'treat' ? 20 : 50; button.textContent = `${price} moedas`; button.disabled = eduCoins < price; button.removeAttribute('aria-label'); }
    button.classList.toggle('is-owned', owned);
  });
}
function addPetXP(amount, silent = false){
  const gained = Math.max(0, Number(amount) || 0);
  if (!gained) return;
  petState.xp += gained;
  let levels = 0;
  while (petState.xp >= 100) { petState.xp -= 100; petState.level += 1; levels += 1; }
  persistPet(); renderPet();
  if (levels) setPetStatus(`Parabéns! ${petState.name} subiu ${levels} nível(is) e agora está no nível ${petState.level}.`);
  else if (!silent) setPetStatus(`${petState.name} ganhou ${gained} XP. Continue cuidando do seu companheiro!`);
}
function feedPet(){
  if (eduCoins < 15) { setPetStatus('Você precisa de 15 moedas. Conclua atividades para ganhar mais.'); return; }
  eduCoins -= 15;
  petState.happiness = Math.min(100, petState.happiness + 18);
  petState.careCount += 1;
  addPetXP(10, true);
  persistCoins(); renderPet();
  setPetStatus(`Você deu carinho a ${petState.name}! +10 XP e mais bem-estar.`);
}
function playWithPet(){
  if (eduCoins < 10) { setPetStatus('Você precisa de 10 moedas para brincar. Conclua uma atividade e volte depois.'); return; }
  eduCoins -= 10;
  petState.happiness = Math.min(100, petState.happiness + 22);
  petState.careCount += 1;
  addPetXP(8, true);
  persistCoins(); renderPet();
  setPetStatus(`Você brincou com ${petState.name}! +8 XP e um ótimo momento juntos.`);
}
function savePetName(){
  const input = document.getElementById('petNameInput');
  const name = String(input?.value || '').trim().slice(0,24);
  if (!name) { setPetStatus('Digite um nome antes de salvar.'); input?.focus(); return; }
  petState.name = name; persistPet(); renderPet(); setPetStatus(`Prontinho! Seu companheiro agora se chama ${name}.`);
}
function changePetColor(color){
  if (!['oceano','lilas','pessego','floresta'].includes(color)) return;
  petState.color = color; persistPet(); renderPet(); setPetStatus('A cor do seu companheiro foi atualizada.');
}
function buyPetItem(item, cost){
  cost = Math.max(0, Number(cost) || 0);
  const accessories = petState.accessories || (petState.accessories = {cap:!!petState.cap,aura:!!petState.aura,glasses:false,bow:false});
  if (eduCoins < cost) { setPetStatus(`Moedas insuficientes. Você precisa de ${cost} moedas para este item.`); return; }
  if (item === 'evolve' && petState.xp < 50) { setPetStatus('Seu pet precisa de pelo menos 50 XP para evoluir. Ganhe XP com atividades, carinho ou petiscos.'); return; }
  if (['cap','aura','glasses','bow'].includes(item) && accessories[item]) { setPetStatus('Este acessório já está na sua coleção.'); return; }
  eduCoins -= cost;
  if (['cap','aura','glasses','bow'].includes(item)) accessories[item] = true;
  else if (item === 'treat') { petState.happiness = Math.min(100, petState.happiness + 20); petState.careCount += 1; }
  else if (item === 'evolve') { petState.xp -= 50; petState.level += 1; }
  else { eduCoins += cost; setPetStatus('Este item não está disponível na loja.'); return; }
  petState.cap = !!accessories.cap; petState.aura = !!accessories.aura;
  persistCoins(); persistPet();
  if (item === 'treat') addPetXP(25, true); else renderPet();
  const labels = {cap:'boné azul',aura:'aura brilhante',glasses:'óculos divertidos',bow:'laço Conecta',treat:'petisco especial',evolve:'evolução'};
  setPetStatus(item === 'evolve' ? `${petState.name} evoluiu para o nível ${petState.level}!` : item === 'treat' ? `${petState.name} adorou o petisco! +25 XP.` : `Você desbloqueou ${labels[item]}. Já está equipado no seu pet!`);
}

/* ================= INICIALIZAÇÃO ================= */

function init(){

    renderTasks();

    renderDashboard();

    updatePendingCount();

    renderCalendar();

    updateProfile();

    loadDarkMode();
    renderPet();
    const storedName = localStorage.getItem('studentName');
    if(storedName){ const field=document.getElementById('loginName'); if(field) field.value=storedName; }

}


init();



/* ================= Connect Edu PR v6: perfis e currículo ================= */
const DEMO_ACCOUNTS = {
  'aluno.demo': { password:'demo123', role:'aluno', name:'João Silva', label:'Aluno(a)' },
  'prof.demo': { password:'demo123', role:'professor', name:'Marina Costa', label:'Professor(a)' },
  'pedagogo.demo': { password:'demo123', role:'pedagogo', name:'Renata Oliveira', label:'Pedagogo(a)' },
  'familia.demo': { password:'demo123', role:'responsavel', name:'Ana Silva', label:'Responsável' },
  'admin.demo': { password:'demo123', role:'admin', name:'Administrador Connect Edu', label:'Administrador' }
};
let currentRole = localStorage.getItem('connectEduRole') || 'aluno';
let currentUserLabel = localStorage.getItem('connectEduUserLabel') || 'Aluno(a)';
let quizAttempts = JSON.parse(localStorage.getItem('connectEduQuizAttempts') || '{}');
let localAssignments = JSON.parse(localStorage.getItem('connectEduAssignments') || '[]');

const skillCatalog = [
 {subject:'Língua Portuguesa',stage:'6º ano',code:'LP-LEITURA-01',title:'Compreensão e inferência',desc:'Localizar informações, inferir sentidos e justificar interpretações com elementos do texto.',evidence:'Respostas justificadas, anotações de leitura e conversa interpretativa.',activity:'Leitura guiada com perguntas literais e inferenciais.'},
 {subject:'Língua Portuguesa',stage:'7º ano',code:'LP-ORAL-02',title:'Participação em debates',desc:'Organizar argumentos, escutar pontos de vista e responder com respeito e evidências.',evidence:'Debate regrado, rubrica de oralidade e autoavaliação.',activity:'Debate com fontes curtas e registro dos argumentos.'},
 {subject:'Língua Portuguesa',stage:'8º ano',code:'LP-ARG-03',title:'Argumentação e evidências',desc:'Construir opinião apoiada em razões, exemplos e evidências confiáveis.',evidence:'Texto de opinião com tese, argumentos e conclusão.',activity:'Produção de parágrafo argumentativo com revisão por pares.'},
 {subject:'Língua Portuguesa',stage:'9º ano',code:'LP-MIDIA-04',title:'Leitura crítica de mídia',desc:'Comparar fontes, reconhecer propósito comunicativo e avaliar efeitos de linguagem.',evidence:'Comparação de manchetes, fontes e intenção comunicativa.',activity:'Análise de duas notícias sobre o mesmo tema.'},
 {subject:'Matemática',stage:'6º ano',code:'MAT-NUM-01',title:'Números racionais',desc:'Representar, comparar e usar frações e decimais em situações cotidianas.',evidence:'Resolução comentada e representação visual.',activity:'Problemas de receitas, medidas e partilhas.'},
 {subject:'Matemática',stage:'7º ano',code:'MAT-PROP-02',title:'Razão e proporcionalidade',desc:'Resolver situações envolvendo proporção, escala e porcentagem simples.',evidence:'Estratégia registrada e conferência dos resultados.',activity:'Comparar preços, mapas e receitas.'},
 {subject:'Matemática',stage:'8º ano',code:'MAT-ALG-03',title:'Expressões e equações',desc:'Representar relações por linguagem algébrica e resolver equações em problemas.',evidence:'Cálculo com etapas e explicação da estratégia.',activity:'Problemas contextualizados com equações do 1º grau.'},
 {subject:'Matemática',stage:'9º ano',code:'MAT-FUN-04',title:'Relações e funções',desc:'Interpretar relações entre grandezas, tabelas, gráficos e expressões.',evidence:'Leitura de gráfico e construção de tabela.',activity:'Investigar tarifa, distância ou consumo em gráficos.'},
 {subject:'Ciências',stage:'6º ano',code:'CIE-MAT-01',title:'Materiais e transformações',desc:'Observar propriedades de materiais e comparar transformações no cotidiano.',evidence:'Registro de observação, hipótese e conclusão.',activity:'Diário de observação de materiais domésticos seguros.'},
 {subject:'Ciências',stage:'7º ano',code:'CIE-ECO-02',title:'Ecossistemas',desc:'Relacionar seres vivos, ambiente, fluxo de energia e impactos humanos.',evidence:'Mapa de relações e explicação de causa e consequência.',activity:'Construção de teia alimentar local.'},
 {subject:'Ciências',stage:'8º ano',code:'CIE-CORPO-03',title:'Corpo, saúde e prevenção',desc:'Analisar hábitos de saúde com base em informação confiável e pensamento crítico.',evidence:'Infográfico informativo e avaliação de fontes.',activity:'Checagem crítica de informações de saúde.'},
 {subject:'Ciências',stage:'9º ano',code:'CIE-ENERG-04',title:'Energia e sustentabilidade',desc:'Comparar fontes de energia considerando impactos, usos e sustentabilidade.',evidence:'Tabela comparativa e justificativa com dados.',activity:'Debate sobre matriz energética e consumo.'},
 {subject:'História',stage:'8º ano',code:'HIS-FONTES-03',title:'Análise de fontes históricas',desc:'Interpretar fontes, identificar contexto e distinguir evidência de opinião.',evidence:'Ficha de análise de documento, imagem ou relato.',activity:'Comparar fontes sobre um acontecimento histórico.'},
 {subject:'Geografia',stage:'8º ano',code:'GEO-ESPACO-03',title:'Território e transformação',desc:'Relacionar atividades humanas, território, paisagem e desigualdades socioespaciais.',evidence:'Mapa temático e explicação de padrões espaciais.',activity:'Leitura de mapas e dados do município.'},
 {subject:'Língua Inglesa',stage:'8º ano',code:'LI-COM-03',title:'Estratégias de leitura em inglês',desc:'Usar cognatos, contexto e palavras-chave para compreender textos curtos.',evidence:'Anotações de palavras-chave e síntese do texto.',activity:'Leitura de cartaz, notícia curta ou página informativa.'},
 {subject:'Arte',stage:'8º ano',code:'ART-CRI-03',title:'Criação e leitura de imagens',desc:'Explorar escolhas visuais e explicar como elementos de composição comunicam ideias.',evidence:'Produção autoral e comentário sobre escolhas visuais.',activity:'Criar cartaz com hierarquia visual e contraste.'},
 {subject:'Educação Física',stage:'8º ano',code:'EF-CULT-03',title:'Práticas corporais e cooperação',desc:'Refletir sobre regras, inclusão, segurança e cooperação em práticas corporais.',evidence:'Observação de participação e reflexão individual.',activity:'Planejar adaptação inclusiva de um jogo.'},
 {subject:'Projeto de Vida',stage:'Ensino Médio',code:'PV-PLANO-01',title:'Metas e autonomia',desc:'Definir metas alcançáveis, estratégias, recursos e formas de acompanhar o progresso.',evidence:'Plano pessoal de metas revisável.',activity:'Plano de estudos com metas semanais e reflexão.'}
];

const bankCatalog = [
 {id:'q-mat-1',subject:'Matemática',stage:'8º ano',type:'Quiz',title:'Porcentagem no cotidiano',desc:'Interprete descontos e variações percentuais.',skill:'Razão e porcentagem',minutes:8,question:'Uma mochila custa R$ 120 e recebe desconto de 25%. Qual é o preço final?',options:['R$ 30','R$ 90','R$ 95','R$ 100'],answer:1,explain:'25% de 120 é 30. Então, 120 − 30 = 90.'},
 {id:'q-port-1',subject:'Língua Portuguesa',stage:'8º ano',type:'Quiz',title:'Tese e argumento',desc:'Identifique a função de um argumento em um texto de opinião.',skill:'Argumentação e evidências',minutes:6,question:'Em um texto de opinião, a tese é:',options:['A lista de referências','A ideia central defendida pelo autor','Uma frase sem relação com o tema','Somente o título'],answer:1,explain:'A tese expressa o ponto de vista central que o autor procura defender.'},
 {id:'q-cie-1',subject:'Ciências',stage:'7º ano',type:'Quiz',title:'Teias alimentares',desc:'Relacione produtores e consumidores.',skill:'Ecossistemas',minutes:7,question:'Qual grupo geralmente produz seu próprio alimento por fotossíntese?',options:['Predadores de topo','Decompositores apenas','Produtores, como muitas plantas','Todos os consumidores'],answer:2,explain:'Plantas e outros organismos fotossintetizantes são produtores na cadeia alimentar.'},
 {id:'q-hist-1',subject:'História',stage:'8º ano',type:'Quiz',title:'Fontes históricas',desc:'Pense como historiador ao analisar evidências.',skill:'Análise de fontes',minutes:7,question:'Ao analisar uma fotografia histórica, é importante:',options:['Aceitar que ela mostra tudo sem recorte','Investigar autoria, data, contexto e finalidade','Ignorar o contexto','Tratá-la como opinião atual'],answer:1,explain:'Toda fonte tem contexto, autoria, recortes e limites; é preciso interrogá-la criticamente.'},
 {id:'q-geo-1',subject:'Geografia',stage:'8º ano',type:'Investigação',title:'Paisagem do bairro',desc:'Observe como a paisagem muda com o tempo e com as atividades humanas.',skill:'Território e transformação',minutes:20,prompt:'Registre três elementos da paisagem, identifique uma transformação e proponha uma pergunta para investigar.'},
 {id:'q-leit-1',subject:'Língua Portuguesa',stage:'6º ano',type:'Leitura',title:'Leitura com inferências',desc:'Leia um texto curto e separe informação explícita de inferência.',skill:'Compreensão e inferência',minutes:15,prompt:'Escolha um texto adequado à turma. Registre duas informações explícitas e uma inferência, explicando qual pista do texto a sustenta.'},
 {id:'q-producao-1',subject:'Língua Portuguesa',stage:'9º ano',type:'Produção',title:'Texto de opinião',desc:'Produza um texto com tese, argumentos e conclusão.',skill:'Leitura crítica de mídia',minutes:25,prompt:'Escolha um tema da comunidade, apresente sua tese, dois argumentos apoiados em evidências e uma conclusão respeitosa.'},
 {id:'q-ingles-1',subject:'Língua Inglesa',stage:'8º ano',type:'Quiz',title:'Reading strategies',desc:'Use context and keywords to understand a short text.',skill:'Estratégias de leitura em inglês',minutes:6,question:'If a text says “The park is crowded on sunny weekends”, what does “crowded” mean?',options:['Vazio','Muito movimentado','Fechado','Silencioso'],answer:1,explain:'“Crowded” significa cheio ou com muitas pessoas.'}
];

function applyRoleUI(role, name, label) {
  currentRole = role || 'aluno'; currentUserLabel = label || 'Aluno(a)';
  document.body.dataset.role = currentRole;
  localStorage.setItem('connectEduRole', currentRole);
  localStorage.setItem('connectEduUserLabel', currentUserLabel);
  const topName = document.getElementById('topName');
  const topRole = document.getElementById('topRole');
  if (topName) topName.textContent = name || 'Estudante';
  if (topRole) topRole.textContent = currentUserLabel + (currentRole === 'aluno' || currentRole === 'responsavel' ? ' • 8º Ano • Turma A' : ' • Connect Edu PR');
  document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
  const first = document.querySelector('.menu button');
  if (first) first.classList.add('active');
  updateProfile();
  renderRoleSummaries();
}
function enterDemo() {
  const role = document.getElementById('loginRole')?.value || 'aluno';
  const username = document.getElementById('loginUser')?.value.trim() || 'aluno.demo';
  const account = DEMO_ACCOUNTS[username];
  if (account && account.role !== role) {
    alert('Este usuário pertence ao perfil "' + account.label + '". Selecione o perfil correspondente para continuar.');
    return;
  }
  const name = (document.getElementById('loginName')?.value || (account && account.name) || localStorage.getItem('studentName') || 'Estudante').trim();
  localStorage.setItem('studentName', name);
  localStorage.setItem('connectEduUsername', username);
  applyRoleUI(role, name, account?.label || ({aluno:'Aluno(a)',professor:'Professor(a)',pedagogo:'Pedagogo(a)',responsavel:'Responsável'}[role]));
  document.getElementById('loginOverlay')?.classList.add('hidden');
  renderTasks(); renderDashboard(); renderCalendar(); renderPet(); renderBank(); renderSkills(); renderAssignments(); renderFamily();
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid'); if (!grid) return;
  const stageRaw = document.getElementById('skillStage')?.value || '8º ano — Ensino Fundamental';
  const stage = stageRaw.startsWith('1ª') || stageRaw.startsWith('2ª') || stageRaw.startsWith('3ª') ? 'Ensino Médio' : stageRaw.slice(0,5).trim();
  const subject = document.getElementById('skillSubject')?.value || 'Todos';
  const search = (document.getElementById('skillSearch')?.value || '').toLowerCase();
  const items = skillCatalog.filter(s => (stage === 'Todos' || s.stage === stage || (stage === 'Ensino Médio' && s.stage === 'Ensino Médio')) && (subject === 'Todos' || s.subject === subject) && (s.title+' '+s.desc+' '+s.code+' '+s.activity).toLowerCase().includes(search));
  grid.innerHTML = items.length ? items.map(s => `<article class="skill-card"><div class="skill-meta"><span class="tag">${s.subject}</span><span class="tag green">${s.stage}</span></div><h3>${s.title}</h3><span class="tag">${s.code} · referência demonstrativa</span><p style="margin-top:10px">${s.desc}</p><p style="margin-top:9px"><strong>Evidências:</strong> ${s.evidence}</p><p style="margin-top:7px"><strong>Atividade sugerida:</strong> ${s.activity}</p></article>`).join('') : '<div class="notice-card">Nenhuma habilidade encontrada com esses filtros. Tente outra etapa ou componente.</div>';
}
function renderBank() {
  const grid = document.getElementById('bankGrid'); if (!grid) return;
  const subject = document.getElementById('bankSubject')?.value || 'Todas';
  const type = document.getElementById('bankType')?.value || 'Todos';
  const stage = document.getElementById('bankStage')?.value || 'Todas';
  const items = bankCatalog.filter(x => (subject === 'Todas' || x.subject === subject) && (type === 'Todos' || x.type === type) && (stage === 'Todas' || x.stage === stage || (stage === 'Ensino Médio' && x.stage.includes('EM'))));
  grid.innerHTML = items.map(x => `<article class="bank-card"><div class="bank-meta"><span class="tag">${x.subject}</span><span class="tag green">${x.stage}</span><span class="tag">${x.type}</span></div><h3>${x.title}</h3><p>${x.desc}</p><p style="margin-top:8px"><strong>Habilidade:</strong> ${x.skill}</p><p><strong>Tempo sugerido:</strong> ${x.minutes} min</p><button class="btn" onclick="openBankActivity('${x.id}')">${x.type === 'Quiz' ? 'Iniciar quiz' : 'Abrir atividade'}</button></article>`).join('');
}
function openBankActivity(id) {
  const x = bankCatalog.find(a => a.id === id); const area = document.getElementById('quizArea'); if (!x || !area) return;
  area.hidden = false;
  if (x.type === 'Quiz') {
    area.innerHTML = `<h2>${x.title}</h2><p>${x.question}</p><form id="quizForm">${x.options.map((o,i)=>`<label class="quiz-option"><input type="radio" name="quizAnswer" value="${i}" required> <span>${o}</span></label>`).join('')}<button class="btn" type="submit">Conferir resposta</button></form><div id="quizFeedback"></div>`;
    document.getElementById('quizForm').addEventListener('submit', e => {
      e.preventDefault(); const answer = Number(new FormData(e.currentTarget).get('quizAnswer')); const correct = answer === x.answer;
      quizAttempts[x.id] = (quizAttempts[x.id] || 0) + 1; localStorage.setItem('connectEduQuizAttempts', JSON.stringify(quizAttempts));
      const feedback = document.getElementById('quizFeedback'); feedback.className = 'quiz-feedback' + (correct ? '' : ' wrong');
      feedback.innerHTML = `<strong>${correct ? 'Resposta correta! +10 moedas' : 'Ainda não. Tente novamente.'}</strong><p>${x.explain}</p>`;
      if (correct && !localStorage.getItem('quizReward_'+x.id)) { eduCoins += 10; localStorage.setItem('quizReward_'+x.id,'1'); persistCoins(); }
      if (correct) { addPetXP(15); renderRoleSummaries(); }
    });
  } else {
    area.innerHTML = `<h2>${x.title}</h2><p>${x.desc}</p><p><strong>Habilidade:</strong> ${x.skill}</p><p style="margin:12px 0">${x.prompt}</p><label for="activityResponse">Sua resposta / registro</label><textarea id="activityResponse" rows="6" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--card);color:var(--text)" placeholder="Escreva seu registro aqui..."></textarea><button class="btn" onclick="saveActivityResponse('${x.id}')">Salvar meu registro</button><div id="activitySaved"></div>`;
  }
  area.scrollIntoView({behavior:'smooth',block:'start'});
}
function saveActivityResponse(id) {
  const response = document.getElementById('activityResponse')?.value.trim(); if (!response) { alert('Escreva seu registro antes de salvar.'); return; }
  const saved = JSON.parse(localStorage.getItem('connectEduResponses') || '{}'); saved[id] = {response, date:new Date().toISOString()}; localStorage.setItem('connectEduResponses', JSON.stringify(saved));
  document.getElementById('activitySaved').innerHTML = '<p class="quiz-feedback">Registro salvo neste navegador. Em uma implantação oficial, o professor precisará de um fluxo seguro para receber e corrigir entregas.</p>';
}
function openAssignmentForm() { const f = document.getElementById('assignmentForm'); if (f) f.hidden = false; }
function closeAssignmentForm() { const f = document.getElementById('assignmentForm'); if (f) f.hidden = true; }
function saveAssignment() {
  const title = document.getElementById('assignmentTitle').value.trim();
  if (!title) { alert('Informe um título para a atividade.'); return; }
  localAssignments.unshift({title,subject:document.getElementById('assignmentSubject').value,klass:document.getElementById('assignmentClass').value,instructions:document.getElementById('assignmentInstructions').value.trim(),date:new Date().toLocaleDateString('pt-BR')});
  localStorage.setItem('connectEduAssignments', JSON.stringify(localAssignments)); renderAssignments(); closeAssignmentForm();
  document.getElementById('assignmentTitle').value=''; document.getElementById('assignmentInstructions').value='';
}
function renderAssignments() {
  const list = document.getElementById('assignmentList'); if (!list) return;
  const bankCount = document.getElementById('teacherBankCount'); if (bankCount) bankCount.textContent = bankCatalog.length;
  const assignmentCount = document.getElementById('teacherAssignments'); if (assignmentCount) assignmentCount.textContent = localAssignments.length;
  const skillCount = document.getElementById('teacherSkillsCount'); if (skillCount) skillCount.textContent = skillCatalog.length;
  list.innerHTML = localAssignments.length ? localAssignments.map(a => `<article class="assignment-item"><div><strong>${a.title}</strong><p>${a.subject} · ${a.klass} · Criada em ${a.date}</p><p>${a.instructions || 'Sem instruções adicionais.'}</p></div><span class="tag green">Criada</span></article>`).join('') : '<div class="notice-card">Nenhuma atividade criada nesta sessão. Use “Criar atividade” para adicionar a primeira.</div>';
}
function renderFamily() {
  const done = tasks.filter(t=>t.completed).length, pending = tasks.length-done;
  const c = document.getElementById('familyCompleted'), p = document.getElementById('familyPending'), coins = document.getElementById('familyCoins');
  if(c)c.textContent=done; if(p)p.textContent=pending; if(coins)coins.textContent=eduCoins;
  const list = document.getElementById('familyTaskList');
  if(list) list.innerHTML = tasks.map(t=>`<article class="assignment-item"><div><strong>${t.title}</strong><p>${t.subject} · Prazo: ${t.deadline}</p></div><span class="tag ${t.completed?'green':''}">${t.completed?'Concluída':'Pendente'}</span></article>`).join('');
}
function renderRoleSummaries() { renderAssignments(); renderFamily(); }
function logoutDemo() {
  document.getElementById('loginOverlay')?.classList.remove('hidden');
  const password = document.getElementById('loginPassword'); if(password) password.value='';
}


/* ================= Connect Edu PR v7 ================= */
const subjectCatalogV7 = [
 {name:'Língua Portuguesa',icon:'',color:'Linguagens',description:'Leitura, escrita, oralidade, análise linguística e literatura.',units:['Leitura e interpretação','Produção textual','Oralidade e argumentação','Análise linguística'],skills:['Compreensão e inferência','Argumentação e evidências','Leitura crítica de mídia']},
 {name:'Matemática',icon:'',color:'Matemática',description:'Números, álgebra, geometria, grandezas, probabilidade e estatística.',units:['Números e operações','Álgebra e funções','Geometria e medidas','Probabilidade e estatística'],skills:['Números racionais','Razão e proporcionalidade','Expressões e equações']},
 {name:'Ciências',icon:'',color:'Ciências da Natureza',description:'Investigação científica, vida, matéria, energia, Terra e universo.',units:['Matéria e energia','Vida e evolução','Terra e universo','Investigação científica'],skills:['Ecossistemas','Energia e sustentabilidade','Corpo, saúde e prevenção']},
 {name:'História',icon:'',color:'Ciências Humanas',description:'Tempo, memória, fontes históricas, culturas e relações sociais.',units:['Tempo e fontes','Sociedades e culturas','Poder e cidadania','História do Brasil e do mundo'],skills:['Análise de fontes históricas']},
 {name:'Geografia',icon:'',color:'Ciências Humanas',description:'Território, paisagem, lugar, cartografia, população e ambiente.',units:['Cartografia','Natureza e sociedade','Território e população','Globalização e ambiente'],skills:['Território e transformação']},
 {name:'Língua Inglesa',icon:'',color:'Linguagens',description:'Compreensão, interação, repertório cultural e comunicação em inglês.',units:['Reading','Listening','Speaking','Writing'],skills:['Estratégias de leitura em inglês']},
 {name:'Arte',icon:'',color:'Linguagens',description:'Artes visuais, dança, música, teatro e repertórios culturais.',units:['Artes visuais','Música','Dança','Teatro e criação'],skills:['Criação e leitura de imagens']},
 {name:'Educação Física',icon:'',color:'Linguagens',description:'Práticas corporais, cooperação, cultura, saúde e inclusão.',units:['Jogos e brincadeiras','Esportes','Danças e lutas','Ginásticas e práticas de aventura'],skills:['Práticas corporais e cooperação']},
 {name:'Ensino Religioso',icon:'',color:'Área específica',description:'Diversidade de tradições, diálogo, respeito e direitos humanos, conforme currículo da rede.',units:['Identidades e alteridades','Manifestações culturais','Diálogo e respeito'],skills:['Respeito à diversidade']},
 {name:'Projeto de Vida',icon:'',color:'Formação integral',description:'Autoconhecimento, planejamento, autonomia, convivência e metas.',units:['Autoconhecimento','Organização dos estudos','Projeto pessoal e coletivo'],skills:['Metas e autonomia']}
];
const resourceDefaultsV7 = [
 {title:'Como estudar com autonomia',subject:'Projeto de Vida',type:'Guia',description:'Estratégias para planejar sessões de estudo, revisar e acompanhar metas.',url:''},
 {title:'Leitura ativa: antes, durante e depois',subject:'Língua Portuguesa',type:'Leitura',description:'Roteiro para fazer perguntas ao texto, destacar ideias e resumir.',url:''},
 {title:'Matemática em situações reais',subject:'Matemática',type:'Guia',description:'Sugestões para explicar estratégias e conferir resultados.',url:''},
 {title:'Investigar uma questão científica',subject:'Ciências',type:'Guia',description:'Etapas de pergunta, hipótese, observação, registro e conclusão.',url:''},
 {title:'Ler mapas e legendas',subject:'Geografia',type:'Leitura',description:'Guia introdutório de orientação, escala, legenda e representação.',url:''},
 {title:'Analisar uma fonte histórica',subject:'História',type:'Guia',description:'Perguntas sobre autoria, data, contexto, propósito e limites da fonte.',url:''}
];
const noticeSeedV7 = [
 {id:'n1',icon:'',title:'Nova atividade de Matemática',message:'Há uma atividade de revisão de porcentagem no banco de atividades.',date:'Hoje',read:false},
 {id:'n2',icon:'',title:'Confira o calendário escolar',message:'Revise os próximos prazos e eventos para organizar sua rotina.',date:'Esta semana',read:false},
 {id:'n3',icon:'',title:'Seu progresso conta',message:'Registre o que aprendeu e escolha uma habilidade para praticar novamente.',date:'Esta semana',read:false}
];
let resourcesV7 = JSON.parse(localStorage.getItem('connectEduResourcesV7') || 'null') || resourceDefaultsV7;
let noticesV7 = JSON.parse(localStorage.getItem('connectEduNoticesV7') || 'null') || noticeSeedV7;
let usersV7 = JSON.parse(localStorage.getItem('connectEduUsersV7') || '[]');
let selectedSubjectV7 = '';

function saveV7State() {
  localStorage.setItem('connectEduResourcesV7', JSON.stringify(resourcesV7));
  localStorage.setItem('connectEduNoticesV7', JSON.stringify(noticesV7));
  localStorage.setItem('connectEduUsersV7', JSON.stringify(usersV7));
}
function applyRoleUI(role, name, label) {
  currentRole = role || 'aluno'; currentUserLabel = label || 'Aluno(a)';
  document.body.dataset.role = currentRole;
  localStorage.setItem('connectEduRole', currentRole);
  localStorage.setItem('connectEduUserLabel', currentUserLabel);
  const topName = document.getElementById('topName');
  const topRole = document.getElementById('topRole');
  if (topName) topName.textContent = name || 'Estudante';
  if (topRole) topRole.textContent = currentUserLabel + (currentRole === 'aluno' || currentRole === 'responsavel' ? ' • 8º Ano • Turma A' : ' • Connect Edu PR');
  document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
  const first = document.querySelector('.menu button');
  if (first) first.classList.add('active');
  renderRoleSummaries();
}
function enterDemo() {
  const role = document.getElementById('loginRole')?.value || 'aluno';
  const username = document.getElementById('loginUser')?.value.trim() || '';
  const account = DEMO_ACCOUNTS[username];
  if (account && account.role !== role) { alert('Este usuário pertence ao perfil "' + account.label + '". Selecione o perfil correspondente.'); return; }
  const roleInfo = {aluno:['Estudante','Aluno(a)'],professor:['Marina Costa','Professor(a)'],pedagogo:['Renata Oliveira','Pedagogo(a)'],responsavel:['Ana Silva','Responsável'],admin:['Administrador Connect Edu','Administrador']};
  const name = (document.getElementById('loginName')?.value || (account && account.name) || roleInfo[role]?.[0] || 'Estudante').trim();
  localStorage.setItem('studentName', name);
  localStorage.setItem('connectEduUsername', username || 'demo.'+role);
  applyRoleUI(role, name, account?.label || roleInfo[role]?.[1]);
  document.getElementById('loginOverlay')?.classList.add('hidden');
  renderTasks(); renderDashboard(); renderCalendar(); renderPet(); renderBank(); renderSkills(); renderAssignments(); renderFamily();
  renderSubjects(); renderLibrary(); renderNotifications(); renderAdmin();
}
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPassword').value;
  const account = DEMO_ACCOUNTS[username];
  if (!account || account.password !== password || account.role !== role) {
    alert('Dados de demonstração não conferem. Use uma das contas listadas e a senha demo123, ou entre sem login.');
    return;
  }
  const name = document.getElementById('loginName').value.trim() || account.name;
  localStorage.setItem('studentName', name);
  localStorage.setItem('connectEduUsername', username);
  applyRoleUI(role, name, account.label);
  document.getElementById('loginOverlay')?.classList.add('hidden');
  renderTasks(); renderDashboard(); renderCalendar(); renderPet(); renderBank(); renderSkills(); renderAssignments(); renderFamily();
  renderSubjects(); renderLibrary(); renderNotifications(); renderAdmin();
});
function renderSubjects() {
  const grid = document.getElementById('subjectsGrid'); if (!grid) return;
  const q = (document.getElementById('subjectSearch')?.value || '').toLowerCase();
  const items = subjectCatalogV7.filter(s => (s.name+' '+s.description+' '+s.units.join(' ')).toLowerCase().includes(q));
  grid.innerHTML = items.map(s => `<article class="subject-card" role="button" tabindex="0" onclick="openSubject('${s.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSubject('${s.name}')}"><div class="subject-icon">${s.icon}</div><span class="tag">${s.color}</span><h3>${s.name}</h3><p>${s.description}</p><span class="tag green">${s.units.length} unidades de estudo</span></article>`).join('');
}
function openSubject(name) {
  selectedSubjectV7 = name;
  const s = subjectCatalogV7.find(x => x.name === name); const d = document.getElementById('subjectDetail'); if (!s || !d) return;
  const related = skillCatalog.filter(x => x.subject === name);
  const activities = bankCatalog.filter(x => x.subject === name);
  d.hidden = false;
  d.innerHTML = `<button class="btn btn-secondary" onclick="document.getElementById('subjectDetail').hidden=true">Fechar detalhes</button><h2>${s.icon} ${s.name}</h2><p>${s.description}</p><h3>Unidades de estudo</h3><ul>${s.units.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Habilidades relacionadas no catálogo demonstrativo</h3>${related.length?`<ul>${related.map(x=>`<li><strong>${x.title}</strong> — ${x.desc}</li>`).join('')}</ul>`:'<p>O catálogo ainda não tem uma habilidade cadastrada para esta disciplina. A equipe pedagógica pode completar após validar a matriz curricular.</p>'}<h3>Atividades disponíveis</h3>${activities.length?`<ul>${activities.map(x=>`<li>${x.title} — ${x.type}, ${x.minutes} min</li>`).join('')}</ul>`:'<p>Não há atividade cadastrada para esta disciplina no banco demonstrativo.</p>'}<div class="detail-actions"><button class="btn" onclick="showPage('banco')">Abrir banco de atividades</button><button class="btn btn-secondary" onclick="showPage('habilidades')">Ver habilidades</button></div>`;
  d.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderLibrary() {
  const grid = document.getElementById('libraryGrid'); if (!grid) return;
  const subject = document.getElementById('librarySubject')?.value || 'Todos';
  const type = document.getElementById('libraryType')?.value || 'Todos';
  const q = (document.getElementById('librarySearch')?.value || '').toLowerCase();
  const items = resourcesV7.filter(r => (subject==='Todos'||r.subject===subject) && (type==='Todos'||r.type===type) && (r.title+' '+r.description+' '+r.subject).toLowerCase().includes(q));
  const icons = {Leitura:'',Vídeo:'▶',Guia:'',Link:''};
  grid.innerHTML = items.map((r,i)=>`<article class="resource-card"><span class="resource-type">${icons[r.type]||''}</span><span class="tag">${r.subject}</span><h3>${r.title}</h3><p>${r.description}</p><span class="tag green">${r.type}</span>${r.url?`<a class="btn resource-open" href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer">Abrir recurso ↗</a>`:`<button class="btn resource-open" onclick="openModal('Material de demonstração','Este item é uma referência de organização. Adicione um link ou arquivo autorizado para disponibilizar o conteúdo real.')">Ver detalhes</button>`}</article>`).join('') || '<div class="notice-card">Nenhum recurso corresponde aos filtros.</div>';
  const count=document.getElementById('adminResourceCount'); if(count) count.textContent=resourcesV7.length;
}
function openResourceForm(){ if(currentRole!=='professor'&&currentRole!=='pedagogo'&&currentRole!=='admin'){alert('Somente professor, pedagogo ou administrador pode adicionar recursos neste protótipo.');return;} document.getElementById('resourceForm').hidden=false; }
function closeResourceForm(){ document.getElementById('resourceForm').hidden=true; }
function saveResource() {
  if(currentRole!=='professor'&&currentRole!=='pedagogo'&&currentRole!=='admin'){alert('Permissão insuficiente para adicionar recursos.');return;}
  const title=document.getElementById('resourceTitle').value.trim(); const description=document.getElementById('resourceDescription').value.trim(); const url=document.getElementById('resourceUrl').value.trim();
  if(!title||!description){alert('Informe o título e a descrição.');return;}
  if(url && !/^https?:\/\//i.test(url)){alert('Use um link que comece com https:// ou http://.');return;}
  resourcesV7.unshift({title,description,url,subject:document.getElementById('resourceSubject').value,type:document.getElementById('resourceType').value});
  saveV7State(); renderLibrary(); renderAdmin(); closeResourceForm(); document.getElementById('resourceTitle').value='';document.getElementById('resourceDescription').value='';document.getElementById('resourceUrl').value='';
}
function renderNotifications() {
  const list=document.getElementById('notificationList'); if(!list)return;
  const unread=noticesV7.filter(n=>!n.read).length;
  const badge=document.getElementById('navNotificationCount'); if(badge) badge.textContent=unread;
  document.querySelector('.notification-dot')?.classList.toggle('hidden',unread===0);
  list.innerHTML=noticesV7.map(n=>`<article class="notification-item ${n.read?'':'unread'}"><span class="notification-icon">${n.icon}</span><div><h3>${n.title}</h3><p>${n.message}</p><small>${n.date} · ${n.read?'Lida':'Não lida'}</small></div><button class="btn btn-secondary" onclick="toggleNotificationRead('${n.id}')">${n.read?'Marcar não lida':'Marcar como lida'}</button></article>`).join('') || '<div class="notice-card">Você não tem notificações.</div>';
}
function toggleNotificationRead(id){noticesV7=noticesV7.map(n=>n.id===id?{...n,read:!n.read}:n);saveV7State();renderNotifications();}
function markAllNotificationsRead(){noticesV7=noticesV7.map(n=>({...n,read:true}));saveV7State();renderNotifications();}
function changeFontSize(direction) {
  let size=Number(localStorage.getItem('connectEduFontSize')||0);
  size=direction===0?0:Math.max(0,Math.min(2,size+direction));
  document.body.classList.remove('font-large','font-xlarge');
  if(size===1)document.body.classList.add('font-large');
  if(size===2)document.body.classList.add('font-xlarge');
  localStorage.setItem('connectEduFontSize',String(size));
  const status=document.getElementById('fontSizeStatus');if(status)status.textContent=['Tamanho padrão','Texto ampliado','Texto extra ampliado'][size];
}
function toggleHighContrast() {
  const enabled=!document.body.classList.contains('high-contrast');
  document.body.classList.toggle('high-contrast',enabled);localStorage.setItem('connectEduHighContrast',enabled?'1':'0');
  const btn=document.getElementById('contrastToggle');if(btn)btn.textContent=enabled?'Desativar alto contraste':'Ativar alto contraste';
}
function resetAccessibility() {
  localStorage.removeItem('connectEduFontSize');localStorage.removeItem('connectEduHighContrast');
  document.body.classList.remove('font-large','font-xlarge','high-contrast');changeFontSize(0);
  const btn=document.getElementById('contrastToggle');if(btn)btn.textContent='Ativar alto contraste';
}
function loadAccessibilityV7() {
  const size=Number(localStorage.getItem('connectEduFontSize')||0);
  document.body.classList.remove('font-large','font-xlarge');
  if(size===1)document.body.classList.add('font-large'); if(size>=2)document.body.classList.add('font-xlarge');
  if(localStorage.getItem('connectEduHighContrast')==='1')document.body.classList.add('high-contrast');
  const btn=document.getElementById('contrastToggle');if(btn)btn.textContent=document.body.classList.contains('high-contrast')?'Desativar alto contraste':'Ativar alto contraste';
  const status=document.getElementById('fontSizeStatus');if(status)status.textContent=['Tamanho padrão','Texto ampliado','Texto extra ampliado'][size]||'Tamanho padrão';
}
function openUserForm(){if(currentRole!=='admin'){alert('Área exclusiva do perfil administrador.');return;}document.getElementById('userForm').hidden=false;}
function saveDemoUser() {
  if(currentRole!=='admin'){alert('Área exclusiva do perfil administrador.');return;}
  const name=document.getElementById('newUserName').value.trim(), id=document.getElementById('newUserId').value.trim(), group=document.getElementById('newUserGroup').value.trim();
  if(!name||!id){alert('Informe nome e identificador.');return;}
  if(usersV7.some(u=>u.id.toLowerCase()===id.toLowerCase())){alert('Esse identificador já foi cadastrado.');return;}
  usersV7.unshift({name,id,group,role:document.getElementById('newUserRole').value,date:new Date().toLocaleDateString('pt-BR')});
  saveV7State();renderAdmin();document.getElementById('userForm').hidden=true;
  ['newUserName','newUserId','newUserGroup'].forEach(id=>document.getElementById(id).value='');
}
function renderAdmin() {
  const count=document.getElementById('adminUserCount');if(count)count.textContent=usersV7.length;
  const subjects=document.getElementById('adminSubjectCount');if(subjects)subjects.textContent=subjectCatalogV7.length;
  const resources=document.getElementById('adminResourceCount');if(resources)resources.textContent=resourcesV7.length;
  const list=document.getElementById('adminUserList');if(!list)return;
  list.innerHTML=usersV7.length?usersV7.map(u=>`<article class="assignment-item"><div><strong>${escapeHTML(u.name)}</strong><p>${escapeHTML(u.id)} · ${escapeHTML(u.role)} · ${escapeHTML(u.group||'Sem turma/área')} · ${u.date}</p></div><button class="btn btn-secondary" onclick="deleteDemoUser('${encodeURIComponent(u.id)}')">Remover</button></article>`).join(''):'<div class="notice-card">Nenhum usuário demonstrativo cadastrado ainda.</div>';
}
function deleteDemoUser(encodedId){if(currentRole!=='admin')return;const id=decodeURIComponent(encodedId);usersV7=usersV7.filter(u=>u.id!==id);saveV7State();renderAdmin();}
function exportDemoData() {
  const data={exportedAt:new Date().toISOString(),notice:'Dados locais demonstrativos; não são registros oficiais',role:currentRole,tasks,coins:eduCoins,pet:petState,resources:resourcesV7,notifications:noticesV7,assignments:localAssignments,users:usersV7,quizAttempts};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='connect-edu-pr-dados-demonstrativos.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function globalSearch() {
  const input=document.getElementById('searchInput');const value=(input?.value||'').toLowerCase().trim();if(!value)return;
  const task=tasks.find(t=>(t.title+' '+t.subject+' '+t.platform).toLowerCase().includes(value));
  const subject=subjectCatalogV7.find(s=>(s.name+' '+s.description+' '+s.units.join(' ')).toLowerCase().includes(value));
  const resource=resourcesV7.find(r=>(r.title+' '+r.subject+' '+r.description).toLowerCase().includes(value));
  const skill=skillCatalog.find(s=>(s.title+' '+s.desc+' '+s.subject).toLowerCase().includes(value));
  if(task){showPage('atividades');openModal('Resultado da busca',`<strong>${escapeHTML(task.title)}</strong><p>${escapeHTML(task.subject)} · ${escapeHTML(task.platform)}</p><p>Prazo: ${escapeHTML(task.deadline)}</p>`);}
  else if(subject){showPage('disciplinas');openSubject(subject.name);}
  else if(resource){showPage('biblioteca');openModal('Recurso encontrado',`<strong>${escapeHTML(resource.title)}</strong><p>${escapeHTML(resource.description)}</p>`);}
  else if(skill){showPage('habilidades');document.getElementById('skillSearch').value=value;renderSkills();}
  else {openModal('Busca',`Não encontramos resultados para <strong>${escapeHTML(value)}</strong>. Tente o nome de uma matéria, atividade, recurso ou habilidade.`);}
}
function renderAdminRoleVisibility() {
  document.querySelectorAll('.role-only').forEach(el=>el.style.display='none');
  if(currentRole==='professor')document.querySelectorAll('.role-professor').forEach(el=>el.style.display='');
  if(currentRole==='pedagogo')document.querySelectorAll('.role-pedagogo').forEach(el=>el.style.display='');
  if(currentRole==='responsavel')document.querySelectorAll('.role-responsavel').forEach(el=>el.style.display='');
  if(currentRole==='admin')document.querySelectorAll('.role-admin').forEach(el=>el.style.display='');
}
const applyRoleUIOriginalV7 = applyRoleUI;
applyRoleUI = function(role,name,label){applyRoleUIOriginalV7(role,name,label);renderAdminRoleVisibility();};
const renderLibraryOriginalV7 = renderLibrary;
const renderSubjectsOriginalV7 = renderSubjects;
function renderRoleSummaries(){renderAssignments();renderFamily();renderAdmin();}

document.addEventListener('DOMContentLoaded', () => {});
loadAccessibilityV7();
renderSubjects(); renderLibrary(); renderNotifications(); renderAdmin();


/* v14.1 — separação real de áreas por perfil */
(function(){
  const ROLE_PAGES = {
    aluno: new Set(['inicio','hub-escola','hub-treinar','hub-score','hub-desempenho','ranking','atividades','plataformas','calendario','progresso','conquistas','pet','escola','ia','disciplinas','biblioteca','notificacoes','acessibilidade','perfil']),
    professor: new Set(['docente','atividades','banco','habilidades','biblioteca','calendario','notificacoes','acessibilidade','perfil','escola']),
    pedagogo: new Set(['pedagogico','habilidades','escola','biblioteca','calendario','notificacoes','acessibilidade','perfil','banco']),
    responsavel: new Set(['familia','calendario','notificacoes','acessibilidade','perfil']),
    admin: new Set(['administracao','docente','pedagogico','familia','habilidades','banco','biblioteca','escola','calendario','notificacoes','acessibilidade','perfil'])
  };
  const HOME = {aluno:'inicio', professor:'docente', pedagogo:'pedagogico', responsavel:'familia', admin:'administracao'};
  const ROLE_LABELS = {aluno:'Estudante',professor:'Painel do professor',pedagogo:'Visão pedagógica',responsavel:'Área da família',admin:'Administração escolar'};
  function allowed(role,pageId){ return (ROLE_PAGES[role] || ROLE_PAGES.aluno).has(pageId); }
  const originalShowPage = window.showPage;
  window.showPage = function(pageId, button){
    if(!allowed(currentRole, pageId)){
      const target = HOME[currentRole] || 'inicio';
      const targetButton = document.querySelector('.menu button[onclick*="showPage(\''+target+'\'"]');
      if(pageId !== target) return originalShowPage.call(this,target,targetButton || null);
    }
    return originalShowPage.call(this,pageId,button);
  };
  const originalApplyRoleUI = window.applyRoleUI;
  window.applyRoleUI = function(role,name,label){
    const result = originalApplyRoleUI.call(this,role,name,label);
    const activeRole = role || currentRole || 'aluno';
    document.querySelectorAll('.menu > li').forEach(li=>{
      const btn = li.querySelector('button[onclick*="showPage("]');
      if(!btn) return;
      const match = btn.getAttribute('onclick').match(/showPage\('([^']+)'/);
      if(!match) return;
      li.hidden = !allowed(activeRole,match[1]);
    });
    document.querySelectorAll('.page').forEach(page=>{
      const permitted = allowed(activeRole,page.id);
      page.dataset.roleAllowed = permitted ? 'true' : 'false';
      if(!permitted) page.classList.remove('active');
    });
    document.body.dataset.role = activeRole;
    const target = HOME[activeRole] || 'inicio';
    const targetButton = document.querySelector('.menu button[onclick*="showPage(\''+target+'\'"]');
    originalShowPage.call(this,target,targetButton || null);
    const title = document.querySelector('#'+target+' h1');
    if(title && activeRole !== 'aluno') title.textContent = ROLE_LABELS[activeRole];
    return result;
  };
  // A página inicial genérica é exclusiva do estudante; links diretos não contornam permissões.
  document.addEventListener('click',function(event){
    const btn = event.target.closest('.menu button[onclick*="showPage("]');
    if(!btn) return;
    const match = btn.getAttribute('onclick').match(/showPage\('([^']+)'/);
    if(match && !allowed(currentRole,match[1])){event.preventDefault();event.stopImmediatePropagation();window.showPage(HOME[currentRole]||'inicio',null);}
  },true);
  window.addEventListener('DOMContentLoaded',()=>window.applyRoleUI(currentRole,localStorage.getItem('connectEduUsername')||'Usuário',currentUserLabel));
})();

/* v14.2 — experiência profissional por perfil, navegação e preferências corrigidas */
(function(){
 const HOME={aluno:'inicio',professor:'docente',pedagogo:'pedagogico',responsavel:'familia',admin:'administracao'};
 const ALLOWED={
  aluno:['inicio','hub-escola','hub-treinar','hub-score','hub-desempenho','ranking','atividades','plataformas','calendario','progresso','conquistas','pet','escola','ia','disciplinas','biblioteca','notificacoes','acessibilidade','perfil'],
  professor:['docente','atividades','banco','habilidades','biblioteca','calendario','notificacoes','acessibilidade','perfil','escola'],
  pedagogo:['pedagogico','habilidades','escola','biblioteca','calendario','notificacoes','acessibilidade','perfil','banco'],
  responsavel:['familia','calendario','notificacoes','acessibilidade','perfil'],
  admin:['administracao','docente','pedagogico','familia','habilidades','banco','biblioteca','escola','calendario','notificacoes','acessibilidade','perfil']
 };
 const ROLE={aluno:'Estudante',professor:'Professor(a)',pedagogo:'Pedagogo(a)',responsavel:'Responsável',admin:'Administrador'};
 const $=id=>document.getElementById(id);
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
 function renderRoleTools(role){
  const extras={
   professor:`<div class="section-heading"><h2>Ferramentas do professor</h2><p>Organização da prática pedagógica</p></div><div class="stats-grid"><article class="stat-card"><span>Planejamento semanal</span><strong>01</strong><small>Plano editável abaixo</small></article><article class="stat-card"><span>Registros de turma</span><strong id="teacherRecordCount">0</strong><small>Salvos neste navegador</small></article><article class="stat-card"><span>Próxima ação</span><strong>Planejar</strong><small>Defina objetivo e evidência</small></article></div><div class="toolbar-grid"><label>Objetivo da aula<input id="teacherObjective" maxlength="140" placeholder="Ex.: interpretar porcentagens no cotidiano"></label><label>Turma<input id="teacherGroup" maxlength="40" placeholder="Ex.: 8º A"></label><label>Data da aula<input id="teacherPlanDate" type="date"></label></div><label>Estratégias e evidências<textarea id="teacherPlanText" rows="3" maxlength="800" placeholder="Estratégias, recursos, adaptações e como observar a aprendizagem"></textarea></label><button class="btn" onclick="saveRoleRecord('teacherPlan')">Salvar planejamento</button><div id="teacherPlanList" class="assignment-list"></div><div class="section-heading"><h2>Registro rápido de acompanhamento</h2></div><div class="toolbar-grid"><label>Estudante (iniciais ou código)<input id="teacherStudentCode" maxlength="40" placeholder="Código interno autorizado"></label><label>Foco observado<select id="teacherObservation"><option>Participação</option><option>Compreensão</option><option>Precisa de apoio</option><option>Avanço observado</option></select></label></div><label>Observação pedagógica<textarea id="teacherObservationText" rows="2" maxlength="500" placeholder="Registre apenas o necessário, sem dados sensíveis desnecessários"></textarea></label><button class="btn btn-secondary" onclick="saveRoleRecord('teacherObservation')">Registrar observação</button><div id="teacherObservationList" class="assignment-list"></div>`,
   pedagogo:`<div class="section-heading"><h2>Ferramentas de coordenação pedagógica</h2><p>Encaminhamentos, reuniões e ciclos de acompanhamento</p></div><div class="toolbar-grid"><label>Turma / equipe<input id="pedTeam" maxlength="60" placeholder="Ex.: 8º A / equipe de Linguagens"></label><label>Prioridade<select id="pedPriority"><option>Rotina</option><option>Atenção</option><option>Prioritária</option></select></label><label>Data de revisão<input id="pedReviewDate" type="date"></label></div><label>Objetivo de acompanhamento<textarea id="pedGoal" rows="2" maxlength="500" placeholder="Qual mudança ou evidência a equipe pretende acompanhar?"></textarea></label><button class="btn" onclick="saveRoleRecord('pedCycle')">Criar ciclo de acompanhamento</button><div id="pedCycleList" class="assignment-list"></div><div class="section-heading"><h2>Pauta de reunião</h2></div><div class="toolbar-grid"><label>Tema<input id="pedMeetingTopic" maxlength="100" placeholder="Tema da reunião"></label><label>Data<input id="pedMeetingDate" type="date"></label><label>Participantes<input id="pedMeetingPeople" maxlength="160" placeholder="Equipe / docentes envolvidos"></label></div><button class="btn btn-secondary" onclick="saveRoleRecord('pedMeeting')">Salvar pauta</button><div id="pedMeetingList" class="assignment-list"></div>`,
   responsavel:`<div class="section-heading"><h2>Ferramentas da família</h2><p>Rotina de estudos e comunicação com a escola</p></div><div class="notice-card"><strong>Privacidade do estudante</strong><p>Este protótipo usa dados demonstrativos armazenados no navegador. Em produção, o vínculo familiar e as mensagens precisam de autenticação e autorização da escola.</p></div><div class="toolbar-grid"><label>Meta de estudo da semana<input id="familyGoal" maxlength="140" placeholder="Ex.: ler 20 minutos por dia"></label><label>Horário combinado<input id="familyStudyTime" type="time"></label><label>Dia para revisar a rotina<select id="familyReviewDay"><option>Segunda-feira</option><option>Terça-feira</option><option>Quarta-feira</option><option>Quinta-feira</option><option>Sexta-feira</option><option>Sábado</option><option>Domingo</option></select></label></div><button class="btn" onclick="saveRoleRecord('familyRoutine')">Salvar rotina familiar</button><div id="familyRoutineList" class="assignment-list"></div><div class="section-heading"><h2>Mensagem para a escola</h2></div><div class="toolbar-grid"><label>Assunto<select id="familyMessageSubject"><option>Dúvida sobre atividade</option><option>Solicitar reunião</option><option>Compartilhar observação</option><option>Organização da rotina</option></select></label><label>Preferência de retorno<select id="familyReplyPreference"><option>Agenda escolar</option><option>Telefone</option><option>Reunião presencial</option></select></label></div><label>Mensagem<textarea id="familyMessage" rows="3" maxlength="600" placeholder="Escreva uma mensagem respeitosa e objetiva"></textarea></label><button class="btn btn-secondary" onclick="saveRoleRecord('familyMessage')">Guardar rascunho</button><div id="familyMessageList" class="assignment-list"></div>`
  };
  if(role==='professor'||role==='pedagogo'||role==='responsavel'){
   const page=$(HOME[role]); if(page&&!page.querySelector('[data-role-tools="'+role+'"]')){const wrap=document.createElement('div');wrap.dataset.roleTools=role;wrap.className='role-tools';wrap.innerHTML=extras[role];page.appendChild(wrap);}
  }
  const profile=$('perfil'); if(profile){
   const name=localStorage.getItem('studentName')||localStorage.getItem('connectEduUsername')||'Usuário';
   const existing=profile.querySelector('.profile-card');
   if(existing){const sub=existing.querySelector('.profile-header p');if(sub)sub.textContent=role==='aluno'?'Estudante • Turma A':ROLE[role]+' • ConnectEdu PR';const input=$('nameInput');if(input){input.value=name;input.setAttribute('aria-label','Nome de exibição');}}
   const intro=profile.querySelector('.page-title p');if(intro)intro.textContent='Gerencie suas informações de exibição e preferências da conta.';
   if(!profile.querySelector('[data-profile-extra]')){const extra=document.createElement('div');extra.dataset.profileExtra='true';extra.className='notice-card';extra.innerHTML='<strong>Conta e privacidade</strong><p>Perfil ativo: '+safe(ROLE[role]||ROLE.aluno)+'. As alterações deste protótipo ficam salvas apenas neste navegador.</p><div class="form-actions"><button class="btn btn-secondary" onclick="exportMyPreferences()">Exportar minhas preferências</button><button class="btn btn-secondary" onclick="resetMyProfilePreferences()">Restaurar preferências</button></div>';profile.appendChild(extra);}
  }
 }
 function renderRecords(role){const keyMap={professor:[['teacherPlan','teacherPlanList','Plano'],['teacherObservation','teacherObservationList','Observação']],pedagogo:[['pedCycle','pedCycleList','Ciclo'],['pedMeeting','pedMeetingList','Pauta']],responsavel:[['familyRoutine','familyRoutineList','Rotina'],['familyMessage','familyMessageList','Rascunho']]};(keyMap[role]||[]).forEach(([type,id,label])=>{const el=$(id);if(!el)return;const items=read('connectEduRoleRecords_'+role,[]).filter(x=>x.type===type);el.innerHTML=items.length?items.map(x=>`<article class="assignment-item"><div><strong>${safe(x.title||label)}</strong><p>${safe(x.details||'')}</p><small>${safe(x.date||'Salvo localmente')}</small></div><span class="tag green">Salvo</span></article>`).join(''):`<div class="notice-card">Nenhum registro salvo ainda.</div>`;});const count=$('teacherRecordCount');if(count)count.textContent=read('connectEduRoleRecords_professor',[]).length;}
 window.saveRoleRecord=function(type){const role=currentRole;const fields={teacherPlan:['teacherObjective','teacherGroup','teacherPlanDate','teacherPlanText'],teacherObservation:['teacherStudentCode','teacherObservation','teacherObservationText'],pedCycle:['pedTeam','pedPriority','pedReviewDate','pedGoal'],pedMeeting:['pedMeetingTopic','pedMeetingDate','pedMeetingPeople'],familyRoutine:['familyGoal','familyStudyTime','familyReviewDay'],familyMessage:['familyMessageSubject','familyReplyPreference','familyMessage']};const ids=fields[type];if(!ids)return;const values=ids.map(id=>($(id)?.value||'').trim());if(!values.some(Boolean)){alert('Preencha pelo menos um campo antes de salvar.');return;}const title=values[0]||({teacherPlan:'Planejamento de aula',teacherObservation:'Observação de turma',pedCycle:'Ciclo de acompanhamento',pedMeeting:'Pauta de reunião',familyRoutine:'Rotina familiar',familyMessage:'Mensagem para a escola'}[type]);const recs=read('connectEduRoleRecords_'+role,[]);recs.unshift({type,title,details:values.slice(1).filter(Boolean).join(' · ')||values[0],date:new Date().toLocaleDateString('pt-BR')});localStorage.setItem('connectEduRoleRecords_'+role,JSON.stringify(recs));renderRecords(role);alert('Registro salvo neste navegador.');};
 window.exportMyPreferences=function(){const data={role:currentRole,displayName:localStorage.getItem('studentName')||'',fontSize:localStorage.getItem('connectEduFontSize')||'0',highContrast:localStorage.getItem('connectEduHighContrast')==='1',exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='conectaedu-preferencias.json';a.click();URL.revokeObjectURL(url);};
 window.resetMyProfilePreferences=function(){if(!confirm('Restaurar as preferências visuais?'))return;resetAccessibility();alert('Preferências restauradas.');};
 const oldShow=window.showPage;
 window.showPage=function(pageId,button){const role=currentRole||localStorage.getItem('connectEduRole')||'aluno';if(!(ALLOWED[role]||ALLOWED.aluno).includes(pageId)){pageId=HOME[role]||'inicio';button=null;}document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.hidden=true;});const page=$(pageId);if(page){page.hidden=false;page.classList.add('active');page.dataset.roleAllowed='true';}document.querySelectorAll('.menu button').forEach(b=>b.classList.toggle('active',b===button||(!button&&b.getAttribute('onclick')?.includes("showPage('"+pageId+"'"))));if(pageId==='notificacoes'&&typeof renderNotifications==='function')renderNotifications();if(pageId==='acessibilidade'&&typeof loadAccessibilityV7==='function')loadAccessibilityV7();if(pageId==='perfil')renderRoleTools(role);window.scrollTo({top:0,behavior:'auto'});if(window.innerWidth<=800)$('sidebar')?.classList.remove('open');};
 const oldApply=window.applyRoleUI;
 window.applyRoleUI=function(role,name,label){role=role||'aluno';const result=oldApply.call(this,role,name,label);currentRole=role;localStorage.setItem('connectEduRole',role);document.body.dataset.role=role;document.querySelectorAll('.menu li').forEach(li=>{const b=li.querySelector('button[onclick*="showPage("]');if(!b){li.hidden= !li.classList.contains('menu-group-label');return;}const m=b.getAttribute('onclick').match(/showPage\('([^']+)'/);li.hidden=!!(m&&!(ALLOWED[role]||ALLOWED.aluno).includes(m[1]));});document.querySelectorAll('.page').forEach(p=>{const ok=(ALLOWED[role]||ALLOWED.aluno).includes(p.id);p.dataset.roleAllowed=ok?'true':'false';p.hidden=!ok;p.classList.remove('active');});renderRoleTools(role);renderRecords(role);showPage(HOME[role]||'inicio',null);return result;};
 document.addEventListener('DOMContentLoaded',()=>{const role=localStorage.getItem('connectEduRole')||currentRole||'aluno';if(typeof window.applyRoleUI==='function')window.applyRoleUI(role,localStorage.getItem('studentName')||'Usuário',localStorage.getItem('connectEduUserLabel')||ROLE[role]);renderRoleTools(role);renderRecords(role);loadAccessibilityV7();});
})();

/* v14.2 — completar ações de acessibilidade presentes na interface */
function toggleReadableFont(){const on=!document.body.classList.contains('readable-font');document.body.classList.toggle('readable-font',on);localStorage.setItem('connectEduReadableFont',on?'1':'0');const b=document.getElementById('readFontToggle');if(b)b.textContent=on?'Desativar fonte amigável':'Ativar fonte amigável';}
function toggleReadingSpacing(){const on=!document.body.classList.contains('reading-spacing');document.body.classList.toggle('reading-spacing',on);localStorage.setItem('connectEduReadingSpacing',on?'1':'0');const b=document.getElementById('spacingToggle');if(b)b.textContent=on?'Restaurar espaçamento':'Aumentar espaçamento';}
function toggleReadingGuide(){const on=!document.body.classList.contains('reading-guide-on');document.body.classList.toggle('reading-guide-on',on);localStorage.setItem('connectEduReadingGuide',on?'1':'0');let guide=document.getElementById('readingGuideOverlay');if(on&&!guide){guide=document.createElement('div');guide.id='readingGuideOverlay';guide.setAttribute('aria-hidden','true');document.body.appendChild(guide);document.addEventListener('mousemove',moveReadingGuide);}if(!on){guide?.remove();document.removeEventListener('mousemove',moveReadingGuide);}const b=document.getElementById('readingGuideToggle');if(b)b.textContent=on?'Desativar guia de leitura':'Ativar guia de leitura';}
function moveReadingGuide(e){const g=document.getElementById('readingGuideOverlay');if(g)g.style.top=(e.clientY-14)+'px';}
function toggleReducedMotion(){const on=!document.body.classList.contains('reduced-motion');document.body.classList.toggle('reduced-motion',on);localStorage.setItem('connectEduReducedMotion',on?'1':'0');const b=document.getElementById('motionToggle');if(b)b.textContent=on?'Movimento reduzido ativado':'Reduzir movimento';}
function readCurrentPage(){if(!('speechSynthesis' in window)){const s=document.getElementById('speechStatus');if(s)s.textContent='Leitura em voz alta não está disponível neste navegador.';return;}stopReadingPage();const page=document.querySelector('.page.active');const text=(page?.innerText||'').trim().slice(0,12000);if(!text){return;}const utterance=new SpeechSynthesisUtterance(text);utterance.lang='pt-BR';utterance.onend=()=>{const s=document.getElementById('speechStatus');if(s)s.textContent='Leitura concluída.';};window.speechSynthesis.speak(utterance);const s=document.getElementById('speechStatus');if(s)s.textContent='Lendo o conteúdo da página…';}
function stopReadingPage(){if('speechSynthesis' in window)window.speechSynthesis.cancel();const s=document.getElementById('speechStatus');if(s)s.textContent='Leitura parada.';}
(function restoreExtendedAccessibility(){const apply=(key,cls,fn)=>{if(localStorage.getItem(key)==='1'){document.body.classList.add(cls);if(fn)fn();}};apply('connectEduReadableFont','readable-font',()=>{const b=document.getElementById('readFontToggle');if(b)b.textContent='Desativar fonte amigável';});apply('connectEduReadingSpacing','reading-spacing',()=>{const b=document.getElementById('spacingToggle');if(b)b.textContent='Restaurar espaçamento';});apply('connectEduReducedMotion','reduced-motion',()=>{const b=document.getElementById('motionToggle');if(b)b.textContent='Movimento reduzido ativado';});if(localStorage.getItem('connectEduReadingGuide')==='1')toggleReadingGuide();})();
function resetAccessibility(){['connectEduFontSize','connectEduHighContrast','connectEduReadableFont','connectEduReadingSpacing','connectEduReadingGuide','connectEduReducedMotion'].forEach(k=>localStorage.removeItem(k));document.body.classList.remove('font-large','font-xlarge','high-contrast','readable-font','reading-spacing','reading-guide-on','reduced-motion');document.getElementById('readingGuideOverlay')?.remove();document.removeEventListener('mousemove',moveReadingGuide);changeFontSize(0);const ids={contrastToggle:'Ativar alto contraste',readFontToggle:'Ativar fonte amigável',spacingToggle:'Aumentar espaçamento',readingGuideToggle:'Ativar guia de leitura',motionToggle:'Reduzir movimento'};Object.entries(ids).forEach(([id,label])=>{const el=document.getElementById(id);if(el)el.textContent=label;});}


/* v14.3 — navegação compartilhada estável para todos os perfis */
(function(){
 const roleHome={aluno:'inicio',professor:'docente',pedagogo:'pedagogico',responsavel:'familia',admin:'administracao'};
 const rolePages={
  aluno:['inicio','hub-escola','hub-treinar','hub-score','hub-desempenho','ranking','atividades','plataformas','calendario','progresso','conquistas','pet','escola','ia','disciplinas','biblioteca','notificacoes','acessibilidade','perfil'],
  professor:['docente','atividades','banco','habilidades','biblioteca','calendario','notificacoes','acessibilidade','perfil','escola'],
  pedagogo:['pedagogico','habilidades','escola','biblioteca','calendario','notificacoes','acessibilidade','perfil','banco'],
  responsavel:['familia','calendario','notificacoes','acessibilidade','perfil'],
  admin:['administracao','docente','pedagogico','familia','habilidades','banco','biblioteca','escola','calendario','notificacoes','acessibilidade','perfil']
 };
 const roleNames={aluno:'Estudante',professor:'Professor(a)',pedagogo:'Pedagogo(a)',responsavel:'Responsável',admin:'Administrador(a)'};
 const $=id=>document.getElementById(id);
 function activeRole(){return currentRole||localStorage.getItem('connectEduRole')||'aluno';}
 window.showPage=function(pageId,button){
  const role=activeRole(),allowed=rolePages[role]||rolePages.aluno;
  if(!allowed.includes(pageId))pageId=roleHome[role]||'inicio';
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.hidden=true;});
  const page=$(pageId);
  if(page){page.hidden=false;page.classList.add('active');page.dataset.roleAllowed='true';}
  document.querySelectorAll('.menu button').forEach(b=>b.classList.toggle('active',b===button||(!button&&b.getAttribute('onclick')?.includes("showPage('"+pageId+"'"))));
  if(pageId==='notificacoes'&&typeof renderNotifications==='function')renderNotifications();
  if(pageId==='acessibilidade'&&typeof loadAccessibilityV7==='function')loadAccessibilityV7();
  if(pageId==='perfil'){
   if(typeof renderRoleTools==='function'){} // ferramentas de perfil são atualizadas pelo wrapper abaixo
   if(typeof updateProfile==='function')updateProfile();
   const name=$('profileName');if(name&&!localStorage.getItem('studentName'))name.textContent=localStorage.getItem('connectEduUsername')||roleNames[role]||'Usuário';
   const detail=document.querySelector('#perfil .profile-header p');if(detail)detail.textContent=roleNames[role]||'Usuário';
  }
  window.scrollTo({top:0,behavior:'auto'});
  if(window.innerWidth<=800)$('sidebar')?.classList.remove('open');
 };
 const priorApply=window.applyRoleUI;
 window.applyRoleUI=function(role,name,label){
  role=role||'aluno';currentRole=role;localStorage.setItem('connectEduRole',role);
  if(name)localStorage.setItem('studentName',name);
  if(label)localStorage.setItem('connectEduUserLabel',label);
  document.body.dataset.role=role;
  if(typeof priorApply==='function'){try{priorApply.call(this,role,name,label);}catch(e){console.warn('Ajuste de perfil aplicado com fallback.',e);}}
  const allowed=rolePages[role]||rolePages.aluno;
  document.querySelectorAll('.menu li').forEach(li=>{
   const b=li.querySelector('button[onclick*="showPage("]');
   if(!b){li.hidden=!li.classList.contains('menu-group-label');return;}
   const m=b.getAttribute('onclick').match(/showPage\('([^']+)'/);
   li.hidden=!!(m&&!allowed.includes(m[1]));
  });
  document.querySelectorAll('.page').forEach(p=>{const ok=allowed.includes(p.id);p.dataset.roleAllowed=ok?'true':'false';p.hidden=!ok;p.classList.remove('active');});
  if(typeof renderNotifications==='function')renderNotifications();
  if(typeof loadAccessibilityV7==='function')loadAccessibilityV7();
  if(typeof renderRoleTools==='function'){};
  window.showPage(roleHome[role]||'inicio',null);
  return true;
 };
 // Reforça ações das três áreas compartilhadas e impede dependência da página inicial do aluno.
 document.addEventListener('click',function(e){
  const b=e.target.closest('.menu button[onclick*="showPage("]');if(!b)return;
  const m=b.getAttribute('onclick').match(/showPage\('([^']+)'/);if(!m)return;
  if(['notificacoes','acessibilidade','perfil'].includes(m[1])){
   e.preventDefault();e.stopImmediatePropagation();window.showPage(m[1],b);
  }
 },true);
 document.addEventListener('DOMContentLoaded',function(){
  const role=localStorage.getItem('connectEduRole')||currentRole||'aluno';
  window.applyRoleUI(role,localStorage.getItem('studentName')||'Usuário',localStorage.getItem('connectEduUserLabel')||roleNames[role]);
  ['connectEduReadableFont','connectEduReadingSpacing','connectEduReducedMotion'].forEach((key)=>{if(localStorage.getItem(key)==='1'){const cls={connectEduReadableFont:'readable-font',connectEduReadingSpacing:'reading-spacing',connectEduReducedMotion:'reduced-motion'}[key];document.body.classList.add(cls);}});
  if(localStorage.getItem('connectEduReadingGuide')==='1'&&!document.body.classList.contains('reading-guide-on')&&typeof toggleReadingGuide==='function')toggleReadingGuide();
 });
})();
