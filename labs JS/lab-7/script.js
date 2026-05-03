'use strict';

const MAX_LEVELS       = 5;
const BASE_GUNMAN_TIME = 0.80;
const MIN_WAIT         = 1500;
const MAX_WAIT         = 4000;
const SCALE            = 3;
const SCREEN_W         = 800;

const createAudio = src => new Audio(src);
const sounds = {
    intro:    createAudio('sfx/intro.m4a'),
    wait:     createAudio('sfx/wait.m4a'),
    fire:     createAudio('sfx/fire.m4a'),
    shot:     createAudio('sfx/shot.m4a'),
    shotFall: createAudio('sfx/shot-fall.m4a'),
    death:    createAudio('sfx/death.m4a'),
    win:      createAudio('sfx/win.m4a'),
    foul:     createAudio('sfx/foul.m4a'),
};
sounds.intro.loop = true;
sounds.wait.loop  = true;

const playSound     = s => { s.currentTime = 0; s.play().catch(() => {}); };
const stopSound     = s => { s.pause(); s.currentTime = 0; };
const stopAllSounds = () => Object.values(sounds).forEach(stopSound);

const CHARACTERS = [
    { id: 1, cls: 'char-1', name: 'The Bandit',  walkSpeed: 5000 },
    { id: 2, cls: 'char-2', name: 'The Deputy',  walkSpeed: 4500 },
    { id: 3, cls: 'char-3', name: 'Quick Draw',  walkSpeed: 3500 },
    { id: 4, cls: 'char-4', name: 'El Sombrero', walkSpeed: 5500 },
    { id: 5, cls: 'char-5', name: 'The Sheriff', walkSpeed: 4000 },
];

const CHAR_POSES = {
    'char-1': { walk:{w:33,h:65}, stand:{w:35,h:65}, ready:{w:35,h:65}, shoot:{w:34,h:65}, death:{w:97,h:65} },
    'char-2': { walk:{w:33,h:76}, stand:{w:33,h:76}, ready:{w:26,h:76}, shoot:{w:29,h:76}, death:{w:69,h:76} },
    'char-3': { walk:{w:27,h:60}, stand:{w:31,h:60}, ready:{w:31,h:60}, shoot:{w:31,h:60}, death:{w:73,h:60} },
    'char-4': { walk:{w:32,h:68}, stand:{w:34,h:68}, ready:{w:33,h:68}, shoot:{w:33,h:68}, death:{w:70,h:68} },
    'char-5': { walk:{w:32,h:72}, stand:{w:34,h:72}, ready:{w:31,h:72}, shoot:{w:35,h:72}, death:{w:108,h:72} },
};

const getRandomCharacter = () => {
    let newChar;
    do {
        newChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    } while (state.character && newChar.id === state.character.id);
    return newChar;
};

const calcGunmanTime  = level => Math.max(0.30, parseFloat((BASE_GUNMAN_TIME - (level-1)*0.10).toFixed(2)));
const calcRoundScore  = (level, sec) => Math.max(50, Math.round((1/sec)*level*100));
const getRandomWait   = () => Math.floor(Math.random() * (MAX_WAIT - MIN_WAIT) + MIN_WAIT);
const addTimerToList  = (timers, t) => [...timers, t];
const calcCenterLeft = () => {
    const { w } = CHAR_POSES[state.character.cls]['stand'];
    return (SCREEN_W - w * SCALE) / 2;
};

let state = {
    level: 1, score: 0, phase: 'menu',
    character: CHARACTERS[0],
    gunmanShootTime: BASE_GUNMAN_TIME,
    fireTimestamp: null, timers: [],
};

const el = id => document.getElementById(id);
const dom = {
    menu: el('game-menu'), wrapper: el('wrapper'),
    panels: el('game-panels'), gameScreen: el('game-screen'),
    winScreen: el('win-screen'), gunmanWrap: el('gunman-wrap'),
    gunman: el('gunman'), message: el('message'),
    timeYou: el('time-you'), timeGunman: el('time-gunman'),
    scoreNum: el('score-num'), levelDisplay: el('level-display'),
    finalScore: el('final-score'), btnStart: el('btn-start'),
    btnRestart: el('btn-restart'), btnNextLevel: el('btn-next-level'),
    btnPlayAgain: el('btn-play-again'),
};

const show = e => { e.style.display = 'block'; };
const hide = e => { e.style.display = 'none'; };
const showMessage = (text, cssClass = '') => {
    dom.message.className   = 'message ' + cssClass;
    dom.message.textContent = cssClass.includes('fire') ? '' : text;
};
const hideMessage = () => { dom.message.className = 'message'; dom.message.textContent = ''; };
const updateHUD = (score, level, youTime, gunTime) => {
    dom.scoreNum.textContent     = score;
    dom.levelDisplay.textContent = `Level ${level}`;
    dom.timeYou.textContent      = youTime;
    dom.timeGunman.textContent   = gunTime;
};

const setGunmanPose = pose => {
    const { cls }  = state.character;
    dom.gunmanWrap.className = `gunman-wrap ${cls} ${pose}`;
    dom.gunman.className = `gunman ${cls} ${pose}`;
};

const scheduleTimer = (fn, delay) => {
    const t = setTimeout(fn, delay);
    state = { ...state, timers: addTimerToList(state.timers, t) };
    return t;
};
const clearAllTimers = () => { state.timers.forEach(clearTimeout); state = { ...state, timers: [] }; };

