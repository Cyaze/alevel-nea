let currentUser = null;
const localStorageKey = 'simulationSaves';

//Display the Save/Load popup
function showSavePopup() {
    document.getElementById('save-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('save-popup').style.display = 'none';
}

//Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('save-form').style.display = 'block';
        alert('Login successful!');
    } else {
        alert('Invalid username or password.');
    }
}

//Function to change back to new save

function returnBack() {
    document.getElementById('save-form').style.display = 'block';
    document.getElementById('load-form').style.display = 'none';
}


//Function to handle signup
function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        alert('Username already exists.');
    } else {
        users[username] = { password: password, saves: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please log in.');
    }
}

//Function to save progress
function saveProgress() {
    const saveName = document.getElementById('save-name').value;

    if (!saveName) {
        alert('Please enter a save name.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];
    const saveData = {
        name: saveName,
        factors: {
            generations: document.getElementById('generations-slider').value,
            population: document.getElementById('population-slider').value,
            mutation: document.getElementById('mutation-slider').value,
            gravity: document.getElementById('gravity-slider').value,
            friction: document.getElementById('friction-slider').value
        }
    };

    user.saves.push(saveData);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Progress saved!');
}

//Function to load saves
function loadSaves() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    const saveList = document.getElementById('save-list');
    saveList.innerHTML = '';

    user.saves.forEach((save, index) => {
        const saveButton = document.createElement('button');
        saveButton.innerText = save.name;
        saveButton.onclick = function () {
            loadSaveData(index);
        };
        saveList.appendChild(saveButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function () {
            deleteSave(index);
        };
        saveList.appendChild(deleteButton);
    });

    document.getElementById('save-form').style.display = 'none';
    document.getElementById('load-form').style.display = 'block';
}

//Function to load a specific save
function loadSaveData(index) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];
    const saveData = user.saves[index].factors;

    document.getElementById('generations-slider').value = saveData.generations;
    document.getElementById('population-slider').value = saveData.population;
    document.getElementById('mutation-slider').value = saveData.mutation;
    document.getElementById('gravity-slider').value = saveData.gravity;
    document.getElementById('friction-slider').value = saveData.friction;

    alert('Save loaded!');
    closePopup();
}

//Function to delete a specific save
function deleteSave(index) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[currentUser];

    user.saves.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Save deleted!');
    loadSaves();
}
