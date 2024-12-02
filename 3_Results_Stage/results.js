window.onload = function() {
    const generationData = JSON.parse(localStorage.getItem('generation_data'));

    //Check if data is available, else show "No Data Available"
    if (!generationData || Object.keys(generationData).length === 0) {
        document.getElementById('graphSection').innerText = "No Data Available";
    } else {
        const totalGenerations = Object.keys(generationData).length;
        let bestDistances = [];
        let medianDistances = [];
        let worstDistances = [];
    
        Object.values(generationData).forEach(generation => {
            //For the stats, best, worst and median
            const sortedDistances = generation.sort((a, b) => b - a);
            const best = sortedDistances[0];
            const worst = sortedDistances[sortedDistances.length - 1];
            const median = sortedDistances[Math.floor(sortedDistances.length / 2)];
    
            bestDistances.push(best);
            medianDistances.push(median);
            worstDistances.push(worst);
        });
    
        //Display Summary Statistics
        document.getElementById('totalGenerations').innerText = totalGenerations;
        document.getElementById('bestDistance').innerText = `${Math.max(...bestDistances)} px`;
        document.getElementById('medianDistance').innerText = `${medianDistances.reduce((a, b) => a + b) / medianDistances.length} px`;
        document.getElementById('worstDistance').innerText = `${Math.min(...worstDistances)} px`;
    }
}
