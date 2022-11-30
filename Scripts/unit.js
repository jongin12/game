import { makeMonsters, Unit } from "./index.js";
import unitJson from "./unitInfo.js";

export const styling = (target, style) => {
  for (let i in style) {
    target.style[i] = style[i];
  }
};

function makeUI(name, top, left, align) {
  let div = document.createElement("div");
  div.id = name;
  styling(div, {
    width: "100px",
    height: "50px",
    fontSize: "32px",
    color: "white",
    position: "absolute",
    top: top + "px",
    left: left + "px",
    textAlign: align,
  });
  div.textContent = 0;
  canvas.appendChild(div);
  return document.getElementById(name);
}

const score = makeUI("score", 0, 490, "right");

function deleteUnit(unit) {
  let unitClass = document.getElementsByClassName(unit.name);
  let unitClass0 = unitClass[0];
  unitClass0.remove();
}

function bump(item, unit) {
  if (
    item.left + item.width > unit.left &&
    item.left < unit.left + unit.width &&
    item.top + item.height > unit.top &&
    item.top < unit.top + unit.height
  ) {
    return true;
  } else {
    return false;
  }
}

export function gameStart(unit, monster, stage) {
  let monsterCount = monster.length;
  let monsterSkill;
  let makeBullet = setInterval(() => {
    let bullet = document.createElement("div");
    let top = unit.top - 10;
    let left = unit.left + unit.width / 2;
    styling(bullet, {
      width: "4px",
      height: "10px",
      backgroundColor: "white",
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
    });
    bullet.className = "bullet";
    canvas.appendChild(bullet);
    let moveBullet = setInterval(() => {
      top -= 10;
      bullet.style.top = top + "px";
      monster.map((item, index) => {
        if (item.left < left && item.left + item.width > left) {
          if (item.top + item.height >= top && item.top <= top) {
            clearInterval(moveBullet); //총알 이동멈춤
            bullet.remove(); //총알 삭제
            item.hp -= unit.att; //데미지
            if (item.hp <= 0) {
              deleteUnit(item);
              monster.splice(index, 1);
              stage.score += item.score;
              score.textContent = stage.score;
              monsterCount--;
            }
          }
        }
      });
      if (top < -10) {
        clearInterval(moveBullet);
        bullet.remove();
      }
    }, 1000 / 60);
  }, 1000 / unit.attSpeed);
  monster.map((item) => {
    if (item.skill) {
      let index = 0;
      monsterSkill = setInterval(() => {
        console.log(item.skill);
        if (item.skill) {
          let coin1 = item.UnitSkill(index);
          index++;
          monster.push(coin1);
          monsterCount++;
        }
      }, 1500);
    }
  });
  let time = setInterval(() => {
    monster.map((item, index) => {
      if (item) {
        if (bump(item, unit) || item.top > 790) {
          unit.hp -= item.att;
          deleteUnit(item);
          monster.splice(index, 1);
          monsterCount--;
        }
      }
    });
    let skill = false;
    monster.map((item, index) => {
      if (item.skill) {
        skill = true;
      }
    });
    if (!skill) {
      clearInterval(monsterSkill);
    }
    if (unit.hp <= 0) {
      clearInterval(makeBullet);
      clearInterval(time);
      deleteUnit(unit);
      canvasText("게임오버", 10);
    } else {
      if (monsterCount <= 0) {
        let bulletClass = document.getElementsByClassName("bullet");
        for (let i = 0; i < bulletClass.length; i++) {
          bulletClass[i].remove();
        }
        clearInterval(makeBullet);
        clearInterval(time);
        stage.number++;
        if (stage.number < stage.info.length) {
          canvasText(`STAGE ${stage.number}`, 1);
          unit.attSpeed += 0.5;
          gameStart(unit, makeMonsters(stage.number), stage);
        } else {
          canvasText("끝", 10);
        }
      }
    }
  }, 1000 / 60);
}

const canvasText = (text, time) => {
  let textDiv = document.createElement("div");
  textDiv.className = "text";
  styling(textDiv, {
    width: "600px",
    height: "200px",
    fontSize: "80px",
    color: "white",
    position: "absolute",
    top: "300px",
    textAlign: "center",
  });
  textDiv.textContent = text;
  let textTime = document.getElementsByClassName("text");
  setTimeout(() => {
    textTime[0].remove();
  }, 1000 * time);
  canvas.appendChild(textDiv);
};
