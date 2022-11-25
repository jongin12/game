export const styling = (target, style) => {
  for (let i in style) {
    target.style[i] = style[i];
  }
};

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
}

export function deleteUnit(unit) {
  let unitClass = document.getElementsByClassName(unit.name);
  let unitClass0 = unitClass[0];
  unitClass0.remove();
}

// export function moveUnit(unit, speed, direction, clear) {
//   return new Promise((resolve, reject) => {
//     if (speed > 0 && unit.left >= 600 - unit.width) {
//       resolve();
//     } else if (speed < 0 && unit.left <= 0) {
//       resolve();
//     } else if (speed > 0 && unit.top >= 800 - unit.height) {
//       resolve();
//     } else if (speed < 0 && unit.top <= 0) {
//       resolve();
//     } else {
//       let unitClass = document.getElementsByClassName(unit.name);
//       let unitClass0 = unitClass[0];
//       let now = unit[direction];
//       let obj = {};
//       obj[direction] = setInterval(() => {
//         unit[direction] += (unit.speed * speed) / 60;
//         unitClass0.style[direction] = unit[direction] + "px";
//         if (unit[direction] <= 0) {
//           clearInterval(obj[direction]);
//           resolve();
//         }
//         if (speed > 0 && unit[direction] >= now + clear) {
//           clearInterval(obj[direction]);
//           resolve();
//         }
//         if (speed < 0 && unit[direction] <= now - clear) {
//           clearInterval(obj[direction]);
//           resolve();
//         }
//       }, 1000 / 60);
//     }
//   });
// } //unit이 초당 speed만큼 direction방향으로 이동, clear만큼 이동후 종료

export function gameStart(unit, monster) {
  let monsterCount = monster.length;
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
            if (item.left < left && item.left + item.width > left) {
              if (item.top + item.height >= top && item.top <= top) {
                clearInterval(attack); //총알 이동멈춤
                div.remove(); //총알 삭제
                item.hp -= unit.att; //데미지
                if (item.hp <= 0) {
                  deleteUnit(item);
                  monster.splice(index, 1);
                  monsterCount--;
                  if (monsterCount <= 0) {
                    clearInterval(makeDiv); //총알쏘는거 멈춤
                    resolve(index);
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
