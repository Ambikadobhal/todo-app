const todoForm = document.getElementById('todoForm');
const todoTitleInput = document.getElementById('todoTitle');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const emptyState = document.getElementById('emptyState');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let sortDirection = 'asc'; 

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(undefined, options);
}

function renderTodos(todosToRender = todos) {
    if (todosToRender.length === 0) {
        todoList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    todoList.style.display = 'block';
    emptyState.style.display = 'none';

    todoList.innerHTML = '';

    todosToRender.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = todo.id;

        li.innerHTML = `
                    <div class="todo-info">
                        <div class="todo-title">${todo.title}</div>
                        <div class="todo-date">Created: ${formatDate(todo.createdAt)}</div>
                    </div>
                    <button class="delete-btn" data-id="${todo.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                `;

        todoList.appendChild(li);
    });
}

function addTodo(title) {
    const newTodo = {
        id: Date.now().toString(),
        title: title.trim(),
        createdAt: new Date().toISOString()
    };

    todos.unshift(newTodo); 
    saveTodos();
    renderTodos();
    todoTitleInput.value = ''; 
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function searchTodos(query) {
    if (!query) {
        renderTodos();
        sortBtn.disabled = false;
        return;
    }

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase())
    );

    renderTodos(filteredTodos);

    sortBtn.disabled = filteredTodos.length === 0;
}

function sortTodos() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    sortBtn.textContent = sortDirection === 'asc' ? 'Sort A-Z' : 'Sort Z-A';

    todos.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (sortDirection === 'asc') {
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        } else {
            return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
        }
    });

    saveTodos();
    renderTodos();
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoTitleInput.value.trim();

    if (title) {
        addTodo(title);
    } else {
        todoTitleInput.classList.add('shake');
        setTimeout(() => {
            todoTitleInput.classList.remove('shake');
        }, 500);
    }
});

todoList.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
        const id = e.target.closest('.delete-btn').dataset.id;
        deleteTodo(id);
    }
});

searchInput.addEventListener('input', (e) => {
    searchTodos(e.target.value);
});

sortBtn.addEventListener('click', sortTodos);

renderTodos();