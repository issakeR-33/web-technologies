// ── стан ──────────────────────────────────────────────────────────────
let isOn            = false;
let currentType     = 'regular';
let brightness      = 100;
let inactivityTimer = null;
const INACTIVITY_MS = 5 * 60 * 1000; // 5 хвилин

// ── 1. Увімкнення / вимкнення ──────────────────────────────────────────
function toggleBulb() {
  isOn = !isOn;
  updateDOM();
  resetInactivityTimer();
}

// ── 2. Зміна типу лампочки ─────────────────────────────────────────────
function changeBulbType() {
  currentType = document.getElementById('bulbType').value;
  // кнопка яскравості — тільки для eco та led
  document.getElementById('btn-brightness').disabled = (currentType === 'regular');

  if (isOn) updateDOM();
}

// ── 3. Яскравість через prompt ─────────────────────────────────────────
function setBrightness() {
  if (currentType === 'regular') {
    alert('Звичайна лампочка не підтримує регулювання яскравості.');
    return;
  }

  const input = prompt(`Введіть яскравість від 10 до 100 (зараз: ${brightness}%):`, brightness);
  if (input === null) return;

  const num = parseInt(input, 10);
  if (isNaN(num) || num < 10 || num > 100) {
    alert('Будь ласка, введіть ціле число від 10 до 100.');
    return;
  }

  brightness = num;
  document.getElementById('brightness-info').textContent = `Яскравість: ${brightness}%`;
  resetInactivityTimer();
}

// ── 4. Автовимкнення через 5 хв бездіяльності ─────────────────────────
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    if (isOn) {
      isOn = false;
      updateDOM();
      document.getElementById('timer-info').textContent = '⚠ Лампочку вимкнено автоматично через 5 хв бездіяльності.';
    }
  }, INACTIVITY_MS);
}

// ── Оновлення DOM через classList ──────────────────────────────────────
function updateDOM() {
  const status = document.getElementById('status');
  const btn    = document.getElementById('btn-toggle');
  const btnB   = document.getElementById('btn-brightness');

  // скидаємо класи і встановлюємо нові через classList
  status.className = '';

  if (isOn) {
    status.classList.add('on', `type-${currentType}`);
    status.innerHTML = `Лампочка: <strong>УВІМКНЕНА</strong> (${getTypeName(currentType)}, яскравість: ${brightness}%)`;
    btn.textContent  = 'Вимкнути';
    btnB.disabled    = (currentType === 'regular');
    document.getElementById('timer-info').textContent = 'Таймер автовимкнення: 5 хв';
    const imgOn = { regular: 'on.png', eco: 'onEng.png', led: 'onDiod.png' };
    document.getElementById('bulb-img').src = `../lab-5/img/${imgOn[currentType]}`   // ← міняємо картинку
  } else {
    status.innerHTML = 'Лампочка: <strong>ВИМКНЕНА</strong>';
    btn.textContent  = 'Увімкнути'; 
    btnB.disabled    = true;
    document.getElementById('brightness-info').textContent = '';
    document.getElementById('timer-info').textContent = '';
    const imgOff = { regular: 'off.png', eco: 'offEng.png', led: 'offDiod.png' };
    document.getElementById('bulb-img').src = `../lab-5/img/${imgOff[currentType]}`;  // ← міняємо картинку
  }
}

// ── Утиліта: назва типу ────────────────────────────────────────────────
function getTypeName(type) {
  const names = { regular: 'Звичайна', eco: 'Енергозберігаюча', led: 'Світлодіодна' };
  return names[type] ?? type;
}

// ── Скидання таймера при будь-якій активності ──────────────────────────
['mousemove', 'keydown', 'click', 'touchstart'].forEach(ev =>
  document.addEventListener(ev, () => { if (isOn) resetInactivityTimer(); })
);




//ЗАВДАННЯ 2

// ── тривалість кожного стану (мс) ─────────────────────────────────────
let durations = {
  red:    5000,
  yellow: 3000,
  green:  7000,
  blink:  400,   // інтервал миготіння жовтого
};

// ── стан ──────────────────────────────────────────────────────────────
// послідовність: red → yellow → green → blinkYellow → red → ...
const STATES = ['red', 'yellow', 'green', 'blinkYellow'];
let currentStateIndex = 0;
let mainTimer   = null;   // setTimeout для переходу між станами
let blinkTimer  = null;   // setInterval для миготіння
let blinkCount  = 0;      // лічильник миготінь
let running     = false;
let countdownTimer = null; // setInterval для відліку секунд
let secondsLeft    = 0;

