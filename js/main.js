let audio, amp, fft
let binWidth
let pdBass, pdLowmid, pdMid, pdHighmid, pdTreble
let bgColor = 0
let bins = 256

let subBass = [20, 80]
let bass = [80, 250] // vocals
let lowMid = [250, 500] // vocals
let mid = [500, 2000] // snare drum,
let highMid = [2000, 4000]
let presence = [4000, 6000]
let brilliance = [6000, 16000]

let img
let starVertex = []

let title = 'Cavetown - Meteor Shower'

function preload() {
    audio = loadSound(`audio/${title}.mp3`)
    img = loadImage('img/iceland5.png')
    img_2 = loadImage('img/iceland3.png')
}

function setup() {
    const canvas = createCanvas(1600, 900)
    canvas.mouseClicked(togglePlay)
    audio.amp(0.3)
    colorMode(HSB)


    // FFT
    fft = new p5.FFT(0.7, bins)

    // peak Detect functions
    pdBass = new p5.PeakDetect(subBass[0], subBass[1], 0.3)
    pdBass.onPeak(bassDetected)

    // amplitude
    amplitude = new p5.Amplitude()

    for (let i=0; i<bins; i++) {
        let x = Math.floor(random(30, 1590))
        let y = Math.floor(random(10, 800))
        //let z = Math.floor(random(4,5.5))
        let z = 4
        let vertex = [x, y, z]
        starVertex.push(vertex)
    }
}

function draw() {
    background(50)
    noStroke()

    // get fft spectrum
    let spectrum = fft.analyze()    
    let level = amplitude.getLevel()

    // get centroid frequency
    //let freq = fft.getCentroid()
    let t = map(level, 0, 0.4, 200, 230)
    let b = map(level, 0, 0.4, 15, 33)

    //const topColor = color(225, 67, 44)
    //const bottomColor = color(225, 25, 55)

    // background gradient
    //push()

    //for(let y = 0; y < height; y++) {
    //    const lineColor = lerpColor(topColor, bottomColor, y / 1080);
    //    stroke(lineColor);
    //    line(0, y, 1920, y);
    //}    

    //pop()


    //for (let i=0; i<spectrum.length; i++) {
    //    let x = map(i, 0, spectrum.length, 0, width);
    //    let h = -height + map(spectrum[i], 0, 255, height, 0);
    //    rect(x, height, width/spectrum.length, h);
    //}

    //star(500, 500, 5, 25, 4)

    image(img, 0, 0)

    // draw stars
    push()
    fill(56, 20, 100)
        for (let i=0; i<spectrum.length; i++) {
            let r = map(spectrum[i], 0, 255, 0, 8);
            let x = starVertex[i][0]
            let y = starVertex[i][1]
            star(starVertex[i][0], starVertex[i][1], r/4, r, starVertex[i][2])
        }
    //filter(BLUR,1)
    pop()

    pdBass.update(fft)
    // get amplitude

    image(img_2, 0, 0)
    

    // title
    //push()
    //    textSize(32);
    //    fill(147, 41, 75);
    //    textAlign(CENTER);
    //    textFont('IBM Plex Serif');
    //    text(title, 0, 70, 1920);
    //pop()
    //rect(500, 500, k, k)
    // drawing objects
    //sphere(0, 0, k)

}

function peakDetected() {
    console.log('Peak Detected')
    bgColor=color(random(255))
}

function bassDetected() {
    // bgColor=color(random(255))
}

function togglePlay() {
    if (audio.isPlaying()){
        audio.pause()
    } else {
        setTimeout(audio.loop(), 1000)
    }
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