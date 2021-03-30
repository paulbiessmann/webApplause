# webApplause
This project converts the shaking of multiple phones around the web (aka applause) into OSC data for one or several performers. 

# webServerSide
This is a websocket that receives 'applause' data from multiple web instances. 
A 'applause' is generated by opening the /public/index.html site and shaking the phone or tapping the screen.
(There are still some permission troubles with iPhone)

A performer opens instead the /public/performer.html and receives the mean of all incoming applause. 
To route this data further to a OSC-device (eg Max4Live), see following point. 

# performerSide
A performer needs to download & install node.js 
https://nodejs.org/en/download/

Then open the terminal and go to /performerSide/ 
(you can write cd and drag the folder in the terminal)

    cd  [yourPath]/node_shake/performerSide


and run the script with

    node bridge.js


if you get error messages, maybe you have to install these packages first: 

    npm install socket.io
    npm install node-osc


If bridge.js is running, open your OSC receiver like the given Max-Patch. 
The OSC-port to receive in Max is default on 3334. You can change it in the performer.html

## References
bridge.js copied from https://github.com/automata/osc-web