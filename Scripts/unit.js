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

export function gameStart(unit, monster, stage) {
  let monsterCount = monster.length;
  skill.textContent = stage.skill;
  return new Promise((resolve, reject) => {
    let makeDiv = setInterval(() => {
      let div = document.createElement("div");
      div.style.backgroundColor = "white";
      div.style.width = "4px";
      div.style.height = "10px";
      div.style.position = "absolute";
      let top = unit.top - 10;
      div.style.top = top + "px";
      let left = unit.left + unit.width / 2;
      div.style.left = left + "px";
      canvas.appendChild(div);
      let attack = setInterval(() => {
        top -= 10;
        div.style.top = top + "px";
        monster.map((item, index) => {
          if (item) {
            if (
              item.left + item.width > unit.left &&
              item.left < unit.left + unit.width &&
              item.top + item.height > unit.top &&
              item.top < unit.top + unit.height
            ) {
              unit.hp -= item.att;
              deleteUnit(item);
              monster.splice(index, 1);
              monsterCount--;
              if (unit.hp <= 0) {
                deleteUnit(unit);
                clearInterval(makeDiv); //총알쏘는거 멈춤
                gameOver();
                reject();
              }
              if (monsterCount <= 0) {
                clearInterval(makeDiv); //총알쏘는거 멈춤
                resolve();
              }
            }
          }
        });
        monster.map((item, index) => {
          if (item) {
            if (item.left < left && item.left + item.width > left) {
              if (item.top + item.height >= top && item.top <= top) {
                clearInterval(attack); //총알 이동멈춤
                div.remove(); //총알 삭제
                item.hp -= unit.att; //데미지
                if (item.hp <= 0) {
                  deleteUnit(item);
                  monster.splice(index, 1);
                  stage.score += 100;
                  score.textContent = stage.score;
                  monsterCount--;
                  if (monsterCount <= 0) {
                    clearInterval(makeDiv); //총알쏘는거 멈춤
                    resolve();
                    stage.stage++;
                    nextStage(stage.stage);
                  }
                }
              }
            }
          }
        });
        if (top < -10) {
          clearInterval(attack);
          div.remove();
        }
      }, 1000 / 60);
    }, 1000 / unit.attSpeed);
  });
}
export const nextStage = (number) => {
  let text = document.createElement("div");
  text.className = "stage";
  styling(text, {
    width: "600px",
    height: "200px",
    fontSize: "100px",
    color: "white",
    position: "absolute",
    top: "300px",
    textAlign: "center",
  });
  text.textContent = number + " STAGE";
  let stage = document.getElementsByClassName("stage");
  setTimeout(() => {
    stage[0].remove();
  }, 1000);
  canvas.appendChild(text);
};

export const gameOver = () => {
  let gameOver = document.createElement("div");
  styling(gameOver, {
    width: "600px",
    height: "200px",
    fontSize: "100px",
    color: "white",
    position: "absolute",
    top: "300px",
    textAlign: "center",
  });
  gameOver.textContent = "게임 오버";
  canvas.appendChild(gameOver);
};
