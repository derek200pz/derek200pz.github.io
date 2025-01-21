export const FRICTION = 0.001;
export const CHSFRICTION = 0.1;
export const CHSSPEED = 5;
export const BULLETSPEED = 10;
export const ASTMSPEED = 0.8;
export const ASTMSPIN = 0.01;
export const TOUCHTHRESHOLD = 0.8;

export const viewWidth = window.innerWidth;
export const viewHeight = window.innerHeight;

export const propelParticles = [];
export const bullets = [];
export const asterooms = [];
export const screenText = [];

export const controls = { a: false, d: false, w: false, space: false };

export function vectorToAngle(x, y) {
  if (y == 0) {
    if (x < 0) {
      return Math.PI;
    } else {
      return 0;
    }
  } else if (y < 0) {
    return Math.atan(-x / y);
  } else {
    return Math.PI + Math.atan(-x / y);
  }
}

export function displayText(text) {
  const txt = document.createElement("span");
  txt.textContent = text;
  txt.style.color = "#f00";
  txt.style.fontSize = 100;
  document.body.appendChild(txt);
  const w = txt.offsetWidth;
  const h = txt.offsetHeight;
  txt.style.left = (viewWidth - w) * 0.5;
  txt.style.top = (viewHeight - h) * 0.5;
}

export function applyControls(sprite) {
  if (controls.a) {
    sprite.rot -= 0.15;
  }
  if (controls.d) {
    sprite.rot += 0.15;
  }
  if (controls.w) {
    sprite.delX += Math.sin(sprite.rot) * 0.1;
    sprite.delY -= Math.cos(sprite.rot) * 0.1;
    spawnPropelParticle();
  }
  if (controls.space) {
  }
}

export function spritesTouching(sprite1, sprite2) {
  if (
    Math.abs(sprite1.x - sprite2.x) <
      (sprite1.w + sprite2.w) * 0.5 * TOUCHTHRESHOLD &&
    Math.abs(sprite1.y - sprite2.y) <
      (sprite1.h + sprite2.h) * 0.5 * TOUCHTHRESHOLD
  ) {
    return true;
  } else {
    return false;
  }
}

export function applyFriction(sprite, friction) {
  //If velocity is small to the point of insignificance, set it to 0
  if (Math.abs(sprite.delY) + Math.abs(sprite.delX) < friction) {
    sprite.delX = 0;
    sprite.delY = 0;
  }

  //if the object is moving, apply friction
  if (!(sprite.delY == 0 && sprite.delX == 0)) {
    sprite.delX -= friction * Math.sin(vectorToAngle(sprite.delX, sprite.delY));
    sprite.delY += friction * Math.cos(vectorToAngle(sprite.delX, sprite.delY));
  }
}

export function applyInertia(sprite) {
  sprite.x += sprite.delX;
  sprite.y += sprite.delY;
  sprite.rot += sprite.delRot;
}

export function reflectOutOfBounds(sprite) {
  if (sprite.x < 0) {
    sprite.x = viewWidth;
    sprite.y = viewHeight - sprite.y;
  } else if (sprite.y < 0) {
    sprite.x = viewWidth - sprite.x;
    sprite.y = viewHeight;
  } else if (sprite.x > viewWidth) {
    sprite.x = 0;
    sprite.y = viewHeight - sprite.y;
  } else if (sprite.y > viewHeight) {
    sprite.x = viewWidth - sprite.x;
    sprite.y = 0;
  }
}

export function removeOutOfBoundsBullets() {
  for (i = 0; i < bullets.length; i++) {
    if (
      bullets[i].x < 0 ||
      bullets[i].y < 0 ||
      bullets[i].x > viewWidth ||
      bullets[i].y > viewHeight
    ) {
      bullets[i].dom.remove();
      bullets.splice(i, 1);
    }
  }
}

export function updateDomPosition(sprite) {
  sprite.dom.height = sprite.h;
  sprite.dom.width = sprite.w;
  sprite.dom.style.transform = "rotate(" + sprite.rot + "rad)";
  sprite.dom.style.left = sprite.x - sprite.w / 2;
  sprite.dom.style.top = sprite.y - sprite.h / 2;
}

export function spawnPropelParticle() {
  const chs = document.createElement("img");

  dice = 2 * Math.random();
  if (dice < 1) {
    chs.src = "img/propellant_y.svg";
  } else {
    chs.src = "img/propellant_w.svg";
  }

  chs.alt = "propellant";
  chs.style.zIndex = -1;
  document.body.appendChild(chs);
  propelParticles.push({
    dom: chs,
    w: 10,
    h: 10,
    rot: Math.random() * Math.PI,
    delRot: (Math.random() - 0.5) * 0.1,
    x: pizzaSprite.x,
    delX: CHSSPEED * Math.sin(pizzaSprite.rot + Math.random() - 0.5 + Math.PI),
    y: pizzaSprite.y,
    delY: CHSSPEED * -Math.cos(pizzaSprite.rot + Math.random() - 0.5 + Math.PI),
  });
}

