/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
let numberOfParticles = 100;
let colors = ["blue", "red", "green", "orange", "yellow"];
let pointer = {
  x: undefined,
  y: undefined,
  pressed: false,
};

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: Math.random() * 5 + -2.5,
      y: Math.random() * 5 + -2.5,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    //Mouse collision
    if (
      getDistance(this.x, this.y, pointer.x, pointer.y) < 120 &&
      this.opacity < 0.5
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }
  edges() {
    if (this.x + this.radius > canvas.width || this.x < this.radius) {
      this.velocity.x = this.velocity.x *= -1;
    }
    if (this.y + this.radius > canvas.height || this.y < this.radius) {
      this.velocity.y = this.velocity.y *= -1;
    }
  }
}

function init() {
  //circle packing
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    let radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    let hue = Math.random() * 255;
    let color = `hsl(${hue}, 100%, 50%)`;
    if (i != 0) {
      for (let j = 0; j < particlesArray.length; j++) {
        if (
          getDistance(x, y, particlesArray[j].x, particlesArray[j].y) -
            radius * 2 <
          0
        ) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);

          j = -1;
        }
      }
    }
    particlesArray.push(new Particle(x, y, radius, color));
  }
}

function collisions() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = 0 + 1; j < particlesArray.length; j++) {
      if (particlesArray[i] != particlesArray[j]) {
        if (
          getDistance(
            particlesArray[i].x,
            particlesArray[i].y,
            particlesArray[j].x,
            particlesArray[j].y
          ) <
          particlesArray[i].radius + particlesArray[j].radius
        ) {
          resolveCollision(particlesArray[i], particlesArray[j]);
        }
      }
    }
  }
}

init();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => {
    particle.draw();
    particle.update();
    particle.edges();
  });
  collisions();
  requestAnimationFrame(animate);
}
animate();

canvas.addEventListener("pointermove", (e) => {
  e.preventDefault();
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});
