import { styling, gameStart } from "./unit.js";

const root = document.getElementById("root");
styling(root, {
  width: "100vw",
  height: "100vh",
});

const canvas = document.getElementById("canvas");
styling(canvas, {
  width: "600px",
  height: "800px",
  backgroundColor: "skyblue",
  overflow: "hidden",
});

let move_switch = false;
function moving(unit, speed, direction, clear) {
  if (!move_switch) {
    move_switch = true;
    unit.moveUnit(speed, direction, clear).then(() => {
      move_switch = false;
    });
  }
}

class Stage {
  constructor(stage, score, skill) {
    this.stage = stage;
    this.score = score;
    this.skill = skill;
  }
  Skill() {
    this.skill--;
  }
}
const stageInfo = new Stage(1, 0, 3);

class Unit {
  constructor(name, hp, att, attSpeed, speed, top, left, width, height, img) {
    this.name = name;
    this.hp = hp;
    this.att = att;
    this.attSpeed = attSpeed;
    this.speed = speed;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.img = img;
  }
  makeUnit() {
    const div = document.createElement("div");
    div.className = this.name;
    styling(div, {
      width: this.width + "px",
      height: this.height + "px",
      position: "absolute",
      top: this.top + "px",
      left: this.left + "px",
    });
    canvas.appendChild(div);
    const img = document.createElement("img");
    img.src = this.img;
    img.style.width = this.width + "px";
    img.style.height = this.height + "px";
    div.appendChild(img);
    const hpBar = document.createElement("div");
    hpBar.style.width = "80%";
    hpBar.style.height = "10%";
    hpBar.style.backgroundColor = "white";
    hpBar.style.position = "absolute";
    hpBar.style.left = "10%";
    hpBar.style.top = "100%";
    div.appendChild(hpBar);
    const nowHp = document.createElement("div");
    nowHp.style.width = "100%";
    nowHp.style.height = "100%";
    nowHp.style.backgroundColor = "red";
    hpBar.appendChild(nowHp);
    let maxHp = this.hp;
    let hpInterval = setInterval(() => {
      nowHp.style.width = (this.hp / maxHp) * 100 + "%";
      if (this.hp <= 0) {
        clearInterval(hpInterval);
      }
    }, 1000 / 60);
  }
  moveUnit(speed, direction, clear) {
    return new Promise((resolve, reject) => {
      if (speed > 0 && this.left >= 600 - this.width) {
        resolve();
      } else if (speed < 0 && this.left <= 0) {
        resolve();
      } else if (speed > 0 && this.top >= 800 - this.height) {
        resolve();
      } else if (speed < 0 && this.top <= 0) {
        resolve();
      } else {
        let unitClass = document.getElementsByClassName(this.name);
        let unitClass0 = unitClass[0];
        let now = this[direction];
        let obj = {};
        obj[direction] = setInterval(() => {
          this[direction] += (this.speed * speed) / 60;
          unitClass0.style[direction] = this[direction] + "px";
          if (this[direction] <= 0) {
            clearInterval(obj[direction]);
            resolve();
          }
          if (speed > 0 && this[direction] >= now + clear) {
            clearInterval(obj[direction]);
            resolve();
          }
          if (speed < 0 && this[direction] <= now - clear) {
            clearInterval(obj[direction]);
            resolve();
          }
        }, 1000 / 60);
      }
    });
  }
  powerUp(number) {
    this.att += number;
  }
  attSpeedUp(number) {
    this.attSpeed += number;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    moving(user, -1, "left", 15);
  } else if (e.key === "d") {
    moving(user, 1, "left", 15);
  } else if (e.key === "s") {
    moving(user, 1, "top", 15);
  } else if (e.key === "w") {
    moving(user, -1, "top", 15);
  } else if (e.key === "q") {
    user.powerUp(40);
    stageInfo.Skill();
  } else if (e.key === "e") {
    user.attSpeedUp(1);
  }
});

const user = new Unit(
  "me", //name
  100, //hp
  30, //att
  3, //attspeed
  300, //speed
  650, //top
  250, //left
  80, //width
  80, //height
  "./img/aaaa.png" //img
);

function makeMonsters_easy(array, many) {
  for (let i = 0; i < many; i++) {
    let monster = new Unit(
      "monster" + i,
      Math.floor(Math.random() * 100 + 100), //hp
      Math.floor(Math.random() * 20 + 20), //att
      0, //attspeed
      Math.floor(Math.random() * 20 + 20), //speed
      0, //top
      Math.floor(Math.random() * 50 + 100 * i), //left
      50, //width
      50, //height
      "./img/bbb.png" //img
    );
    array.push(monster);
  }
}
user.makeUnit();

let monsterArray = [];
makeMonsters_easy(monsterArray, 3);
monsterArray.map((item) => {
  item.makeUnit();
  item.moveUnit(1, "top", 700);
});
gameStart(user, monsterArray, stageInfo).then(() => {
  monsterArray = [];
  makeMonsters_easy(monsterArray, 5);
  monsterArray.map((item) => {
    item.makeUnit();
    item.moveUnit(1, "top", 700);
  });
  gameStart(user, monsterArray, stageInfo);
});
// moveUnit(monster, 1, "left", 300);
