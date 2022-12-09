import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

const root = document.getElementById("root");
console.log(root);
root.style.position = "absolute";

let hpBar = document.createElement("div");
hpBar.style.width = "100vw";
hpBar.style.height = "50px";
hpBar.style.backgroundColor = "red";
root.appendChild(hpBar);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-1, 2, 4);
// scene.add(light);
// console.log(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: "green" });
const userMaterial = new THREE.MeshBasicMaterial({ color: "white" });

const user = [];
const makeUser = (scale, position) => {
  let part = new THREE.Mesh(geometry, userMaterial);
  part.scale.set(scale.x, scale.y, scale.z);
  part.position.set(position.x, position.y, position.z);
  scene.add(part);
  user.push(part);
  return part;
};
const makeMonster = (scale, position, color) => {
  let material = new THREE.MeshBasicMaterial({ color: color });
  let part = new THREE.Mesh(geometry, material);
  part.scale.set(scale.x, scale.y, scale.z);
  part.position.set(position.x, position.y, position.z);
  scene.add(part);
  return part;
};

const monster = makeMonster(
  { x: 1, y: 1, z: 10 },
  { x: 5, y: -0.25, z: 0 },
  "red"
);

// const leg1 = new THREE.Mesh(geometry, userMaterial);
// leg1.scale.x = 0.2;
// leg1.scale.y = 1;
// leg1.scale.z = 0.2;
// scene.add(leg1);

const leg1 = makeUser({ x: 0.2, y: 1, z: 0.2 }, { x: -8, y: 0, z: 0 });
const leg2 = makeUser({ x: 0.2, y: 1, z: 0.2 }, { x: -8, y: 0, z: 0.3 });
const body = makeUser({ x: 0.5, y: 1, z: 0.7 }, { x: -8, y: 0.8, z: 0.15 });
const head = makeUser({ x: 0.5, y: 0.5, z: 0.5 }, { x: -8, y: 1.7, z: 0.15 });
const arm1 = makeUser({ x: 0.2, y: 1, z: 0.2 }, { x: -8, y: 0.8, z: 0.65 });
const arm2 = makeUser({ x: 0.2, y: 1, z: 0.2 }, { x: -8, y: 0.8, z: -0.35 });

const ground = new THREE.Mesh(geometry, material);
ground.scale.set(20, 0, 10);
ground.position.y = -0.75;
scene.add(ground);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 500;

const cubeState = {
  moving: false,
  jumping: false,
  speed: 0.1,
};

{
  let count = false;
  const legAnimate = () => {
    requestAnimationFrame(legAnimate);
    if (cubeState.moving) {
      if (count) {
        leg1.rotation.z -= 0.01;
        leg2.rotation.z += 0.01;
        if (leg1.rotation.z < -0.2) {
          count = false;
        }
      } else {
        leg1.rotation.z += 0.01;
        leg2.rotation.z -= 0.01;
        if (leg1.rotation.z > 0.2) {
          count = true;
        }
      }
    }
  };
  legAnimate();
} //leganimation

//test
camera.position.set(0, 3, 5);

const jumpAnimate = function () {
  requestAnimationFrame(jumpAnimate);
  if (cubeState.jumping) {
    user.map((item) => {
      item.position.y += 0.2;
    });
  } else if (!cubeState.jumping && leg1.position.y >= 0) {
    user.map((item) => {
      item.position.y -= 0.3;
    });
  }
  camera.position.set(
    head.position.x - 15,
    head.position.y + 10,
    head.position.z
  );
  controls.target.set(head.position.x, head.position.y, head.position.z);
  controls.update();
  renderer.render(scene, camera);
};
jumpAnimate();

const keypress = {
  w: false,
  a: false,
  s: false,
  d: false,
};

document.addEventListener("keydown", (e) => {
  if (!keypress.w && e.key === "w") {
    keypress.w = true;
  }
  if (!keypress.a && e.key === "a") {
    keypress.a = true;
  }
  if (!keypress.s && e.key === "s") {
    keypress.s = true;
  }
  if (!keypress.d && e.key === "d") {
    keypress.d = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (keypress.w && e.key === "w") {
    keypress.w = false;
  }
  if (keypress.a && e.key === "a") {
    keypress.a = false;
  }
  if (keypress.s && e.key === "s") {
    keypress.s = false;
  }
  if (keypress.d && e.key === "d") {
    keypress.d = false;
  }
});

const moveAnimate = function () {
  requestAnimationFrame(moveAnimate);
  if (keypress.w) {
    user.map((item) => {
      item.position.x += cubeState.speed;
    });
  }
  if (keypress.a) {
    user.map((item) => {
      item.position.z -= cubeState.speed;
    });
  }
  if (keypress.s) {
    user.map((item) => {
      item.position.x -= cubeState.speed;
    });
  }
  if (keypress.d) {
    user.map((item) => {
      item.position.z += cubeState.speed;
    });
  }
  if (keypress.w || keypress.a || keypress.s || keypress.d) {
    cubeState.moving = true;
  } else {
    cubeState.moving = false;
  }
  controls.update();
  renderer.render(scene, camera);
};
moveAnimate();

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !cubeState.jumping && leg1.position.y <= 0) {
    cubeState.jumping = true;
    setTimeout(() => {
      cubeState.jumping = false;
    }, 300);
  }
});

let monsterSpeed = 0.2;
let monsterCount = 0;
let hp = 100;
let score = 0;
const monsterAnimate = () => {
  requestAnimationFrame(monsterAnimate);
  if (hp > 0) {
    monster.position.x -= monsterSpeed;
    score++;
    if (
      monster.position.x < leg1.position.x + 0.85 &&
      monster.position.x > leg1.position.x - 0.85 &&
      monster.position.y > leg1.position.y - 0.8
    ) {
      hp -= 10;
      hpBar.style.width = hp + "vw";
    }
    if (monster.position.x < -10) {
      monster.position.x = 10;
      monsterCount++;
      if (monsterCount >= 10) {
        monsterCount = 0;
        monsterSpeed += 0.05;
      }
    }
  } else if (hp <= 0 && hp > -100) {
    alert("score : " + score);
    console.log(score);
    hp = -200;
  }
};
monsterAnimate();
