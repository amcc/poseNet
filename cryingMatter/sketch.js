// set up the matter module by creating variables

// module aliases
let Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
let engine;
let world;
let boxes = [];

let circles = [];
let ground;

// posenet variables
let video;
let poseNet;
let poses = [];
let graphics;

function setup() {
  createCanvas(640, 480);
  frameRate(25);
  // create and run the matter engine
  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);

  // add the ground for boxes to fall on to
  let matterOptions = {
    isStatic: true
  }
  ground = Bodies.rectangle(200, height - 50, 200, 10, matterOptions);
  // add the ground to the world
  World.add(world, ground)

  // poseNet settings
  // fix for retina resolutions which scale in
  pixelDensity(1);
  graphics = createGraphics(640, 480);
  graphics.clear();
  colorMode(HSB);
  graphics.colorMode(HSB);

  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  let poseOptions = {
    maxPoseDetections: 5,
  }
  poseNet = ml5.poseNet(video, modelReady, poseOptions);
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
}

function mouseDragged() {
  // make boxes with random sizes
  boxes.push(new Box(mouseX, mouseY, random(10, 30), random(10, 30)))
}

function draw() {
  background(51);

  // draw image
  image(video, 0, 0, width, height);

  //poseNet drawing
  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  drawBalls();
  // drawSkeleton();
  image(graphics, 0, 0);


  // loop through all the boxes and show them.
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].show();
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
  }
  // draw the ground on the canvas
  stroke(255)
  fill(170)
  rectMode(CENTER)
  // strokeWeight(4)
  noStroke();
  rect(ground.position.x, ground.position.y, 200, 10)



}

// A function to draw ellipses over the detected keypoints
function drawBalls() {
  // Loop through all the poses detected
  // for (let i = 0; i < poses.length; i++) {
  // For each pose detected, loop through all the keypoints
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let leftEyePoint = pose.keypoints.find(keypoint => keypoint.part === 'leftEye');
      let rightEyePoint = pose.keypoints.find(keypoint => keypoint.part === 'rightEye');
      // measure distance between eyes
      let d = int(dist(leftEyePoint.position.x, leftEyePoint.position.y, rightEyePoint.position.x, rightEyePoint.position.y));

      let rightWrist = pose.keypoints.find(keypoint => keypoint.part === 'rightWrist');
      let leftWrist = pose.keypoints.find(keypoint => keypoint.part === 'leftWrist');

      let keypoint = pose.keypoints[j];
      let handHue = (leftWrist.position.x / width) * 360;
      let noseSize = 2 + (height - rightWrist.position.y) / 5;
      if (keypoint.score > 0.5 && (keypoint.part == "leftEye" || keypoint.part == "rightEye")) {
        circles.push(new Circle(keypoint.position.x, keypoint.position.y + d / 6, noseSize, handHue))
      }
    }
  }
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
      let noseSize = height - rightWrist.position.y;

      // draw with the nose
      // use the right hand x position for hue 
      // use the right hand y position for size
      if (keypoint.score > 0.5 && keypoint.part == "nose") {
        graphics.fill(handHue, 100, 100);
        graphics.noStroke();
        graphics.ellipse(keypoint.position.x, keypoint.position.y, noseSize);

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