/* ConnectEdu PR — correção definitiva de navegação, preferências e chat por turma.
   Protótipo local: o chat persiste no navegador e não substitui um backend multiusuário. */
(function () {
  'use strict';
  const HOME = { aluno: 'inicio', professor: 'docente', pedagogo: 'pedagogico', responsavel: 'familia', admin: 'administracao' };
  const ALLOWED = {
    aluno: ['inicio','hub-escola','hub-treinar','hub-score','hub-desempenho','ranking','atividades','plataformas','calendario','progresso','conquistas','pet','escola','ia','disciplinas','biblioteca','notificacoes','acessibilidade','perfil'],
    professor: ['docente','atividades','banco','habilidades','biblioteca','calendario','notificacoes','acessibilidade','perfil','escola','turma-chat'],
    pedagogo: ['pedagogico','habilidades','escola','biblioteca','calendario','notificacoes','acessibilidade','perfil','banco','turma-chat'],
    responsavel: ['familia','calendario','notificacoes','acessibilidade','perfil'],
    admin: ['administracao','docente','pedagogico','familia','habilidades','banco','biblioteca','escola','calendario','notificacoes','acessibilidade','perfil']
  };
  const ROLE_LABEL = { aluno: 'Estudante', professor: 'Professor(a)', pedagogo: 'Pedagogo(a)', responsavel: 'Responsável', admin: 'Administrador(a)' };
  const GROUPS = [
    ['6A','6º ano A'], ['6B','6º ano B'], ['7A','7º ano A'], ['7B','7º ano B'],
    ['8A','8º ano A'], ['8B','8º ano B'], ['9A','9º ano A'], ['9B','9º ano B'],
    ['1EM','1º ano do Ensino Médio'], ['2EM','2º ano do Ensino Médio'], ['3EM','3º ano do Ensino Médio']
  ];
  const CHAT_KEY = 'connectEduClassChatsV1';
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const activeRole = () => ALLOWED[currentRole] ? currentRole : (ALLOWED[localStorage.getItem('connectEduRole')] ? localStorage.getItem('connectEduRole') : 'aluno');
  const parse = (value, fallback) => { try { const result = JSON.parse(value); return result == null ? fallback : result; } catch (_) { return fallback; } };
  const readChats = () => parse(localStorage.getItem(CHAT_KEY), {});
  const writeChats = data => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(data)); return true; } catch (_) { setChatStatus('Não foi possível salvar neste navegador. Verifique o espaço disponível.'); return false; } };

  // Substitui os wrappers acumulados por uma única navegação previsível.
  window.showPage = function (pageId, button) {
    const role = activeRole();
    const allowed = ALLOWED[role] || ALLOWED.aluno;
    if (!allowed.includes(pageId)) pageId = HOME[role] || 'inicio';
    let page = $(pageId);
    if (!page) { pageId = HOME[role] || 'inicio'; page = $(pageId); }
    document.querySelectorAll('.page').forEach(item => {
      item.classList.remove('active');
      item.hidden = true;
      item.dataset.roleAllowed = allowed.includes(item.id) ? 'true' : 'false';
    });
    if (page) {
      page.hidden = false;
      page.dataset.roleAllowed = 'true';
      page.classList.add('active');
    }
    document.querySelectorAll('.menu button').forEach(item => item.classList.toggle('active', item === button || (!button && (item.getAttribute('onclick') || '').includes("showPage('" + pageId + "'"))));
    if (pageId === 'notificacoes') { if (typeof window.renderNotifications === 'function') window.renderNotifications(); }
    if (pageId === 'acessibilidade') { if (typeof window.loadAccessibilityV7 === 'function') window.loadAccessibilityV7(); syncAccessibilityLabels(); }
    if (pageId === 'perfil') refreshProfile();
    if (pageId === 'turma-chat') renderClassChat();
    if (pageId === 'docente' && typeof window.renderAssignmentsV8 === 'function') window.renderAssignmentsV8();
    if (pageId === 'pedagogico' && typeof window.renderPedActionsV8 === 'function') window.renderPedActionsV8();
    if (pageId === 'familia' && typeof window.renderFamily === 'function') window.renderFamily();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.innerWidth <= 800) $('sidebar')?.classList.remove('open');
    return false;
  };

  window.applyRoleUI = function (role, name, label) {
    role = ALLOWED[role] ? role : 'aluno';
    const displayName = String(name || localStorage.getItem('studentName') || ROLE_LABEL[role]);
    const displayLabel = String(label || ROLE_LABEL[role]);
    try { currentRole = role; currentUserLabel = displayLabel; } catch (_) { /* global bindings may be read-only in embedded hosts */ }
    localStorage.setItem('connectEduRole', role);
    localStorage.setItem('connectEduUserLabel', displayLabel);
    localStorage.setItem('studentName', displayName);
    document.body.dataset.role = role;
    const topName = $('topName'); if (topName) topName.textContent = displayName;
    const topRole = $('topRole'); if (topRole) topRole.textContent = displayLabel + (role === 'aluno' || role === 'responsavel' ? ' • 8º Ano • Turma A' : ' • Connect Edu PR');

    document.querySelectorAll('.menu > li').forEach(li => {
      const btn = li.querySelector('button[onclick*="showPage("]');
      if (!btn) { li.hidden = !li.classList.contains('menu-group-label'); return; }
      const match = (btn.getAttribute('onclick') || '').match(/showPage\(\s*['"]([^'"]+)['"]/);
      li.hidden = !!(match && !((ALLOWED[role] || ALLOWED.aluno).includes(match[1])));
    });
    document.querySelectorAll('.page').forEach(page => {
      const allowed = (ALLOWED[role] || ALLOWED.aluno).includes(page.id);
      page.dataset.roleAllowed = allowed ? 'true' : 'false';
      page.hidden = !allowed;
      page.classList.remove('active');
    });
    refreshProfile();
    if (typeof window.renderNotifications === 'function') window.renderNotifications();
    if (typeof window.loadAccessibilityV7 === 'function') window.loadAccessibilityV7();
    syncAccessibilityLabels();
    const navItems = Array.from(document.querySelectorAll('.menu > li'));
    navItems.filter(li => li.classList.contains('menu-group-label')).forEach(li => {
      let sibling = li.nextElementSibling, hasVisible = false;
      while (sibling && !sibling.classList.contains('menu-group-label')) { if (!sibling.hidden) hasVisible = true; sibling = sibling.nextElementSibling; }
      li.hidden = !hasVisible;
    });
    window.showPage(HOME[role] || 'inicio', null);
    return true;
  };

  function refreshProfile() {
    const role = activeRole();
    const name = localStorage.getItem('studentName') || localStorage.getItem('connectEduUsername') || ROLE_LABEL[role] || 'Usuário';
    const heading = $('profileName'); if (heading) heading.textContent = name;
    const input = $('nameInput'); if (input) input.value = name;
    const initials = document.querySelector('#perfil .big-avatar');
    if (initials) initials.textContent = name.trim().split(/\s+/).slice(0,2).map(part => part[0] || '').join('').toUpperCase() || 'U';
    const detail = document.querySelector('#perfil .profile-header p');
    if (detail) detail.textContent = role === 'aluno' ? 'Estudante • Turma A' : ROLE_LABEL[role] + ' • ConnectEdu PR';
    const topName = $('topName'); if (topName) topName.textContent = name;
  }
  window.updateProfile = refreshProfile;
  window.saveProfile = function () {
    const input = $('nameInput');
    const name = input ? input.value.trim() : '';
    if (!name) { alert('Digite seu nome antes de salvar.'); input?.focus(); return; }
    localStorage.setItem('studentName', name);
    refreshProfile();
    alert('Perfil atualizado com sucesso neste navegador.');
  };

  // Mantém os mesmos controles de leitura, contraste e preferências em qualquer perfil.
  function syncAccessibilityLabels() {
    const contrast = $('contrastToggle'); if (contrast) contrast.textContent = document.body.classList.contains('high-contrast') ? 'Desativar alto contraste' : 'Ativar alto contraste';
    const readable = $('readFontToggle'); if (readable) readable.textContent = document.body.classList.contains('readable-font') ? 'Desativar fonte amigável' : 'Ativar fonte amigável';
    const spacing = $('spacingToggle'); if (spacing) spacing.textContent = document.body.classList.contains('reading-spacing') ? 'Restaurar espaçamento' : 'Aumentar espaçamento';
    const guide = $('readingGuideToggle'); if (guide) guide.textContent = document.body.classList.contains('reading-guide-on') ? 'Desativar guia de leitura' : 'Ativar guia de leitura';
    const motion = $('motionToggle'); if (motion) motion.textContent = document.body.classList.contains('reduced-motion') ? 'Movimento reduzido ativado' : 'Reduzir movimento';
    const size = Number(localStorage.getItem('connectEduFontSize') || '0');
    const status = $('fontSizeStatus'); if (status) status.textContent = ['Tamanho padrão','Texto ampliado','Texto extra ampliado'][Math.max(0,Math.min(2,size))];
  }
  const previousFontChange = window.changeFontSize;
  window.changeFontSize = function (direction) { if (typeof previousFontChange === 'function') previousFontChange(direction); syncAccessibilityLabels(); };
  const previousContrast = window.toggleHighContrast;
  window.toggleHighContrast = function () { if (typeof previousContrast === 'function') previousContrast(); else { const on = !document.body.classList.contains('high-contrast'); document.body.classList.toggle('high-contrast', on); localStorage.setItem('connectEduHighContrast', on ? '1' : '0'); } syncAccessibilityLabels(); };
  ['toggleReadableFont','toggleReadingSpacing','toggleReadingGuide','toggleReducedMotion'].forEach(key => {
    const fn = window[key]; if (typeof fn === 'function') { window[key] = function () { fn(); syncAccessibilityLabels(); }; }
  });
  const previousReset = window.resetAccessibility;
  window.resetAccessibility = function () { if (typeof previousReset === 'function') previousReset(); else { document.body.classList.remove('font-large','font-xlarge','high-contrast','readable-font','reading-spacing','reading-guide-on','reduced-motion'); ['connectEduFontSize','connectEduHighContrast','connectEduReadableFont','connectEduReadingSpacing','connectEduReadingGuide','connectEduReducedMotion'].forEach(k=>localStorage.removeItem(k)); } syncAccessibilityLabels(); };

  // Chat separado por turma. Mensagens e canais persistem neste navegador.
  window.openClassChat = function (button) { window.showPage('turma-chat', button || null); };
  window.selectClassChat = function (groupId) {
    const selector = $('classChatChannel'); if (selector) selector.value = groupId;
    renderClassChat();
  };
  window.renderClassChat = renderClassChat;
  function renderClassChat() {
    const selector = $('classChatChannel'), list = $('classChatMessages'), channelList = $('classChatChannels');
    if (!selector || !list) return;
    const current = GROUPS.find(group => group[0] === selector.value) || GROUPS[4];
    selector.value = current[0];
    const heading = $('classChatTitle'); if (heading) heading.textContent = 'Canal · ' + current[1];
    const sub = $('classChatSubtitle'); if (sub) sub.textContent = 'Professores e equipe pedagógica • ' + current[1];
    const chats = readChats(), messages = Array.isArray(chats[current[0]]) ? chats[current[0]] : [];
    if (channelList) channelList.innerHTML = GROUPS.map(group => {
      const total = Array.isArray(chats[group[0]]) ? chats[group[0]].length : 0;
      return `<button type="button" class="chat-channel ${group[0] === current[0] ? 'selected' : ''}" onclick="selectClassChat('${group[0]}')"><span class="chat-channel-icon">${group[0].includes('EM') ? 'EM' : group[0][0]+'º'}</span><span class="chat-channel-name">${esc(group[1])}<small>${total ? total + (total === 1 ? ' mensagem' : ' mensagens') : 'Sem mensagens'}</small></span><span class="chat-channel-arrow">›</span></button>`;
    }).join('');
    list.innerHTML = messages.length ? messages.map(message => {
      const own = message.senderId === (localStorage.getItem('connectEduUsername') || 'demo.' + activeRole());
      let when = '';
      try { when = new Date(message.createdAt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }); } catch (_) { when = ''; }
      return `<article class="class-chat-message ${own ? 'own' : ''}"><div class="class-chat-message-meta"><strong>${esc(message.sender || 'Usuário')}</strong><span>${esc(message.roleLabel || 'Equipe')} · ${esc(when)}</span></div><p>${esc(message.text).replace(/\n/g,'<br>')}</p></article>`;
    }).join('') : '<div class="chat-empty"><span>💬</span><strong>Conversa começando</strong><p>Ainda não há mensagens neste canal. Envie uma mensagem para iniciar a conversa com os colegas desta turma.</p></div>';
    list.scrollTop = list.scrollHeight;
    const input = $('classChatInput'); if (input) input.placeholder = 'Escreva uma mensagem para ' + current[1] + '…';
    setChatStatus('Canal selecionado: ' + current[1] + '.');
  }
  function setChatStatus(message) { const status = $('classChatStatus'); if (status) status.textContent = message; }
  window.exportClassChat = function () {
    const selector = $('classChatChannel'); if (!selector) return;
    const group = GROUPS.find(item => item[0] === selector.value) || GROUPS[4];
    const messages = readChats()[group[0]] || [];
    const content = JSON.stringify({ channel: group[1], exportedAt: new Date().toISOString(), messages }, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'conectaedu-chat-' + group[0] + '.json'; link.click(); URL.revokeObjectURL(url);
    setChatStatus('Conversa exportada em arquivo JSON.');
  };
  function sendClassChatMessage(event) {
    event.preventDefault();
    const role = activeRole();
    if (role !== 'professor' && role !== 'pedagogo' && role !== 'admin') { setChatStatus('O chat está disponível para professores e pedagogos.'); return; }
    const input = $('classChatInput'), text = input ? input.value.trim() : '';
    if (!text) { setChatStatus('Digite uma mensagem antes de enviar.'); input?.focus(); return; }
    if (text.length > 2000) { setChatStatus('A mensagem deve ter até 2.000 caracteres.'); return; }
    const selector = $('classChatChannel'); const group = GROUPS.find(item => item[0] === selector?.value) || GROUPS[4];
    const chats = readChats(); if (!Array.isArray(chats[group[0]])) chats[group[0]] = [];
    const senderId = localStorage.getItem('connectEduUsername') || 'demo.' + role;
    const sender = localStorage.getItem('studentName') || ROLE_LABEL[role];
    chats[group[0]].push({ id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), senderId, sender, role, roleLabel: ROLE_LABEL[role], text, createdAt: new Date().toISOString() });
    if (!writeChats(chats)) return;
    input.value = '';
    renderClassChat();
    setChatStatus('Mensagem enviada para o canal ' + group[1] + '.');
    input.focus();
  }

  document.addEventListener('click', function (event) {
    const button = event.target.closest('button[onclick*="showPage("]');
    if (!button) return;
    const match = (button.getAttribute('onclick') || '').match(/showPage\(\s*['"]([^'"]+)['"]/);
    if (!match) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.showPage(match[1], button.closest('.menu') ? button : null);
  }, true);

  document.addEventListener('submit', function (event) {
    if (event.target && event.target.id === 'classChatForm') sendClassChatMessage(event);
  });
  window.addEventListener('storage', event => { if (event.key === CHAT_KEY && $('turma-chat')?.classList.contains('active')) renderClassChat(); });
  document.addEventListener('DOMContentLoaded', function () {
    const role = localStorage.getItem('connectEduRole') || (typeof currentRole !== 'undefined' ? currentRole : 'aluno') || 'aluno';
    const name = localStorage.getItem('studentName') || localStorage.getItem('connectEduUsername') || ROLE_LABEL[role] || 'Usuário';
    const label = localStorage.getItem('connectEduUserLabel') || ROLE_LABEL[role] || 'Estudante';
    window.applyRoleUI(role, name, label);
    const selector = $('classChatChannel'); if (selector && !selector.value) selector.value = '8A';
    renderClassChat();
    syncAccessibilityLabels();
  });
})();
