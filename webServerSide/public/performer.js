let value = 0;
let button;
let mouseVal = 0;
var socket;
var valueRcv = -1;
var socketOsc;
var port = 3334;
let input;
var numClientsRcv = -1;
var numClients = -1;
var activeClients = -1;
var activeClientsRcv = -1;
var maxClients = 0;
var maxActive = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // connect to webserver, get audience data:
  let url = 'https://oper.digital';
  socket = io.connect(url, {path: "/applause/socket.io"});
  console.log("perf",url);

  // say "I'm a performer"
  socket.emit('performer', 1);

  socket.on('applauseRcv',
    function(valueRcv) {
      console.log("Got: " + valueRcv);
      value = valueRcv;
    }
  );

  socket.on('numClientsRcv',
    function(numClientsRcv) {
      numClients = numClientsRcv;
      if (numClients > maxClients){
        maxClients = numClients;
      }
   }
  );

  socket.on('activeClientsRcv',
    function(activeClientsRcv) {
      activeClients = activeClientsRcv;
      if(activeClients > maxActive){
        maxActive = activeClients;
      }
   }
  );

  // connect to local OSC server on the performer machines:
  socketOsc = io.connect('http://localhost:8081');
  socketOsc.on('connect', function() {
        // sends to socket.io server the host/port of oscServer
        // and oscClient
        socketOsc.emit('config',
            {
                server: {
                    port: 3333,
                    host: '127.0.0.1'
                },
                client: {
                    port: port,
                    host: '127.0.0.1'
                }
            }
        );

    });


    input = createInput('');
    input.position(15, 110);
    input.size(50);
    let portButton = createButton("change OSC port");
    //portButton.style("font-size", "20px");
    portButton.position(70, 110);

    portButton.mousePressed(changeUdpPort);


}

function changeUdpPort() {
    var inputValue = int(input.value());
    if(inputValue > 0 && inputValue < 65536){
        port = inputValue;
        console.log('Change Udp Port to: ', port);

        socketOsc.emit('config',
          {
              server: {
                  port: 3333,
                  host: '127.0.0.1'
              },
              client: {
                  port: port,
                  host: '127.0.0.1'
              }
          }
      );
  }else {

  }

}



function draw() {
    background(0, value, 255-value);

    if (value > 2){
        value = value - 2;
        // send incoming applause value to OSC device
        if (value)
        socketOsc.emit('message', '/applause ' + int(value) );
    }

      // display variables
    fill(255);
    textSize(25);
    text("Performer", 15, 50);
    text("udp port: " + port, 15, 80 );
    textSize(20);
    text("clients:         " + numClients + "            active: " + activeClients, 15, 390);
    text("maxClients: " + maxClients + "      maxActive: " + maxActive, 15, 410);
    textSize(20);
    text("Applaus empfangen: " + int(100*value/255) + " %", 5, 450);
    textSize(48);
    fill(0,0,255);
    text("Applaus!!", 25, 200);

}

function deviceShaken() {
  value = value + 3;
  if (value >= 255) {
    value = 255;
  }
}

function mousePressed() {
  value = value + 15;
  if (value > 255) {
    value = 255;
  }
}
