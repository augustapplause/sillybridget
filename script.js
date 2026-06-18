const setupScreen = document.getElementById('setupScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const difficultySelect = document.getElementById('difficulty');
const questionCountSelect = document.getElementById('questionCount');
const categorySelect = document.getElementById('category');
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
  category: 'arithmetic',
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

function formatOp(op) {
  if (op === '*') return 'x';
  if (op === '/') return '÷';
  return op;
}

function generateMultiExpressionQuestion() {
  const difficulty = state.difficulty;
  const termCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? randInt(3, 4) : randInt(4, 5);
  const maxStart = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 75 : 150;
  const maxTerm = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
  let value = randInt(10, maxStart);
  let expression = String(value);

  for (let i = 1; i < termCount; i++) {
    let op = pick(['+', '-']);
    let n = randInt(1, maxTerm);
    if (op === '-' && value - n < 0) op = '+';
    value = op === '+' ? value + n : value - n;
    expression += ` ${op} ${n}`;
  }

  const styles = ['direct', 'multiple', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic: Multi-Step', type: 'multiple', text: `What is ${expression}?`, answer: String(value), choices: makeChoices(value) };
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? value : value + randInt(1, 8);
    return { skill: 'Arithmetic: Multi-Step', type: 'truefalse', text: `${expression} = ${shown}`, answer: String(shown === value) };
  }
  return { skill: 'Arithmetic: Multi-Step', type: 'input', text: `Solve: ${expression}`, answer: String(value) };
}

function missingOperandQuestion() {
  const range = numberRange();
  const op = pick(state.difficulty === 'easy' ? ['+', '-'] : ['+', '-', 'x', '÷']);

  if (op === '+') {
    const a = randInt(range.min, Math.min(range.max, 60));
    const b = randInt(range.min, Math.min(range.max, 60));
    const sum = a + b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ + ${b} = ${sum}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} + ___ = ${sum}`, answer: String(b) };
  }

  if (op === '-') {
    const result = randInt(1, Math.min(range.max, 60));
    const b = randInt(1, Math.min(range.max, 40));
    const a = result + b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ - ${b} = ${result}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} - ___ = ${result}`, answer: String(b) };
  }

  if (op === 'x') {
    const maxFactor = state.difficulty === 'medium' ? 12 : 15;
    const a = randInt(2, maxFactor);
    const b = randInt(2, maxFactor);
    const product = a * b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ x ${b} = ${product}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} x ___ = ${product}`, answer: String(b) };
  }

  const maxQuotient = state.difficulty === 'medium' ? 12 : 20;
  const maxDivisor = state.difficulty === 'medium' ? 10 : 12;
  const quotient = randInt(2, maxQuotient);
  const divisor = randInt(2, maxDivisor);
  const dividend = quotient * divisor;
  const style = pick(['missingDividend', 'missingDivisor']);
  return style === 'missingDividend'
    ? { skill: 'Missing Number', type: 'input', text: `___ ÷ ${divisor} = ${quotient}`, answer: String(dividend) }
    : { skill: 'Missing Number', type: 'input', text: `${dividend} ÷ ___ = ${quotient}`, answer: String(divisor) };
}

function divisionQuestion() {
  const maxQuotient = state.difficulty === 'easy' ? 10 : state.difficulty === 'medium' ? 12 : 20;
  const maxDivisor = state.difficulty === 'easy' ? 5 : state.difficulty === 'medium' ? 10 : 12;
  const quotient = randInt(1, maxQuotient);
  const divisor = randInt(2, maxDivisor);
  const dividend = quotient * divisor;
  const styles = ['direct', 'multiple', 'missing', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic: Division', type: 'multiple', text: `What is ${dividend} ÷ ${divisor}?`, answer: String(quotient), choices: makeChoices(quotient) };
  }
  if (style === 'missing') {
    return { skill: 'Missing Number', type: 'input', text: `${dividend} ÷ ___ = ${quotient}`, answer: String(divisor) };
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? quotient : quotient + randInt(1, 4);
    return { skill: 'Arithmetic: Division', type: 'truefalse', text: `${dividend} ÷ ${divisor} = ${shown}`, answer: String(shown === quotient) };
  }
  return { skill: 'Arithmetic: Division', type: 'input', text: `Solve: ${dividend} ÷ ${divisor}`, answer: String(quotient) };
}

function arithmeticQuestion() {
  if (Math.random() < 0.28) return generateMultiExpressionQuestion();
  if (Math.random() < 0.28) return missingOperandQuestion();
  if (state.difficulty !== 'easy' && Math.random() < 0.22) return divisionQuestion();

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
    return missingOperandQuestion();
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
  if (state.category === 'arithmetic') {
    return arithmeticQuestion();
  }

  return pick([
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
    category: categorySelect.value,
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
