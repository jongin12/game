import { makeUnit, moveUnit, attackUnit } from "./unit.js";
const styling = (target, style) => {
  for (let i in style) {
    target.style[i] = style[i];
  }
};

const root = document.getElementById("root");
styling(root, {
  width: "100vw",
  height: "100vh",
});

const canvas = document.getElementById("canvas");
styling(canvas, {
  width: "600px",
  height: "800px",
  backgroundColor: "#888",
  overflow: "hidden",
});

let move_switch = false;
document.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    if (!move_switch) {
      move_switch = true;
      moveUnit(user, -1, "left", 5).then(() => {
        move_switch = false;
      });
    }
  } else if (e.key === "d") {
    if (!move_switch) {
      move_switch = true;
      moveUnit(user, 1, "left", 5).then(() => {
        move_switch = false;
      });
    }
    move_switch = true;
  }
});

class Unit {
  constructor(name, hp, att, attSpeed, speed, top, left, width, height) {
    this.name = name;
    this.hp = hp;
    this.att = att;
    this.attSpeed = attSpeed;
    this.speed = speed;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }
}

const user = new Unit("me", 100, 10, 10, 300, 650, 250, 80, 80);
const monster = new Unit("monster", 100, 100, 10, 100, 0, 50, 50, 50);
makeUnit(user, "blue");
attackUnit(user, monster);

makeUnit(monster, "red");
moveUnit(monster, 1, "top", 500);
moveUnit(monster, 1, "left", 300);
