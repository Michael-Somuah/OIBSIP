(function () {
  'use strict';

  const STORAGE_KEY = 'docket-tasks-v1';

  const addForm = document.getElementById('addForm');
  const taskInput = document.getElementById('taskInput');
  const pendingList = document.getElementById('pendingList');
  const completedList = document.getElementById('completedList');
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');
  const pendingSection = pendingList.closest('.docket__section');
  const completedSection = completedList.closest('.docket__section');
  const taskTemplate = document.getElementById('taskTemplate');
  const docketDate = document.getElementById('docketDate');

  /** @type {{id:string, text:string, completed:boolean, createdAt:number, completedAt:number|null}[]} */
  let tasks = loadTasks();

  init();

  function init() {
    stampDate();
    render();

    addForm.addEventListener('submit', handleAddTask);
  }

  function stampDate() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    docketDate.textContent = `NO. ${mm}${dd}${yy}`;
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Could not read saved tasks:', err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn('Could not save tasks:', err);
    }
  }

  function makeId() {
    return `t${Date.now()}${Math.random().toString(16).slice(2, 6)}`;
  }

  function formatTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function handleAddTask(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.unshift({
      id: makeId(),
      text,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
    });

    saveTasks();
    render({ enterId: tasks[0].id });
    taskInput.value = '';
    taskInput.focus();
  }

  function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    saveTasks();
    render({ stampId: task.completed ? id : null });
  }

  function deleteTask(id) {
    const li = document.querySelector(`.task[data-id="${id}"]`);
    if (li) {
      li.classList.add('is-leaving');
      li.addEventListener('animationend', () => {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        render();
      }, { once: true });
    } else {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      render();
    }
  }

  function startEdit(id) {
    document.querySelectorAll('.task.is-editing').forEach((li) => {
      if (li.dataset.id !== id) commitEdit(li.dataset.id, li);
    });
    const li = document.querySelector(`.task[data-id="${id}"]`);
    if (!li) return;
    li.classList.add('is-editing');
    const input = li.querySelector('.task__edit-input');
    const task = tasks.find((t) => t.id === id);
    input.value = task.text;
    input.focus();
    input.select();
  }

  function commitEdit(id, liEl) {
    const li = liEl || document.querySelector(`.task[data-id="${id}"]`);
    if (!li || !li.classList.contains('is-editing')) return;
    const input = li.querySelector('.task__edit-input');
    const newText = input.value.trim();
    const task = tasks.find((t) => t.id === id);
    if (newText && task) {
      task.text = newText;
      saveTasks();
    }
    li.classList.remove('is-editing');
    render();
  }

  function buildTaskEl(task, opts) {
    const node = taskTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = task.id;
    node.classList.toggle('task--completed', task.completed);

    if (opts.enterId === task.id) node.classList.add('is-entering');
    if (opts.stampId === task.id) node.classList.add('is-stamping');

    const toggle = node.querySelector('.task__toggle');
    toggle.setAttribute('aria-label', task.completed ? 'Mark task pending' : 'Mark task complete');
    toggle.addEventListener('click', () => toggleComplete(task.id));

    node.querySelector('.task__text').textContent = task.text;

    const timeParts = [`Added ${formatTime(task.createdAt)}`];
    if (task.completed && task.completedAt) {
      timeParts.push(`Done ${formatTime(task.completedAt)}`);
    }
    node.querySelector('.task__time').textContent = timeParts.join(' · ');

    const editInput = node.querySelector('.task__edit-input');
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commitEdit(task.id, node);
      if (e.key === 'Escape') { node.classList.remove('is-editing'); render(); }
    });
    editInput.addEventListener('blur', () => commitEdit(task.id, node));

    node.querySelector('.task__edit').addEventListener('click', () => startEdit(task.id));
    node.querySelector('.task__delete').addEventListener('click', () => deleteTask(task.id));

    return node;
  }

  function render(opts = {}) {
    const pending = tasks.filter((t) => !t.completed);
    const completed = tasks.filter((t) => t.completed).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    pending.forEach((task) => pendingList.appendChild(buildTaskEl(task, opts)));
    completed.forEach((task) => completedList.appendChild(buildTaskEl(task, opts)));

    pendingCount.textContent = `${pending.length} pending`;
    completedCount.textContent = `${completed.length} completed`;

    pendingSection.classList.toggle('is-empty', pending.length === 0);
    completedSection.classList.toggle('is-empty', completed.length === 0);
  }
})();
