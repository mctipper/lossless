export function buildPlayerCharacterDeathBarChart(attemptModels, colours) {
    // rem successful attempts because only deaths
    const filteredModels = attemptModels.filter(game => !game.success);

    const playerCharacterGroupings = {};

    filteredModels.forEach(game => {
        const key = `${game.deathPlayer}-${game.deathCharacter}`;
        playerCharacterGroupings[key] = (playerCharacterGroupings[key] || 0) + 1;
    });

    let playerCharacters = Object.keys(playerCharacterGroupings);
    let playerCharacterDeathCounts = Object.values(playerCharacterGroupings);

    // alphabetical sort
    const sortedIndices = playerCharacters
        .map((label, index) => ({ label, index }))
        .sort((a, b) => a.label.localeCompare(b.label));

    playerCharacters = sortedIndices.map(item => item.label);
    playerCharacterDeathCounts = sortedIndices.map(item => playerCharacterDeathCounts[item.index]);

    // build out the chart itself finally
    const barCtx = document.getElementById('playerCharacterBarChart').getContext('2d');
    const chart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: playerCharacters,
            datasets: [{
                data: playerCharacterDeathCounts
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y', // horizontal
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: 'start',
                    align: 'end',
                    color: '#000000',
                    font: {
                        size: 14,
                        weight: 'normal',
                        style: 'italic'
                    },
                    formatter: (value, context) => {
                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    // Custom formatting

    // Fill and border based on player-character combination
    // Player border
    chart.data.datasets[0].borderColor = playerCharacters.map(label => {
        const [player] = label.split('-');
        return colours[player].colour || 'gray';
    });
    chart.data.datasets[0].borderWidth = 4;

    // Character fill
    chart.data.datasets[0].backgroundColor = playerCharacters.map(label => {
        const [_, character] = label.split('-');
        return colours[character].colour || 'gray';
    });

    // Integer x-axis
    chart.options.scales.x.ticks.stepSize = 1;
    chart.options.scales.x.ticks.callback = value => (Number.isInteger(value) ? value : '');

    // No legend
    chart.options.plugins.legend.display = false;

    chart.update();
}