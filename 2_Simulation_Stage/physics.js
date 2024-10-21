//Function to detect collision
function checkCollision(joint) {
    //Platform height
    const groundHeight = canvas.height * 0.9; 

    //If the joint is below the platform, place it back on top and stop downward velocity
    if (joint.y >= groundHeight) {
        joint.y = groundHeight + 0.1;
        joint.vy = 0;
    }
}

// Physics update for each joint
function updatePhysics(joint) {
    const gravity = JSON.parse(localStorage.getItem('gravity'));
    const friction = JSON.parse(localStorage.getItem('friction')); 

    joint.vy += gravity;
    joint.vx *= friction; 
    joint.vy *= friction; 

    // Check for collision with the platform
    checkCollision(joint);
}
