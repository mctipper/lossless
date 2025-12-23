
function buildLevelAttemptAxis(levelsData) {
    const levelMap = [];

    for (const [world, worldObj] of Object.entries(levelsData)) {
        const worldInt = parseInt(world, 10);
        const levelEntries = Object.entries(worldObj.levels);
        const numLevels = levelEntries.length;
        const step = 1 / (numLevels + 1);

        // world anchor
        levelMap.push({
            world: worldInt.toString(),
            level: '0',
            name: worldObj.name,   // world label
            x: parseFloat(`${worldInt}.0`)
        });

        // levels
        for (let i = 0; i < levelEntries.length; i++) {
            const [levelKey, levelName] = levelEntries[i];

            levelMap.push({
                world: worldInt.toString(),
                level: levelKey,
                name: levelName,
                x: parseFloat((worldInt + (i + 1) * step).toFixed(3))
            });
        }
    }

    return levelMap;
}


export function buildAttemptBar(attemptModels, levelsData, colours, sortedByLevel = false) {
    const levelMap = buildLevelAttemptAxis(levelsData);
    const maxX = Math.max(...levelMap.map(level => level.x)); // for 'success = true', ensure bar / point can go full length

    let modelsForChart = {}
    if (!sortedByLevel) {
        modelsForChart = attemptModels.reverse(); // reverse the order so the most recent attempt is at the top
    } else {
        modelsForChart = [...attemptModels].sort((a, b) => {
            const aLevel = levelMap.find(l => l.world === a.world && l.level === a.level);
            const bLevel = levelMap.find(l => l.world === b.world && l.level === b.level);
            const aX = aLevel ? aLevel.x : maxX;
            const bX = bLevel ? bLevel.x : maxX;
            return bX - aX;
        });
    }

    // data prep, massage it so can be made use of for both bar and point components of the chart
    const datasets = modelsForChart.map((attempt, index) => {
        const AttemptLevel = levelMap.find(l => l.world === attempt.world && l.level === attempt.level);
        // const maxX = Math.max(...levelMap.map(level => level.x)); // for 'success = true', ensure bar / point can go full length
        const AttemptX = AttemptLevel ? AttemptLevel.x : maxX; // if null, make it full length as success wont have Attempt indicator

        const isSuccess = attempt.success;
        const colour = isSuccess ? colours["Success"].colour : colours[attempt.deathPlayer].colour || 'gray'

        return {
            label: `Attempt ${modelsForChart.length - index}`,
            data: [
                {
                    x: AttemptX,
                    y: modelsForChart.length - index - 1,
                    attempt: attempt.attemptNumber,
                    success: attempt.success,
                    deathPlayer: attempt.deathPlayer,
                    deathCharacter: attempt.deathCharacter,
                    deathLevelName: attempt.level_name
                }
            ],
            backgroundColor: colour,
            borderColor: colour,
            borderWidth: 20,
        };
    });

    // chart rendering
    let ctx = ""
    if (!sortedByLevel) {
        ctx = document.getElementById('attemptBar').getContext('2d');
    } else {
        ctx = document.getElementById('attemptBarByLevel').getContext('2d');
    }
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // dynamic vertical growth
            indexAxis: 'y', // horizontal
            scales: {
                x: {
                    type: 'linear',
                    position: 'top',
                    min: 1,
                    max: levelMap[levelMap.length - 1]?.x || 10, // extend to last x value as fixed
                    ticks: {
                        autoSkip: false,
                        position: 'top',
                        callback: (value) => {
                            // find a matching world anchor
                            const worldAnchor = levelMap.find(l => l.x === value && l.level === '0');
                            if (worldAnchor) {
                                return worldAnchor.name;
                            }
                            return undefined; // 
                        }
                    }

                },
                y: {
                    type: 'category',
                    title: { display: true, text: 'Attempts' },
                    ticks: { font: { size: 12 } },
                    grid: { display: false },
                    barPercentage: 0.5,
                    categoryPercentage: 0.5,
                    offset: true,
                },

            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const attempt = context.raw;

                            if (attempt.success) {
                                return [
                                    `Attempt: ${attempt.attempt}`,
                                    `Level: ${attempt.deathLevelName}`,
                                ]
                            } else {
                                return [
                                    `Attempt: ${attempt.attempt}`,
                                    `Player: ${attempt.deathPlayer}`,
                                    `Character: ${attempt.deathCharacter}`,
                                    `Level: ${attempt.deathLevelName}`,
                                ];
                            }
                        },
                        // remove excess detail from tooltip
                        title: () => null,
                        body: (items) => items.map(() => null),
                    },
                    displayColors: false,
                }
            }
        },
        plugins: [
            {
                // the dots / points at the end of each Attempt bar
                id: 'dotsPlugin',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;

                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const attempt = dataset.data[index];

                            // this needs to be directly lifted from the bar rather than the raw data because javascript
                            const { x, y } = bar.getProps(['x', 'y']);
                            const isSuccess = attempt.success;

                            // Draw the dot
                            ctx.beginPath();
                            ctx.arc(
                                x, y, // dot centre
                                8, // dot size
                                0, Math.PI * 2
                            );
                            ctx.fillStyle = isSuccess
                                ? colours["Success"].colour
                                : colours[attempt.deathCharacter].colour || 'gray';
                            ctx.fill();
                            ctx.lineWidth = 3;
                            ctx.strokeStyle = isSuccess
                                ? colours["Success"].colour
                                : colours[attempt.deathPlayer].colour || 'gray';
                            ctx.stroke();
                        });
                    });
                },
            }
        ]
    })

    // custom formatting to ensure bars are nicely sized and dynamically displayed
    const barHeight = 20;
    const totalBars = modelsForChart.length;
    const basePadding = 50;
    const dynamicHeight = totalBars * barHeight + basePadding;

    let canvas = ""
    if (!sortedByLevel) {
        canvas = document.getElementById('attemptBar');
    } else {
        canvas = document.getElementById('attemptBarByLevel');
    }
    canvas.style.height = `${dynamicHeight}px`;
    canvas.style.width = "100%"; // as we modify the height, reset the width


    chart.update();
}