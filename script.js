let score = 0, qCount = 0, currentAnswer = null;

function generateQuestion() {
    if (qCount >= 10) {
        document.getElementById('quiz-area').innerHTML = `<h2>Quiz Complete!</h2><p>Final Score: ${score}/10</p><button onclick="location.reload()">Restart</button>`;
        return;
    }
    
    qCount++;
    const age = document.getElementById('age').value;
    const cat = document.getElementById('category').value;
    const diff = age * 3;

    // Logic: Define Question
    let text = "";
    if (cat === "Arithmetic") {
        let a = Math.floor(Math.random() * diff), b = Math.floor(Math.random() * diff);
        currentAnswer = a + b;
        text = `What is ${a} + ${b}?`;
    } else if (cat === "Geometry") {
        const s = [{n:"Square", a:4}, {n:"Triangle", a:3}, {n:"Pentagon", a:5}];
        let pick = s[Math.floor(Math.random() * s.length)];
        currentAnswer = pick.a;
        text = `How many sides does a ${pick.n} have?`;
    } else {
        let h = Math.floor(Math.random() * 12) + 1;
        currentAnswer = h + 1;
        text = `If the clock hand is on ${h}, where will it be in 1 hour?`;
    }

    // Refresh UI
    document.getElementById('question').innerText = text;
    document.getElementById('input-area').innerHTML = '<input type="number" id="user-ans">';
    document.getElementById('feedback').innerText = `Question ${qCount} of 10`;
}

function checkAnswer() {
    let val = document.getElementById('user-ans').value;
    if (parseInt(val) === currentAnswer) {
        score++;
        document.getElementById('feedback').innerText = "Correct!";
    } else {
        document.getElementById('feedback').innerText = "Wrong!";
    }
    setTimeout(generateQuestion, 1000); // Wait 1s then move on
}

// Start game when user clicks a button or on load
document.getElementById('submit-btn').addEventListener('click', () => { if(qCount === 0) generateQuestion(); });