export function spawnBullet() {
  const chs = document.createElement("img");
  chs.src = "img/bullet.svg";
  chs.alt = "bullet";
  document.body.appendChild(chs);
  bullets.push({
    dom: chs,
    w: 10,
    h: 10,
    rot: pizzaSprite.rot,
    delRot: 0,
    x: pizzaSprite.x,
    delX: BULLETSPEED * Math.sin(pizzaSprite.rot),
    y: pizzaSprite.y,
    delY: BULLETSPEED * -Math.cos(pizzaSprite.rot),
  });
}

export function spawnChildAsterooms(parentAsteroom) {
  if (parentAsteroom.w <= 25) {
    return;
  }
  const asrm1 = document.createElement("img");
  asrm1.src = "img/asteroom.svg";
  asrm1.alt = "asteroom";
  document.body.appendChild(asrm1);
  asterooms.push({
    dom: asrm1,
    w: parentAsteroom.w * 0.5,
    h: parentAsteroom.h * 0.5,
    rot: (Math.random() - 0.5) * Math.PI,
    delRot: (Math.random() - 0.5) * 0.01,
    x: parentAsteroom.x,
    delX: parentAsteroom.delX + Math.random() - 0.5,
    y: parentAsteroom.y,
    delY: parentAsteroom.delY + Math.random() - 0.5,
  });

  const asrm2 = document.createElement("img");
  asrm2.src = "img/asteroom.svg";
  asrm2.alt = "asteroom";
  document.body.appendChild(asrm2);
  asterooms.push({
    dom: asrm2,
    w: parentAsteroom.w * 0.5,
    h: parentAsteroom.h * 0.5,
    rot: (Math.random() - 0.5) * Math.PI,
    delRot: (Math.random() - 0.5) * 0.01,
    x: parentAsteroom.x + (Math.random() - 0.5) * 50,
    delX: parentAsteroom.delX + (Math.random() - 0.5) * 10,
    y: parentAsteroom.y + (Math.random() - 0.5) * 50,
    delY: parentAsteroom.delY + (Math.random() - 0.5) * 10,
  });
}

export function randomEdgeCoords() {
  dice = 4 * Math.random();
  if (dice < 1) {
    return { x: 0, y: Math.random() * viewHeight };
  } else if (dice < 2) {
    return { x: viewWidth, y: Math.random() * viewHeight };
  } else if (dice < 3) {
    return { x: Math.random() * viewWidth, y: 0 };
  } else {
    return { x: Math.random() * viewWidth, y: viewHeight };
  }
}

export function populateAsterooms(count) {
  for (i = 0; i < count; i++) {
    const astm = document.createElement("img");
    astm.src = "img/asteroom.svg";
    astm.alt = "asteroom";
    astm.style.zIndex = -1;
    document.body.appendChild(astm);
    randomEdge = randomEdgeCoords();
    randomAngle = Math.random() * 2 * Math.PI;
    asterooms.push({
      dom: astm,
      w: 100,
      h: 100,
      rot: 0,
      delRot: ASTMSPIN * (2 * Math.random() - 0.5),
      x: randomEdge.x,
      delX: ASTMSPEED * Math.sin(randomAngle),
      y: randomEdge.y,
      delY: ASTMSPEED * Math.cos(randomAngle),
    });
  }
}

export function placeExplosion(sprite1, sprite2) {
  const xploSize = 300;
  const xplo = document.createElement("img");
  xplo.src = "img/explosion.svg";
  xplo.alt = "explosion";
  document.body.appendChild(xplo);
  xplo.style.height = xploSize;
  xplo.style.width = xploSize;
  // xplo.style.zIndex = -2;
  xplo.style.left =
    (sprite1.x + sprite2.x) * 0.5 -
    (sprite1.w + sprite1.w) * 0.25 -
    xploSize * 0.5;
  xplo.style.top =
    (sprite1.y + sprite2.y) * 0.5 -
    (sprite1.h + sprite1.h) * 0.25 -
    xploSize * 0.5;
}

export function removeStationaryPropelParticles() {
  for (i = 0; i < propelParticles.length; i++) {
    if (propelParticles[i].delX == 0 && propelParticles[i].delY == 0) {
      propelParticles[i].dom.remove();
      propelParticles.splice(i, 1);
    }
  }
}
