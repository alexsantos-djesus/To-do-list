// Estado
var state = { user: '', view: 'all', items: [] };

// Seletores
var loginCard = document.getElementById('loginCard');
var userInput = document.getElementById('userInput');
var btnLogin  = document.getElementById('btnLogin');
var app       = document.getElementById('app');
var who       = document.getElementById('who');
var btnViewAll = document.getElementById('btnViewAll');
var btnViewMine = document.getElementById('btnViewMine');
var btnCreateTable = document.getElementById('btnCreateTable');
var btnLogout = document.getElementById('btnLogout');
var input = document.querySelector('.input-task');
// var button = document.querySelector('.button-add-task');
var btnAdd = document.getElementById("btnAdd");
var listaCompleta = document.querySelector('.list-tasks');
var modal = document.getElementById('modal');
var btnCloseModal = document.getElementById('btnCloseModal');
var btnModalCreate = document.getElementById('btnModalCreate');

function api(path, opts){
  opts = opts || {};
  opts.headers = opts.headers || {};
  if(!(opts.body instanceof FormData) && (!opts.headers['Content-Type'])){
    // default to form encoding for POST bodies that are plain objects
    if(opts.method && opts.method.toUpperCase() === 'POST' && opts.body && typeof opts.body === 'object'){
      var params = new URLSearchParams();
      for(var k in opts.body){ params.append(k, opts.body[k]); }
      opts.body = params.toString();
      opts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
  }
  return fetch(path, opts).then(function(res){
    return res.json().then(function(data){ return { status: res.status, data: data }; });
  });
}

function render(){
  if(!listaCompleta) return;
  if(state.items.length === 0){
    listaCompleta.innerHTML = '<li class="task"><p>Nenhum item</p></li>';
    return;
  }
  var me = state.user;
  var html = state.items.map(function(item, idx){
    var isMine = item.owner === me;
    var actionsHtml = isMine
      ? '<img src="./img/checked.png" alt="check" class="btn-check"> <img src="./img/trash.png" alt="trash" class="btn-del">'
      : '<span class="readonly-badge">somente leitura</span>';
    return '<li class="task '+(item.done?'done':'')+'" data-id="'+item.id+'">'+
             '<div><p>'+escapeHtml(item.text)+'</p><span class="owner">Dono: '+escapeHtml(item.owner)+'</span></div>'+
             '<div class="icons">'+ actionsHtml +'</div>'+
           '</li>';
  }).join('');
  listaCompleta.innerHTML = html;
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function loadWho(){
  return api('api/whoami.php').then(function(resp){
    state.user = (resp.data && resp.data.user) ? resp.data.user : '';
    if(state.user){
      loginCard.style.display = 'none';
      app.style.display = 'block';
      who.textContent = state.user;
    }else{
      loginCard.style.display = 'block';
      app.style.display = 'none';
    }
    return state.user;
  });
}

function login(){
  var u = (userInput.value||'').trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
  if(!u){ alert('Informe um usuário (apenas letras, números e _).'); return; }
  api('api/login.php', { method:'POST', body:{ user: u }}).then(function(resp){
    if(resp.status === 200 && resp.data.ok){
      state.user = resp.data.user;
      who.textContent = state.user;
      loginCard.style.display = 'none';
      app.style.display = 'block';
      setView('all');
      reload();
    }else{
      alert('Falha ao entrar.');
    }
  });
}

function logout(){
  api('api/logout.php', { method:'POST' }).then(function(){
    state.user = '';
    loginCard.style.display = 'block';
    app.style.display = 'none';
  });
}

function setView(v){ state.view = v; sessionStorage.setItem('view', v); }
function getView(){ return sessionStorage.getItem('view') || 'all'; }

function reload(){
  var v = state.view || getView();
  var url = 'api/list.php?view='+encodeURIComponent(v);
  api(url).then(function(resp){
    state.items = resp.data.items || [];
    render();
  });
}

function addTask(){
  var txt = (input.value||'').trim();
  if(!txt){ alert('Digite a tarefa.'); return; }
  api('api/add.php', { method:'POST', body:{ text: txt }}).then(function(resp){
    if(resp.status === 401){ alert('Entre primeiro.'); return; }
    if(resp.status !== 200 || !resp.data.ok){ alert('Não foi possível adicionar.'); return; }
    input.value='';
    reload();
  });
}

function toggleTask(id){
  api('api/toggle.php', { method:'POST', body:{ id: id }}).then(function(resp){
    if(resp.status === 403){
      openDenied();
      return;
    }
    reload();
  });
}

function deleteTask(id){
  api('api/delete.php', { method:'POST', body:{ id: id }}).then(function(resp){
    if(resp.status === 403){
      openDenied();
      return;
    }
    reload();
  });
}

// Modal
function openDenied(){ modal.style.display='flex'; }
function closeDenied(){ modal.style.display='none'; }
function createTable(){
  api('api/create_table.php', { method:'POST' }).then(function(resp){
    setView('mine');
    closeDenied();
    reload();
  });
}

// Eventos
if(btnLogin) btnLogin.addEventListener('click', login);
if(userInput) userInput.addEventListener('keydown', function(e){ if(e.key==='Enter') login(); });
if(btnLogout) btnLogout.addEventListener('click', logout);
// if(button) button.addEventListener('click', addTask);
if (btnAdd) btnAdd.addEventListener("click", addTask);
if(input) input.addEventListener('keydown', function(e){ if(e.key==='Enter') addTask(); });
if(btnViewAll) btnViewAll.addEventListener('click', function(){ setView('all'); reload(); });
if(btnViewMine) btnViewMine.addEventListener('click', function(){ setView('mine'); reload(); });
if(btnCreateTable) btnCreateTable.addEventListener('click', createTable);
if(btnCloseModal) btnCloseModal.addEventListener('click', closeDenied);
if(btnModalCreate) btnModalCreate.addEventListener('click', createTable);

if(listaCompleta){
  listaCompleta.addEventListener('click', function(e){
    var li = e.target.closest('li.task');
    if(!li) return;
    var id = li.getAttribute('data-id');
    if(e.target.classList.contains('btn-check')) toggleTask(id);
    if(e.target.classList.contains('btn-del')) deleteTask(id);
  });
}

// Boot
loadWho().then(function(){
  setView(getView());
  if(state.user){ reload(); }
});
