const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const highScoresEl = document.getElementById("high-scores");
const progressEl = document.getElementById("progress");

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let shuffledQuestions;

function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  timeLeft = 15;
  timerEl.textContent = `⏱ ${timeLeft}s`;
  timer = setInterval(updateTimer, 1000);

  const q = shuffledQuestions[currentQuestion];
  questionEl.textContent = q.question;

  q.options.forEach((opt, i) => {
    const button = document.createElement("button");
    button.textContent = opt;
    button.onclick = () => selectAnswer(i);
    optionsEl.appendChild(button);
  });

  updateProgress();
}

function resetState() {
  clearInterval(timer);
  nextBtn.classList.add("hidden");
  optionsEl.innerHTML = "";
}

function updateTimer() {
  timeLeft--;
  timerEl.textContent = `⏱ ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    nextBtn.classList.remove("hidden");
  }
}

function selectAnswer(selected) {
  clearInterval(timer);
  const q = shuffledQuestions[currentQuestion];
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    if (i === q.answer) btn.classList.add("correct");
    else if (i === selected) btn.classList.add("wrong");
    btn.disabled = true;
  });
  if (selected === q.answer) score++;
  nextBtn.classList.remove("hidden");
}

function updateProgress() {
  progressEl.innerHTML = "<div></div>";
  const progressBar = progressEl.querySelector("div");
  progressBar.style.width = `${
    ((currentQuestion + 1) / shuffledQuestions.length) * 100
  }%`;
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${shuffledQuestions.length}`;
  saveHighScore(score);
  displayHighScores();
}

function saveHighScore(newScore) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(newScore);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function displayHighScores() {
  highScoresEl.innerHTML = "";
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    highScoresEl.appendChild(li);
  });
}

startBtn.onclick = startQuiz;
nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < shuffledQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
};
restartBtn.onclick = () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};
