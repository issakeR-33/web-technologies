'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const columns = document.querySelectorAll('.column-body');
  const editBtn = document.getElementById('edit-btn');

  editBtn.addEventListener('click', () => {
    const isEditMode = board.classList.toggle('edit-mode');
    if (isEditMode) {
      editBtn.textContent = 'Готово';
      editBtn.classList.add('active');
    } else {
      editBtn.textContent = 'Редагувати';
      editBtn.classList.remove('active');
    }
  });

  board.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const card = e.target.closest('.card');
      card.style.transform = 'scale(0.8)';
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        updateBadges();
      }, 200);
    }
  });

  let draggedCard = null;
  let placeholder = document.createElement('div');
  placeholder.classList.add('placeholder');

  //перетягування картки
  board.addEventListener('dragstart', (e) => {
    if (!e.target.classList.contains('card')) return;
    
    draggedCard = e.target;
    
    const rect = draggedCard.getBoundingClientRect();
    placeholder.style.height = `${rect.height}px`;

    setTimeout(() => {
      draggedCard.classList.add('dragging');
      draggedCard.style.display = 'none';
      draggedCard.parentNode.insertBefore(placeholder, draggedCard);
    }, 0);
  });

  board.addEventListener('dragend', () => {
    if (!draggedCard) return;

    draggedCard.style.display = 'block';
    draggedCard.classList.remove('dragging');
    
    if (placeholder.parentNode) {
      placeholder.parentNode.replaceChild(draggedCard, placeholder);
    }
    
    draggedCard = null;
    updateBadges();
  });

  columns.forEach(column => {
    column.addEventListener('dragover', e => {
      e.preventDefault(); // Дозволяємо кидання
      if (!draggedCard) return;

      const afterElement = getDragAfterElement(column, e.clientY);
      
      if (afterElement == null) {
        column.appendChild(placeholder);
      } else {
        column.insertBefore(placeholder, afterElement);
      }
    });
  });

  // Математична функція, яка визначає, над якою карткою знаходиться мишка
  function getDragAfterElement(container, y) {
    // Беремо всі картки в цій колонці, крім тієї, яку ми зараз тягнемо
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      // Рахуємо відстань від курсора до центру картки
      const offset = y - box.top - box.height / 2;
      
      // Якщо курсор вище центру картки (offset < 0) і це найближча картка
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Оновлення лічильників в колонках
  function updateBadges() {
    document.querySelectorAll('.trello-column').forEach(column => {
      const count = column.querySelectorAll('.card:not(.dragging)').length;
      const badge = column.querySelector('.badge');
      if (badge) badge.textContent = count;
    });
  }
});
