# To-Do List Web

Aplicativo simples de lista de tarefas com **HTML**, **CSS** e **JavaScript** no front, e **PHP + JSON (sem banco)** no back.  
Cada tarefa tem **dono** e **apenas o dono pode alterar/excluir**. Qualquer pessoa pode **ver** todas as tarefas na visão **“Todos”**.

> **Versão atual:** `v1.2.0`  
> **Novidades:** Horário opcional por tarefa (`HH:MM`) e **toggle de ordenação** (Hora ↔ Criação).

---

## 🎯 Funcionalidades

- Adicionar novas tarefas.
- Marcar tarefas como concluídas.
- Remover tarefas.
- **Dono por item:** só quem criou pode alterar/excluir (validação no servidor).
- **Visões:**  
  - **Todos** — agrega as tarefas de todos os usuários.  
  - **Minha Tabela** — somente suas tarefas.
- **Horário opcional:** informe `HH:MM` ao adicionar (se vazio, segue normal).
- **Ordenação configurável:** botão “**Ordenar: Hora/Criação**” (salva preferência na sessão).
- **Sem banco de dados:** persistência em **arquivos JSON** por usuário.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6).
- **Backend:** PHP (7+ recomendado) lendo/escrevendo JSON.
- **Armazenamento:** arquivos em `data/users/<usuario>.json`.

---

## 🚀 Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/alezin54/to-do-list.git

2. Acesse a pasta do projeto:
   ```bash
   cd to-do-list

3. Inicie um servidor PHP simples na raiz do projeto:

         php -S localhost:8000

4. Acesse: `http://localhost:8000/index.html`

         Se preferir rodar sem PHP (somente estático), as ações de adicionar/editar/excluir não funcionarão, pois agora são feitas via API PHP.

---

## 📋 Estrutura do Projeto
    
    📂 To-Do List Web
      ├── 📂 api
      │   ├── add.php
      │   ├── create_table.php
      │   ├── delete.php
      │   ├── lib.php
      │   ├── list.php
      │   ├── login.php
      │   ├── logout.php
      │   └── whoami.php
      ├── 📂 data
      │   ├── 📂 sessions   # sessão do PHP (fallback)
      │   └── 📂 users      # arquivos .json por usuário
      ├── 📂 img
      │   ├── checked.png
      │   ├── trash.png
      │   └── background.png
      ├── app.js
      ├── index.html
      ├── styles.css
      └── favicon.ico (opcional)

---

## 🧩 API (Resumo dos Endpoints)

- POST api/login.php — body: user → cria sessão e arquivo do usuário.
- POST api/logout.php — encerra sessão.
- GET api/whoami.php — retorna usuário logado.
- GET api/list.php?view=all|mine&sort=time|created — lista tarefas.
- POST api/add.php — body: text, time (opcional HH:MM) → cria tarefa.
- POST api/toggle.php — body: id → alterna concluída (somente do dono).
- POST api/delete.php — body: id → remove (somente do dono).
- POST api/create_table.php — garante o arquivo do usuário.

**Formato do item:**

      {
        "id": "t_...",
        "text": "string",
        "done": false,
        "owner": "usuario",
        "created": 1690000000,
        "time": "HH:MM"
      }

---

## 🖥️ Uso

- Abra o site → informe um nome de usuário (sem senha) → Entrar.
- Adicione tarefas; opcionalmente preencha o horário (HH:MM).
- Use o botão “Ordenar: Hora/Criação” para alternar a ordenação.
- Em “Todos” você vê as tarefas de todo mundo; só o dono pode alterar/excluir.

---

🌟 Roadmap / Melhorias Futuras

- Editar tarefa (inline).
- Filtros (todas | concluídas | pendentes).
- Exportar/Importar tarefas.
- Autenticação real (login com senha) e perfis.

---

## 🧑‍💻 Contribuição

Contribuições são bem-vindas! Abra uma issue ou envie um **pull request**.

---

## 📄 Licença

Este projeto é de uso livre e está disponível sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

---

Feito com ❤️ por Alex Santos.

--- 

Caso deseje adicionar mais detalhes ou customizações, é só avisar! 😊

---
