// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let graphics;
let modelLoaded = false;

function setup() {
  // fix for retina resolutions which scale in
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  graphics = createGraphics(width, height);
  graphics.clear();

  graphics.colorMode(HSB);

  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  let options = {
    maxPoseDetections: 5,
  }
  poseNet = ml5.poseNet(video, modelReady, options);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    // console.log(poses);
  });
  // poses
  // nose, leftEye, rightEye, leftEar, rightEar
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
  modelLoaded = true;
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  // drawSkeleton();
  image(graphics, 0, 0);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  // for (let i = 0; i < poses.length; i++) {
  // For each pose detected, loop through all the keypoints
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let rightWrist = pose.keypoints.find(keypoint => keypoint.part === 'rightWrist');
      let leftWrist = pose.keypoints.find(keypoint => keypoint.part === 'leftWrist');

      let keypoint = pose.keypoints[j];
      let handHue = (rightWrist.position.x / width) * 360;

      // draw with the nose
      // use the right hand x position for hue 
      // use the right hand y position for size
      if (keypoint.score > 0.5 && keypoint.part == "nose") {
        graphics.fill(handHue, 100, 100);
        graphics.noStroke();
        graphics.ellipse(keypoint.position.x, keypoint.position.y, height - rightWrist.position.y);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}