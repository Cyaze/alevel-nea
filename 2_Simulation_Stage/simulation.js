const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TICK_INTERVAL = 50; // 50ms
const TICKS_PER_SECOND = 1000 / TICK_INTERVAL;
const GENERATION_DURATION = 15000; // 15 seconds per generation

const START_X = canvas.width * 0.1;
const START_Y = canvas.height * 0.85;

let creatures = [];
let generation = 1;
let generationTimer;
let timeRemaining = GENERATION_DURATION / 1000; // Time remaining in seconds
const totalGenerations = JSON.parse(localStorage.getItem('generations'))

// Load gravity and friction from local storage with defaults
const gravity = JSON.parse(localStorage.getItem('gravity')) || 0.1;
const friction = JSON.parse(localStorage.getItem('friction')) || 0.99;

class Joint {
    constructor(x, y, friction) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.friction = friction;
    }

    update() {
        updatePhysics(this);
        this.x += this.vx + this.friction;
        this.y += this.vy + this.friction;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0, 0, 0, ${this.friction})`;
        ctx.fill();
        ctx.closePath();
    }

    reset() {
        this.x = START_X + Math.random() * 100;
        this.y = START_Y - Math.random() * 50;
        this.vx = 0;
        this.vy = 0;
    }
}

class Muscle {
    constructor(joint1, joint2, extendedLength, contractedLength, extendTime, contractTime, strength) {
        this.joint1 = joint1;
        this.joint2 = joint2;
        this.extendedLength = extendedLength;
        this.contractedLength = contractedLength;
        this.extendTime = extendTime;
        this.contractTime = contractTime;
        this.strength = strength;
        this.clock = 0;
        this.isContracting = false;
    }

    update() {
        const currentLength = Math.hypot(this.joint2.x - this.joint1.x, this.joint2.y - this.joint1.y);
        const targetLength = this.isContracting ? this.contractedLength : this.extendedLength;
        const lengthDifference = currentLength - targetLength;

        const forceX = (this.joint2.x - this.joint1.x) / currentLength * lengthDifference * this.strength;
        const forceY = (this.joint2.y - this.joint1.y) / currentLength * lengthDifference * this.strength;

        //Apply force to the joints
        this.joint1.vx += forceX;
        this.joint1.vy += forceY;
        this.joint2.vx -= forceX;
        this.joint2.vy -= forceY;

        //Update the clock for muscle contraction/extension
        this.clock++;
        if (this.isContracting && this.clock >= this.contractTime * TICKS_PER_SECOND) {
            this.isContracting = false;
            this.clock = 0;
        } else if (!this.isContracting && this.clock >= this.extendTime * TICKS_PER_SECOND) {
            this.isContracting = true;
            this.clock = 0;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.joint1.x, this.joint1.y);
        ctx.lineTo(this.joint2.x, this.joint2.y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
    }
}


class Creature {
    constructor() {
        this.joints = [];
        this.muscles = [];
        this.generateCreature();
    }

    generateCreature() {
        const jointCount = Math.floor(Math.random() * 3) + 8;

        for (let i = 0; i < jointCount; i++) {
            const x = START_X + Math.random() * 100;
            const y = START_Y - Math.random() * 50;
            const friction = Math.random();
            this.joints.push(new Joint(x, y, friction));
        }

        for (let i = 0; i < jointCount - 1; i++) {
            for (let j = i + 1; j < jointCount; j++) {
                const extendedLength = Math.random() * 100 + 50;
                const contractedLength = Math.random() * 50 + 10;
                const extendTime = Math.random() * 1 + 0.5;
                const contractTime = Math.random() * 1 + 0.5;
                const strength = Math.random() * 1 + 0.01;
                this.muscles.push(new Muscle(this.joints[i], this.joints[j], extendedLength, contractedLength, extendTime, contractTime, strength));
            }
        }
    }

    inheritTraits(parent) {
        //Copy the joints from the parent
        this.joints = parent.joints.map(joint => new Joint(joint.x, joint.y, joint.friction));

        //Copy the muscles from the parent
        this.muscles = parent.muscles.map(muscle => {
            const joint1Index = parent.joints.indexOf(muscle.joint1);
            const joint2Index = parent.joints.indexOf(muscle.joint2);
            const newJoint1 = this.joints[joint1Index];
            const newJoint2 = this.joints[joint2Index];
            return new Muscle(newJoint1, newJoint2, muscle.extendedLength, muscle.contractedLength, muscle.extendTime, muscle.contractTime, muscle.strength);
        });
    }

    mutate() {
        
        //Mutation rate
        const mutationRate = JSON.parse(localStorage.getItem('mutatation')) || 0.01; 

        //Mutate joints
        this.joints.forEach(joint => {
            if (Math.random() < mutationRate) {
                joint.x += (Math.random() - 0.5) * 20; //Small mutation in x position
                joint.y += (Math.random() - 0.5) * 20; //Small mutation in y position
            }
            if (Math.random() < mutationRate) {
                joint.friction += (Math.random() - 0.5) * 0.1; //Small mutation in friction
                joint.friction = Math.max(0, Math.min(1, joint.friction)); //Clamp friction between 0 and 1
            }
        });

        //Mutate muscles
        this.muscles.forEach(muscle => {
            if (Math.random() < mutationRate) {
                muscle.extendedLength += (Math.random() - 0.5) * 10; //Small mutation in extended length
                muscle.extendedLength = Math.max(10, muscle.extendedLength); //Ensure a minimum length
            }
            if (Math.random() < mutationRate) {
                muscle.contractedLength += (Math.random() - 0.5) * 10; //Small mutation in contracted length
                muscle.contractedLength = Math.max(5, muscle.contractedLength); //Ensure a minimum length
            }
            if (Math.random() < mutationRate) {
                muscle.strength += (Math.random() - 0.5) * 0.1; //Small mutation in strength
                muscle.strength = Math.max(0.01, muscle.strength); //Ensure a minimum strength
            }
            if (Math.random() < mutationRate) {
                muscle.extendTime += (Math.random() - 0.5) * 0.1; //Small mutation in extend time
                muscle.extendTime = Math.max(0.1, muscle.extendTime); //Ensure a minimum time
            }
            if (Math.random() < mutationRate) {
                muscle.contractTime += (Math.random() - 0.5) * 0.1; //Small mutation in contract time
                muscle.contractTime = Math.max(0.1, muscle.contractTime); //Ensure a minimum time
            }
        });
    }

    update() {
        this.joints.forEach(joint => joint.update());
        this.muscles.forEach(muscle => muscle.update());
    }

    draw() {
        this.muscles.forEach(muscle => muscle.draw());
        this.joints.forEach(joint => joint.draw());
    }

    resetToStart() {
        this.joints.forEach(joint => {
            joint.x = START_X + Math.random() * 100;
            joint.y = START_Y - Math.random() * 50;
            joint.vx = 0;
            joint.vy = 0;
        });
    }

    getDistanceTraveled() {
        return Math.max(...this.joints.map(joint => joint.x)) - START_X;
    }
}


//Initialise the simulation with multiple creatures
function initialiseSimulation() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createPlatform();

    const numOfCreatures = JSON.parse(localStorage.getItem('population'));
    creatures = generateInitialCreatures(numOfCreatures);

    //Start the generation loop
    startGenerations();
}

//Generate initial population
function generateInitialCreatures(num) {
    const generatedCreatures = [];
    for (let i = 0; i < num; i++) {
        generatedCreatures.push(new Creature());
    }
    return generatedCreatures;
}

//Helps start each generation
function startGenerations() {
    let generationCounter = totalGenerations;

    //Simulation Loop
    function runNextGeneration() {
        if (generationCounter > 0) {
            startGeneration(() => {
                generationCounter--;
                generation++;
                runNextGeneration();
            });
        } else {
            //Redirect to results page
            window.location.href = '/3_Results_Stage/results.html';
        }
    }

    runNextGeneration();
}

//Callback function for each individual simulation
function startGeneration(callback) {
    timeRemaining = GENERATION_DURATION / 1000;

    generationTimer = setInterval(() => {
        timeRemaining -= 1;
        if (timeRemaining <= 0) {
            clearInterval(generationTimer);
            evaluateGeneration();
            callback();
        }
    }, 1000);
}

//Draw the countdown timer on the canvas
function drawTimer() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Time Left: ${timeRemaining}s`, canvas.width - 150, 30);
    ctx.fillText(`Generation: ${generation}`, canvas.width - 150, 60);
}

