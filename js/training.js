let currentNumber = 0;
let startTime;
let operation, digits, mode;

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    operation = params.get('operation');
    digits = parseInt(params.get('digits'));
    mode = params.get('mode');

    if (mode === 'sequential') {
        currentNumber = getStartingNumber(operation, digits);
    } else {
        currentNumber = generateRandomNumber(digits);
    }

    displayNumber(getDisplayNumber(currentNumber, operation));
    startTimer();
};

function getStartingNumber(operation, digits) {
    return digits === 2 ? 10 : 100;
}

function getWeightedRandomDigit() {
    const avgTimes = [];
    let totalWeight = 0;
    let weights = [];

    for (let i = 0; i <= 9; i++) {
        const category = `operation:${operation}_digits:${digits}_ending:${i}`;
        const data = JSON.parse(localStorage.getItem(category)) || [];
        const avgTime = data.length > 0 ? data.reduce((a, b) => a + b) / data.length : 0;
        avgTimes.push(avgTime);
    }

    const maxAvgTime = Math.max(...avgTimes);
    const maxAvgIndex = avgTimes.indexOf(maxAvgTime);

    for (let i = 0; i <= 9; i++) {
        weights[i] = (i === maxAvgIndex) ? 1.7 : 1;
        totalWeight += weights[i];
    }

    const randomWeight = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i <= 9; i++) {
        cumulativeWeight += weights[i];
        if (randomWeight <= cumulativeWeight) {
            return i;
        }
    }
}

function generateRandomNumber(digits) {
    const min = digits === 2 ? 10 : 100;
    const max = digits === 2 ? 99 : 999;
    const randomDigit = getWeightedRandomDigit();
    const randomBase = Math.floor(Math.random() * (max - min + 1) / 10) * 10; 
    const x = randomBase + randomDigit;
    return x;
}

function getDisplayNumber(x, operation) {
    if (operation === 'square-root') {
        return x * x;
    } else if (operation === 'cube-root') {
        return x * x * x;
    }
    return x;
}

function displayNumber(number) {
    document.getElementById('number-container').innerText = number;
}

function startTimer() {
    startTime = new Date();
}

function checkAnswer() {
    const input = parseInt(document.getElementById('answer-input').value);

    let correctAnswer;
    switch (operation) {
        case 'square':
            correctAnswer = currentNumber ** 2;
            break;
        case 'square-root':
            correctAnswer = currentNumber;
            break;
        case 'cube':
            correctAnswer = currentNumber ** 3;
            break;
        case 'cube-root':
            correctAnswer = currentNumber;
            break;
    }

    if (input === correctAnswer) {
        recordTime();
        showFeedback(true);
        moveToNextNumber();
    } else {
        showFeedback(false);
    }
}

function recordTime() {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

    const lastDigit = currentNumber % 10;
    const category = `operation:${operation}_digits:${digits}_ending:${lastDigit}`;

    let data = JSON.parse(localStorage.getItem(category)) || [];
    data.push(timeTaken);
    localStorage.setItem(category, JSON.stringify(data));
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = 'Correct!';
        feedback.classList.remove('wrong');
        feedback.classList.add('correct');
    } else {
        const correctAnswerText = operation === 'square-root' || operation === 'cube-root' ? currentNumber : getDisplayNumber(currentNumber, operation);
        feedback.innerText = `Incorrect! Correct answer: ${correctAnswerText}`;
        feedback.classList.remove('correct');
        feedback.classList.add('wrong');
    }

    setTimeout(() => {
        feedback.innerText = '';
    }, 1500);
}

function moveToNextNumber() {
    if (mode === 'sequential') {
        currentNumber++;
    } else {
        currentNumber = generateRandomNumber(digits);
    }

    displayNumber(getDisplayNumber(currentNumber, operation));
    document.getElementById('answer-input').value = '';
    startTimer();
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToResults() {
    window.location.href = 'results.html';
}
