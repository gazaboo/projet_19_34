'use strict'
var button;
var slider ;
var canvas;
var transparentImg;
var colorToRemove = [255,255,0]
var thresh = 100;
var webcams;
var recorder ;

function setup() {
  canvas = setupCanvas()
  recorder = setupRecorder(canvas)
  setupWebcams((webcams)=>{
    console.log('webcams',webcams)
    const device= webcams[Object.keys(webcams)[0]] 
    transparentImg = initWebcam(device)
  })
  button = createButton('startRecording');
  button.position(19, 19);
  button.mousePressed(v=>{
    recorder.toggleRecording();
    button.html(recorder.isRecording?'stop recording':'start recording')
    
  });
  slider = createSlider(0,100,100);
  slider.position(39, 39);
  slider.input(v=>
    thresh=v.srcElement.valueAsNumber
    );
  windowResized()

}


function changeBG() {

}



function drawBG(){
  background(0)
  const fitR = fitStretched(transparentImg,canvas)
  fill(0,255,0)
  rect(fitR.left,fitR.top, fitR.width, fitR.height)
}



function draw(){
  if(transparentImg){
    drawBG();
    colorToAlpha(transparentImg,colorToRemove,thresh)
    const fitR = fitStretched(transparentImg,canvas)
    image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
  }
  
}



function mouseClicked(e){
  if(getColorUnderMouseClick(e))
    colorToRemove = getColorUnderMouseClick(e)
}

function windowResized() {
  resizeCanvas(getCanvasResW(),getCanvasResH(),false);
  canvas.canvas.style.width = ""+getWindowWidth()+"px"
  canvas.canvas.style.height = ""+getWindowHeight()+"px"
  // camera.size(windowWidth, windowHeight);
  
}