//Reset creatures' positions to the starting point
function resetCreaturesPosition() {
    creatures.forEach(creature => {
        creature.resetToStart();
    });
}

//Evaluate the current generation
function evaluateGeneration() {
    //Sort creatures
    creatures.sort((a, b) => b.getDistanceTraveled() - a.getDistanceTraveled());

    saveGenerationData();

    //Keep the top 50%
    if (creatures.length > 1){
        const survivors = creatures.slice(0, creatures.length / 2);
        const offspring = reproduceCreatures(survivors);
        creatures = survivors.concat(offspring);
    }

    resetCreaturesPosition();
}

//Save generation data to local storage
function saveGenerationData() {
    let generationData = JSON.parse(localStorage.getItem('generation_data')) || {};
    generationData[`generation_${generation}`] = creatures.map(creature => creature.getDistanceTraveled());
    localStorage.setItem('generation_data', JSON.stringify(generationData));
}

//Reset the Data
function resetGenerationData() {
    localStorage.removeItem('generation_data');
}


//Reproduction function with mutation
function reproduceCreatures(parents) {
    const offspring = [];
    parents.forEach(parent => {
        const child = new Creature();
        child.inheritTraits(parent);
        child.mutate();
        offspring.push(child);
    });
    return offspring;
}



//Tick function
function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms(ctx);
    drawTimer();
    creatures.forEach(creature => {
        creature.update();
        creature.draw();
    });
    setTimeout(tick, TICK_INTERVAL);
}

//Start the simulation
resetGenerationData();
initialiseSimulation();
tick();