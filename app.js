/**
 * @description Dinosaur Constructor (the unit of height and weight are imperial)
 * @param {Object} dino A dinosaur data retrieve from "dino.json" file
 */ 
function Dinosaur(dino) {
    this.species = dino.species;
    // 6 facts data
    this.weight = dino.weight;
    this.height = dino.height;
    this.diet = dino.diet;
    this.where = dino.where;
    this.when = dino.when;
    this.fact = dino.fact;
}

/**
 * ## Modified based on review ##
 * @description function to return json data
 * @returns Array of dinosaur data from dino.json
 */
 function dinoData(){
    return fetch("dino.json")
    .then((res) => res.json())
    .then((res) => {
        console.log("JSON data", res);
        return res;
    })
    .catch((error) => {
        console.error("Failed");
    });
}

/**
 * @description create dino objects based on dino Data feed
 * @param {Object} data dino data from "dino.json"
 * @returns Dinosaur data in arrays
 */
function createDinoObjs(data){
    const dinoObjs = [];
    data.forEach(dino => dinoObjs.push(new Dinosaur(dino)))
    return dinoObjs;
};

/**
 * @description Human Object Constructor (the unit of height and weight are imperial)
 * @param {Obj} human human data input
 */
function Human(human){
    this.name = human.name;
    this.weight = human.weight;
    this.height = human.height;
    this.diet = human.diet;
}

/**
 * The starter code suggests to use IIFE, but I think this should happen once user
 * click the button. Therefore I didn't use IIFE pattern here.
 * @returns Human data from form
 */
function getHumanData(){
    return {
        name: document.getElementById("name").value,
        // NOTE: Weight in JSON file is in lbs, height in inches. 
        height: document.getElementById("feet").value * 12 + document.getElementById("inches").value,
        weight: document.getElementById("weight").value,
        diet: document.getElementById("diet").value
    };
}

// Adding comparing method to Dinosaur class
Dinosaur.prototype = {
    compareWeight: function(humanWeight){
        const ratio = Math.round((this.weight/humanWeight) * 100) / 100;
        if (ratio > 1){
            return `${this.species} weights ${ratio} times more than you!`;
        }else if (ratio < 1) {
            return `You weights ${ratio} times less than ${this.species}!`;
        }else{
            return `${this.species} has the same weight as you!`;
        }
    },
    compareHeight: function(humanHeight){
        const ratio = Math.round((this.height /humanHeight) * 100) / 100;
        if (ratio > 1){
            return `${this.species} is ${ratio} times taller than you!`;
        }else if(ratio < 1){
            return `${this.species} is ${ratio} times shorter than you!`;
        }else{
            return `${this.species} has the same height as you!`;
        }
    },
    compareDiet: function(humanDiet){
        if (this.diet === humanDiet){
            return `You and ${this.species} are both ${this.diet}!`;
        }else{
            return `You are a ${humanDiet}, while ${this.species} is a ${this.diet}!`;
        }
    }
}

/**
 * UTILITY FUNCTION, credit to https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * @description Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/**
 * @param {string} name name of the object 
 * @param {string} fact fact of the object
 * @returns returns a div object includes object tile information
 */
function createDiv(name, fact){
    let div = document.createElement('div');
    div.className = 'grid-item';
    if (fact.length > 0){
        div.innerHTML = `<h3>${name}</h3><img src="images/${name}.png"><p>${fact}</p>`;
    }else{
        div.innerHTML = `<h3>${name}</h3><img src="images/human.png">`;
    }
    return div;
}

/**
 * @description return a random fact of given dinosaur
 * @param {Object} dinosaur obj 
 * @param {object} human obj 
 * @returns random fact string
 */
function getRandomFact(dino, human){
    let fact;
    const rand = Math.floor(Math.random() * 5);
    switch (rand){
        case 0:
            return dino.compareWeight(human.weight);
        case 1:
            return dino.compareHeight(human.height);
        case 2:
            return dino.compareDiet(human.diet);
        case 3:
            return `${dino.species} lived in ${dino.where}!`;
        case 4:
            return `${dino.species} lived in ${dino.when}!`;
        case 5:
            return dino.fact;
    } 
}

/**
 * @param {Object} dino dinosaur object to generate div object
 * @param {Object} humanData human object to generate div object
 * @returns div object of dinosaur tile
 */
function generateDinoTile(dino, humanData){
    let fact;
    if (dino.species !== "Pigeon"){
        fact = getRandomFact(dino, humanData);
    }else{
        fact = dino.fact;
    }
    return createDiv(dino.species.toLowerCase(), fact);
}

/**
 * @param {Object} humanData human object to generate div object
 * @returns div object of human tile
 */
function generateHumanTile(humanData){
    return createDiv(humanData.name, "");
}

/**
 * @description generate dino tiles with random facts and random position
 * @param {Object} dinosaur objects
 * @param {Object} human data
 * @updates index.html
 */
 function generateTiles(dinoObjs, humanData){
    let counter = 0;
    let generatedDiv = document.createDocumentFragment();
    for (let i = 0; i < 9; i++){
        if (i == 4){
            generatedDiv.appendChild(generateHumanTile(humanData));
        }else{
            generatedDiv.appendChild(generateDinoTile(dinoObjs[counter], humanData));
            counter++;
        }
    }
    document.getElementById('grid').appendChild(generatedDiv);
}

/**
 * I used IIFE for dinoObjs before, but in order to avoid using globals, I remove the IIFE.
 * @description actions when "compare me" being clicked
 * @updates index.html
 */
 async function click(){
    // generate data
    const humanData = getHumanData();
    const jsonData = await dinoData();
    const dinoObjs = createDinoObjs(jsonData.Dinos);
    shuffle(dinoObjs);
    // Hide input data form
    document.getElementById("dino-compare").style.display = "none";
    // Generate Tiles for each Dino in Array
    // Add Div to DOM
    generateTiles(dinoObjs, humanData);
}

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", click);