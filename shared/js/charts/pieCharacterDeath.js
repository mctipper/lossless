export function buildPieCharacterDeath(gameModels, colours) {
    // only care for unsuccessful attempts
    const filteredModels = gameModels.filter(game => !game.success);

    // minor data wrangling needed
    const characterCounts = {};
    filteredModels.forEach(game => {
        characterCounts[game.deathCharacter] = (characterCounts[game.deathCharacter] || 0) + 1;
    });

    const characterNames = Object.keys(characterCounts);
    const characterDeathCounts = Object.values(characterCounts);

    // render the chart
    const pieCtx = document.getElementById('characterPieChart').getContext('2d');
    const chart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: characterNames,
            datasets: [{
                data: characterDeathCounts
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    color: "#000000",
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                    formatter: (value, context) => {
                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        plugins: [ChartDataLabels]
    });

    // custom formatting
    chart.data.datasets[0].backgroundColor = characterNames.map(character => colours[character]?.colour || 'gray');
    chart.data.datasets[0].borderColor = characterNames.map(() => '#FFFFFF');
    chart.data.datasets[0].borderWidth = 1;

    chart.update();
}