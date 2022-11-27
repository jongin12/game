import { makeMonsters, Unit } from "./index.js";

export const styling = (target, style) => {
  for (let i in style) {
    target.style[i] = style[i];
  }
};

function UI() {
  let score = document.createElement("div");
  score.id = "score";
  styling(score, {
    width: "100px",
    height: "50px",
    fontSize: "32px",
    color: "white",
    position: "absolute",
    top: "5px",
    right: "10px",
    textAlign: "right",
  });
  score.textContent = 0;
  canvas.appendChild(score);
  let skill = document.createElement("div");
  skill.id = "skill";
  styling(skill, {
    width: "150px",
    height: "50px",
    fontSize: "32px",
    color: "white",
    position: "absolute",
    top: "5px",
    left: "10px",
    textAlign: "left",
  });
  canvas.appendChild(skill);
}
UI();
const score = document.getElementById("score");
const skill = document.getElementById("skill");

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
              stage.score += 100;
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
          unit.att *= 0.95;
          unit.attSpeed *= 1.1;
          console.log(unit);
          gameStart(unit, makeMonsters(stage.number), stage);
        } else {
          canvasText("끝", 10);
        }
      }
    }
  }, 1000 / 60);
  monster.map((item) => {
    if (item.skill) {
      console.log(item.skill);
      item.skill;
    }
  });
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
