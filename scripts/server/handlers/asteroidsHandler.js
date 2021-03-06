// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an asteroid handler 
// object.
//
// ------------------------------------------------------------------
let Asteroid = require("../objects/asteroid");
let Helper = require("../helper/helperFunctions");

// ------------------------------------------------------------------
//
// Public function to create a new asteroid handler
//
// ------------------------------------------------------------------
function asteroidHandler(){
    let that = {};
    let asteroids = {};
    let newAsteroids = []; //dictionary of id to asteroid details
    let deletedAsteroids = []; //list of ids
    let id = 0;
    
    let asteroidGenerationRate = 20 / 10000; // however many every 10000 milliseconds
    let timeSinceLastAsteroid = 10000; // immediately spawn one
    let maxAsteroids = 50;

    Object.defineProperty(that, 'asteroids', {
        get: () => asteroids
    });

    Object.defineProperty(that, 'newAsteroids', {
        get: () => newAsteroids
    });

    Object.defineProperty(that, 'deletedAsteroids', {
        get: () => deletedAsteroids
    });

    function getIdForNewAsteroid(){
        let newId = id++
        newAsteroids.push(newId);
        return newId;
    }

    that.update = function(elapsedTime){
        timeSinceLastAsteroid += elapsedTime; // generate a new asteroid if necesary
        if (timeSinceLastAsteroid * asteroidGenerationRate > 1 && Object.keys(asteroids).length < maxAsteroids){// max number of asteroids reached
            that.createNewRandomAsteroid(1);
            timeSinceLastAsteroid = 0;
        }

        for (let key in asteroids){
            asteroids[key].update(elapsedTime);
        }
    }

    that.createNewRandomAsteroid = function(number){
        for (let i = 0; i < number; i++){
            asteroids[getIdForNewAsteroid()] = 
                Asteroid.create(
                    Helper.generateNewRandomCenter(), 
                    "large"
                    );
        }
    }

    that.createNewAsteroidAtCenter = function(size, center){
        asteroids[getIdForNewAsteroid()] = Asteroid.create(center, size);
    }

    that.handleAsteroidBreak = function(oldAsteroid){
        if (oldAsteroid.asteroidSize === "large"){
            for (let i = 0; i < 3; i ++){
                that.createNewAsteroidAtCenter("medium", oldAsteroid.state.center)
            }
        } else if (oldAsteroid.asteroidSize === "medium"){
            for (let i = 0; i < 4; i ++){
                that.createNewAsteroidAtCenter("small", oldAsteroid.state.center)
            }
        }
    }

    that.deleteAsteroid = function(id){
        delete asteroids[id];
        deletedAsteroids.push(id);
    }

    that.clearNewAndDeletedAsteroids = function(){
        deletedAsteroids = [];
        newAsteroids = [];
    }

    return that;
};

module.exports.create = () => asteroidHandler();