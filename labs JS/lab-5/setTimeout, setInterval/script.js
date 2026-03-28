let red = document.querySelector('.red');
let green = document.querySelector('.green');
let yellow = document.querySelector('.yellow');
let redBtn = document.querySelector('#change-red');
let yellowBtn = document.querySelector('#change-yellow');
let greenBtn = document.querySelector('#change-green');
let text = document.getElementById('output');
let nextBtn = document.getElementById('next-btn');
let redTimeout, yellowTimeout, greenTimeout;

function hideAll() {
    red.classList.remove('active');
    green.classList.remove('active');
    yellow.classList.remove('active');
}

function showRed() {
    redTimeout = setTimeout(() => {
        hideAll();
        red.classList.add('active');
        text.textContent = 'Червоний';
        text.style.color = 'red';
    }, 0);
}

function showYellow() {
    yellowTimeout = setTimeout(() => {
        hideAll();
        yellow.classList.add('active');
        text.textContent = 'Жовтий';
        text.style.color = 'yellow';
    }, 3000);
}

function showGreen() {
    greenTimeout = setTimeout(() => {
        hideAll();
        green.classList.add('active');
        text.textContent = 'Зелений';
        text.style.color = 'green';
    }, 7000);
}

let trafficLightInterval = setInterval(() => {
    startTrafficLight();
}, 12500);

redBtn.addEventListener('click', () => {
    clearInterval(trafficLightInterval);
    clearTimeout(redTimeout);
    let value = prompt('Enter time in seconds');
    redTimeout = setTimeout(() => {
        hideAll();
        red.classList.add('active');
        text.textContent = 'Червоний';
        text.style.color = 'red';
        trafficLightInterval = setInterval(() => {
            startTrafficLight();
        }, 12500);
    }, value * 1000);
});

yellowBtn.addEventListener('click', () => {
    clearInterval(trafficLightInterval);
    clearTimeout(yellowTimeout);
    let value = prompt('Enter time in seconds');
    yellowTimeout = setTimeout(() => {
        hideAll();
        yellow.classList.add('active');
        text.textContent = 'Жовтий';
        text.style.color = 'yellow';
        trafficLightInterval = setInterval(() => {
            startTrafficLight();
        }, 12500);
    }, value * 1000);
});

greenBtn.addEventListener('click', () => {
    clearInterval(trafficLightInterval);
    clearTimeout(greenTimeout);
    let value = prompt('Enter time in seconds');
    greenTimeout = setTimeout(() => {
        hideAll();
        green.classList.add('active');
        text.textContent = 'Зелений';
        text.style.color = 'green';
        trafficLightInterval = setInterval(() => {
            startTrafficLight();
        }, 12500);
    }, value * 1000);
});

function showRedNow() {
    hideAll();
    red.classList.add('active');
    text.textContent = 'Червоний';
    text.style.color = 'red';
}
function showYellowNow() {
    hideAll();
    yellow.classList.add('active');
    text.textContent = 'Жовтий';
    text.style.color = 'yellow';
}
function showGreenNow() {
    hideAll();
    green.classList.add('active');
    text.textContent = 'Зелений';
    text.style.color = 'green';
}

nextBtn.addEventListener('click', () => {
    clearInterval(trafficLightInterval);
    if (red.classList.contains('active')) {
        hideAll();
        clearTimeout(redTimeout);
        showYellowNow();
    }
    else if (yellow.classList.contains('active')) {
        hideAll();
        clearTimeout(yellowTimeout);
        showGreenNow();
    }
    else if (green.classList.contains('active')) {
        hideAll();
        clearTimeout(greenTimeout);
        showRedNow();
    }
});

function blinkYellow(startTime) {
    for (let i = 0; i < 3; i++) {
        yellowTimeout = setTimeout(() => {
            hideAll();
            yellow.classList.add('active');
            text.textContent = 'Жовтий';
            text.style.color = 'yellow';
        }, startTime + i * 500);
        greenTimeout = setTimeout(() => {
            hideAll();
            text.textContent = '';
        }, startTime + i * 500 + 250);
    }
}

function startTrafficLight() {
    showRed();
    showYellow();
    showGreen();
    blinkYellow(11000);
}

startTrafficLight();