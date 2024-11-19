const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');

let minhaListaDeItens = [];

// Função para adicionar uma nova tarefa
function adicionarNovaTarefa() {
  const tarefaTexto = input.value.trim(); // Remove espaços extras

  // Verifica se a tarefa está vazia
  if (tarefaTexto === '') {
    alert('Por favor, insira uma tarefa antes de adicionar.');
    return; // Impede a execução do restante da função
  }

  // Adiciona a tarefa à lista
  minhaListaDeItens.push({
    tarefa: tarefaTexto,
    concluida: false,
  });

  input.value = ''; // Limpa o campo de entrada

  mostrarTarefas();
}

// Função para exibir as tarefas
function mostrarTarefas() {
  let novaLi = '';

  minhaListaDeItens.forEach((item, posicao) => {
    novaLi += `
        <li class="task ${item.concluida ? 'done' : ''}">
            <img src="./img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
            <p>${item.tarefa}</p>
            <img src="./img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
        </li>
    `;
  });

  listaCompleta.innerHTML = novaLi;

  // Salva no Local Storage
  localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

// Função para marcar uma tarefa como concluída
function concluirTarefa(posicao) {
  minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida;

  mostrarTarefas();
}

// Função para deletar uma tarefa
function deletarItem(posicao) {
  minhaListaDeItens.splice(posicao, 1);

  mostrarTarefas();
}

// Função para recarregar as tarefas salvas no Local Storage
function recarregarTarefas() {
  const tarefasDoLocalStorage = localStorage.getItem('lista');

  if (tarefasDoLocalStorage) {
    minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
  }

  mostrarTarefas();
}

// Inicializa as tarefas salvas no Local Storage
recarregarTarefas();
button.addEventListener('click', adicionarNovaTarefa);