// ── Назви станів ───────────────────────────────────────────────────────
function getStateName(state) {
  const names = {
    red:         '🔴 Червоний — СТОП',
    yellow:      '🟡 Жовтий — УВАГА',
    green:       '🟢 Зелений — МОЖНА',
    blinkYellow: '🟡 Миготливий жовтий',
  };
  return names[state] ?? state;
}

// ── Увімкнути потрібне світло ──────────────────────────────────────────
function setLight(color) {
  document.getElementById('light-red').style.background    = (color === 'red')    ? 'red'    : '#333';
  document.getElementById('light-yellow').style.background = (color === 'yellow') ? 'yellow' : '#333';
  document.getElementById('light-green').style.background  = (color === 'green')  ? 'lime'   : '#333';
}

function clearAllLights() {
  ['light-red', 'light-yellow', 'light-green'].forEach(id =>
    document.getElementById(id).style.background = '#333'
  );
}

// ── Запустити поточний стан ────────────────────────────────────────────
function runCurrentState() {
  const state = STATES[currentStateIndex];
  document.getElementById('state-label').textContent = 'Стан: ' + getStateName(state);

  clearTimeout(mainTimer);
  clearInterval(blinkTimer);
  clearInterval(countdownTimer);

  if (state === 'blinkYellow') {
    // миготить 3 рази (6 перемикань) потім переходить далі
    blinkCount = 0;
    let visible = true;
    blinkTimer = setInterval(() => {
      visible = !visible;
      document.getElementById('light-yellow').style.background = visible ? 'yellow' : '#333';
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkTimer);
        goNextState();
      }
    }, durations.blink);
    document.getElementById('timer-label').textContent = '';
  } else {
    setLight(state);
    startCountdown(durations[state]);
    mainTimer = setTimeout(goNextState, durations[state]);
  }
}

// ── Відлік секунд ──────────────────────────────────────────────────────
function startCountdown(ms) {
  secondsLeft = Math.round(ms / 1000);
  document.getElementById('timer-label').textContent = `Залишилось: ${secondsLeft} с`;

  countdownTimer = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(countdownTimer);
      document.getElementById('timer-label').textContent = '';
    } else {
      document.getElementById('timer-label').textContent = `Залишилось: ${secondsLeft} с`;
    }
  }, 1000);
}

// ── Перейти до наступного стану ────────────────────────────────────────
function goNextState() {
  currentStateIndex = (currentStateIndex + 1) % STATES.length;
  runCurrentState();
}

// ── 1. Старт ───────────────────────────────────────────────────────────
function startTrafficLight() {
  if (running) return;
  running = true;
  currentStateIndex = 0;
  runCurrentState();
}

// ── 2. Стоп ────────────────────────────────────────────────────────────
function stopTrafficLight() {
  running = false;
  clearTimeout(mainTimer);
  clearInterval(blinkTimer);
  clearInterval(countdownTimer);
  clearAllLights();
  document.getElementById('state-label').textContent = 'Стан: зупинено';
  document.getElementById('timer-label').textContent = '';
}

// ── 3. Ручне переключення на наступний стан ────────────────────────────
function nextState() {
  if (!running) return;
  clearTimeout(mainTimer);
  clearInterval(blinkTimer);
  clearInterval(countdownTimer);
  goNextState();
}

// ── 4. Змінити тривалість через prompt ────────────────────────────────
function setDurations() {
  const red = parseInt(prompt('Тривалість червоного (секунди):', durations.red / 1000), 10);
  if (isNaN(red) || red <= 0) { alert('Невірне значення'); return; }

  const yellow = parseInt(prompt('Тривалість жовтого (секунди):', durations.yellow / 1000), 10);
  if (isNaN(yellow) || yellow <= 0) { alert('Невірне значення'); return; }

  const green = parseInt(prompt('Тривалість зеленого (секунди):', durations.green / 1000), 10);
  if (isNaN(green) || green <= 0) { alert('Невірне значення'); return; }

  durations.red    = red    * 1000;
  durations.yellow = yellow * 1000;
  durations.green  = green  * 1000;

  alert(`Збережено: 🔴 ${red}с · 🟡 ${yellow}с · 🟢 ${green}с`);
}