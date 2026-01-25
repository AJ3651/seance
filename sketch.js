/*Seance , 09/01/2026 Jemila Abdulai
 WCC1 Final Project 
Run in any code editor with all accompanying files
Acknowledgements (references, links, inspirations, etc) :
Video manipulation, qx578,  https://editor.p5js.org/qx578/sketches/1v3G4V7ls  
Offscreen buffer , Becky Aston, https://editor.p5js.org/beckyaston/sketches/zYAGvA1FKL 
Load Video, Becky Aston https://editor.p5js.org/beckyaston/sketches/CtQDE0mTm 
Video Pixels , p5, https://editor.p5js.org/p5/sketches/Dom:_Video_Pixels 
*/

let video;
let song;

let buffer;

// offsets for my rgb values
let rOffset, gOffset, bOffset;

// Zoom
let zoomAmount = 1.5; // zooms into the video

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  buffer = createGraphics(320, 240);
  buffer.pixelDensity(1);

  // load in the audio 
  song = loadSound("audio/seancesound.mp3");

  // load in video
  video = createVideo("p5video.mp4", () => {
    video.hide();
    video.volume(0);
    video.loop();

    setTimeout(() => {
      song.loop();
      song.setVolume(0.4);
      video.time(song.currentTime());
    }, 50);
  });

  setRGBOffsets();
}

function draw() {
  background(0);

  // set the sound to sync with the video
  if (song.isPlaying()) {
    if (abs(video.time() - song.currentTime()) > 0.5) {
      video.time(song.currentTime());
    }
  }

  // setting video vidth based on the zoom amount above
  let zoomedWidth  = floor(video.width / zoomAmount);
  let zoomedHeight = floor(video.height / zoomAmount);

  let xOffset = floor((video.width - zoomedWidth) / 2);
  let yOffset = floor((video.height - zoomedHeight) / 2);

  video.loadPixels();
  buffer.loadPixels();

  // map values to feed into the rgb index
  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      let i = (x + y * buffer.width) * 4;

      let vx = floor(map(x, 0, buffer.width, xOffset, xOffset + zoomedWidth));
      let vy = floor(map(y, 0, buffer.height, yOffset, yOffset + zoomedHeight));

      let rIndex = constrain(vx + rOffset, 0, video.width - 1) + vy * video.width;
      let gIndex = constrain(vx + gOffset, 0, video.width - 1) + vy * video.width;
      let bIndex = vx + (constrain(vy + bOffset, 0, video.height - 1) * video.width);

      let r = 255 - video.pixels[rIndex * 4];
      let g = 255 - video.pixels[gIndex * 4 + 1];
      let b = 255 - video.pixels[bIndex * 4 + 2];

      buffer.pixels[i] = r;
      buffer.pixels[i + 1] = g;
      buffer.pixels[i + 2] = b;
      buffer.pixels[i + 3] = 255;
    }
  }

  buffer.updatePixels();
  image(buffer, 0, 0, width, height);
}

//make the browser window responsive
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setRGBOffsets();
}

// adjust the rgb offset 
function setRGBOffsets() {
  rOffset = floor(video.width * -0.3);   
  gOffset = floor(video.width * -0.2);   
  bOffset = floor(video.height * 0.1);  
}

// make it full screen when mouse is pressed
function mousePressed() {
  fullscreen(true);
}
