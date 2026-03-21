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
  document.getElementById('btn-brightness').disabled = (currentType === 'regular');

  if (isOn) updateDOM();
  else updateBulbImage(); // показати вимкнену картинку нового типу
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

// ── Перемикання картинок через display:block / display:none ───────────
function updateBulbImage() {
  // ховаємо всі картинки
  ['regular-off', 'regular-on', 'eco-off', 'eco-on', 'led-off', 'led-on'].forEach(id => {
    document.getElementById(`img-${id}`).style.display = 'none';
  });

  // показуємо потрібну
  const state = isOn ? 'on' : 'off';
  const img = document.getElementById(`img-${currentType}-${state}`);
  img.style.display = 'block';
  img.style.opacity = isOn ? brightness / 100 : 1; // яскравість через opacity
}

// ── Оновлення DOM через classList ──────────────────────────────────────
function updateDOM() {
  const status = document.getElementById('status');
  const btn    = document.getElementById('btn-toggle');
  const btnB   = document.getElementById('btn-brightness');

  status.className = '';

  if (isOn) {
    status.classList.add('on', `type-${currentType}`);
    status.innerHTML = `Лампочка: <strong>УВІМКНЕНА</strong> (${getTypeName(currentType)}, яскравість: ${brightness}%)`;
    btn.textContent  = 'Вимкнути';
    btnB.disabled    = (currentType === 'regular');
    document.getElementById('timer-info').textContent = 'Таймер автовимкнення: 5 хв';
  } else {
    status.innerHTML = 'Лампочка: <strong>ВИМКНЕНА</strong>';
    btn.textContent  = 'Увімкнути';
    btnB.disabled    = true;
    document.getElementById('brightness-info').textContent = '';
    document.getElementById('timer-info').textContent = '';
  }

  updateBulbImage(); // перемикаємо картинку
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



//ЗАВДАННЯ 3
// ════════════════════════════════════════════════════════
// 1. ЦИФРОВИЙ ГОДИННИК
// ════════════════════════════════════════════════════════
let colonVisible = true; // для миготіння двокрапки

function updateClock() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  // миготяча двокрапка
  const colon = colonVisible ? ':' : ' ';
  colonVisible = !colonVisible;

  document.getElementById('clock').textContent = `${h}${colon}${m}${colon}${s}`;
}

// запускаємо одразу і оновлюємо кожну секунду
updateClock();
setInterval(updateClock, 1000);


// ════════════════════════════════════════════════════════
// 2. ТАЙМЕР ЗВОРОТНОГО ВІДЛІКУ
// ════════════════════════════════════════════════════════
let countdownInterval = null;

