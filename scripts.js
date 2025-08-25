const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');

// Novos elementos
const loginCard = document.getElementById('loginCard');
const userInput = document.getElementById('userInput');
const btnLogin = document.getElementById('btnLogin');
const app = document.getElementById('app');
const who = document.getElementById('who');
const btnViewAll = document.getElementById('btnViewAll');
const btnViewMine = document.getElementById('btnViewMine');
const btnCreateTable = document.getElementById('btnCreateTable');
const btnLogout = document.getElementById('btnLogout');
const modal = document.getElementById('modal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnModalCreate = document.getElementById('btnModalCreate');

// Sessão na aba (sem autenticação real)
function getUser(){ return sessionStorage.getItem('user') || ''; }
function setUser(u){ if(u){ sessionStorage.setItem('user', u); } else { sessionStorage.removeItem('user'); } }

// Visão atual: 'all' | 'mine'
function getView(){ return sessionStorage.getItem('view') || 'all'; }
function setView(v){ sessionStorage.setItem('view', v); }

// "Tabelas" sem BD (LocalStorage)
function keyUser(u){ return 'lista:' + u; }
function getAll(){ try{ return JSON.parse(localStorage.getItem('lista')||'[]'); }catch(e){ return []; } }
function setAll(arr){ localStorage.setItem('lista', JSON.stringify(arr)); }
function getMine(u){ try{ return JSON.parse(localStorage.getItem(keyUser(u))||'[]'); }catch(e){ return []; } }
function setMine(u, arr){ localStorage.setItem(keyUser(u), JSON.stringify(arr)); }
function ensureMyTable(u){ if(localStorage.getItem(keyUser(u))===null) setMine(u, []); }

let minhaListaDeItens = []; // cache da visão renderizada

function entrar(){
  const u = (userInput.value||'').trim().toLowerCase();
  if(!u){ alert('Informe um usuário.'); return; }
  setUser(u);
  ensureMyTable(u);
  loginCard.style.display = 'none';
  app.style.display = 'block';
  who && (who.textContent = u);
  setView('all');
  recarregarTarefas();
}

function sair(){
  setUser('');
  app.style.display = 'none';
  loginCard.style.display = 'block';
  userInput.focus();
}

// Adicionar tarefa com dono
function adicionarNovaTarefa() {
  const tarefaTexto = (input.value||'').trim();
  const u = getUser();
  if (!u){ alert('Entre com um usuário primeiro.'); return; }
  if (tarefaTexto === '') {
    alert('Por favor, insira uma tarefa antes de adicionar.');
    return;
  }

  const novoItem = { tarefa: tarefaTexto, concluida: false, owner: u };

  // Adiciona no global
  const all = getAll();
  all.unshift(novoItem);
  setAll(all);

  // Espelha na tabela do usuário
  const mine = getMine(u);
  mine.unshift(novoItem);
  setMine(u, mine);

  input.value = '';
  recarregarTarefas();
}

// Renderiza conforme visão
function mostrarTarefas() {
  let novaLi = '';
  if(minhaListaDeItens.length === 0){
    listaCompleta.innerHTML = '<li class="task"><p>Nenhum item</p></li>';
    return;
  }

  minhaListaDeItens.forEach((item, posicao) => {
    const owner = item.owner || 'desconhecido';
    novaLi += `
      <li class="task ${item.concluida ? 'done' : ''}" data-pos="${posicao}">
        <img src="./img/checked.png" alt="check-na-tarefa" class="btn-check">
        <div>
          <p>${escapeHtml(item.tarefa)}</p>
          <span class="owner">Dono: ${escapeHtml(owner)}</span>
        </div>
        <img src="./img/trash.png" alt="tarefa-para-o-lixo" class="btn-del">
      </li>
    `;
  });

  listaCompleta.innerHTML = novaLi;
}

// Segurança simples contra HTML
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Alterna concluída — com trava por dono
function concluirTarefa(posicao) {
  const u = getUser();
  const view = getView();
  let source = (view === 'mine') ? getMine(u) : getAll();
  const item = source[posicao];
  if(!item) return;

  if(item.owner !== u){
    abrirModalNegado();
    return;
  }

  item.concluida = !item.concluida;
  // Salva fonte
  if(view === 'mine'){
    setMine(u, source);
    // também refletir no global
    const all = getAll();
    const idx = all.findIndex(x => x.tarefa === item.tarefa && x.owner === item.owner && x.concluida !== item.concluida);
    // índice por id seria melhor; aqui mantemos simples
    setAll(all.map(it => (it.tarefa===item.tarefa && it.owner===item.owner) ? { ...it, concluida:item.concluida } : it));
  }else{
    setAll(source);
    // refletir no mine
    const mine = getMine(u);
    const i2 = mine.findIndex(it => it.tarefa===item.tarefa && it.owner===item.owner);
    if(i2>=0){ mine[i2].concluida = item.concluida; setMine(u, mine); }
  }

  recarregarTarefas();
}

// Deletar — com trava por dono
function deletarItem(posicao) {
  const u = getUser();
  const view = getView();
  let source = (view === 'mine') ? getMine(u) : getAll();
  const item = source[posicao];
  if(!item) return;

  if(item.owner !== u){
    abrirModalNegado();
    return;
  }

  source.splice(posicao, 1);
  if(view === 'mine'){
    setMine(u, source);
    // remove do global
    const all = getAll().filter(it => !(it.tarefa===item.tarefa && it.owner===item.owner));
    setAll(all);
  }else{
    setAll(source);
    // remove do mine
    const mine = getMine(u).filter(it => !(it.tarefa===item.tarefa && it.owner===item.owner));
    setMine(u, mine);
  }

  recarregarTarefas();
}

// Recarrega do LocalStorage conforme visão
function recarregarTarefas() {
  const u = getUser();
  const view = getView();
  if(!u){
    minhaListaDeItens = [];
    mostrarTarefas();
    return;
  }

  if(view === 'mine'){
    minhaListaDeItens = getMine(u);
  }else{
    minhaListaDeItens = getAll();
  }

  mostrarTarefas();
}

// Modal
function abrirModalNegado(){ if(modal) modal.style.display = 'flex'; }
function fecharModalNegado(){ if(modal) modal.style.display = 'none'; }
function criarMinhaTabela(){ const u = getUser(); ensureMyTable(u); setView('mine'); fecharModalNegado(); recarregarTarefas(); }

// Eventos
if(btnLogin) btnLogin.addEventListener('click', entrar);
if(userInput) userInput.addEventListener('keydown', e => { if(e.key==='Enter') entrar(); });
if(btnLogout) btnLogout.addEventListener('click', sair);
if(button) button.addEventListener('click', adicionarNovaTarefa);

if(btnViewAll) btnViewAll.addEventListener('click', () => { setView('all'); recarregarTarefas(); });
if(btnViewMine) btnViewMine.addEventListener('click', () => { setView('mine'); recarregarTarefas(); });
if(btnCreateTable) btnCreateTable.addEventListener('click', () => { const u=getUser(); if(!u){alert('Entre com um usuário primeiro.');return;} ensureMyTable(u); alert('Sua tabela pessoal foi criada (ou já existia).'); });

if(btnCloseModal) btnCloseModal.addEventListener('click', fecharModalNegado);
if(btnModalCreate) btnModalCreate.addEventListener('click', criarMinhaTabela);

// Delegação de eventos para os ícones da lista
if(listaCompleta){
  listaCompleta.addEventListener('click', (e)=>{
    const li = e.target.closest('li.task');
    if(!li) return;
    const pos = parseInt(li.getAttribute('data-pos'), 10);
    if(e.target.classList.contains('btn-check')) concluirTarefa(pos);
    if(e.target.classList.contains('btn-del')) deletarItem(pos);
  });
}

// Boot
(function init(){
  if(getUser()){
    loginCard.style.display='none';
    app.style.display='block';
    who && (who.textContent = getUser());
    recarregarTarefas();
  }else{
    loginCard.style.display='block';
    app.style.display='none';
    userInput && userInput.focus();
  }
})();
