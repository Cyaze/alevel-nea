
//Images and text stored in tuples.
const images = [
    {
        src: 'infoImages/image1.jpg',
        text: 'This is the factor screen'
    },
    {
        src: 'infoImages/image2.jpg',
        text: 'This is the simulation'
    },
    {
        src: 'infoImages/image3.jpg',
        text: 'This is the results'
    }
];

let currentIndex = 0;

//slideshow which loops through each image
function showSlide(index) {
    const imageElement = document.getElementById('info-image');
    const textElement = document.getElementById('info-text');
    
    //Return back to the first the image, it can check how many images there are.
    if (index >= images.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = images.length - 1;
    } else {
        currentIndex = index;
    }
    
    imageElement.src = images[currentIndex].src;
    textElement.textContent = images[currentIndex].text;

    //Logging for any debugging issues, not 100% neccessary
    console.log('Current Index:', currentIndex);
    console.log('Image Source:', images[currentIndex].src);
}


function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

//For the home button
function returnHome() {
    window.location.href = '/1_Home_Stage/1.1_Start_Screen/startscreen.html';
}

//Initialise the first slide
showSlide(currentIndex);
