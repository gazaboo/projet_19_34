'use strict'
var button;
var sliderThresh,sliderTol ;
var canvas;
var transparentImg;
var colorToRemove = [255,255,0]
var thresh = 100;
var webcams;
var recorder ;
var bgImg;

function setup() {
  canvas = setupCanvas()
  recorder = new MyMediaRecorder(canvas)
  setupWebcams((webcams)=>{
    console.log('webcams',webcams)
    const device= webcams[Object.keys(webcams)[0]] 
    transparentImg = initWebcam(device)
  })
  bgImg = loadImage('assets/beach.jpg')
  button = createButton('startRecording');
  
  button.mousePressed(v=>{
    recorder.toggleRecording();
    button.html(recorder.isRecording?'stop recording':'start recording')
    
  });

  sliderThresh = createSlider(0,100,100);
  sliderTol = createSlider(0,100,100);


  
  const wSize = getWindowWidth()/4
  const gap = 10
  let y = 0
  let x = 0
  const allUIs = [button,sliderThresh,sliderTol]
  const hSize = getWindowHeight()/allUIs.length
  for(const element of allUIs){
    element.position(x,y);
    element.size(wSize,hSize)
    y+=hSize+gap
  }


 

}


function changeBG() {

}



function drawBG(){
  background(0)
  const fitR = fitStretched(transparentImg,canvas)
  fill(0,255,0)
  if(bgImg){
    image(bgImg,fitR.left,fitR.top, fitR.width, fitR.height)
  }
  else{
  rect(fitR.left,fitR.top, fitR.width, fitR.height)
}
}



function draw(){
  if(transparentImg){
    drawBG();
    colorToAlpha(transparentImg,colorToRemove,sliderThresh.elt.valueAsNumber,sliderTol.elt.valueAsNumber)
    const fitR = fitStretched(transparentImg,canvas)
    image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
  }
  
}



function mouseClicked(e){
  if(getColorUnderMouseClick(e))
    colorToRemove = getColorUnderMouseClick(e)
}

function windowResized() {
  resizeCanvas(getCanvasResW(),getCanvasResH(),true);
  canvas.canvas.style.width = ""+getWindowWidth()+"px"
  canvas.canvas.style.height = ""+getWindowHeight()+"px"
  // camera.size(windowWidth, windowHeight);
  
}

