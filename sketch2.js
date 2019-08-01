'use strict'
var button;
var sliderThresh,sliderTol,selBackground,selForeground ;
var canvas;
var transparentImg;
var colorToRemove = [255,255,0]
var thresh = 100;
var webcams;
var recorder ;
var bgImg;
var webcams;

function setup() {
  canvas = setupCanvas()
  
  
  var s = createSlider(0,10,0);
  console.log(s.value())
  debugger
  selBackground = createSelect()
  
  const medias = ["none","franck.mp4","beach.jpg","webcam:0"]

  for(const m of medias){
    selBackground.option(m)
    
  }
  selBackground.changed((m)=>{
    bgImg = loadMedia(m.srcElement.value)
  }
  )



  
  // const wSize = getWindowWidth()/3
  // const gap = 10
  // let y = 0
  // let x = 0
  // const allUIs = [button,sliderThresh,sliderTol,selBackground,selForeground]
  // const hSize = getWindowHeight()/allUIs.length
  // for(const element of allUIs){
  //   element.position(x,y);
  //   element.size(wSize,hSize)
  //   y+=hSize+gap
  // }




}




function drawBG(){
  background(0)
  const fitR = fitStretched(transparentImg,canvas)
  
  if(bgImg){
    fill(255)
    image(bgImg,fitR.left,fitR.top, fitR.width, fitR.height)
  }
  else{
    fill(0,255,0)
    rect(fitR.left,fitR.top, fitR.width, fitR.height)
  }
}

function drawFG(){
  
  transparentImg.loadPixels()
  colorToAlpha(transparentImg,colorToRemove,sliderThresh.elt.valueAsNumber,sliderTol.elt.valueAsNumber)
  blurAlpha(transparentImg,1)
  const fitR = fitStretched(transparentImg,canvas)

  transparentImg.updatePixels()
  image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
  
}

function draw(){
  if(transparentImg){
    drawBG();
    
    drawFG();
  }
  
}



function mouseClicked(e){
  const color = getColorUnderMouseClick(e,transparentImg)
  if(color)
    colorToRemove = color
}

function windowResized() {
  resizeCanvas(getCanvasResW(),getCanvasResH(),true);
  canvas.canvas.style.width = ""+getWindowWidth()+"px"
  canvas.canvas.style.height = ""+getWindowHeight()+"px"
  // camera.size(windowWidth, windowHeight);
  
}

