const CARD_THEMES = [
  { img: "../lab-8/img/React-icon.svg.png", label: 'React' },
  { img: "../lab-8/img/JS.webp",            label: 'JavaScript' },
  { img: "../lab-8/img/java.png",           label: 'Java' },
  { img: "../lab-8/img/TypeScript.png",     label: 'TypeScript' },
  { img: "../lab-8/img/Rust.png",           label: 'Rust' },
  { img: "../lab-8/img/Go.png",             label: 'Go' },
  { img: "../lab-8/img/Python.png",         label: 'Python' },
  { img: "../lab-8/img/C++.png",            label: 'C++' },
  { img: "../lab-8/img/sql.png",            label: 'NoSQL' },
  { img: "../lab-8/img/Kotlin.png",         label: 'Kotlin' },
  { img: "../lab-8/img/Ruby.png",           label: 'Ruby' },
  { img: "../lab-8/img/PHP.png",            label: 'PHP' },
  { img: "../lab-8/img/dotNET.png",         label: '.NET' },
  { img: "../lab-8/img/Django.png",         label: 'Django' },
  { img: "../lab-8/img/csharp.png",         label: 'C#' },
  { img: "../lab-8/img/WordPress.png",      label: 'WordPress' },
  { img: "../lab-8/img/Swift.png",          label: 'Swift' },
  { img: "../lab-8/img/ASM.png",            label: 'ASM' },
];

const DIFFICULTY_TIMES = { easy: 180, normal: 120, hard: 60 };

const parseGridSize = (val) => {
  const [cols, rows] = val.split('x').map(Number);
  return { cols, rows };
};

