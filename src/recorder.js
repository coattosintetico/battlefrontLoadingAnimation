/**
 * Simple canvas recorder using MediaRecorder API
 * Records canvas to WebM format with audio
 */

export class CanvasRecorder {
  constructor() {
    this.chunks = [];
    this.recorder = null;
    this.isRecording = false;
    this.name = "battlefront-animation";
    this.audioContext = null;
    this.audioDestination = null;
    this.audioSources = [];
  }

  /**
   * Start recording a canvas element
   * @param {HTMLCanvasElement} canvas - The canvas to record
   * @param {Array<HTMLAudioElement>} audioElements - Audio elements to capture (optional)
   * @param {number} fps - Target framerate (default: 60)
   */
  start(canvas, audioElements = [], fps = 60) {
    if (this.isRecording) {
      console.warn("Already recording");
      return;
    }

    console.log("Starting recording...");
    this.chunks = [];

    // captureStream() captures the canvas at the specified framerate
    // This creates a MediaStream that can be recorded
    const videoStream = canvas.captureStream(fps);

    let combinedStream;

    // If we have audio elements, set up audio mixing
    if (audioElements && audioElements.length > 0) {
      // AudioContext is the Web Audio API's main interface
      // It creates and manages audio processing nodes
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // MediaStreamDestination creates a destination that outputs to a MediaStream
      // This allows us to route Web Audio API output into MediaRecorder
      this.audioDestination = this.audioContext.createMediaStreamDestination();

      // For each audio element, create a source node and connect to destination
      // This mixes all audio sources into one stream
      audioElements.forEach((audioElement) => {
        // createMediaElementSource connects an HTML Audio element to Web Audio API
        const source = this.audioContext.createMediaElementSource(audioElement);

        // Connect to destination to capture the audio
        source.connect(this.audioDestination);

        // Also connect to context.destination so we can hear it during playback
        source.connect(this.audioContext.destination);

        this.audioSources.push(source);
      });

      // Combine video tracks from canvas and audio tracks from Web Audio API
      combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...this.audioDestination.stream.getAudioTracks(),
      ]);

      console.log("Recording with audio");
    } else {
      combinedStream = videoStream;
      console.log("Recording without audio");
    }

    // MediaRecorder takes the stream and encodes it to WebM format
    this.recorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 8000000, // 8 Mbps for good quality
    });

    // Event fires whenever the recorder has encoded data ready
    // We collect these chunks to build the final video
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) {
        this.chunks.push(e.data);
      }
    };

    // When recording stops, create the final video file and download it
    this.recorder.onstop = () => {
      console.log("Recording stopped, creating file...");
      const blob = new Blob(this.chunks, { type: "video/webm" });
      this.download(blob, `${this.name}.webm`, "video/webm");
      this.isRecording = false;

      // Cleanup audio context
      if (this.audioContext) {
        this.audioContext.close();
      }
    };

    this.recorder.start();
    this.isRecording = true;
  }

  /**
   * Stop recording
   */
  stop() {
    if (!this.isRecording || !this.recorder) {
      console.warn("Not currently recording");
      return;
    }

    console.log("Stopping recording...");
    this.recorder.stop();
  }

  /**
   * Download a blob as a file
   * @param {Blob} blob - The data to download
   * @param {string} filename - Name of the file
   * @param {string} mimeType - MIME type of the file
   */
  download(blob, filename, mimeType) {
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Downloaded: ${filename}`);
  }
}
