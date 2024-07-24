// Fruit array
const fruits = [
  "apple.png", "broccoli.png", "carrot.png", "cherries.png", "grapes.png",
  "watermelon.png", "orange.png", "chili.png", "salad.png", "strawberry.png"
];

// Game state
let moves = 0;
let pairs = 0;
let cardsUncovered = [];
let timer;
let sec = 0;
let min = 0;

// DOM elements
const boardElement = document.getElementById('plansza');
const movesElement = document.getElementById('moves');
const pairsElement = document.getElementById('selectedCards');
const timeElement = document.getElementById('time');
const timerToggle = document.getElementById('timerToggle');
const timerToggleMobile = document.getElementById('timerToggleMobile');
const startAgainButton = document.getElementById('startAgain');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');

// Initialize game
function initGame() {
  const fruitsMix = [...fruits, ...fruits].sort(() => 0.5 - Math.random());
  boardElement.innerHTML = fruitsMix.map((fruit, index) => 
      `<div class="fruit" data-id="${index}" data-fruit="${fruit}"></div>`
  ).join('');

  document.querySelectorAll('.fruit').forEach(card => 
      card.addEventListener('click', uncoverCard)
  );

  moves = 0;
  pairs = 0;
  cardsUncovered = [];
  updateUI();
  startTimer();
}

// Uncover card
function uncoverCard(e) {
  const card = e.target;
  if (cardsUncovered.includes(card) || cardsUncovered.length === 2) return;

  card.style.backgroundImage = `url("img/${card.dataset.fruit}")`;
  cardsUncovered.push(card);

  if (cardsUncovered.length === 2) {
      moves++;
      updateUI();
      checkMatch();
  }
}

// Check if cards match
function checkMatch() {
  const [card1, card2] = cardsUncovered;
  if (card1.dataset.fruit === card2.dataset.fruit) {
      pairs++;
      cardsUncovered.forEach(card => {
          card.style.backgroundImage = `url("img/y${card.dataset.fruit}")`;
          card.removeEventListener('click', uncoverCard);
      });
      if (pairs === fruits.length) {
          endGame();
      }
  } else {
      setTimeout(() => {
          cardsUncovered.forEach(card => {
              card.style.backgroundImage = 'url("img/fruits.png")';
          });
      }, 700);
  }
  setTimeout(() => {
      cardsUncovered = [];
  }, 700);
  updateUI();
}

// Update UI elements
function updateUI() {
  movesElement.textContent = moves;
  pairsElement.textContent = `${pairs}/${fruits.length}`;
}

// Timer functions
function startTimer() {
  timer = setInterval(() => {
      sec++;
      if (sec === 60) {
          min++;
          sec = 0;
      }
      updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  timeElement.textContent = `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
}

function toggleTimer() {
  if (timer) {
      clearInterval(timer);
      timer = null;
      timerToggle.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> play timer';
      timerToggleMobile.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"></span> play timer';
  } else {
      startTimer();
      timerToggle.innerHTML = '<span class="glyphicon glyphicon-pause" aria-hidden="true"></span> pause timer';
      timerToggleMobile.innerHTML = '<span class="glyphicon glyphicon-pause" aria-hidden="true"></span> pause timer';
  }
}

// End game
function endGame() {
  clearInterval(timer);
  overlay.style.display = 'block';
  popup.innerHTML = `
      <div id="close" onclick="hideWin()">X</div>
      <h2>Congratulations!</h2>
      <br><p>You found all pairs<br><br>
      Your time: <span class="b">${timeElement.textContent}</span><br>
      Number of moves: <span class="b">${moves}</span></p>
      <button class="aside-btn zegar" onclick="startAgain()">play again</button>
  `;
}

// Hide win popup
function hideWin() {
  overlay.style.display = 'none';
}

// Event listeners
timerToggle.addEventListener('click', toggleTimer);
timerToggleMobile.addEventListener('click', toggleTimer);
startAgainButton.addEventListener('click', startAgain);

// Start game
function startAgain() {
  clearInterval(timer);
  sec = 0;
  min = 0;
  updateTimerDisplay();
  initGame();
}

// Initialize game on load
window.onload = initGame;

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    updateDarkModeButton();
}

function updateDarkModeButton() {
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<span class="glyphicon glyphicon-adjust" aria-hidden="true"></span> Toggle Light Mode';
    } else {
        darkModeToggle.innerHTML = '<span class="glyphicon glyphicon-adjust" aria-hidden="true"></span> Toggle Dark Mode';
    }
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    updateDarkModeButton();
}

darkModeToggle.addEventListener('click', toggleDarkMode);