export function makeUnit(unit, color) {
  const div = document.createElement("div");
  div.className = unit.name;
  div.style.width = unit.width + "px";
  div.style.height = unit.height + "px";

  div.style.position = "absolute";
  div.style.top = unit.top + "px";
  div.style.left = unit.left + "px";

  div.style.backgroundColor = color;
  canvas.appendChild(div);
  const div2 = document.createElement("div");
  div.appendChild(div2);
}

export function deleteUnit(unit) {
  let unitClass = document.getElementsByClassName(unit.name);
  let unitClass0 = unitClass[0];
  unitClass0.remove();
}

export function moveUnit(unit, speed, direction, clear) {
  return new Promise((resolve, reject) => {
    if (speed > 0 && unit.left >= 600 - unit.width) {
      resolve();
    } else if (speed < 0 && unit.left <= 0) {
      resolve();
    } else if (speed > 0 && unit.top >= 800 - unit.height) {
      resolve();
    } else if (speed < 0 && unit.top <= 0) {
      resolve();
    } else {
      let unitClass = document.getElementsByClassName(unit.name);
      let unitClass0 = unitClass[0];
      let now = unit[direction];
      let obj = {};
      obj[direction] = setInterval(() => {
        unit[direction] += (unit.speed * speed) / 60;
        unitClass0.style[direction] = unit[direction] + "px";
        if (unit[direction] <= 0) {
          clearInterval(obj[direction]);
          resolve();
        }
        if (speed > 0 && unit[direction] >= now + clear) {
          clearInterval(obj[direction]);
          resolve();
        }
        if (speed < 0 && unit[direction] <= now - clear) {
          clearInterval(obj[direction]);
          resolve();
        }
      }, 1000 / 60);
    }
  });
} //unit이 초당 speed만큼 direction방향으로 이동, clear만큼 이동후 종료

export function attackUnit(unit, monster) {
  let makeDiv = setInterval(() => {
    let div = document.createElement("div");
    div.style.backgroundColor = "white";
    div.style.width = "4px";
    div.style.height = "15px";
    div.style.position = "absolute";
    let top = unit.top - 15;
    div.style.top = top + "px";
    let left = unit.left + unit.width / 2;
    div.style.left = left + "px";
    canvas.appendChild(div);
    let attack = setInterval(() => {
      top -= 10;
      div.style.top = top + "px";
      if (monster) {
        if (monster.left < left && monster.left + monster.width > left) {
          if (monster.top + monster.height >= top) {
            clearInterval(attack);
            div.remove();
            monster.hp -= unit.att;
            console.log(monster.hp);
            if (monster.hp <= 0) {
              deleteUnit(monster);
              monster = null;
            }
          }
        }
      } else if (top < -15) {
        clearInterval(attack);
        div.remove();
      }
    }, 1000 / 60);
  }, 300);
}
