//Initial values for the sliders
const defaultValues = {
    generations: 20,
    population: 50,
    mutation: 0.5,
    gravity: 2.5,
    friction: 0.15
};

//Display the tooltip
function showTooltip(text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    tooltip.style.display = 'block';

    //Position tooltip near the mouse cursor
    document.onmousemove = function(e) {
        tooltip.style.left = e.pageX + 5 + 'px';
        tooltip.style.top = e.pageY + 5 + 'px';
    };
}

//Hide the tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

//Toggle the visibility of advanced settings
function toggleAdvanced() {
    const advancedFactors = document.getElementById('advanced-factors');
    const checkbox = document.getElementById('advanced-checkbox');
    advancedFactors.style.display = checkbox.checked ? 'block' : 'none';
}

//Reset sliders to default values
function resetDefaults() {
    document.getElementById('generations-slider').value = defaultValues.generations;
    document.getElementById('population-slider').value = defaultValues.population;
    document.getElementById('mutation-slider').value = defaultValues.mutation;
    document.getElementById('gravity-slider').value = defaultValues.gravity;
    document.getElementById('friction-slider').value = defaultValues.friction;

    updateValues();
}

//Update the displayed values
function updateValues() {
    document.getElementById('generations-value').textContent = document.getElementById('generations-slider').value;
    document.getElementById('population-value').textContent = document.getElementById('population-slider').value;
    document.getElementById('mutation-value').textContent = document.getElementById('mutation-slider').value;
    document.getElementById('gravity-value').textContent = document.getElementById('gravity-slider').value;
    document.getElementById('friction-value').textContent = document.getElementById('friction-slider').value;
}

//Submit data to the simulation page
function submitData() {
    const generations = document.getElementById('generations-slider').value;
    const population = document.getElementById('population-slider').value;
    const mutation = document.getElementById('mutation-slider').value;
    const gravity = document.getElementById('gravity-slider').value;
    const friction = document.getElementById('friction-slider').value;

    localStorage.setItem('generations', generations);
    localStorage.setItem('population', population);
    localStorage.setItem('mutation', mutation);
    localStorage.setItem('gravity', gravity);
    localStorage.setItem('friction', friction);

    window.location.href = '/2_Simulation_Stage/simulation.html';
}

//Return to start screen
function returnToStart() {
    window.location.href = '/1_Home_Stage/1.1_Start_Screen/startscreen.html';
}


// Initialize sliders and update values on load
document.getElementById('advanced-checkbox').checked = false;
resetDefaults();
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', updateValues);
});
