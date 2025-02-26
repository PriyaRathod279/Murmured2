let boids = [];
let tempSlider, humiditySlider, skySlider;
let bgSound, repelSound;
let temperature = 20, humidity = 50, skyCondition = 50;

function preload() {
  bgSound = loadSound('murmuration.mp3');
  repelSound = loadSound('repel.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight * 0.7);

  let title = createElement('h1', 'Murmured');
  title.style('text-align', 'center');

  let description = createP(`Murmured is an interactive exploration of time and weather, responding to the circadian rhythm. Touch, slide, listen and observe as murmuration patterns shift with the natural rhythm of the day. Reflect on your connection with these feathered sparks of nature.<br><br>An exploration by Deeptam Das & Priya Rathod, Interaction Design`);
  description.style('text-align', 'center');
  description.style('max-width', '800px');
  description.style('margin', '0 auto');

  tempSlider = createSlider(-10, 40, temperature, 1);
  tempSlider.position(20, height + 40);
  tempSlider.style('width', '200px');

  humiditySlider = createSlider(0, 100, humidity, 1);
  humiditySlider.position(250, height + 40);
  humiditySlider.style('width', '200px');

  skySlider = createSlider(0, 100, skyCondition, 1);
  skySlider.position(480, height + 40);
  skySlider.style('width', '200px');

  for (let i = 0; i < 500; i++) {
    boids.push(new Boid(random(width), random(height)));
  }

  bgSound.loop();
}

function draw() {
  background(0);

  temperature = tempSlider.value();
  humidity = humiditySlider.value();
  skyCondition = skySlider.value();

  for (let boid of boids) {
    boid.update();
    boid.edges();
    boid.show();
  }
}

function mousePressed() {
  repelSound.play();
  for (let boid of boids) {
    boid.repel(mouseX, mouseY);
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector();
    this.maxSpeed = 3;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    let tempFactor = map(temperature, -10, 40, 0.5, 2);
    let humidityFactor = map(humidity, 0, 100, 0.8, 1.2);
    let skyFactor = map(skyCondition, 0, 100, 0.5, 1.5);

    this.maxSpeed = tempFactor * humidityFactor * skyFactor;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;

    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  repel(x, y) {
    let mouse = createVector(x, y);
    let force = p5.Vector.sub(this.position, mouse);
    let distance = force.mag();
    if (distance < 100) {
      force.setMag(5);
      this.applyForce(force);
    }
  }

  show() {
    stroke(255);
    strokeWeight(2);
    point(this.position.x, this.position.y);
  }
}
