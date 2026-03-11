// Pomodoro Pro - Web App with Modern Animations

let timerInterval;
let remainingSeconds = 25 * 60;
let sessionCount = 0;
let tasks = [];
let history = [];

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('pomodoroData');
    if (saved) {
        const data = JSON.parse(saved);
        sessionCount = data.sessionCount || 0;
        tasks = data.tasks || [];
        history = data.history || [];
        document.getElementById('session-count').textContent = sessionCount;
        renderTasks();
        renderHistory();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('pomodoroData', JSON.stringify({
        sessionCount,
        tasks,
        history
    }));
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateProgress() {
    const circle = document.getElementById('progress-bar');
    const total = 25 * 60;
    const ratio = remainingSeconds / total;
    const dash = 439.8 * (1 - ratio);
    circle.style.strokeDashoffset = dash;
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
}

function startTimer() {
    if (timerInterval) return;
    const btn = document.getElementById('start-button');
    btn.textContent = 'Running...';
    btn.disabled = true;
    btn.style.animation = 'buttonClick 0.3s ease-out';
    
    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            document.getElementById('timer').textContent = formatTime(remainingSeconds);
            updateProgress();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            logSession();
            remainingSeconds = 25 * 60;
            document.getElementById('timer').textContent = formatTime(remainingSeconds);
            updateProgress();
            btn.textContent = 'Start Timer';
            btn.disabled = false;
        }
    }, 1000);
}

function logSession() {
    const notes = document.getElementById('notes').value.trim();
    if (!notes) return;
    sessionCount++;
    const countEl = document.getElementById('session-count');
    countEl.textContent = sessionCount;
    countEl.style.animation = 'none';
    setTimeout(() => {
        countEl.style.animation = 'pulse 0.6s ease-in-out';
    }, 10);
    document.getElementById('notes').value = '';
    saveData();
}

function renderTasks() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = `${task.time} - ${task.text}`;
        
        const btn = document.createElement('button');
        btn.textContent = '✕';
        btn.addEventListener('click', () => removeTodo(idx));
        
        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
        li.style.animation = 'slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
}

function renderHistory() {
    const historyEl = document.getElementById('task-history');
    const items = historyEl.querySelectorAll('li:not(.no-tasks)');
    items.forEach(i => i.remove());
    
    if (history.length === 0) return;
    history.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.time} - ${task.text}`;
        li.style.animation = 'slideInUp 0.3s ease-out';
        historyEl.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;
    
    const time = new Date().toLocaleTimeString();
    tasks.push({ text, time });
    saveData();
    renderTasks();
    
    input.value = '';
    input.focus();
}

function removeTodo(idx) {
    const list = document.getElementById('todo-list');
    const li = list.children[idx];
    li.style.animation = 'slideOutLeft 0.3s ease-out forwards';
    
    setTimeout(() => {
        const task = tasks[idx];
        history.unshift(task);
        tasks.splice(idx, 1);
        saveData();
        renderTasks();
        renderHistory();
    }, 300);
}

function applyProfile(profile) {
    const body = document.body;
    const extra = document.getElementById('extra-content');
    const progressBar = document.getElementById('progress-bar');
    localStorage.setItem('profile', profile);
    body.classList.remove('profile-aarhon', 'profile-paula', 'profile-dark', 'profile-light');
    
    if (profile === 'aarhon') {
        body.classList.add('profile-aarhon');
        extra.innerHTML = '🧛';
        progressBar.setAttribute('stroke', 'url(#grad-aarhon)');
    } else if (profile === 'paula') {
        body.classList.add('profile-paula');
        extra.innerHTML = '🎀';
        progressBar.setAttribute('stroke', 'url(#grad-paula)');
    } else if (profile === 'dark') {
        body.classList.add('profile-dark');
        extra.innerHTML = '🌙';
        progressBar.setAttribute('stroke', 'url(#grad-dark)');
    } else if (profile === 'light') {
        body.classList.add('profile-light');
        extra.innerHTML = '☀️';
        progressBar.setAttribute('stroke', 'url(#grad-light)');
    }
}

function toggleHistory() {
    const history = document.getElementById('task-history');
    const btn = document.getElementById('toggle-history');
    history.classList.toggle('show');
    btn.textContent = history.classList.contains('show') ? 'Hide History' : 'Show History';
    btn.style.animation = 'buttonClick 0.3s ease-out';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startTimer);
    document.getElementById('add-todo').addEventListener('click', addTodo);
    document.getElementById('toggle-history').addEventListener('click', toggleHistory);

    document.getElementById('todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    document.getElementById('profile-select').addEventListener('change', (e) => {
        applyProfile(e.target.value);
    });

    // Initialize
    loadData();
    const savedProfile = localStorage.getItem('profile') || 'aarhon';
    document.getElementById('profile-select').value = savedProfile;
    applyProfile(savedProfile);
    updateDateTime();
    updateProgress();
    setInterval(updateDateTime, 1000);
});