function startGame() {
    clearAllTimers(); stopAllSounds();
    state = { level:1, score:0, phase:'walking', character:CHARACTERS[0],
        gunmanShootTime:calcGunmanTime(1), fireTimestamp:null, timers:[] };
    hide(dom.menu); hide(dom.winScreen);
    dom.btnRestart.style.display = 'none';
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
    show(dom.wrapper); show(dom.panels); show(dom.gameScreen);
    hideMessage();
    updateHUD(0, 1, '0.00', calcGunmanTime(1).toFixed(2));
    moveGunman();
}

function restartGame() {
    clearAllTimers(); stopAllSounds();
    state = { ...state, phase:'walking', fireTimestamp:null, timers:[] };
    dom.btnRestart.style.display = 'none';
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
    hideMessage();
    updateHUD(state.score, state.level, '0.00', state.gunmanShootTime.toFixed(2));
    moveGunman();
}

function nextLevel() {
    clearAllTimers(); stopAllSounds();
    const newLevel = state.level + 1;
    if (newLevel > MAX_LEVELS) { showWinScreen(); return; }
    state = { ...state, level:newLevel, phase:'walking',
        gunmanShootTime:calcGunmanTime(newLevel), fireTimestamp:null, timers:[] };
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
    hideMessage();
    updateHUD(state.score, newLevel, '0.00', calcGunmanTime(newLevel).toFixed(2));
    moveGunman();
}

function moveGunman() {
    const character = getRandomCharacter();
    state = { ...state, character };
    showMessage(character.name, 'message--win');
    scheduleTimer(hideMessage, 1500);

    dom.gunmanWrap.style.transition = 'none';
    dom.gunmanWrap.style.left = '900px';
    setGunmanPose('walk');

    void dom.gunmanWrap.offsetLeft;

    const centerLeft = calcCenterLeft();
    dom.gunmanWrap.style.transition = `left ${character.walkSpeed}ms linear`;
    dom.gunmanWrap.style.left = centerLeft + 'px';

    playSound(sounds.wait);
    scheduleTimer(prepareForDuel, character.walkSpeed);
}

function prepareForDuel() {
    stopSound(sounds.wait);
    setGunmanPose('stand');
    state = { ...state, phase: 'waiting' };
    scheduleTimer(startDuel, getRandomWait());
}

function startDuel() {
    state = { ...state, phase:'duel', fireTimestamp:Date.now() };
    setGunmanPose('ready');
    showMessage('', 'message--fire');
    playSound(sounds.fire);
    dom.timeGunman.textContent = state.gunmanShootTime.toFixed(2);
    scheduleTimer(gunmanShootsPlayer, state.gunmanShootTime * 1000);
}

function gunmanShootsPlayer() {
    if (state.phase !== 'duel') return;
    clearAllTimers();
    state = { ...state, phase:'result' };
    setGunmanPose('shoot');
    playSound(sounds.shot);
    scheduleTimer(() => {
        hideMessage();
        showMessage('YOU LOSE', 'message--dead');
        dom.gameScreen.classList.add('game-screen--death');
        stopSound(sounds.shot);
        playSound(sounds.death);
        dom.btnRestart.style.display = 'block';
    }, 400);
}

function playerShootsGunman() {
    if (state.phase !== 'duel') return;
    clearAllTimers();
    const reactionMs  = Date.now() - state.fireTimestamp;
    const reactionSec = parseFloat((reactionMs / 1000).toFixed(2));
    const roundScore  = calcRoundScore(state.level, reactionSec);
    state = { ...state, phase:'result', score:state.score + roundScore };

    setGunmanPose('death');
    stopAllSounds();
    playSound(sounds.shotFall);
    hideMessage();
    updateHUD(state.score, state.level, reactionSec.toFixed(2), state.gunmanShootTime.toFixed(2));

    scheduleTimer(() => {
        showMessage(`+$${roundScore}`, 'message--win');
        playSound(sounds.win);
        if (state.level >= MAX_LEVELS) { scheduleTimer(showWinScreen, 2500); }
        else { dom.btnNextLevel.style.display = 'block'; }
    }, 3500);
}

function handleEarlyClick() {
    if (state.phase !== 'waiting') return;
    clearAllTimers(); stopAllSounds();
    state = { ...state, phase:'result' };
    showMessage('TOO EARLY!', 'message--dead');
    playSound(sounds.foul);
    dom.btnRestart.style.display = 'block';
}

function showWinScreen() {
    stopAllSounds(); hide(dom.wrapper);
    dom.finalScore.textContent = state.score;
    show(dom.winScreen);
    playSound(sounds.win);
}

dom.btnStart.addEventListener('click',     () => { stopAllSounds(); startGame(); });
dom.btnRestart.addEventListener('click',   restartGame);
dom.btnNextLevel.addEventListener('click', nextLevel);
dom.btnPlayAgain.addEventListener('click', startGame);
dom.gunman.addEventListener('click', e => { e.stopPropagation(); if (state.phase === 'waiting') { handleEarlyClick(); } else { playerShootsGunman(); } });
dom.gameScreen.addEventListener('click', () => { if (state.phase === 'waiting') { handleEarlyClick(); } });

const startIntroMusic = () => {
    if (state.phase === 'menu' && sounds.intro.paused) {
        sounds.intro.play().catch(() => {});
    }
    document.removeEventListener('click', startIntroMusic);
    document.removeEventListener('keydown', startIntroMusic);
};

document.addEventListener('click', startIntroMusic);
document.addEventListener('keydown', startIntroMusic);