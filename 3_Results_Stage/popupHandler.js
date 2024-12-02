document.addEventListener('DOMContentLoaded', () => {
    const downloadPopup = document.querySelector('.download-popup');
    const simulationOptionsPopup = document.querySelector('.simulation-options');
    const downloadYesButton = document.getElementById('downloadYes');
    const downloadNoButton = document.getElementById('downloadNo');
    const restartSimulationButton = document.getElementById('restartSimulation');
    const returnHomeButton = document.getElementById('returnHome');
    const backButton = document.getElementById('backButton');
    const closeButtons = document.querySelectorAll('.close-btn'); // All "X" buttons

    //Close the popup
    function closePopup(popup) {
        popup.classList.add('hidden');
    }

    //Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup'); // Find the parent popup container
            closePopup(popup);
        });
    });

    //Home Button
    backButton.addEventListener('click', () => {
        downloadPopup.classList.remove('hidden'); // Show the download popup
    });

    //Download Popup
    downloadYesButton.addEventListener('click', () => {
        downloadData(); // Trigger download function
        closePopup(downloadPopup);
    });

    downloadNoButton.addEventListener('click', () => {
        closePopup(downloadPopup);
        simulationOptionsPopup.classList.remove('hidden'); // Show the next popup
    });

    //Return to sim
    restartSimulationButton.addEventListener('click', () => {
        window.location.href = '/2_Simulation_Stage/simulation.html';
        closePopup(simulationOptionsPopup);
    });

    returnHomeButton.addEventListener('click', () => {
        window.location.href = '/1_Home_Stage/1.1_Start_Screen/startscreen.html';   
        closePopup(simulationOptionsPopup);
    });

    //Download function to create spreadsheet
    function downloadData() {
        const generationData = JSON.parse(localStorage.getItem('generation_data'));
    
        //Check if data is available
        if (!generationData || Object.keys(generationData).length === 0) {
            alert('No data available for download.');
            return;
        }
    
        
        const sheetData = [];
        //Header row
        sheetData.push(["Generation", "Best Distance", "Median Distance", "Worst Distance"]); 
    
        Object.entries(generationData).forEach(([generation, distances], index) => {
            const sortedDistances = distances.sort((a, b) => b - a);
            const best = sortedDistances[0];
            const worst = sortedDistances[sortedDistances.length - 1];
            const median = sortedDistances[Math.floor(sortedDistances.length / 2)];
    
            //Append each generation's data as a row
            sheetData.push([`Gen ${index + 1}`, best, median, worst]);
        });
    
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Simulation Data");
    
        //Export to Excel file
        XLSX.writeFile(workbook, "generation_data.xlsx");
        alert('Data Avaliable to Download!');
    }
});
