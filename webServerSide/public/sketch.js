let value = 0;
let button;
let mouseVal = 0;
var socket;
let valueRcv = 0;
let permissionGranted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let url = 'https://oper.digital';
  console.log("connecting",url);
  socket = io.connect(url, {path: "/applause/socket.io"});


  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function'){
    // ios 13 deviceShaken
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
          //show permission dialog only first time
          let button = createButton("click to allow acces to sensors");
          button.style("font-size", "24px");
          button.center();
          button.mousePressed( requestAccess );
      })
      .then(() => {
        // on any subsequent visits
        permissionGranted = true;
      })
  } else {
    // non ios 13 device
    permissionGranted = true;
  }

}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted'){
        permissionGranted = true;
      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);

    this.remove();
}

function draw() {
    background(255-value, value, 0);

    // display variables
    fill(0);
    textSize(25);
    text("Shake Me!", 15, 50);
    text("Click Me! ", 15, 80);

    // textSize(15);
    // text("Permission granted iOS " + permissionGranted, 15, 550);

    textSize(25);
    text("Applause-O-Meter: " + int(100*value/255) + " %", 5, 450);
    textSize(48);
    fill(255,0,0);
    text("Applaus!!", 25, 200);

    // Send that object to the socket
    if (value > 5){
      socket.emit('applause',value);
    }

    if (value > 2){
      value = value - 1;
    }

}

function deviceShaken() {
  value = value + 3;
  if (value > 255) {
    value = 255;
  }
}

function mousePressed() {
  value = value + 35;
  if (value >= 260) {
    value = 260;
  }
}
