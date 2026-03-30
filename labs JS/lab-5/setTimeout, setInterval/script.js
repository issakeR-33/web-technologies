const red     = document.querySelector('.red');
const yellow  = document.querySelector('.yellow');
const green   = document.querySelector('.green');
const redBtn  = document.getElementById('change-red');
const yellowBtn = document.getElementById('change-yellow');
const greenBtn  = document.getElementById('change-green');
const nextBtn   = document.getElementById('next-btn');
const text      = document.getElementById('output');

let redDuration    = 5000;
let yellowDuration = 3000;
let greenDuration  = 7000;

let currentState = 'red';
let cycleTimeout = null;


function hideAll() {
    red.classList.remove('active');
    yellow.classList.remove('active');
    green.classList.remove('active');
}

function showState(state, color, label) {
    hideAll();
    document.querySelector(`.${state}`).classList.add('active');
    text.textContent = label;
    text.style.color = color;
    currentState = state;
}


function blinkYellow(callback) {
    let count = 0;

    function blink() {
        if (count >= 3) {
            callback();
            return;
        }
        showState('yellow', 'yellow', 'Жовтий (мигає)');
        cycleTimeout = setTimeout(() => {
            hideAll();
            text.textContent = '';
            cycleTimeout = setTimeout(() => {
                count++;
                blink();
            }, 300);
        }, 300);
    }

    blink();
}

function startCycle() {
    clearTimeout(cycleTimeout);

    showState('red', 'red', 'Червоний');

    cycleTimeout = setTimeout(() => {
        showState('yellow', 'yellow', 'Жовтий');

        cycleTimeout = setTimeout(() => {
            showState('green', 'green', 'Зелений');

            cycleTimeout = setTimeout(() => {
                blinkYellow(() => startCycle());
            }, greenDuration);

        }, yellowDuration);

    }, redDuration);
}

// тривалicть

redBtn.addEventListener('click', () => {
    const value = prompt('Введіть тривалість червоного (в секундах):', redDuration / 1000);
    if (value === null) return;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) { alert('Введіть позитивне число.'); return; }
    redDuration = num * 1000;
    startCycle();
});

yellowBtn.addEventListener('click', () => {
    const value = prompt('Введіть тривалість жовтого (в секундах):', yellowDuration / 1000);
    if (value === null) return;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) { alert('Введіть позитивне число.'); return; }
    yellowDuration = num * 1000;
    startCycle();
});

greenBtn.addEventListener('click', () => {
    const value = prompt('Введіть тривалість зеленого (в секундах):', greenDuration / 1000);
    if (value === null) return;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) { alert('Введіть позитивне число.'); return; }
    greenDuration = num * 1000;
    startCycle();
});

nextBtn.addEventListener('click', () => {
    clearTimeout(cycleTimeout);

    if (currentState === 'red') {
        showState('yellow', 'yellow', 'Жовтий');
        cycleTimeout = setTimeout(() => {
            showState('green', 'green', 'Зелений');
            cycleTimeout = setTimeout(() => {
                startCycle(); // одразу починаємо цикл (червоний)
            }, greenDuration);
        }, yellowDuration);

    } else if (currentState === 'yellow') {
        showState('green', 'green', 'Зелений');
        cycleTimeout = setTimeout(() => {
            startCycle();
        }, greenDuration);

    } else if (currentState === 'green') {
        startCycle(); // одразу на червоний, без блимання

    } else {
        startCycle();
    }
});

startCycle();