function startCountdown() {
  const input = document.getElementById('countdown-input').value;
  if (!input) {
    alert('Будь ласка, введіть дату і час!');
    return;
  }

  const targetDate = new Date(input);
  if (targetDate <= new Date()) {
    alert('Дата має бути в майбутньому!');
    return;
  }

  stopCountdown(); // зупиняємо попередній якщо був

  countdownInterval = setInterval(() => {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-display').textContent = '⏰ Час вийшов!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown-display').textContent =
      `Залишилось: ${days} дн. ${hours} год. ${minutes} хв. ${seconds} с.`;
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
}


// ════════════════════════════════════════════════════════
// 3. КАЛЕНДАР
// ════════════════════════════════════════════════════════
function renderCalendar() {
  const input = document.getElementById('calendar-input').value;
  if (!input) return;

  const parts = input.split('-');
  const year  = parseInt(parts[0]);
  const month = parseInt(parts[1]);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay  = new Date(year, month, 0).getDate();
  const today    = new Date();

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const months = ['Січень','Лютий','Березень','Квітень','Травень','Червень',
                  'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];

  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  let html = '<h4>' + months[month - 1] + ' ' + year + '</h4>';
  html += '<table border="1"><tr>';
  for (let d of days) html += '<th>' + d + '</th>';
  html += '</tr><tr>';

  for (let i = 0; i < startDay; i++) html += '<td></td>';

  let col = startDay;
  for (let day = 1; day <= lastDay; day++) {
    if (today.getDate() == day && today.getMonth() + 1 == month && today.getFullYear() == year) {
      html += '<td><b>' + day + '</b></td>';
    } else {
      html += '<td>' + day + '</td>';
    }
    col++;
    if (col == 7 && day != lastDay) {
      html += '</tr><tr>';
      col = 0;
    }
  }

  html += '</tr></table>';
  document.getElementById('calendar').innerHTML = html;
}


// ════════════════════════════════════════════════════════
// 4. ДЕНЬ НАРОДЖЕННЯ — через скільки настане
// ════════════════════════════════════════════════════════
function calcBirthday() {
  const input = document.getElementById('birthday-input').value;
  if (!input) {
    alert('Введіть дату народження!');
    return;
  }

  const now      = new Date();
  const bday     = new Date(input);

  // наступний день народження цього або наступного року
  let next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
  if (next <= now) {
    next = new Date(now.getFullYear() + 1, bday.getMonth(), bday.getDate());
  }

  const diff    = next - now;
  const months  = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days    = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('birthday-result').textContent =
    `До наступного дня народження: ${months} міс. ${days} дн. ${hours} год. ${minutes} хв. ${seconds} с.`;
}



//ЗАВДАННЯ 4

// ════════════════════════════════════════════════════════
// СТРУКТУРИ ДАНИХ
// ════════════════════════════════════════════════════════

// Map — основний каталог продуктів: id → { name, price, stock }
const catalog = new Map();

// Set — унікальні назви продуктів (щоб не дублювались)
const productNames = new Set();

// WeakMap — зберігає об'єкти-продукти → масив змін (історія)
const changeHistory = new WeakMap();

// WeakSet — продукти, які були замовлені хоча б раз
const orderedProducts = new WeakSet();

let nextId = 1; // лічильник id


// ════════════════════════════════════════════════════════
// 1. ДОДАВАННЯ ПРОДУКТУ
// ════════════════════════════════════════════════════════
function addProduct() {
  const name  = document.getElementById('prod-name').value.trim();
  const price = parseFloat(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value, 10);

  if (!name || isNaN(price) || isNaN(stock)) {
    log('⚠ Заповніть всі поля!');
    return;
  }

  // Set — перевіряємо унікальність назви
  if (productNames.has(name)) {
    log(`⚠ Продукт "${name}" вже існує в каталозі!`);
    return;
  }

  const product = { id: nextId, name, price, stock };

  // Map — зберігаємо продукт
  catalog.set(nextId, product);

  // Set — додаємо назву
  productNames.add(name);

  // WeakMap — ініціалізуємо історію змін
  changeHistory.set(product, [`Створено: ціна ${price}, кількість ${stock}`]);

  log(`✅ Додано продукт #${nextId}: "${name}", ціна: ${price}, кількість: ${stock}`);
  nextId++;

  clearInputs();
  renderCatalog();
}


// ════════════════════════════════════════════════════════
// 2. ВИДАЛЕННЯ ПРОДУКТУ
// ════════════════════════════════════════════════════════
function removeProduct() {
  const id = parseInt(document.getElementById('prod-id').value, 10);

  if (!catalog.has(id)) {
    log(`⚠ Продукт #${id} не знайдено!`);
    return;
  }

  const product = catalog.get(id);

  // Set — видаляємо назву
  productNames.delete(product.name);

  // Map — видаляємо продукт
  catalog.delete(id);

  log(`🗑 Видалено продукт #${id}: "${product.name}"`);
  renderCatalog();
}


// ════════════════════════════════════════════════════════
// 3. ОНОВЛЕННЯ ПРОДУКТУ
// ════════════════════════════════════════════════════════
function updateProduct() {
  const id    = parseInt(document.getElementById('prod-id').value, 10);
  const price = parseFloat(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value, 10);

  if (!catalog.has(id)) {
    log(`⚠ Продукт #${id} не знайдено!`);
    return;
  }

  if (isNaN(price) || isNaN(stock)) {
    log('⚠ Введіть нову ціну та кількість!');
    return;
  }

  const product = catalog.get(id);

  // WeakMap — записуємо зміну в історію
  const history = changeHistory.get(product);
  history.push(`Оновлено: ціна ${product.price}→${price}, кількість ${product.stock}→${stock}`);

  product.price = price;
  product.stock = stock;

  log(`✏ Оновлено продукт #${id}: ціна ${price}, кількість ${stock}`);
  renderCatalog();
}


// ════════════════════════════════════════════════════════
// 4. ПОШУК
// ════════════════════════════════════════════════════════
function searchById() {
  const id = parseInt(document.getElementById('prod-id').value, 10);

  if (!catalog.has(id)) {
    log(`⚠ Продукт #${id} не знайдено!`);
    return;
  }

  const p = catalog.get(id);
  const history = changeHistory.get(p);
  log(`🔍 #${p.id} "${p.name}" | ціна: ${p.price} | кількість: ${p.stock} | зміни: [${history.join(' → ')}]`);
}

function searchByName() {
  const name = document.getElementById('search-name').value.trim();

  if (!productNames.has(name)) {
    log(`⚠ Продукт "${name}" не знайдено!`);
    return;
  }

  // перебираємо Map щоб знайти по назві
  for (const [id, p] of catalog) {
    if (p.name === name) {
      log(`🔍 #${p.id} "${p.name}" | ціна: ${p.price} | кількість: ${p.stock}`);
      return;
    }
  }
}


// ════════════════════════════════════════════════════════
// 5. ЗАМОВЛЕННЯ
// ════════════════════════════════════════════════════════
function placeOrder() {
  const id  = parseInt(document.getElementById('order-id').value, 10);
  const qty = parseInt(document.getElementById('order-qty').value, 10);

  if (!catalog.has(id)) {
    log(`⚠ Продукт #${id} не знайдено!`);
    return;
  }

  if (isNaN(qty) || qty <= 0) {
    log('⚠ Введіть коректну кількість!');
    return;
  }

  const product = catalog.get(id);

  if (product.stock < qty) {
    log(`⚠ Недостатньо товару! На складі: ${product.stock}`);
    return;
  }

  // зменшуємо кількість на складі
  product.stock -= qty;

  // WeakSet — позначаємо що продукт вже замовлявся
  orderedProducts.add(product);

  // WeakMap — записуємо в історію
  const history = changeHistory.get(product);
  history.push(`Замовлено: ${qty} шт.`);

  log(`🛒 Замовлено ${qty} шт. "${product.name}". Залишок: ${product.stock}`);
  renderCatalog();
}


// ════════════════════════════════════════════════════════
// ВІДОБРАЖЕННЯ КАТАЛОГУ
// ════════════════════════════════════════════════════════
function renderCatalog() {
  const div = document.getElementById('catalog');

  if (catalog.size === 0) {
    div.innerHTML = '<p>Каталог порожній.</p>';
    return;
  }

  let html = '<table border="1" cellpadding="6"><tr><th>ID</th><th>Назва</th><th>Ціна</th><th>Кількість</th><th>Замовлявся</th></tr>';

  for (const [id, p] of catalog) {
    const wasOrdered = orderedProducts.has(p) ? '✅' : '—';
    html += `<tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price} грн</td>
      <td>${p.stock}</td>
      <td>${wasOrdered}</td>
    </tr>`;
  }

  html += '</table>';
  div.innerHTML = html;
}


// ════════════════════════════════════════════════════════
// ДОПОМІЖНІ ФУНКЦІЇ
// ════════════════════════════════════════════════════════
function log(msg) {
  const div = document.getElementById('log');
  const p   = document.createElement('p');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  div.prepend(p);
}

function clearInputs() {
  ['prod-name', 'prod-price', 'prod-stock'].forEach(id => {
    document.getElementById(id).value = '';
  });
}