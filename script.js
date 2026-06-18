const setupScreen = document.getElementById('setupScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const difficultySelect = document.getElementById('difficulty');
const questionCountSelect = document.getElementById('questionCount');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const questionCounter = document.getElementById('questionCounter');
const skillBadge = document.getElementById('skillBadge');
const questionText = document.getElementById('questionText');
const answerArea = document.getElementById('answerArea');
const feedback = document.getElementById('feedback');
const visualArea = document.getElementById('visualArea');
const finalScore = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');

let state = {
  difficulty: 'medium',
  total: 10,
  current: 0,
  score: 0,
  question: null,
  selectedAnswer: null,
  answered: false
};

const names = ['Mia', 'Leo', 'Aisha', 'Noah', 'Sofia', 'Ethan', 'Zara', 'Kai'];
const objects = ['apples', 'stickers', 'marbles', 'stars', 'cookies', 'cards', 'blocks', 'shells'];
const contexts = ['space', 'jungle', 'school', 'sports day', 'bakery', 'toy shop', 'aquarium'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function numberRange() {
  if (state.difficulty === 'easy') return { min: 1, max: 10 };
  if (state.difficulty === 'medium') return { min: 5, max: 40 };
  return { min: 12, max: 120 };
}

function makeChoices(correct) {
  const choices = new Set([String(correct)]);
  while (choices.size < 4) {
    const offset = randInt(-10, 10) || 1;
    const wrong = Number(correct) + offset;
    if (wrong >= 0) choices.add(String(wrong));
  }
  return shuffle([...choices]);
}

function arithmeticQuestion() {
  const range = numberRange();
  const ops = state.difficulty === 'easy' ? ['+', '-'] : ['+', '-', 'x'];
  const op = pick(ops);
  let a = randInt(range.min, range.max);
  let b = randInt(range.min, Math.min(range.max, state.difficulty === 'hard' ? 15 : range.max));
  let answer;

  if (op === '+') answer = a + b;
  if (op === '-') {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
  }
  if (op === 'x') answer = a * b;

  const styles = ['direct', 'multiple', 'missing', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic', type: 'multiple', text: `What is ${a} ${op} ${b}?`, answer: String(answer), choices: makeChoices(answer) };
  }
  if (style === 'missing') {
    if (op === '+') return { skill: 'Missing Number', type: 'input', text: `${a} + ___ = ${answer}`, answer: String(b) };
    if (op === '-') return { skill: 'Missing Number', type: 'input', text: `${a} - ___ = ${answer}`, answer: String(b) };
    return { skill: 'Missing Number', type: 'input', text: `${a} x ___ = ${answer}`, answer: String(b) };
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? answer : answer + randInt(1, 5);
    return { skill: 'True / False', type: 'truefalse', text: `${a} ${op} ${b} = ${shown}`, answer: String(shown === answer) };
  }
  return { skill: 'Arithmetic', type: 'input', text: `Solve: ${a} ${op} ${b}`, answer: String(answer) };
}

function wordProblemQuestion() {
  const range = numberRange();
  const name = pick(names);
  const item = pick(objects);
  const place = pick(contexts);
  const a = randInt(range.min, Math.min(range.max, 50));
  const b = randInt(1, Math.min(range.max, 30));
  const add = Math.random() > 0.35;
  const answer = add ? a + b : Math.max(a - b, 0);
  const text = add
    ? `${name} is at the ${place}. ${name} has ${a} ${item} and gets ${b} more. How many ${item} does ${name} have now?`
    : `${name} is at the ${place}. ${name} has ${a} ${item} and gives away ${Math.min(a, b)}. How many ${item} are left?`;
  return { skill: 'Word Problem', type: Math.random() > 0.5 ? 'multiple' : 'input', text, answer: String(answer), choices: makeChoices(answer) };
}

function geometryQuestion() {
  const shapes = [
    { name: 'triangle', sides: 3 },
    { name: 'square', sides: 4 },
    { name: 'rectangle', sides: 4 },
    { name: 'pentagon', sides: 5 },
    { name: 'hexagon', sides: 6 }
  ];
  const shape = pick(shapes);
  const askSides = Math.random() > 0.45;
  const svg = shapeSvg(shape.name);
  if (askSides) {
    return { skill: 'Geometry', type: 'multiple', text: `How many sides does this ${shape.name} have?`, answer: String(shape.sides), choices: makeChoices(shape.sides), visual: svg };
  }
  const choices = shuffle(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon']);
  return { skill: 'Geometry', type: 'multiple', text: 'What shape is shown?', answer: shape.name, choices, visual: svg };
}

function shapeSvg(name) {
  const map = {
    triangle: '<polygon points="120,20 220,180 20,180" />',
    square: '<rect x="45" y="35" width="150" height="150" rx="8" />',
    rectangle: '<rect x="25" y="55" width="190" height="115" rx="8" />',
    pentagon: '<polygon points="120,20 215,90 180,190 60,190 25,90" />',
    hexagon: '<polygon points="75,35 165,35 220,110 165,185 75,185 20,110" />'
  };
  return `<svg viewBox="0 0 240 220" width="260" aria-label="${name}"><g fill="#bfdbfe" stroke="#2563eb" stroke-width="6">${map[name]}</g></svg>`;
}

function patternQuestion() {
  const start = randInt(1, 8);
  const step = state.difficulty === 'easy' ? randInt(1, 4) : randInt(2, 9);
  const sequence = [start, start + step, start + step * 2, start + step * 3];
  const answer = start + step * 4;
  return { skill: 'Pattern Recognition', type: Math.random() > 0.5 ? 'multiple' : 'input', text: `What comes next? ${sequence.join(', ')}, ___`, answer: String(answer), choices: makeChoices(answer) };
}

function spatialQuestion() {
  const count = state.difficulty === 'easy' ? randInt(3, 6) : state.difficulty === 'medium' ? randInt(5, 10) : randInt(8, 15);
  return { skill: 'Spatial Reasoning', type: 'input', text: 'How many blocks are shown?', answer: String(count), visual: blocksSvg(count) };
}

function blocksSvg(count) {
  let blocks = '';
  for (let i = 0; i < count; i++) {
    const x = 20 + (i % 5) * 42;
    const y = 25 + Math.floor(i / 5) * 42;
    blocks += `<rect x="${x}" y="${y}" width="34" height="34" rx="5" fill="#fde68a" stroke="#92400e" stroke-width="3" />`;
  }
  return `<svg viewBox="0 0 245 160" width="300" aria-label="blocks">${blocks}</svg>`;
}

function generateQuestion() {
  return pick([
    arithmeticQuestion,
    wordProblemQuestion,
    geometryQuestion,
    patternQuestion,
    spatialQuestion
  ])();
}

function startQuiz() {
  state = {
    difficulty: difficultySelect.value,
    total: Number(questionCountSelect.value),
    current: 0,
    score: 0,
    question: null,
    selectedAnswer: null,
    answered: false
  };
  scoreEl.textContent = '0';
  setupScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion();
}

function loadQuestion() {
  state.current += 1;
  state.question = generateQuestion();
  state.selectedAnswer = null;
  state.answered = false;

  questionCounter.textContent = `Question ${state.current} of ${state.total}`;
  skillBadge.textContent = state.question.skill;
  questionText.textContent = state.question.text;
  feedback.textContent = '';
  feedback.className = 'feedback';
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');

  if (state.question.visual) {
    visualArea.innerHTML = state.question.visual;
    visualArea.classList.remove('hidden');
  } else {
    visualArea.innerHTML = '';
    visualArea.classList.add('hidden');
  }

  renderAnswerArea();
}

function renderAnswerArea() {
  answerArea.innerHTML = '';
  const q = state.question;

  if (q.type === 'multiple') {
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.onclick = () => {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedAnswer = choice;
      };
      answerArea.appendChild(btn);
    });
    return;
  }

  if (q.type === 'truefalse') {
    ['true', 'false'].forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice === 'true' ? 'True' : 'False';
      btn.onclick = () => {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedAnswer = choice;
      };
      answerArea.appendChild(btn);
    });
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your answer';
  input.id = 'answerInput';
  input.autocomplete = 'off';
  input.oninput = () => state.selectedAnswer = input.value.trim().toLowerCase();
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') submitAnswer();
  });
  answerArea.appendChild(input);
  input.focus();
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function submitAnswer() {
  if (state.answered) return;
  const answer = normalize(state.selectedAnswer || '');
  if (!answer) {
    feedback.textContent = 'Choose or type an answer first.';
    feedback.className = 'feedback bad';
    return;
  }

  const correct = answer === normalize(state.question.answer);
  state.answered = true;

  if (correct) {
    state.score += 1;
    scoreEl.textContent = String(state.score);
    feedback.textContent = 'Correct! Great job.';
    feedback.className = 'feedback good';
  } else {
    feedback.textContent = `Not quite. The correct answer is ${state.question.answer}.`;
    feedback.className = 'feedback bad';
  }

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
}

function nextQuestion() {
  if (state.current >= state.total) {
    showResults();
  } else {
    loadQuestion();
  }
}

function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  const pct = Math.round((state.score / state.total) * 100);
  finalScore.textContent = `${state.score} / ${state.total} (${pct}%)`;
  if (pct >= 90) finalMessage.textContent = 'Amazing work! You are a math star.';
  else if (pct >= 70) finalMessage.textContent = 'Nice job! Keep practicing to level up.';
  else finalMessage.textContent = 'Good effort! Try again and beat your score.';
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});
submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', nextQuestion);
