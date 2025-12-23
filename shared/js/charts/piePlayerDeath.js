export function buildPiePlayerDeath(attemptModels, colours) {
    // only care for unsuccessful attempts
    const filteredModels = attemptModels.filter(game => !game.success);

    // minor data wrangling needed
    const playerCounts = {};
    filteredModels.forEach(game => {
        playerCounts[game.deathPlayer] = (playerCounts[game.deathPlayer] || 0) + 1;
    });

    const playerNames = Object.keys(playerCounts);
    const playerNameDeathCounts = Object.values(playerCounts);

    // render the chart
    const pieCtx = document.getElementById("playerPieChart").getContext("2d");
    const chart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: playerNames,
            datasets: [{
                data: playerNameDeathCounts
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: "#FFFFFF",
                    font: {
                        size: 14,
                        weight: "bold"
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

    // custom formatting
    chart.data.datasets[0].backgroundColor = playerNames.map(
        playerName => colours[playerName]?.colour || "gray"
    );

    chart.data.datasets[0].borderColor = playerNames.map(() => "#FFFFFF");
    chart.data.datasets[0].borderWidth = 1;

    chart.update();
}