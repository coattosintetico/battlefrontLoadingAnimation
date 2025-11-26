import p5 from "p5";

const sketch = (p) => {
  let soundEffects;

  p.setup = async () => {
    p.createCanvas(1024, 768);

    soundEffects = [
      new Audio("assets/01.mp3"),
      new Audio("assets/02.mp3"),
      new Audio("assets/03.mp3"),
    ];
  };

  p.draw = () => {
    p.background(220, 0, 0);
  };

  p.mousePressed = () => {
    soundEffects[0].play();
  };
};

new p5(sketch, "p5sketch");
