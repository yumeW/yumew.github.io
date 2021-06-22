let socket = io();

let newText = document.getElementById ('newText');

socket.on ('welcome', (data)=> {
    console.log (data)
// newText.innerHTML = "This id is from a socket.io connection for this page " +data ;
 //newText.innerHTML = "Number of observers" + socket.client.conn.server.clientsCount ;

})

socket.on ('observers', (data)=> {
  console.log (data);
  // newText.innerHTML = "This id is from a socket.io connection for this page " +data ;
newText.innerHTML = data + " Observer."  ;

})









// Finds eyes from webcam and draws a representation of them on the canvas
// Starting point: https://editor.p5js.org/kylemcdonald/sketches/BJOcyD9hm 

//colour
let colors = []; //array of colors used for random functioning
let numOfColors = 7; //number of colors used at once
//webcam
let capture = null;
let tracker = null;
let positions = null;
let w = 0, h = 0;


function setup (){

  w = windowWidth;
  h = windowHeight;
  let canvas = createCanvas (w,h);
  canvas.position (0,0)
  canvas.style('z-index','-2')
  canvas.parent ('p5Canvas'); 
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  frameRate(10);
// background(0,169,169);
//clm tracker initialise 
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
//socket.io new draweing from server 
//node server.js 
socket.on ('eyeTrail' , newDrawing);

//iris colours array
   colorMode(RGB);
   for (let i = 0; i < numOfColors; i++) {
       let newColor = color(random(255), random(255), random(255), 90);
       colors.push(newColor);
     }
  
}

function newDrawing (data) {
//iris 

noStroke ();
randomSeed (180)
fill (random(colors));
ellipse (data.eye1[0], data.eye1[1],30,25);
ellipse(data.eye2[0],data.eye2[1],30,25)
//iris 
fill(255,90)
ellipse (data.eye1[0], data.eye1[1],10,10);
ellipse(data.eye2[0],data.eye2[1],10,10)
//outline 
strokeWeight(0.5)
stroke(255,90)
noFill()
arc(data.eye1[0], data.eye1[1]+10, 45, 40, -PI, 0, CHORD);  // upper half of circle
arc(data.eye2[0], data.eye2[1]+10, 45, 40, -PI, 0, CHORD);  // upper half of circle



}


function draw() {
  // Flip the canvas so that we get a mirror image
	translate(w, 0);
  scale(-1.0, 1.0);
  // Uncomment the line below to see the webcam image (and no trail)
  //image(capture, 0, 0, w, h);
  positions = tracker.getCurrentPosition();

  if (positions.length > 0) {

    // Eye points from clmtrackr:
    // https://www.auduno.com/clmtrackr/docs/reference.html
   
   let eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    }
    let eye2 = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    }
    var data = {
  
      eye1: [getPoint(27).x, getPoint(27).y],
      eye2: [getPoint(32).x, getPoint(32).y]
      }

    const irisColor = fill (random(colors))
    randomSeed  (99); 
    drawEyeOne (eye1, irisColor);
    drawEyeOne (eye2, irisColor);
    
    //data 
    //console.log (data) 
    socket.emit ('eyeTrail', data);
    //console.log ("afterEmit");
    console.log (eye1.outline )
    
}
   
  }

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function drawEyeOne  (eye, irisColor) {
  noFill();
  stroke(255);
  strokeWeight (1)
  drawEyeOutline(eye);
  
  const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  const irisSize = irisRadius * 2;
  noStroke();
  fill(random(colors));
  ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  
  const pupilSize = irisSize / 3;
  fill(255);
  ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
}

function drawEyeOutline(eye) {
	beginShape();
  const firstPoint = eye.outline[0];
  eye.outline.forEach((p, i) => {
    curveVertex(p.x, p.y);
    if (i === 0) {
      // Duplicate the initial point (see curveVertex documentation)
      curveVertex(firstPoint.x, firstPoint.y);
    }
    if (i === eye.outline.length - 1) {
      // Close the curve and duplicate the closing point
      curveVertex(firstPoint.x, firstPoint.y);
      curveVertex(firstPoint.x, firstPoint.y);
    }
  });
  endShape();
}


function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  //background(200);
}