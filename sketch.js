'use strict'
var button;
var sliderThresh,sliderTol,selBackground,selForeground,selRes ;
var canvas;
var transparentImg;
var colorToRemove = [255,255,0]
var thresh = 100;
var recorder ;
var bgImg;

var allUIs;
var showUI;


function setup() {
  canvas = setupCanvas()
  recorder = new MyMediaRecorder(canvas)
  setupWebcams(()=>{
    transparentImg = loadMedia("webcam:0",webcamLoaded)
  })
  
  // bgImg = loadMedia('beach.jpg')
  button = createButton('startRecording');
  
  button.mousePressed(v=>{
    recorder.toggleRecording();
    button.html(recorder.isRecording?'stop recording':'start recording')
    
  });
  showUI = createButton('show')
  showUI.position(100,100)
  sliderThresh = createSlider(0,200,100);
  sliderTol = createSlider(0,100,0);
  selBackground = createSelect()
  selForeground = createSelect()

  const medias = ["none","franck.mp4","minions.mp4","beach.jpg","pngtest.png","webcam:0","webcam:1"]

  for(const m of medias){
    selBackground.option(m)
    selForeground.option(m)
  }
  selBackground.changed((m)=>{
    bgImg = loadMedia(selBackground.value())
  })

  selForeground.changed((m)=>{
    transparentImg = loadMedia(selForeground.value(),webcamLoaded)

  })

  selRes = createSlider(0.1,1,1,0.1)
  selRes.changed(()=>{
    setDownscaling(selRes.value())
    if(transparentImg ){
      transparentImg = loadMedia(selForeground.value(),undefined,{width:{max:getCanvasResW()},height:{max:getCanvasResW()}})
      // const vt = transparentImg.stream.getVideoTracks()[0];
      // if(vt){
      //   debugger
      //   vt.applyConstraints({width:getCanvasResW(),height:getCanvasResH() }).then(()=>{
      //     debugger
      //   })
      // }

    }
  })

  allUIs = [button,sliderThresh,sliderTol,selBackground,selForeground,selRes]
  layoutUI()




}

function webcamLoaded(){
  let w = transparentImg.width
  let h = transparentImg.height

  setTargetRes(w,h)
  resizeCanvasToWindow()

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


  // colorToAlphaShader(transparentImg,colorToRemove,sliderThresh.value(),sliderTol.value())

  transparentImg.loadPixels()
  colorToAlpha(transparentImg,colorToRemove,sliderThresh.value(),sliderTol.value())
  transparentImg.updatePixels()

  // blurAlpha(transparentImg,1)
  const fitR = fitStretched(transparentImg,canvas)
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
  resizeCanvasToWindow()
  layoutUI()
  // camera.size(windowWidth, windowHeight);
  
}


function layoutUI(){
  const wSize = getWindowWidth()/3
  const gap = 10
  let y = 0
  let x = 0
  
  const hSize = getWindowHeight()/allUIs.length
  for(const element of allUIs){
    element.position(x,y);
    element.size(wSize,hSize-gap)
    y+=hSize
  }
}
