const defaultBlubOn = document.querySelector('.default-on');
const defaultBlubOff = document.querySelector('.default-off');
const energySavingBlubOn = document.querySelector('.energy-saving-on');
const energySavingBlubOff = document.querySelector('.energy-saving-off');
const ledBlubOn = document.querySelector('.led-on');
const ledBlubOff = document.querySelector('.led-off');

//тип
const defaultButton = document.querySelector('.default-button');
const energySavingButton = document.querySelector('.energy-saving-button');
const ledButton = document.querySelector('.led-button');

// Кнопки 
const onButton = document.querySelector('.on-button');
const offButton = document.querySelector('.off-button');

const brightnessButton = document.querySelector('.brightness-button');

const statusInfo = document.querySelector('.status-info');
const brightnessInfo = document.querySelector('.brightness-info');
const timerInfo = document.querySelector('.timer-info');

let inactivityTimer = null;
const INACTIVITY_MS = 5 * 60 * 1000;


function hideAllBulbs() {
    [defaultBlubOn, defaultBlubOff,
     energySavingBlubOn, energySavingBlubOff,
     ledBlubOn, ledBlubOff
    ].forEach(el => el.classList.remove('active'));
}

function getActiveBulb() {
    if (defaultBlubOn.classList.contains('active'))         return { el: defaultBlubOn,         type: 'default',       state: 'on'  };
    if (defaultBlubOff.classList.contains('active'))        return { el: defaultBlubOff,        type: 'default',       state: 'off' };
    if (energySavingBlubOn.classList.contains('active'))    return { el: energySavingBlubOn,    type: 'energySaving',  state: 'on'  };
    if (energySavingBlubOff.classList.contains('active'))   return { el: energySavingBlubOff,   type: 'energySaving',  state: 'off' };
    if (ledBlubOn.classList.contains('active'))             return { el: ledBlubOn,             type: 'led',           state: 'on'  };
    if (ledBlubOff.classList.contains('active'))            return { el: ledBlubOff,            type: 'led',           state: 'off' };
    return null;
}

function getOnBulbByType(type) {
    return { default: defaultBlubOn, energySaving: energySavingBlubOn, led: ledBlubOn }[type];
}

function getOffBulbByType(type) {
    return { default: defaultBlubOff, energySaving: energySavingBlubOff, led: ledBlubOff }[type];
}

function getTypeName(type) {
    return { default: 'Звичайна', energySaving: 'Енергозберігаюча', led: 'Світлодіодна' }[type];
}

function updateStatus() {
    const active = getActiveBulb();
    if (!active) {
        statusInfo.textContent = 'Оберіть тип лампочки';
        timerInfo.textContent = '';
        brightnessInfo.textContent = '';
        return;
    }
    if (active.state === 'on') {
        statusInfo.textContent = `Лампочка УВІМКНЕНА (${getTypeName(active.type)})`;
        timerInfo.textContent = 'Таймер автовимкнення: 5 хв';
    } else {
        statusInfo.textContent = `Лампочка ВИМКНЕНА (${getTypeName(active.type)})`;
        timerInfo.textContent = '';
        brightnessInfo.textContent = '';
    }
}


function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const active = getActiveBulb();
        if (active && active.state === 'on') {
            hideAllBulbs();
            getOffBulbByType(active.type).classList.add('active');
            timerInfo.textContent = 'Лампочку вимкнено автоматично через 5 хв бездіяльності.';
            brightnessInfo.textContent = '';
            statusInfo.textContent = `Лампочка ВИМКНЕНА (${getTypeName(active.type)})`;
        }
    }, INACTIVITY_MS);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(ev =>
    document.addEventListener(ev, () => {
        const active = getActiveBulb();
        if (active && active.state === 'on') resetInactivityTimer();
    })
);


defaultButton.addEventListener('click', () => {
    hideAllBulbs();
    defaultBlubOff.classList.add('active');
    updateStatus();
});

energySavingButton.addEventListener('click', () => {
    hideAllBulbs();
    energySavingBlubOff.classList.add('active');
    updateStatus();
});

ledButton.addEventListener('click', () => {
    hideAllBulbs();
    ledBlubOff.classList.add('active');
    updateStatus();
});


onButton.addEventListener('click', () => {
    const active = getActiveBulb();
    if (!active) {
        alert('Спочатку оберіть тип лампочки.');
        return;
    }
    if (active.state === 'on') return;
    hideAllBulbs();
    getOnBulbByType(active.type).classList.add('active');
    resetInactivityTimer();
    updateStatus();
});

offButton.addEventListener('click', () => {
    const active = getActiveBulb();
    if (!active) {
        alert('Спочатку оберіть тип лампочки.');
        return;
    }
    if (active.state === 'off') return;
    hideAllBulbs();
    getOffBulbByType(active.type).classList.add('active');
    clearTimeout(inactivityTimer);
    updateStatus();
});

// 

brightnessButton.addEventListener('click', () => {
    const active = getActiveBulb();
    if (!active || active.state !== 'on') {
        alert('Спочатку увімкніть лампочку.');
        return;
    }
    if (active.type === 'default') {
        alert('Звичайна лампочка не підтримує регулювання яскравості.');
        return;
    }
    const input = prompt('Введіть яскравість від 10 до 100:', 100);
    if (input === null) return;
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 10 || num > 100) {
        alert('Будь ласка, введіть ціле число від 10 до 100.');
        return;
    }
    active.el.style.filter = `brightness(${num}%)`;
    brightnessInfo.textContent = `Яскравість: ${num}%`;
    resetInactivityTimer();
});