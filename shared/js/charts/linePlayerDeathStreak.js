export function buildStreakPlot(gameModels, colours) {
    // a bit of computation needed to determine streakage

    // initial values
    const streakData = [{ x: 0, y: 0, player: null, streak: 0 }];
    let score = 0;
    let currentStreak = 0;
    let worstStreak = { value: 0, player: null };

    gameModels.forEach((game, index) => {
        if (game.success) {
            // reset streak (but leave current score)
            currentStreak = 0;
        } else if (game.deathPlayer === "Shag") {
            score += 1;
            currentStreak = currentStreak >= 0 ? currentStreak + 1 : 1;
        } else if (game.deathPlayer === "Mogs") {
            score -= 1;
            currentStreak = currentStreak <= 0 ? currentStreak - 1 : -1;
        }

        streakData.push({
            x: index + 1,
            y: score,
            colour: game.success ? successColour : colours[game.deathPlayer].colour,
            player: game.success ? "Success" : game.deathPlayer,
            streak: currentStreak,
            success: game.success
        });

        // worst streak determination
        const absCurrentStreak = Math.abs(currentStreak);
        if (
            absCurrentStreak > Math.abs(worstStreak.value) ||
            (absCurrentStreak === Math.abs(worstStreak.value) && index + 1 > streakData[streakData.length - 1]?.x)
        ) {
            worstStreak = { value: currentStreak, player: game.deathPlayer };
        }
    });

    const worstStreakValueSpan = document.getElementById('worstStreakValue');
    const worstStreakPlayerSpan = document.getElementById('worstStreakPlayer');
    worstStreakValueSpan.textContent = Math.abs(worstStreak.value);
    worstStreakPlayerSpan.textContent = worstStreak.player;

    // dynamic bounds as streaks / volume may explode
    const yMin = Math.floor(Math.min(...streakData.map(point => point.y)) / 5) * 5;
    const yMax = Math.ceil(Math.max(...streakData.map(point => point.y)) / 5) * 5;

    const streakCtx = document.getElementById('streakPlot').getContext('2d');
    const chart = new Chart(streakCtx, {
        type: 'line',
        data: {
            labels: streakData.map(point => point.x),
            datasets: [
                {
                    label: 'Death Streak',
                    data: streakData.map(point => ({ x: point.x, y: point.y })),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    segment: {
                        borderColor: ctx => {
                            const index = ctx.p1DataIndex;
                            const point = streakData[index];
                            return point.success ? successColour : colours[point.player].colour || 'gray';
                        },
                    },
                    pointBackgroundColor: streakData.map(point =>
                        point.colour || 'gray'
                    ),
                    pointBorderColor: streakData.map(point =>
                        point.colour || 'gray'
                    ),
                    pointBorderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: false,
                },
                y: {
                    beginAtZero: false,
                    min: yMin,
                    max: yMax,
                    title: {
                        display: true,
                        text: '(-ve) Mogs Deaths | Shag Deaths (+ve)', // manually set to appear on each side of the x-axis line
                    },
                    ticks: {
                        stepSize: 5,
                    },
                    grid: {
                        display: true,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const point = streakData[context.dataIndex];
                            return [
                                point.success ? 'Success!' : `${point.player} Ruined It`,
                                `Current Margin: ${point.y}`,
                                `Current Streak: ${point.streak}`,
                            ];
                        },
                        // remove excess detail from tooltip
                        title: () => null,
                        body: (items) => items.map(() => null),
                    },
                    displayColors: false,
                },
            },
        },
    });

    chart.update();
}