const para = document.querySelector('p');
let count = 0;
// Get a reference to the canvas element and its 2D context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set the canvas dimensions to match the window's inner dimensions
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Function to generate a random number between min and max (inclusive)
function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// Function to generate a random RGB color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Define a Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.velX = velX; // velocity in the x-direction
    this.velY = velY; // velocity in the y-direction
  }
}

// Define a Ball class that extends Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY); // call the super class constructor and pass in the parameters
    this.color = color; // color of the ball
    this.size = size; // radius of the ball
    this.exists = true; // state of the ball
  }

  // Method to draw the ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Method to update the ball's position and handle collisions with the canvas edges
  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Method to detect collisions between balls
  collisionDetect() {
     for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
           const dx = this.x - ball.x;
           const dy = this.y - ball.y;
           const distance = Math.sqrt(dx * dx + dy * dy);

           if (distance < this.size + ball.size) {
             ball.color = this.color = randomRGB();
           }
        }
     }
  }
}

// Define an EvilCircle class that extends Shape
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // call the super class constructor and pass in the parameters
    this.color = "white"; // color of the evil circle
    this.size = 10; // radius of the evil circle

    // Add keyboard event listener for movement
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });

    // Add mousemove event listener for movement
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    });
  }

  // Method to draw the evil circle
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Method to check bounds and keep the evil circle within the canvas
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  // Method to detect collisions with balls and remove them
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = 'Ball count: ' + count;
        }
      }
    }
  }
}

// Array to hold all the balls
const balls = [];

// Create 25 balls with random properties
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

// Create an evil circle with random initial position
const evilBall = new EvilCircle(random(0, width), random(0, height));

// Function to animate the balls and evil circle
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

// Start the animation loop
loop();
