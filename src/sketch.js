import p5 from "p5";
import Animation from "./Animation";

/**
 * @param {p5} p
 */
const sketch = (p) => {
  let images;
  let positions;
  let soundEffects;
  let animations = [];
  let currentAnimationIndex = 0;

  p.setup = async () => {
    p.createCanvas(1024, 768);

    images = [
      await p.loadImage("assets/01.png"),
      await p.loadImage("assets/02.png"),
      await p.loadImage("assets/03.png"),
      await p.loadImage("assets/04.png"),
      await p.loadImage("assets/05.png"),
      await p.loadImage("assets/06.png"),
      await p.loadImage("assets/07.png"),
    ];

    positions = [
      new p.createVector(435, 333),
      new p.createVector(217, 121),
      new p.createVector(574, 371),
      new p.createVector(544, 284),
      new p.createVector(392, 378),
      new p.createVector(351, 414),
    ];

    soundEffects = [
      new Audio("assets/01.mp3"),
      new Audio("assets/02.mp3"),
      new Audio("assets/03.mp3"),
    ];

    for (let i = 0; i < positions.length; i++) {
      animations.push(new Animation(
        p,
        images[i],
        images[i + 1],
        positions[i],
        soundEffects,
      ));
    }
  };

  p.draw = () => {
    if (animations[currentAnimationIndex].hasFinished) {
      currentAnimationIndex++;
    }
    if (currentAnimationIndex < animations.length) {
      animations[currentAnimationIndex].draw();
    } else {
      p.noLoop();
    }
  };
};

new p5(sketch, "p5sketch");
