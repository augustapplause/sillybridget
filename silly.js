const shapes = [
    { name: "Square", sides: 4, svg: '<rect x="10" y="10" width="80" height="80" fill="none" stroke="#333" stroke-width="5"/>' },
    { name: "Triangle", sides: 3, svg: '<polygon points="50,10 90,90 10,90" fill="none" stroke="#333" stroke-width="5"/>' }
];

let currentData = {};

function generateQuestion() {
    const isGeo = Math.random() > 0.5;
    if (isGeo) {
        let s = shapes[Math.floor(Math.random() * shapes.length)];
        currentData = { ans: s.sides, text: `How many sides does this ${s.name} have?`, svg: s.svg };
        document.getElementById('visual-area').innerHTML = `<svg width="100" height="100">${s.svg}</svg>`;
        document.getElementById('input-area').innerHTML = '<input type="number" id="user-ans">';
    } else {
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        currentData = { ans: a + b, text: `What is ${a} + ${b}?` };
        document.getElementById('visual-area').innerHTML = '';
        document.getElementById('input-area').innerHTML = '<input type="number" id="user-ans">';
    }
    document.getElementById('question').innerText = currentData.text;
    document.getElementById('feedback').innerText = '';
}

function checkAnswer() {
    let val = document.getElementById('user-ans').value;
    document.getElementById('feedback').innerText = (parseInt(val) === currentData.ans) ? "Correct! 🎉" : "Try again!";
    if(parseInt(val) === currentData.ans) setTimeout(generateQuestion, 1500);
}

generateQuestion();