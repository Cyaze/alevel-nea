//Create an HTML container for the stats viewer
const statsContainer = document.createElement('div');
statsContainer.id = 'statsContainer';
document.body.appendChild(statsContainer);

//Create a title for the stats viewer
const statsTitle = document.createElement('h2');
statsTitle.id = 'statsTitle';
statsTitle.innerText = 'Live Stats Viewer';
statsContainer.appendChild(statsTitle);

//Create elements to display best and worst creature stats
const bestCreatureContainer = document.createElement('div');
bestCreatureContainer.id = 'bestCreatureContainer';
statsContainer.appendChild(bestCreatureContainer);

const worstCreatureContainer = document.createElement('div');
worstCreatureContainer.id = 'worstCreatureContainer';
statsContainer.appendChild(worstCreatureContainer);

const bestCreatureTitle = document.createElement('h3');
bestCreatureTitle.className = 'creatureTitle';
bestCreatureTitle.innerText = 'Best Creature';
bestCreatureContainer.appendChild(bestCreatureTitle);

const bestCreatureStats = document.createElement('p');
bestCreatureStats.className = 'creatureStats';
bestCreatureContainer.appendChild(bestCreatureStats);

const worstCreatureTitle = document.createElement('h3');
worstCreatureTitle.className = 'creatureTitle';
worstCreatureTitle.innerText = 'Worst Creature';
worstCreatureContainer.appendChild(worstCreatureTitle);

const worstCreatureStats = document.createElement('p');
worstCreatureStats.className = 'creatureStats';
worstCreatureContainer.appendChild(worstCreatureStats);

//Function to update the live stats viewer
function updateLiveStats() {
    if (creatures.length === 0) return;

    //Sort creatures based on distance traveled (fitness)
    creatures.sort((a, b) => b.getDistanceTraveled() - a.getDistanceTraveled());

    //Best creature
    const bestCreature = creatures[0];
    const bestDistance = bestCreature.getDistanceTraveled();
    bestCreatureStats.innerHTML = `Distance: ${bestDistance.toFixed(2)}px`;

    //Worst creature
    const worstCreature = creatures[creatures.length - 1];
    const worstDistance = worstCreature.getDistanceTraveled();
    worstCreatureStats.innerHTML = `Distance: ${worstDistance.toFixed(2)}px`;
}

//Start a loop to update the stats every 100ms
setInterval(updateLiveStats, 100);
