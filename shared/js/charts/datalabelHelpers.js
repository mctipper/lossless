// shared Chart.js datalabels formatter: "<label>: <value>"
export function labelValueFormatter(value, context) {
    const label = context.chart.data.labels[context.dataIndex];
    return `${label}: ${value}`;
}
