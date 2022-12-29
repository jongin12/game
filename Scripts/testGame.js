export const styling = (target, style) => {
  for (let i in style) {
    target.style[i] = style[i];
  }
  return document.getElementById(target);
};

const root = document.getElementById("root");
styling(root, {
  width: "100vw",
  height: "100vh",
});

const canvas = document.getElementById("canvas");
styling(canvas, {
  width: "400px",
  height: "800px",
  backgroundColor: "white",
  display: "flex",
  position: "relative",
});

for (let i = 0; i < 8; i++) {
  let div = document.createElement("div");
  styling(div, {
    width: "12.5%",
    height: "100%",
    border: "1px solid black",
    position: "relative",
  });
  canvas.appendChild(div);
}

const line = document.createElement("div");
styling(line, {
  width: "100%",
  height: "100px",
  border: "1px solid black",
  position: "absolute",
  top: "700px",
});
canvas.appendChild(line);

const score = document.createElement("p");
styling(score, {
  width: "100%",
  height: "100px",
  position: "absolute",
  bottom: "500px",
  fontSize: "60px",
  fontWeight: "800",
  color: "red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
line.appendChild(score);

const combo = document.createElement("p");
styling(combo, {
  width: "100%",
  height: "100px",
  position: "absolute",
  bottom: "420px",
  fontSize: "36px",
  fontWeight: "600",
  color: "red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
line.appendChild(combo);

{
  const setting = document.createElement("div");
  styling(setting, {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: "0px",
  });
  canvas.appendChild(setting);

  const speed = document.createElement("input");
  styling(speed, {
    width: "100px",
    height: "20px",
    border: "1px solid black",
  });
  speed.placeholder = "속도";
  setting.appendChild(speed);

  const noteNum = document.createElement("input");
  styling(noteNum, {
    width: "100px",
    height: "20px",
    border: "1px solid black",
  });
  noteNum.placeholder = "노트 개수";
  setting.appendChild(noteNum);

  const button = document.createElement("button");
  styling(button, {
    width: "100px",
    height: "20px",
    border: "1px solid black",
  });
  button.textContent = "시작";
  setting.appendChild(button);

  const text = document.createElement("p");
  styling(text, {
    width: "100%",
    height: "100px",
  });
  text.textContent = "둘다 숫자만 입력";
  setting.appendChild(text);

  button.addEventListener("click", () => {
    let speedValue = Number(speed.value);
    let NoteValue = Number(noteNum.value);
    setting.remove();
    play(randomStage(NoteValue).reverse(), 1 / speedValue, speedValue);
  });
}

let comboNum = 0;

let lineArr = canvas.children;
function createNote(data, speed) {
  data.map((item, index) => {
    if (item) {
      let note = document.createElement("div");
      styling(note, {
        width: "100%",
        height: "20px",
        backgroundColor: "blue",
        position: "absolute",
      });
      lineArr[index].appendChild(note);
      let top = 0;
      let moveNote = setInterval(() => {
        note.style.top = `${top}px`;
        top += speed;
        if (keySwitch[index]) {
          if (top > 670 && top < 710) {
            score.textContent = "perfect";
            comboNum++;
            combo.textContent = `${comboNum}combo`;
            clearInterval(moveNote);
            note.remove();
          } else if (top > 650 && top < 730) {
            score.textContent = "good";
            comboNum++;
            combo.textContent = `${comboNum}combo`;
            clearInterval(moveNote);
            note.remove();
          }
        }
        if (top > 780) {
          score.textContent = "bad";
          comboNum = 0;
          combo.textContent = `${comboNum}combo`;
          clearInterval(moveNote);
          note.remove();
        }
      }, 1000 / 60);
    }
  });
}

const testArr = [
  "10001000",
  "10000000",
  "10000010",
  "10000000",
  "10001000",
  "10000000",
  "10000010",
  "10000000",
  "10001000",
  "10000000",
  "10000010",
  "00000000",
  "00001000",
  "00010000",
  "00000100",
  "00100000",
  "00000010",
  "01000000",
  "00000001",
  "10000000",
];

const stage1 = [
  "00100000",
  "00001000",
  "00000000",
  "00000001",
  "10000000",
  "00000100",
  "00100000",
  "00000010",
  "00001000",
  "00001000",
  "00100000",
  "00100000",
  "10000000",
  "10000000",
  "00000001",
  "00000001",
];

const testDataArr = testArr.map((item) => {
  let arr = [];
  for (let i = 0; i < 8; i++) {
    arr.push(Number(item[i]));
  }
  return arr;
});
const stage1Arr = stage1.map((item) => {
  let arr = [];
  for (let i = 0; i < 8; i++) {
    arr.push(Number(item[i]));
  }
  return arr;
});
const randomStage = (number) => {
  let arr = [];
  for (let i = 0; i < number; i++) {
    let arrr = [0, 0, 0, 0, 0, 0, 0, 0];
    let random = Math.floor(Math.random() * 8);
    arrr[random] = 1;
    arr.push(arrr);
  }
  return arr;
};

function play(dataArr, delay, speed) {
  let index = 0;
  comboNum = 0;
  const game = setInterval(() => {
    createNote(dataArr[index], speed);
    index++;
    if (index >= dataArr.length) {
      clearInterval(game);
    }
  }, delay * 1000);
}

const keySwitch = [0, 0, 0, 0, 0, 0, 0, 0];
const keyData = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  j: 4,
  k: 5,
  l: 6,
  ";": 7,
};

document.addEventListener("keydown", (e) => {
  let index = keyData[e.key];
  if (
    e.key === "a" ||
    e.key === "s" ||
    e.key === "d" ||
    e.key === "f" ||
    e.key === "j" ||
    e.key === "k" ||
    e.key === "l" ||
    e.key === ";"
  ) {
    if (!keySwitch[index]) {
      lineArr[index].style.backgroundColor = "rgba(0,0,0,0.2)";
      keySwitch[index] = 1;
      setTimeout(() => {
        lineArr[index].style.backgroundColor = "rgba(0,0,0,0)";
        keySwitch[index] = 0;
      }, 50);
    }
  }
});
