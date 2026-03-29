const hour    = document.getElementById('hour');
const minute  = document.getElementById('minute');
const second  = document.getElementById('second');

const timerHour   = document.getElementById('timer-hour');
const timerMinute = document.getElementById('timer-minute');
const timerSecond = document.getElementById('timer-second');
const startBtn    = document.getElementById('start-btn');

const monthInput = document.getElementById('month-input');
const dayCells   = document.querySelectorAll('.day-cell');

const bdayInput  = document.getElementById('bday-input');
const bdayResult = document.getElementById('bday-result');

function updateTime() {
    const now = new Date();
    hour.textContent   = now.getHours().toString().padStart(2, '0') + ':';
    minute.textContent = now.getMinutes().toString().padStart(2, '0') + ':';
    second.textContent = now.getSeconds().toString().padStart(2, '0');
}

let visible = true;
setInterval(() => {
    visible = !visible;
    second.style.visibility = visible ? 'visible' : 'hidden';
    if (visible) updateTime();
}, 500);

updateTime();

//2

let timerInterval = null;

startBtn.addEventListener('click', () => {
    const input = prompt('Введіть час у форматі HH:MM:SS', '00:00:10');
    if (!input) return;

    const parts = input.split(':');
    let h = parseInt(parts[0]) || 0;
    let m = parseInt(parts[1]) || 0;
    let s = parseInt(parts[2]) || 0;

    if (isNaN(h) || isNaN(m) || isNaN(s)) {
        alert('Невірний формат. Введіть HH:MM:SS');
        return;
    }

    clearInterval(timerInterval);

    function display() {
        timerHour.textContent   = h.toString().padStart(2, '0') + ':';
        timerMinute.textContent = m.toString().padStart(2, '0') + ':';
        timerSecond.textContent = s.toString().padStart(2, '0');
    }

    display();

    timerInterval = setInterval(() => {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) {
            clearInterval(timerInterval);
            timerHour.textContent   = '00:';
            timerMinute.textContent = '00:';
            timerSecond.textContent = '00';
            alert('Час вийшов!');
            return;
        }
        display();
    }, 1000);
});

//3

function renderCalendar(year, month) {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startIndex  = firstDay === 0 ? 6 : firstDay - 1;

    dayCells.forEach((cell, i) => {
        if (i < startIndex || i >= startIndex + daysInMonth) {
            cell.textContent = '';
            cell.classList.remove('filled');
        } else {
            cell.textContent = i - startIndex + 1;
            cell.classList.add('filled');
        }
    });
}

function initCalendar() {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    monthInput.value = `${y}-${m}`;
    renderCalendar(today.getFullYear(), today.getMonth());
}

monthInput.addEventListener('change', () => {
    const parts = monthInput.value.split('-');
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1;
    renderCalendar(y, m);
});

initCalendar();

//4

setInterval(() => {
    if (!bdayInput.value) return;

    const now  = new Date();
    const bday = new Date(bdayInput.value);

    bday.setFullYear(now.getFullYear());
    if (bday <= now) bday.setFullYear(now.getFullYear() + 1);

    let mDiff = bday.getMonth() - now.getMonth();
    let dDiff = bday.getDate() - now.getDate();

    if (dDiff < 0) {
        mDiff--;
        dDiff += new Date(bday.getFullYear(), bday.getMonth(), 0).getDate();
    }
    if (mDiff < 0) mDiff += 12;

    const hDiff   = 23 - now.getHours();
    const minDiff = 59 - now.getMinutes();
    const secDiff = 59 - now.getSeconds();

    bdayResult.textContent =
        `${mDiff} місяців, ${dDiff} днів, ` +
        `${hDiff.toString().padStart(2, '0')} годин, ` +
        `${minDiff.toString().padStart(2, '0')} хвилин, ` +
        `${secDiff.toString().padStart(2, '0')} секунд`;
}, 1000);