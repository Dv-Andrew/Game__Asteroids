import { Ship, Asteroid } from './gameObjects.js';

export default class GameAsteroids {
    constructor(canvasClass) {
        this.canvas = document.querySelector(canvasClass);
        this.context = this.canvas.getContext('2d');
        this.canvas.focus();

        this.drawGuides = false;

        this.shipMass = 100;
        this.shipRadius = 15;

        this.asteroidMass = 5000;
        this.asteroidPushForce = 500000; // max force to apply in one frame

        this.ship = new Ship(
            this.context,
            this.canvas.width / 2,
            this.canvas.height / 2,
            1000,
            200,
            0.25
        );
        this.projectiles = [];
        this.asteroids = [];
        this.asteroids.push(this.addAsteroid());

        this.canvas.addEventListener("keydown", this.keyDown.bind(this), true); // bind используется для привязки контекста
        this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);

        window.requestAnimationFrame(this.frame.bind(this));
    }

    // Drawing methods:
    frame(timestamp) {
        if (!this.previousTime) {
            this.previousTime = timestamp;
        }
        let elapsedTime = timestamp - this.previousTime;
        this.previousTime = timestamp;

        this.update(elapsedTime / 1000);
        this.draw();

        window.requestAnimationFrame(this.frame.bind(this));
    }
    update(elapsedTime) {
        this.ship.compromised = false;
        this.ship.update(elapsedTime);

        this.asteroids.forEach(function(asteroid) {
            asteroid.update(elapsedTime);
            if (this.isCollision(asteroid, this.ship)) {
                this.ship.isCompromised = true;
            }
        }, this);

        this.projectiles.forEach(function(projectile, i, projectiles) {
            projectile.update(elapsedTime);
            if (projectile.life <= 0) {
                projectiles.splice(i, 1);
            }
        }, this);

        if (this.ship.isLoaded && this.ship.isShooting) {
            this.projectiles.push(this.ship.shoot(elapsedTime));
        }
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.drawGuides) {
            this.asteroids.forEach(function(asteroid) {
                this.drawLine(asteroid, this.ship);
            }, this);
        }

        this.projectiles.forEach(function(projectile) {
            projectile.draw();
        }, this)

        this.asteroids.forEach(function(asteroid) {
            asteroid.draw({ drawGuides: this.drawGuides });
        }, this);

        this.ship.draw({ drawGuides: this.drawGuides });

        this.context.save();
        this.context.font = "18px Arial";
        this.context.fillStyle = "white";
        this.context.fillText("health: " + this.ship.health.toFixed(1), 10, this.canvas.height - 10);
        this.context.restore();
    }

    // Controls:
    keyDown(event) {
        this.keyHandler(event, true);
    }
    keyUp(event) {
        this.keyHandler(event, false);
    }
    keyHandler(event, value) {
        let key = event.key || event.keyCode;
        let nothingHandled = false;
        switch (key) {
            case "ArrowLeft":
            case 37: // left arrow keyCode
                this.ship.leftThruster = value;
                break;
            case "ArrowUp":
            case 38: // up arrow keyCode
                this.ship.isThrusterOn = value;
                break;
            case "ArrowRight":
            case 39: // right arrow keyCode
                this.ship.rightThruster = value;
                break;

            case " ":
            case 32: // space keyCode
                this.ship.isShooting = value;
                break;

            case "g":
            case 71: // g for guide
                if (value) this.drawGuides = !this.drawGuides;
                break;

            default:
                nothingHandled = true;
        }
        if (!nothingHandled) {
            event.preventDefault();
        }
    }

    // Methods for creation objects:
    addAsteroid(elapsedTime) {
        var asteroid = this.newAsteroid();
        this.pushAsteroidInRandomDirection(asteroid, elapsedTime);
        return asteroid;
    }
    newAsteroid() {
        return new Asteroid(
            this.context,
            this.canvas.width * Math.random(),
            this.canvas.height * Math.random(),
            this.asteroidMass
        );
    }
    pushAsteroidInRandomDirection(asteroid, elapsedTime) {
        elapsedTime = elapsedTime || 0.015;
        asteroid.push(2 * Math.PI * Math.random(), this.asteroidPushForce, elapsedTime);
        asteroid.twist((Math.random() - 0.5) * Math.PI * this.asteroidPushForce * 0.02, elapsedTime);
    }

    // game mechanic methods:
    isCollision(obj1, obj2) {
        return this.distanceBetween(obj1, obj2) < (obj1.radius + obj2.radius); // return true if distance < radius
    }
    distanceBetween(obj1, obj2) {
        return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
    }

    // some useful development methods:
    drawLine(obj1, obj2) {
        this.context.save();
        this.context.strokeStyle = "white";
        this.context.lineWidth = 0.5;
        this.context.beginPath();
        this.context.moveTo(obj1.x, obj1.y);
        this.context.lineTo(obj2.x, obj2.y);
        this.context.stroke();
        this.context.restore();
    }
}