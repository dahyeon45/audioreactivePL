let audio, amp, fft;
let binWidth;
//let pdBass, pdLowmid, pdMid, pdHighmid, pdTreble;
let bins = 128;


let subBass = [20, 80];
let bass = [80, 250]; // vocals
let lowMid = [250, 500]; // vocals
let mid = [500, 2000];// snare drum,
let highMid = [2000, 4000];
let presence = [4000, 6000];
let brilliance = [6000, 16000];

let img;
let starVertex = [];

const selectSongs = document.getElementById("select-songs");
const playbtn = document.getElementById("play-button");
const pausebtn = document.getElementById("pause-button");
const submitbtn = document.getElementById("submit");

const songsArr = ["Coldplay - Coloratura", "Cavetown - Meteor Shower", 
                "Adam Melchor - Moon in the Morning"];

var audioArr = [];
var width = window.innerWidth;
var height = window.innerHeight;

function preload(song) {
    if (!song){
        song = "Coldplay - Coloratura";
    }
    for (let i = 0; i < songsArr.length; i++){
        audioArr.push(loadSound(`audio/${songsArr[i]}.mp3`));
    }
    audio = audioArr[0];


    img = loadImage('img/icelanddark.png');
    img_2 = loadImage('img/icelanddark3.png');
}

function setup() {
    playbtn.onclick = handlePlay;
    pausebtn.onclick = handlePause;
    submitbtn.onclick = handleSubmit;
    const canvas = createCanvas(window.innerWidth, window.innerHeight);
    audio.amp(0.3);
    colorMode(HSB);

    // FFT
    fft = new p5.FFT(0.7, bins);

    /* peak Detect functions
    pdBass = new p5.PeakDetect(subBass[0], subBass[1], 0.3);
    pdBass.onPeak(bassDetected);
    */
   
    // amplitude
    amplitude = new p5.Amplitude();

    for (let i=0; i<bins; i++) {
        let x = Math.floor(random(30, width));
        let y = Math.floor(random(10, height*0.6));
        //let z = Math.floor(random(4,5.5))
        let z = 4;
        let vertex = [x, y, z];
        starVertex.push(vertex);
    }

    selectSongs.style.opacity = "0.6";
}

function draw() {
    noStroke();

    // get fft spectrum
    let spectrum = fft.analyze();

    image(img, 0, 0, width, height);

    // draw stars
    push();
    fill(56, 20, 100)
        for (let i=0; i<spectrum.length; i++) {
            let r = map(spectrum[i], 0, 120, 0, 6);
            star(starVertex[i][0], starVertex[i][1], r/4, r, starVertex[i][2]);
        }
    pop();

    image(img_2, 0, 0, width, height);
}

function handlePlay(){
    if (!audio.isPlaying()){
        setTimeout(audio.loop(), 1000);
    }
}

function handlePause(){
    if (audio.isPlaying()){
        audio.pause();
    }
}

function handleSubmit(event){
    audio.pause();
    audio.pauseTime = 0;
    audio = audioArr[event.target.previousElementSibling.value];
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;

    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}