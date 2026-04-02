class Todo {
    constructor() {
        this.tasks = [];
        this.term = '';
    }

    add(text, date) {
        this.tasks.push({ text, date, done: false });
        this.saveToStorage();
        this.draw();
    }

    remove(index) {
        this.tasks.splice(index, 1);
        this.saveToStorage();
        this.draw();
    }

    toggle(index) {
        this.tasks[index].done = !this.tasks[index].done;
        this.saveToStorage();
        this.draw();
    }

    highlight(text) {
        if (!this.term) return text;
    
        const regex = new RegExp(`(${this.term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    startEdit(element, task, index) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';
    
        element.replaceWith(input);
        input.focus();
    
        const save = () => {
            if (input.value.trim() !== '') {
                task.text = input.value;
            }
            this.saveToStorage();
            this.draw();
        };
    
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') this.draw();
        });
    
        input.addEventListener('blur', save);
    }

    startEditDate(element, task, index) {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = task.date || '';
        input.className = 'edit-input';
    
        element.replaceWith(input);
        input.focus();
    
        const save = () => {
            if (input.value) {
                const today = new Date();
                const newDate = new Date(input.value);
    
                today.setHours(0,0,0,0);
    
                if (newDate <= today) {
                    alert('Data musi być w przyszłości!');
                    this.draw();
                    return;
                }
    
                task.date = input.value;
            } else {
                task.date = '';
            }
            this.saveToStorage();
            this.draw();
        };
    
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') this.draw();
        });
    
        input.addEventListener('blur', save);
    }

    get filteredTasks() {
        return this.tasks.filter(task =>
            task.text.toLowerCase().includes(this.term.toLowerCase())
        );
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.tasks));
    }

    loadFromStorage() {
        const data = localStorage.getItem('todos');
        if (data) {
            this.tasks = JSON.parse(data);
        }
    }

    draw() {
        const container = document.querySelector('.tabelka');
        container.innerHTML = '';
    
        this.filteredTasks.forEach(task => {
            const index = this.tasks.indexOf(task);
    
            const div = document.createElement('div');
            div.className = 'zadanie';
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done;
            checkbox.onclick = () => this.toggle(index);
    
            const text = document.createElement('div');
            text.className = 'text';
            text.innerHTML = this.highlight(task.text);
            text.onclick = () => this.startEdit(text, task, index);
    
            const date = document.createElement('div');
            date.className = 'data';
            date.textContent = task.date;
            date.onclick = () => this.startEditDate(date, task, index);
    
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Delete';
            removeBtn.onclick = () => this.remove(index);
    
            div.appendChild(checkbox);
            div.appendChild(text);
            div.appendChild(date);
            div.appendChild(removeBtn);
    
            container.appendChild(div);
        });
    }
}

const todo = new Todo();
todo.loadFromStorage();
todo.draw();
document.todo = todo;

document.getElementById('szukaj').addEventListener('input', (e) => {
    todo.term = e.target.value;
    todo.draw();
});

document.getElementById('zatwierdz').addEventListener('click', () => {
    const textInput = document.getElementById('nowy');
    const dateInput = document.getElementById('n-data');

    const text = textInput.value;
    const date = dateInput.value;

    if (text.trim() === '') {
        alert('Wpisz treść zadania!');
        return;
    }

    if (text.length < 3) { 
        alert('Zadanie musi mieć co najmniej 3 znaki.'); 
        return; 
    }
    
    if (text.length > 255) {
        alert('Zadanie nie może mieć więcej niż 255 znaków.'); 
        return;
    }

    if (date) {
        const today = new Date();
        const dueDate = new Date(date);
        today.setHours(0,0,0,0);
            if (dueDate <= today) { 
                alert('Data musi być w przyszłości.'); 
            return; 
        }
    }

    todo.add(text, date);
    textInput.value = '';
    dateInput.value = '';
    textInput.focus();
});
