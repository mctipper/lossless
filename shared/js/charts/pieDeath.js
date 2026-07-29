import { labelValueFormatter } from './datalabelHelpers.js';

export function buildPieDeathChart(attemptModels, colours, { elementId, groupByKey, labelColor }) {
    // only care for unsuccessful attempts
    const filteredModels = attemptModels.filter(game => !game.success);

    // minor data wrangling needed
    const counts = {};
    filteredModels.forEach(game => {
        counts[game[groupByKey]] = (counts[game[groupByKey]] || 0) + 1;
    });

    const names = Object.keys(counts);
    const deathCounts = Object.values(counts);

    // render the chart
    const pieCtx = document.getElementById(elementId).getContext("2d");
    const chart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: names,
            datasets: [{
                data: deathCounts
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: labelColor,
                    font: {
                        size: 14,
                        weight: "bold"
                    },
                    formatter: labelValueFormatter
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    // custom formatting
    chart.data.datasets[0].backgroundColor = names.map(
        name => colours[name]?.colour || "gray"
    );

    chart.data.datasets[0].borderColor = names.map(() => "#FFFFFF");
    chart.data.datasets[0].borderWidth = 1;

    chart.update();
}
