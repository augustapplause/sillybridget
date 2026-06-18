let score = 0, qCount = 0, currentData = {};
let age = 7;

function updateAge(val) { document.getElementById('ageVal').innerText = val; age = val; }

function resetQuiz() { score = 0; qCount = 0; generateQuestion(); }

function generateQuestion() {
    if (qCount >= 10) {
        document.getElementById('quiz-area').innerHTML = `<h2>Quiz Complete!</h2><p>Final Score: ${score}/10</p><button onclick="location.reload()">Play Again</button>`;
        return;
    }
    qCount++;
    const cat = document.getElementById('category').value;
    const diff = age * 2; // Difficulty scales with age

    if (cat === "Arithmetic") {
        let a = Math.floor(Math.random() * diff), b = Math.floor(Math.random() * diff);
        currentData = { ans: a + b, text: `What is ${a} + ${b}?` };
    } else if (cat === "Geometry") {
        const shapes = [{n:"Square", s:4}, {n:"Triangle", s:3}, {n:"Pentagon", s:5}];
        let s = shapes[Math.floor(Math.random()*shapes.length)];
        currentData = { ans: s.s, text: `How many sides does a ${s.n} have?` };
    } else {
        let h = Math.floor(Math.random() * 12) + 1;
        currentData = { ans: h, text: `If the hour hand is on ${h}, what number will it be on in 1 hour?` };
    }
    document.getElementById('question').innerText = currentData.text;
}

function checkAnswer() {
    let val = document.getElementById('user-ans')?.value;
    if (parseInt(val) === currentData.ans) { score++; alert("Correct!"); }
    else { alert("Wrong! The answer was " + currentData.ans); }
    generateQuestion();
}
// Initial call
generateQuestion();