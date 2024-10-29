//Function to render the graph
function renderGraph() {
    const generationData = JSON.parse(localStorage.getItem('generation_data'));

    //To check if there is somehow no data
    if (!generationData || Object.keys(generationData).length === 0) {
        document.getElementById('graphSection').innerText = "No Data Available";
        return;
    }

    //Distance Arrays
    let bestDistances = [];
    let medianDistances = [];
    let worstDistances = [];

    //Using Object.value, this allows the data to be converted into array
    Object.values(generationData).forEach(generation => {
        const sortedDistances = generation.sort((a, b) => b - a);
        const best = sortedDistances[0];
        const worst = sortedDistances[sortedDistances.length - 1];
        const median = sortedDistances[Math.floor(sortedDistances.length / 2)];

        bestDistances.push(best);
        medianDistances.push(median);
        worstDistances.push(worst);
    });

    //Creating the graph
    const data = {
        labels: Array.from({ length: bestDistances.length }, (_, i) => `Gen ${i + 1}`),
        datasets: [
            {
                label: 'Best Distance',
                data: bestDistances,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
            {
                label: 'Median Distance',
                data: medianDistances,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
            },
            {
                label: 'Worst Distance',
                data: worstDistances,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
            }
        ]
    };

    //Chart config
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distance Travelled per Generation'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Generations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Distance (px)'
                    }
                }
            }
        }
    };

    //Rendeing the chart
    const ctx = document.getElementById('distanceChart').getContext('2d');
    new Chart(ctx, config);
}

renderGraph();

