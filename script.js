document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const list = document.getElementById('todo-list');

    function addTodo() {
        const text = input.value.trim();
        if (text === '') return;
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn">Delete</button>
        `;
        // toggle completed when clicking the text
        const span = li.querySelector('span');
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            // prevent click from bubbling to span
            e.stopPropagation();
            list.removeChild(li);
        });
        list.appendChild(li);
        input.value = '';
        input.focus();
    }

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') addTodo();
    });
});