document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const list = document.getElementById('todo-list');

    // animate parameter allows skipping effect (useful when initializing from storage)
    function addTodo(text, completed = false, animate = true) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (completed) li.classList.add('completed');
        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn">Delete</button>
        `;
        // toggle completed when clicking the text
        const span = li.querySelector('span');
        span.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTodos();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            // prevent click from bubbling to span
            e.stopPropagation();
            // animate removal before actually deleting
            li.classList.add('removing');
            li.addEventListener('animationend', () => {
                list.removeChild(li);
                saveTodos();
            }, { once: true });
        });
        // insert item and optionally animate
        list.appendChild(li);
        if (animate) {
            requestAnimationFrame(() => {
                li.classList.add('adding');
            });
            li.addEventListener('animationend', () => {
                // ensure final visible state after animation
                li.style.opacity = '1';
                li.style.transform = 'none';
                li.classList.remove('adding');
            }, { once: true });
        } else {
            // ensure it's visible if skipping animation
            li.style.opacity = '1';
            li.style.transform = 'none';
        }
        saveTodos();
    }

    function saveTodos() {
        const items = [];
        list.querySelectorAll('.todo-item').forEach(node => {
            const text = node.querySelector('span').textContent;
            const completed = node.classList.contains('completed');
            items.push({ text, completed });
        });
        localStorage.setItem('todos', JSON.stringify(items));
    }

    function loadTodos() {
        const data = localStorage.getItem('todos');
        if (!data) return;
        try {
            const items = JSON.parse(data);
            items.forEach(item => addTodo(item.text, item.completed, false));
        } catch (err) {
            console.error('Failed to parse todos from storage', err);
        }
    }

    addBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text === '') return;
        addTodo(text);
        input.value = '';
        input.focus();
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (text === '') return;
            addTodo(text);
            input.value = '';
            input.focus();
        }
    });

    // populate from storage first
    loadTodos();

    // --- theme logic --------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // initialize theme from storage or prefers-color-scheme
    let stored = localStorage.getItem('theme');
    if (!stored) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        stored = prefersDark ? 'dark' : 'light';
    }
    setTheme(stored);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
});