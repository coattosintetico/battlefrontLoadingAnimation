# Battlefront Loading Animation

Recreate the iconic [battlefront loading animation](https://www.youtube.com/watch?v=9s-2olavSPc) in p5.js with a set of images of your choosing.

## Setup

I recommend using [volta](https://volta.sh/) for managing the node and npm versions.

```
npm install
```

And then modify `src/sketch.js` to point to the images of your choosing that should be located under `assets/`. The (x, y) locations (top left edge) for where to zoom in each stage are also defined in `src/sketch.js`. Note that if one has `n` images, there should be `n-1` positions defined.

The width and height of the sketch is defined in `src/config.js`. Note that the images that you include in the sketch should match the sketch dimensions, so the preprocessing is left to you.

## Running

It runs with vite:

```
npm run dev
```

**IMPORTANT**: at least on Brave, one has to quickly click the sketch after refreshing in order for the audio to work. Otherwise, it complaint that the user didn't interact with the page so the audio wouldn't be enabled.

Automatic recording is also enabled, so it tries to save the video after finishing the sketch in .webm format.
