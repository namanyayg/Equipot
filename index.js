var canvas = document.querySelector('canvas')
var ctx = canvas.getContext("2d")

// Dimensions of thingy
const width = window.innerWidth;
const height = window.innerHeight/2;
// const width = 500;
// const height = 500;

// box dimension = sqrt(area/number of boxes)
const area = width * height;
const numBoxes = 500;
const D = Math.round(Math.sqrt(area/numBoxes));

const nRows = Math.round(height/D);
const nColumns = Math.round(width/D);

const midRow = Math.floor(nRows/2);
const midCol = Math.floor(nColumns/2);

const k = 9e9;

// Init Canvas
function initCanvas() {
  canvas.width = width;
  canvas.height = height;
}

// Plot grid
function plotGrid() {
  ctx.beginPath();
  // Create vertical lines
  for ( var i = 0; i < height; i += D ) {
    ctx.moveTo(0, i + .5);
    ctx.lineTo(width, i + .5);
  }
  // Create horizontal lines
  for ( var i = 0; i < width; i += D ) {
    ctx.moveTo(i + .5, 0);
    ctx.lineTo(i + .5, height);
  }

  // TODO: Show axis

  ctx.strokeStyle = "whitesmoke";
  ctx.stroke();
  ctx.closePath();
}

var points = [];

// Definition of a point charge
function Point(charge, x, y) {
  this.charge = charge || 0;
  this.x = x ? midCol + x : midCol;
  this.y = y ? midRow - y : midRow;
  // Origin is half the screen

  // Add to points array
  points.push(this);

  this.render();

  // TODO: +ve -ve have different colors
  // TODO: Show text for charge value
}

Point.prototype.X = function() {
  return this.x - midCol;
}

Point.prototype.Y = function() {
  return -this.y + midRow;
}

Point.prototype.render = function() {
  // Make a circle on the said point
  ctx.beginPath();
  ctx.arc(this.x * D, this.y * D, D/4, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = "tomato";
  ctx.fill();
}


// Figure out the equipotential!

function dist (a, b) {
  return Math.sqrt( Math.pow(Math.abs(b.y - a.y), 2) + Math.pow(Math.abs(b.x - a.x), 2));
}

function dist2 (a, b) {
  var diffX = b.x - a.x;
  var diffY = b.y - a.y;
  diffX = diffX * diffX;
  diffY = diffY * diffY;
  return diffX + diffY;
}

function fuzz(test, val, fuzziness) {
  return ( test > val - fuzziness && test < val + fuzziness );
};

function equi () {
  var E = 0;
  for ( var i = 0; i < width; i++ ) {
    for ( var j = 0; j < height; j++ ) {
      E = 0;
      points.forEach(function(point) {
        var r2 = dist2({x: point.x, y: point.y}, { x: i/D, y: j/D }) 
        E += (k * point.charge)/r2;
      });
      // if ( E >= .93 && E <= 1 ) {
      if ( fuzz(E, 0, 1e9) ) {
        // TODO: Input user value for the three parameters
        ctx.fillStyle = "rgba(128,128,128,.3)";
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }
}


// Init
function init () {
  initCanvas();
  plotGrid();

  var p = new Point(2, 0, 0);
  var p2 = new Point(-1, 2, 0);
  // TODO: Allow users to create points by inputting charge, x, y

  equi();
}

init();