const calcPairs = ({ cols, rows }) => Math.floor((cols * rows) / 2);

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createDeck = (pairs) => {
  const themes = shuffleArray(CARD_THEMES).slice(0, pairs);
  const doubled = themes.flatMap((t, i) => [
    { id: i * 2,     pairId: i, img: t.img, label: t.label },
    { id: i * 2 + 1, pairId: i, img: t.img, label: t.label },
  ]);
  return shuffleArray(doubled);
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const calcWinner = (players) => {
  const withTotals = players.map(p => ({
    ...p,
    total: p.rounds.reduce((acc, r) => acc + r.moves, 0),
  }));
  return withTotals.reduce((best, cur) => cur.total < best.total ? cur : best);
};

const buildInitialState = ({ cols, rows, diff, playerCount, p1, p2, totalRounds }) => {
  const pairs = calcPairs({ cols, rows });
  const deck  = createDeck(pairs);
  const players = playerCount === 2
    ? [{ name: p1, rounds: [] }, { name: p2, rounds: [] }]
    : [{ name: p1, rounds: [] }];

  return {
    running: true,
    deck,
    flipped: [],
    matched: [],
    moves: 0,
    currentPlayer: 0,
    players,
    playerCount,
    timerSeconds: DIFFICULTY_TIMES[diff],
    timerRemaining: DIFFICULTY_TIMES[diff],
    gridCols: cols,
    gridRows: rows,
    totalRounds,
    currentRound: 1,
    roundStart: Date.now(),
    locked: false,
  };
};

const stateAfterFlip = (state, cardId) => {
  const newFlipped = [...state.flipped, cardId];
  const shouldCount = newFlipped.length === 2;
  return {
    ...state,
    flipped: newFlipped,
    moves: shouldCount ? state.moves + 1 : state.moves,
    locked: shouldCount ? true : state.locked,
  };
};

const stateAfterMatch = (state, [id1, id2]) => {
  const newMatched = [...state.matched, id1, id2];
  return {
    ...state,
    flipped: [],
    matched: newMatched,
    locked: false,
  };
};

const stateAfterMismatch = (state) => ({
  ...state,
  flipped: [],
  locked: false,
  currentPlayer: state.playerCount === 2
    ? (state.currentPlayer + 1) % 2
    : state.currentPlayer,
});

const isRoundComplete = (state) => {
  const totalCards = state.gridCols * state.gridRows;
  return state.matched.length >= Math.floor(totalCards / 2) * 2;
};

const stateAfterRoundEnd = (state, elapsed) => {
  const roundRecord = { round: state.currentRound, moves: state.moves, time: elapsed };
  const updatedPlayers = state.players.map((p, i) => {
    const isCurrentPlayer = state.playerCount === 2
      ? i === state.currentPlayer
      : i === 0;
    return isCurrentPlayer
      ? { ...p, rounds: [...p.rounds, roundRecord] }
      : p;
  });
  return { ...state, running: false, players: updatedPlayers };
};

const stateForNextRound = (state) => {
  const pairs = calcPairs({ cols: state.gridCols, rows: state.gridRows });
  const deck  = createDeck(pairs);
  return {
    ...state,
    running: true,
    deck,
    flipped: [],
    matched: [],
    moves: 0,
    timerRemaining: state.timerSeconds,
    roundStart: Date.now(),
    locked: false,
    currentRound: state.currentRound + 1,
  };
};

const buildHUDData = (state) => ({
  round: `${state.currentRound}/${state.totalRounds}`,
  timer: formatTime(state.timerRemaining),
  moves: state.moves,
  pairs: state.matched.length / 2,
  totalPairs: Math.floor((state.gridCols * state.gridRows) / 2),
  turnName: state.running
    ? (state.playerCount === 2
        ? `Хід: ${state.players[state.currentPlayer].name}`
        : `Гравець: ${state.players[0].name}`)
    : 'Натисніть "Розпочати гру"',
  timerWarning: state.timerRemaining <= 15 && state.running,
});

const buildRoundWinContent = (state, elapsed) => ({
  title: `Раунд ${state.currentRound} завершено!`,
  body: `<p>Ходи: <strong>${state.moves}</strong> | Час: <strong>${formatTime(elapsed)}</strong></p>`,
});

const buildFinalResultsContent = (players, playerCount) => {
  const tableRows = players
    .filter(p => p.rounds.length > 0)
    .flatMap(p =>
      p.rounds.map(r => `
        <tr>
          <td>${p.name}</td>
          <td>${r.round}</td>
          <td>${r.moves}</td>
          <td>${formatTime(r.time)}</td>
        </tr>`)
    )
    .join('');

  const winnerHTML = (playerCount === 2 && players.filter(p => p.rounds.length > 0).length === 2)
    ? (() => {
        const winner = calcWinner(players.filter(p => p.rounds.length > 0));
        return `<p>Переможець: <strong>${winner.name}</strong><span class="winner-badge">WINNER</span></p>`;
      })()
    : (() => {
        const p = players.find(p => p.rounds.length > 0);
        const totalMoves = p ? p.rounds.reduce((a, r) => a + r.moves, 0) : 0;
        return `<p>Загальна кількість ходів: <strong>${totalMoves}</strong></p>`;
      })();

  const tableHTML = tableRows
    ? `<table class="stats-table">
        <thead><tr><th>Гравець</th><th>Раунд</th><th>Ходи</th><th>Час</th></tr></thead>
        <tbody>${tableRows}</tbody>
       </table>`
    : '';

  return { title: 'Гра завершена!', body: winnerHTML + tableHTML };
};

const readSettingsFromDOM = () => ({
  gridVal:      document.getElementById('grid-size').value,
  diff:         document.getElementById('difficulty').value,
  playerCount:  parseInt(document.getElementById('player-count').value),
  totalRounds:  Math.max(1, parseInt(document.getElementById('rounds-count').value) || 1),
  p1:           document.getElementById('p1-name').value.trim() || 'Гравець 1',
  p2:           document.getElementById('p2-name').value.trim() || 'Гравець 2',
});

const renderHUD = (hudData) => {
  document.getElementById('hud-round').textContent  = hudData.round;
  document.getElementById('hud-timer').textContent  = hudData.timer;
  document.getElementById('hud-moves').textContent  = hudData.moves;
  document.getElementById('hud-pairs').textContent  = `${hudData.pairs}/${hudData.totalPairs}`;
  document.getElementById('turn-indicator').textContent = hudData.turnName;
  document.getElementById('timer-box').classList.toggle('timer-warning', hudData.timerWarning);
};

const renderBoard = (deck, cols) => {
  const board = document.getElementById('game-board');
  board.style.gridTemplateColumns = `repeat(${cols}, var(--card-size))`;
  board.innerHTML = '';
  deck.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id     = card.id;
    el.dataset.pairId = card.pairId;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${card.img}" alt="${card.label}">
          <span class="card-label">${card.label}</span>
        </div>
        <div class="card-back"></div>
      </div>`;
    el.addEventListener('click', () => onCardClick(card.id));
    board.appendChild(el);
  });
};

const getCardEl = (id) => document.querySelector(`.card[data-id="${id}"]`);

const renderCardFlipped = (id, flipped) => {
  const el = getCardEl(id);
  if (!el) return;
  el.classList.toggle('flipped', flipped);
};

const renderCardsMatched = (ids) => {
  ids.forEach(id => {
    const el = getCardEl(id);
    if (!el) return;
    el.classList.add('matched', 'flipped');
    el.classList.remove('wrong');
  });
};

const renderCardsWrong = (ids) => {
  ids.forEach(id => {
    const el = getCardEl(id);
    if (el) el.classList.add('wrong');
  });
  setTimeout(() => {
    ids.forEach(id => {
      const el = getCardEl(id);
      if (el) el.classList.remove('wrong');
    });
  }, 600);
};

const showOverlay = (title, content, buttons) => {
  document.getElementById('overlay-title').innerHTML   = title;
  document.getElementById('overlay-content').innerHTML = content;
  const btnEl = document.getElementById('overlay-buttons');
  btnEl.innerHTML = '';
  buttons.forEach(({ label, cls, action }) => {
    const b = document.createElement('button');
    b.className = `btn ${cls}`;
    b.textContent = label;
    b.onclick = action;
    btnEl.appendChild(b);
  });
  document.getElementById('overlay').classList.add('show');
};

const hideOverlay = () =>
  document.getElementById('overlay').classList.remove('show');

// TIMER

let _timerInterval = null;

const stopTimer = () => {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
};

const startTimer = () => {
  stopTimer();
  _timerInterval = setInterval(() => {
    appState = { ...appState, timerRemaining: appState.timerRemaining - 1 };
    renderHUD(buildHUDData(appState));
    if (appState.timerRemaining <= 0) {
      stopTimer();
      handleTimeUp();
    }
  }, 1000);
};


let appState = {
  running: false,
  deck: [],
  flipped: [],
  matched: [],
  moves: 0,
  currentPlayer: 0,
  players: [{ name: 'Гравець 1', rounds: [] }],
  playerCount: 1,
  timerSeconds: 180,
  timerRemaining: 180,
  gridCols: 4,
  gridRows: 4,
  totalRounds: 1,
  currentRound: 1,
  roundStart: null,
  locked: false,
};


const updatePlayerInputs = () => {
  const count = parseInt(document.getElementById('player-count').value);
  document.getElementById('p2-group').style.display = count === 2 ? '' : 'none';
};

const resetSettings = () => {
  document.getElementById('player-count').value  = '1';
  document.getElementById('p1-name').value       = 'Гравець 1';
  document.getElementById('p2-name').value       = 'Гравець 2';
  document.getElementById('grid-size').value     = '4x4';
  document.getElementById('difficulty').value    = 'easy';
  document.getElementById('rounds-count').value  = '1';
  updatePlayerInputs();
};

const startGame = () => {
  hideOverlay();
  stopTimer();

  const settings = readSettingsFromDOM();
  const { cols, rows } = parseGridSize(settings.gridVal);

  appState = buildInitialState({ ...settings, cols, rows });

  renderBoard(appState.deck, appState.gridCols);
  renderHUD(buildHUDData(appState));
  startTimer();
};

const restartRound = () => {
  const isFirstRun =
    !appState.running &&
    appState.currentRound === 1 &&
    appState.players.every(p => p.rounds.length === 0);

  if (isFirstRun) { startGame(); return; }

  hideOverlay();
  stopTimer();

  const pairs = calcPairs({ cols: appState.gridCols, rows: appState.gridRows });
  const deck  = createDeck(pairs);


  appState = {
    ...appState,
    running: true,
    deck,
    flipped: [],
    matched: [],
    moves: 0,
    timerRemaining: appState.timerSeconds,
    roundStart: Date.now(),
    locked: false,
    currentRound: 1,
    players: appState.players.map(p => ({ ...p, rounds: [] })),
  };

  renderBoard(appState.deck, appState.gridCols);
  renderHUD(buildHUDData(appState));
  startTimer();
};

const onCardClick = (cardId) => {
  if (!appState.running || appState.locked)          return;
  if (appState.flipped.includes(cardId))             return;
  if (appState.matched.includes(cardId))             return;
  if (appState.flipped.length >= 2)                  return;

  appState = stateAfterFlip(appState, cardId);
  renderCardFlipped(cardId, true);
  renderHUD(buildHUDData(appState));

  if (appState.flipped.length === 2) {
    handleCheckMatch(appState.flipped);
  }
};

const handleCheckMatch = ([id1, id2]) => {
  const card1 = appState.deck.find(c => c.id === id1);
  const card2 = appState.deck.find(c => c.id === id2);

  if (card1.pairId === card2.pairId) {
    setTimeout(() => {
      renderCardsMatched([id1, id2]);

      appState = stateAfterMatch(appState, [id1, id2]);
      renderHUD(buildHUDData(appState));

      if (isRoundComplete(appState)) handleRoundEnd();
    }, 300);
  } else {
    renderCardsWrong([id1, id2]);
    setTimeout(() => {
      renderCardFlipped(id1, false);
      renderCardFlipped(id2, false);

      appState = stateAfterMismatch(appState);
      renderHUD(buildHUDData(appState));
    }, 900);
  }
};

const handleRoundEnd = () => {
  stopTimer();
  const elapsed = Math.round((Date.now() - appState.roundStart) / 1000);

  appState = stateAfterRoundEnd(appState, elapsed);

  if (appState.currentRound >= appState.totalRounds) {
    handleFinalResults();
  } else {
    const content = buildRoundWinContent(appState, elapsed);
    showOverlay(content.title, content.body, [
      { label: 'Наступний раунд', cls: 'btn-yellow', action: handleNextRound },
    ]);
  }
};

const handleNextRound = () => {
  hideOverlay();

  appState = stateForNextRound(appState);

  renderBoard(appState.deck, appState.gridCols);
  renderHUD(buildHUDData(appState));
  startTimer();
};

const handleFinalResults = () => {
  const content = buildFinalResultsContent(appState.players, appState.playerCount);
  showOverlay(content.title, content.body, [
    { label: 'Нова гра',  cls: 'btn-yellow',  action: startGame },
    { label: 'Рестарт',   cls: 'btn-outline',  action: restartRound },
  ]);
};

const handleTimeUp = () => {
  appState = { ...appState, running: false };
  showOverlay(
    'Час вийшов!',
    `<p>Ви не встигли знайти всі пари.</p><p>Ходи: <strong>${appState.moves}</strong></p>`,
    [
      { label: 'Спробувати знову', cls: 'btn-yellow',  action: restartRound },
      { label: 'Налаштування',     cls: 'btn-outline',  action: hideOverlay },
    ]
  );
};
updatePlayerInputs();
renderHUD(buildHUDData(appState));