import p5 from "p5";

export default class Animation {
  constructor(p, baseImage, destImage, destCoord, soundEffects) {
    /** @type {p5} */
    this.p = p;
    /** @type {p5.Image} image that is drawn at the beginning */
    this.baseImage = baseImage;
    /** @type {p5.Image} image that represents the end result */
    this.destImage = destImage;
    /** @type {p5.Vector} x y coordinates of the top left corner of the destination */
    this.destCoord = destCoord;

    /** @type {Array<Audio>} sound effect to be played */
    this.soundEffects = soundEffects;
    /** @type {Array<boolean>} whether sound effects have played already to avoid playing them twice */
    this.soundsHavePlayed = [false, false, false];

    this.hasStarted = false;
    this.hasFinished = false;
  }

  draw() {
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.startTime = this.p.millis();
    }

    const lineColor = this.p.color(4, 192, 255);
    const lineWeight = 3;
    const margin = 1;
    const destWidth = 80;
    const destHeight = 60;

    this.p.stroke(lineColor);
    this.p.strokeWeight(lineWeight);

    const t = this.p.millis() - this.startTime;

    if (t < 1000) {
      this.p.image(this.baseImage, 0, 0);

      const w = this.p.width;
      const h = this.p.height;
      this.p.line(margin, 0, margin, h);
      this.p.line(w - margin, 0, w - margin, h);
      this.p.line(0, margin, w, margin);
      this.p.line(0, h - margin, w, h - margin);
      return;
    }

    if (1000 < t && t < 2300) {
      const duration = 1300;
      // start time for this specific keyframe
      const t0 = t - 1000;

      if (!this.soundsHavePlayed[0]) {
        this.soundEffects[0].play();
        this.soundsHavePlayed[0] = true;
      }

      this.p.image(this.baseImage, 0, 0);

      const w = this.p.width;
      const h = this.p.height;

      this.p.line(margin, 0, margin, h);
      this.p.line(w - margin, 0, w - margin, h);

      // in order to animate the positions, we use an ease out factor kappa E [0,1]
      // value(t) = kappa(t) * finalValue
      // kappa(t) goes from [0, 1] in the range of t [0, 1], so we have to
      // normalize t
      const kappa = easeOut(t0 / duration);

      const y1 = this.destCoord.y;
      const y2 = this.destCoord.y + destHeight;

      const y1_t = margin + kappa * (y1 - margin);
      const y2_t = (h - margin) * (1 - kappa) + kappa * y2;

      this.p.line(0, y1_t, w, y1_t);
      this.p.line(0, y2_t, w, y2_t);

      return;
    }

    if (2300 < t && t < 3600) {
      const duration = 1300;
      // start time for this specific keyframe
      const t0 = t - 2300;

      if (!this.soundsHavePlayed[1]) {
        this.soundEffects[1].play();
        this.soundsHavePlayed[1] = true;
      }

      this.p.image(this.baseImage, 0, 0);

      const y1 = this.destCoord.y;
      const y2 = this.destCoord.y + destHeight;
      const w = this.p.width;
      const h = this.p.height;

      this.p.line(0, y1, w, y1);
      this.p.line(0, y2, w, y2);

      const kappa = easeOut(t0 / duration);

      const x1 = this.destCoord.x;
      const x2 = this.destCoord.x + destWidth;

      const x1_t = margin + kappa * (x1 - margin);
      const x2_t = (w - margin) * (1 - kappa) + kappa * x2;

      this.p.line(x1_t, 0, x1_t, h);
      this.p.line(x2_t, 0, x2_t, h);

      return;
    }

    if (3600 < t && t < 4400) {
      const duration = 800;
      const t0 = t - 3600;

      if (!this.soundsHavePlayed[2]) {
        this.soundEffects[2].play();
        this.soundsHavePlayed[2] = true;
      }

      this.p.image(this.baseImage, 0, 0);

      const w = this.p.width;
      const h = this.p.height;

      const kappa = t0 / duration;

      const opacity = 255 * kappa;

      const x1_t = this.destCoord.x * (1 - kappa);
      const x2_t =
        this.destCoord.x +
        destWidth +
        (w - this.destCoord.x - destWidth) * kappa;

      const y1_t = this.destCoord.y * (1 - kappa);
      const y2_t =
        this.destCoord.y +
        destHeight +
        (h - this.destCoord.y - destHeight) * kappa;

      this.p.imageMode(this.p.CORNERS);
      this.p.tint(255, opacity);
      this.p.image(this.destImage, x1_t, y1_t, x2_t, y2_t);
      this.p.noTint();

      this.p.line(0, y1_t, w, y1_t);
      this.p.line(0, y2_t, w, y2_t);
      this.p.line(x1_t, 0, x1_t, h);
      this.p.line(x2_t, 0, x2_t, h);

      return;
    }

    if (4400 < t) {
      this.hasFinished = true;
      return;
    }

    // if (4900 < t) {
    //   this.p.imageMode(this.p.CORNER);
    //   this.p.image(this.destImage, 0, 0);
    //   return;
    // }

    // if (2300 < t) {
    //   this.p.image(this.baseImage, 0, 0);

    //   // Vertical lines

    //   const x1 = this.destCoord.x;
    //   const x2 = this.destCoord.x + destWidth;
    //   const h = this.p.height;

    //   this.p.line(x1, 0, x1, h);
    //   this.p.line(x2, 0, x2, h);

    //   // Horizontal lines

    //   const y1 = this.destCoord.y;
    //   const y2 = this.destCoord.y + destHeight;
    //   const w = this.p.width;

    //   this.p.line(0, y1, w, y1);
    //   this.p.line(0, y2, w, y2);

    //   return;
    // }

    this.currentFrame++;
  }
}

function easeOut(t, n = 3) {
  return 1 - Math.pow(1 - t, n);
}
