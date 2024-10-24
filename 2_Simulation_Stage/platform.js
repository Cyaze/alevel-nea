function createPlatform() {
    const groundHeight = canvas.height * 0.9;
    ctx.fillStyle = "#41980a";
    ctx.fillRect(0, groundHeight, canvas.width, canvas.height * 0.1);
}

function drawPlatforms(ctx) {
    createPlatform();
}

function returnFactor() {
    window.location.href = '/1_Home_Stage/1.2_Factors/factors.html';
}

function skip() {
    window.location.href = '/3_Results_Stage/results.html';
}