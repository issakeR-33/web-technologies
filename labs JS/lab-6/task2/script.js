'use strict';

/* ─────────────────── UTILS ─────────────────── */
const generateId    = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const getCurrentDate = () => new Date().toISOString();
const formatDate    = (iso) => new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

let tasks = [
  { id: generateId(), text: 'Зробити лабораторну роботу',    done: false, createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
  { id: generateId(), text: 'Купити продукти у магазині',    done: true,  createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
  { id: generateId(), text: 'Прочитати розділ з книги',      done: false, createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
];

let activeSort = null;

const $taskList       = document.getElementById('js-task-list');
const $emptyState     = document.getElementById('js-empty-state');
const $addForm        = document.getElementById('js-add-form');
const $taskInput      = document.getElementById('js-task-input');
const $headerStats    = document.getElementById('js-header-stats');
const $resetSort      = document.getElementById('js-reset-sort');
const $modalBackdrop  = document.getElementById('js-modal-backdrop');
const $editForm       = document.getElementById('js-edit-form');
const $editId         = document.getElementById('js-edit-id');
const $editInput      = document.getElementById('js-edit-input');
const $modalClose     = document.getElementById('js-modal-close');
const $modalCancel    = document.getElementById('js-modal-cancel');
const $snackContainer = document.getElementById('js-snackbar-container');

const addTask = (tasks, text) => [
  ...tasks,
  { id: generateId(), text, done: false, createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
];

const deleteTask = (tasks, id) =>
  tasks.filter(t => t.id !== id);

const toggleTask = (tasks, id) =>
  tasks.map(t => t.id !== id ? t : { ...t, done: !t.done, updatedAt: getCurrentDate() });

const editTask = (tasks, id, text) =>
  tasks.map(t => t.id !== id ? t : { ...t, text, updatedAt: getCurrentDate() });

const sortTasks = (tasks, sortBy) => {
  if (!sortBy) return tasks;
  return [...tasks].sort((a, b) => {
    if (sortBy === 'done') return Number(a.done) - Number(b.done);
    return new Date(a[sortBy]) - new Date(b[sortBy]);
  });
};

const countRemaining = (tasks) =>
  tasks.filter(t => !t.done).length;

const showSnackbar = (message, type = 'success') => {
  const el = document.createElement('div');
  el.className = `snackbar ${type}`;
  el.textContent = message;
  $snackContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
};

const toggleModal = (show) => {
  $modalBackdrop.classList.toggle('open', show);
  if (!show) $editForm.reset();
};

const openEditModal = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  $editId.value    = task.id;
  $editInput.value = task.text;
  toggleModal(true);
};

/*render*/
const createTaskItem = (task) => {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;
  li.innerHTML = `
    <button class="task-checkbox" data-id="${task.id}" aria-label="Відзначити виконаним">
      ${task.done ? '&#10003;' : ''}
    </button>
    <span class="task-text">${task.text}</span>
    <span class="task-meta">${formatDate(task.createdAt)}</span>
    <div class="task-actions">
      <button class="edit-btn"   data-id="${task.id}">Редагувати</button>
      <button class="delete-btn" data-id="${task.id}">Видалити</button>
    </div>`;
  return li;
};

const updateStats = () => {
  const remaining = countRemaining(tasks);
  const total     = tasks.length;
  const done      = total - remaining;
  $headerStats.textContent = `Виконано: ${done} / ${total}`;
};

const updateSortButtons = () => {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === activeSort);
  });
};

const render = () => {
  const visible = sortTasks(tasks, activeSort);
  $taskList.innerHTML = '';
  $emptyState.classList.toggle('visible', tasks.length === 0);
  visible.forEach(t => $taskList.appendChild(createTaskItem(t)));
  updateStats();
  updateSortButtons();
};

const handleAdd = (e) => {
  e.preventDefault();
  if (!$addForm.checkValidity()) { $addForm.reportValidity(); return; }
  const text = $taskInput.value.trim();
  tasks = addTask(tasks, text);
  $taskInput.value = '';
  render();
  showSnackbar(`Завдання «${text}» додано`);
};

const handleEdit = (e) => {
  e.preventDefault();
  if (!$editForm.checkValidity()) { $editForm.reportValidity(); return; }
  const id   = $editId.value;
  const text = $editInput.value.trim();
  tasks = editTask(tasks, id, text);
  toggleModal(false);
  render();
  showSnackbar(`Завдання оновлено: «${text}»`, 'info');
};

const deleteWithAnimation = (id) => {
  const item    = $taskList.querySelector(`[data-id="${id}"]`);
  const deleted = tasks.find(t => t.id === id);
  if (!item || !deleted) return;
  item.classList.add('removing');
  item.addEventListener('animationend', () => {
    tasks = deleteTask(tasks, id);
    render();
    showSnackbar(`Завдання «${deleted.text}» видалено`, 'error');
  }, { once: true });
};

$addForm.addEventListener('submit', handleAdd);
$editForm.addEventListener('submit', handleEdit);

$taskList.addEventListener('click', (e) => {
  const checkbox  = e.target.closest('.task-checkbox');
  const editBtn   = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (checkbox)  {
    const id = checkbox.dataset.id;
    tasks = toggleTask(tasks, id);
    render();
    const task = tasks.find(t => t.id === id);
    showSnackbar(task.done ? 'Завдання виконано' : 'Завдання відновлено', task.done ? 'success' : 'info');
  }
  if (editBtn)   openEditModal(editBtn.dataset.id);
  if (deleteBtn) deleteWithAnimation(deleteBtn.dataset.id);
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeSort = activeSort === btn.dataset.sort ? null : btn.dataset.sort;
    render();
  });
});

$resetSort.addEventListener('click', () => { activeSort = null; render(); });

$modalClose.addEventListener('click',  () => toggleModal(false));
$modalCancel.addEventListener('click', () => toggleModal(false));
$modalBackdrop.addEventListener('click', (e) => {
  if (e.target === $modalBackdrop) toggleModal(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleModal(false);
});

render();