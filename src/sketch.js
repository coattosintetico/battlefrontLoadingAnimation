import p5 from "p5";
import Animation from "./Animation";
import { CanvasRecorder } from "./recorder";

/**
 * @param {p5} p
 */
const sketch = (p) => {
  let images;
  let positions;
  let soundEffects;
  let animations = [];
  let currentAnimationIndex = 0;
  let recorder; // Canvas recorder instance

  p.setup = async () => {
    p.createCanvas(1024, 768);

    images = [
      await p.loadImage("assets/santiago/01.png"),
      await p.loadImage("assets/santiago/02.png"),
      await p.loadImage("assets/santiago/03.png"),
      await p.loadImage("assets/santiago/04.png"),
      await p.loadImage("assets/santiago/05.png"),
      await p.loadImage("assets/santiago/06.png"),
    ];

    positions = [
      new p.createVector(353, 147),
      new p.createVector(279, 154),
      new p.createVector(602, 373),
      new p.createVector(575, 344),
      new p.createVector(601, 438),
    ];

    soundEffects = [
      new Audio("assets/soundEffect01.mp3"),
      new Audio("assets/soundEffect02.mp3"),
      new Audio("assets/soundEffect03.mp3"),
    ];

    for (let i = 0; i < positions.length; i++) {
      animations.push(
        new Animation(p, images[i], images[i + 1], positions[i], soundEffects),
      );
    }
  };

  p.draw = () => {
    // Start recording on the first frame
    if (p.frameCount === 1) {
      recorder = new CanvasRecorder();
      // Get the canvas element - p5 creates it automatically
      const canvas = document.querySelector("canvas");
      // Pass soundEffects array to capture audio along with video
      recorder.start(canvas, soundEffects, 60); // Record at 60 FPS with audio
    }

    // Progress through animations
    if (animations[currentAnimationIndex].hasFinished) {
      currentAnimationIndex++;
    }

    // Draw current animation or stop when all are done
    if (currentAnimationIndex < animations.length) {
      animations[currentAnimationIndex].draw();
    } else {
      // All animations finished - wait a couple seconds before stopping recording and the sketch
      p.noLoop();
      if (recorder) {
        setTimeout(() => {
          recorder.stop();
        }, 2000); // Wait for 2 seconds (2000 ms) before stopping the recorder
      }
    }
  };
};

new p5(sketch, "p5sketch");
