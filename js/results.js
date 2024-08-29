let chart;

window.onload = function() {
    updateChart();
};

function updateChart() {
    const operation = document.getElementById('operation-select').value;
    const digits = parseInt(document.getElementById('digits-select').value);

    const categories = [];
    const averageTimes = [];

    for (let i = 0; i <= 9; i++) {
        const category = `operation:${operation}_digits:${digits}_ending:${i}`;
        const data = JSON.parse(localStorage.getItem(category)) || [];
        const avgTime = data.length > 0 ? data.reduce((a, b) => a + b) / data.length : 0;

        categories.push(`Ending with ${i}`);
        averageTimes.push((avgTime / 1000).toFixed(3)); // Convert ms to seconds and round to 3 decimal places
    }

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('performanceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: `Average Time (seconds) for ${operation} with ${digits}-digit numbers`,
                data: averageTimes,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' sec'; // Display time in seconds
                        }
                    }
                }
            }
        }
    });

    // Update the summary report based on the selected operation and digits
    displaySummary(operation, digits);
}

function calculateSummary(operation, digits) {
    let overallSum = 0;
    let overallCount = 0;
    const endingData = {};

    for (let i = 0; i <= 9; i++) {
        const category = `operation:${operation}_digits:${digits}_ending:${i}`;
        const data = JSON.parse(localStorage.getItem(category)) || [];

        if (data.length > 0) {
            const avgTime = data.reduce((a, b) => a + b) / data.length;
            overallSum += avgTime * data.length;
            overallCount += data.length;
            endingData[i] = avgTime;
        } else {
            endingData[i] = null;
        }
    }

    const overallAvg = overallSum / overallCount;
    const needsImprovement = [];

    for (let i = 0; i <= 9; i++) {
        if (endingData[i] && endingData[i] > overallAvg) {
            needsImprovement.push({ digit: i, avgTime: endingData[i] / 1000 }); // Convert to seconds
        }
    }

    return {
        overallAvg: overallAvg / 1000, // Convert to seconds
        needsImprovement: needsImprovement
    };
}

function displaySummary(operation, digits) {
    const summary = calculateSummary(operation, digits);
    const summaryContainer = document.getElementById('summary-container');
    summaryContainer.innerHTML = ''; // Clear previous content

    const operationTitle = document.createElement('h3');
    operationTitle.innerText = `${operation.replace(/-/g, ' ')} (${digits}-digit numbers)`;
    summaryContainer.appendChild(operationTitle);

    if (summary.needsImprovement.length > 0) {
        const summaryText = document.createElement('p');
        summaryText.innerText = `Your overall average time is ${summary.overallAvg.toFixed(3)} seconds. You need to improve on the following endings:`;

        const list = document.createElement('ul');
        summary.needsImprovement.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerText = `Numbers ending with ${item.digit}: Average time = ${item.avgTime.toFixed(3)} seconds`;
            list.appendChild(listItem);
        });

        summaryContainer.appendChild(summaryText);
        summaryContainer.appendChild(list);
    } else {
        const summaryText = document.createElement('p');
        summaryText.innerText = `Your performance is consistent across all numbers for this operation.`;
        summaryContainer.appendChild(summaryText);
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

//function goToTraining() {
//    window.location.href = 'training.html';
//}
