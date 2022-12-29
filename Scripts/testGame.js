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
  backgroundColor: "skyblue",
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
          if (top > 680 && top < 700) {
            console.log("perfect");
            clearInterval(moveNote);
            note.remove();
          } else if (top > 670 && top < 710) {
            console.log("good");
            clearInterval(moveNote);
            note.remove();
          }
        }
        if (top > 800) {
          clearInterval(moveNote);
          note.remove();
        }
      }, 1000 / 60);
    }
  });
}

// const testData = [1, 0, 0, 0, 0, 0, 0, 1];
// createNote(testData, 1);

const testDataArr = [
  [1, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

function play(dataArr, delay, speed) {
  let index = 0;
  const game = setInterval(() => {
    createNote(dataArr[index], speed);
    index++;
    if (index >= dataArr.length) {
      clearInterval(game);
    }
  }, delay * 1000);
}
play(testDataArr.reverse(), 0.5, 3);

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
  if (!keySwitch[index]) {
    lineArr[index].style.backgroundColor = "rgba(0,0,0,0.2)";
    keySwitch[index] = 1;
    setTimeout(() => {
      lineArr[index].style.backgroundColor = "rgba(0,0,0,0)";
      keySwitch[index] = 0;
    }, 50);
  }
});
