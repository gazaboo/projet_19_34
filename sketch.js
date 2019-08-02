'use strict'
var button;
var sliderThresh,sliderTol,selBackground,selForeground,selRes,distChk ;
var canvas;
var transparentImg;
var colorToRemove = [0,255,0]
var colorToRemove2 
var thresh = 100;
var recorder ;
var bgImg;

var allUIs;
var showUI;


function setup() {
  canvas = setupCanvas() // function to setup canvas and other stuffs hidden from student
  recorder = new MyMediaRecorder(canvas) // jelper class to record canvas
  setupWebcams(()=>{
    transparentImg = loadMedia("webcam:0",webcamLoaded)
  }) // function to initiate webcams (callback parameter called when done)
  
  // bgImg = loadMedia('beach.jpg')
  button = createButton('startRecording');
  
  button.mousePressed(v=>{
    recorder.toggleRecording();
    button.html(recorder.isRecording?'stop recording':'start recording')
    
  });
  showUI = createButton('hide')
  showUI.position(0,0)
  showUI.mousePressed(()=>{
    const wasVisible  = allUIs[0].elt.style.display !== 'none';
    if(wasVisible){showUI.html('show');allUIs.map(e=>e.hide());}
    else{showUI.html('hide');allUIs.map(e=>e.show());}
  })
  sliderThresh = createSlider(0,200,100);
  sliderTol = createSlider(0,100,0);
  selBackground = createSelect()
  selForeground = createSelect()

  const medias = ["none",
  "enquete/batiment.jpg","enquete/batiment2.jpg","enquete/nightclub.jpg","enquete/",
  "franck.mp4","tst.mp4","minions.mp4","beach.jpg","pngtest.png",
  "webcam:0","webcam:1"
  ,"meteo/accident.jpg"
  ,"meteo/accident2.jpg"
  ,"meteo/paneau.png"
  ,"meteo/attention.png"
  ,"meteo/soleil.jpg"
  ,"meteo/azkaban.jpg"
  ,"meteo/transat.jpg"
  ,"meteo/dobby.jpg"
  ,"meteo/Carte.jpg"
  ,"meteo/manif1.jpg"
  ,"lesAnges/intro.jpg"
  ,"JT/JT.jpg"]

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
    setDownscaling(selRes.value()) // can downscale resolution if needed
    if(transparentImg ){
      transparentImg = loadMedia(selForeground.value(),undefined,{width:{max:getCanvasResW()},height:{max:getCanvasResW()}})
    }
  })

  distChk = createCheckbox('dist');
  allUIs = [button,sliderThresh,sliderTol,selBackground,selForeground,selRes,distChk]
  layoutUI()




}

function webcamLoaded(){
  let w = transparentImg.width
  let h = transparentImg.height
  setTargetRes(w,h) // sets canvas resolution to webcam one (allow for bigger resolution than displayed -> better video recordings)
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

  // old code to test shader
  // colorToAlphaShader(transparentImg,colorToRemove,sliderThresh.value(),sliderTol.value())

  transparentImg.loadPixels()
  colorToAlpha(transparentImg,colorToRemove,colorToRemove2,sliderThresh.value(),sliderTol.value(),distChk.checked()?normDist:hsvDist)
  transparentImg.updatePixels()
  // slow code to smooth out alphas
  // blurAlpha(transparentImg,1)
  const fitR = fitStretched(transparentImg,canvas) // gets the best possible rectangle to drw in (needed for getColorUnderMiuseClick to work)
  image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
  
}

function draw(){
  if(transparentImg){
    drawBG();
    drawFG();
  }
  
}



function mouseClicked(e){
  let color = getColorUnderMouseClick(e,transparentImg,true) // last argument transforms a "soft" green into a flashy on
  if(color){
    if(keyIsDown(SHIFT)){colorToRemove2 = color}
    else{colorToRemove = color}
    
  }
}

function windowResized() {
  resizeCanvasToWindow()
  layoutUI()
  // camera.size(windowWidth, windowHeight);
  
}


function layoutUI(){
  // auto layout ui in column
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
