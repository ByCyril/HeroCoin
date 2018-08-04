// Where is the circle
var x, y, x2, y2;
let featureExtractor;
let classfier;
let video;
let playState = "Not";

function setup() {
  noCanvas();
  let canvas = createCanvas(720, 400);
  canvas.parent("gameContainer");

  video = createCapture(VIDEO);
  video.parent("videoContainer");
  video.size(100, 100);

  featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  classifier = featureExtractor.classification(video, videoReady);

  // Starts in the middle
  x = width;
  y = width / 2;

  x2 = 100;
  y2 = 350;
}

function draw() {
  background(200);

  // Draw a circle
  stroke(50);
  fill(100);
  ellipse(x, y, 24, 24);

  if (playState == "Play") {
    // Jiggling randomly on the horizontal axis
    y = y + random(-1, 1);
    // Moving up at a constant speed
    x = x - 5;

    // Reset to the bottom
    if (x < 0) {
      select("#modelStatus").html("Game Over!");
      playState = "Not";
      document.getElementById("playButton").innerHTML = "Restart";
    }

    if (res == "up") {
      y2 = y2 - 2;
    } else if (res == "down") {
      y2 = y2 + 2;
    }

    ellipse(x2, y2, 50, 50);

    console.log(distance());
    if (distance() < 40) {
      x = width;
      y = random(100, 300);
    }
  }
}

function distance() {
  var d = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
  return d;
}

function videoReady() {
  select("#videoStatus").html("Camera ready!");
}

function modelReady() {
  select("#modelStatus").html("MobileNet is loaded!");
}

function classify() {
  classifier.classify(gotResults);
}

function trainUp() {
  classifier.addImage("up");
  let val = document.getElementById("upCount").textContent;
  let i = parseInt(val) + 1;
  document.getElementById("upCount").innerHTML = i;
}

function trainDown() {
  classifier.addImage("down");
  let value = document.getElementById("downCount").textContent;
  let i = parseInt(value) + 1;
  console.log(i);
  document.getElementById("downCount").innerHTML = i;
}

function train() {
  classifier.train(function(lossValue) {
    if (lossValue) {
      loss = lossValue;
      select("#loss").html("Loss: " + loss);
    } else {
      select("#loss").html("Done Training! Final Loss: " + loss);
    }
  });
}

function play() {
  playState = "Play";
  x = width;
  y = width / 2;

  x2 = 100;
  y2 = 350;
  select("#modelStatus").html("MobileNet is loaded!");
  document.getElementById("playButton").innerHTML = "Play";
}

function prep() {
  classifier.classify(gotResults);
}
var res;

function gotResults(error, results) {
  //   select("#result").html(results);
  res = results;
  classify();
}
