'use strict';

function initSlider(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = container.querySelector('.slider-track');
  const slides = container.querySelectorAll('.slide');
  const prevBtn = container.querySelector('.slider-arrow--prev');
  const nextBtn = container.querySelector('.slider-arrow--next');
  const dotsContainer = container.querySelector('.slider-dots');
  const pagination = container.querySelector('.slider-pagination');

  let currentIndex = 0;
  const slideCount = slides.length;
  
  const autoplay = container.dataset.autoplay === 'true';
  const interval = parseInt(container.dataset.autoplayInterval) || 3000;
  let autoplayTimer = null;

  const slideColors = Array.from(slides).map(slide => slide.dataset.color || '#ffffff');

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('dot-btn');
    dot.setAttribute('aria-label', `Перейти до слайда ${index + 1}`);
    
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
    
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot-btn');

  // оновлення слайдера
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
        // Застосовуємо фірмовий колір мови програмування
        dot.style.backgroundColor = slideColors[i];
        // Додаємо легке світіння
        dot.style.boxShadow = `0 0 12px ${slideColors[i]}`;
      } else {
        dot.classList.remove('active');
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        dot.style.boxShadow = 'none';
      }
    });

    // Оновлення лічильника
    if (pagination) {
      pagination.textContent = `${currentIndex + 1} / ${slideCount}`;
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlider();
  }

  function startAutoplay() {
    if (autoplay) {
      autoplayTimer = setInterval(nextSlide, interval);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  updateSlider();
  startAutoplay();
}
