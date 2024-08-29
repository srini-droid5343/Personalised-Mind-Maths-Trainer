function startTraining() {
    const operation = document.getElementById('operation').value;
    const digits = document.getElementById('digits').value;
    const mode = document.getElementById('mode').value;

    const url = `training.html?operation=${operation}&digits=${digits}&mode=${mode}`;
    window.location.href = url;
}

function goToResults() {
    window.location.href = 'results.html';
}
