let score = 0, qCount = 0, current = {};

function getClockSVG(h, m) {
    let angleH = (h % 12) * 30 + m * 0.5;
    let angleM = m * 6;
    return `<svg width="100" height="100"><circle cx="50" cy="50" r="45" fill="none" stroke="black" stroke-width="3"/><line x1="50" y1="50" x2="50" y2="20" transform="rotate(${angleH} 50 50)" stroke="black" stroke-width="4"/><line x1="50" y1="50" x2="50" y2="10" transform="rotate(${angleM} 50 50)" stroke="red" stroke-width="2"/></svg>`;
}

function generateQuestion() {
    if (qCount >= 10) { 
        document.querySelector('.quiz-card').innerHTML = `<h2>Complete!</h2><p>Score: ${score}/10</p>`; return; 
    }
    qCount++;
    const cat = document.getElementById('category').value;
    const style = ['input', 'mc', 'tf'][Math.floor(Math.random() * 3)];
    
    if (cat === "Time") {
        let h = Math.floor(Math.random()*12)+1, m = Math.floor(Math.random()*12)*5;
        let change = Math.floor(Math.random()*6)*5;
        let targetM = (m + change) % 60;
        let text = `If it is ${h}:${m.toString().padStart(2,'0')}, is it ${h}:${targetM.toString().padStart(2,'0')} in ${change} minutes?`;
        current = { ans: true, text: text, style: 'tf', visual: getClockSVG(h, m) };
    }
    // ... Additional logic for Arithmetic/Geometry following same pattern
    
    document.getElementById('question').innerText = current.text;
    document.getElementById('visual-area').innerHTML = current.visual || '';
    renderInput(style);
}

function renderInput(style) {
    let area = document.getElementById('input-area');
    if (style === 'tf') area.innerHTML = '<button onclick="validate(true)">True</button><button onclick="validate(false)">False</button>';
    // Add logic for 'mc' and 'input'
}

function validate(choice) {
    if (choice === current.ans) score++;
    generateQuestion();
}

function resetQuiz() { score=0; qCount=0; generateQuestion(); }