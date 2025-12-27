// visual inspo: https://www.youtube.com/watch?v=nzE8eUlseRM
// physics inspo: https://www.forbes.com/sites/startswithabang/2016/07/01/the-physics-of-fireworks/

let rockets = [];
let sparks = [];

const FOV = 200;
const G   = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(0);
}

function draw() {
  // fade old frames for trails
  fill(0, 0, 0, 20);
  rect(0, 0, width, height);

  // launch rockets periodically
  if (frameCount % 80 === 0) {
    launch(random(width * 0.3, width * 0.7));
  }

  // rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    let r = rockets[i];

    stroke(r.h, 80, 100);
    line(r.x, r.y, r.x, r.y + 10);

    r.y += r.vy;
    r.vy += G;

    if (r.vy >= 0 || r.y <= r.targetY) {
      explode(r.x, r.y, r.h);
      rockets.splice(i, 1);
    }
  }

  // sparks (pseudo-3D)
  blendMode(ADD);
  for (let i = sparks.length - 1; i >= 0; i--) {
    let p = sparks[i];

    p.x3 += p.vx;
    p.y3 += p.vy;
    p.z3 += p.vz;
    p.vy += G * 2;
    p.life--;

    let s = FOV / (FOV + p.z3);
    let x = p.cx + p.x3 * s;
    let y = p.cy + p.y3 * s;

    let fade = pow(p.life / p.ttl, 5);
    let a = 100 * fade;

    strokeWeight(1 + s);
    stroke(p.h, 80, 100, a);
    point(x, y);

    if (p.life <= 0) {
      sparks.splice(i, 1);
    }
  }
  blendMode(BLEND);
}

function launch(x) {
  rockets.push({
    x: x,
    y: height,
    vy: -random(6, 10),
    targetY: random(height * 0.15, height * 0.35),
    h: random(360)
  });
}

function explode(x, y, baseHue) {
  let count = random(500, 2000);
  for (let i = 0; i < count; i++) {
    let a = random(TWO_PI);
    let b = random(PI);
    let spd = random(0.8, 2);

    let vx = cos(a) * sin(b) * spd;
    let vy = sin(a) * sin(b) * spd;
    let vz = cos(b) * spd * 0.35;

    let h = (baseHue + random(-50, 50) + 360) % 360;

    sparks.push({
      cx: x,
      cy: y,
      x3: 0,
      y3: 0,
      z3: random(-80, -20),
      vx: vx,
      vy: vy,
      vz: vz,
      h: h,
      ttl: 100,
      life: 100
    });
  }
}
