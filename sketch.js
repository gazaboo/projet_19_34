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
  recorder = new MyMediaRecorder(canvas)
  setupWebcams((wc)=>{
    webcams = wc;
    console.log('webcams',webcams)
    const device= webcams[Object.keys(webcams)[0]] 
    transparentImg = initWebcam(device)
  })
  
  // bgImg = loadMedia('beach.jpg')
  button = createButton('startRecording');
  
  button.mousePressed(v=>{
    recorder.toggleRecording();
    button.html(recorder.isRecording?'stop recording':'start recording')
    
  });

  sliderThresh = createSlider(0,200,100);
  sliderTol = createSlider(0,100,0);
  selBackground = createSelect()
  selForeground = createSelect()
  const medias = ["none","franck.mp4","beach.jpg","webcam:0"]

  for(const m of medias){
    selBackground.option(m)
    selForeground.option(m)
  }
  selBackground.changed((m)=>{
    bgImg = loadMedia(m.srcElement.value)
  }
    )
  selForeground.changed((m)=>{
    transparentImg = loadMedia(m.srcElement.value)
  }
    )


  
  const wSize = getWindowWidth()/3
  const gap = 10
  let y = 0
  let x = 0
  const allUIs = [button,sliderThresh,sliderTol,selBackground,selForeground]
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
  
  if(bgImg){
    fill(255)
    image(bgImg,fitR.left,fitR.top, fitR.width, fitR.height)
  }
  else{
    fill(0,255,0)
    rect(fitR.left,fitR.top, fitR.width, fitR.height)
  }
}


function loadMedia(path){
  let med;
  if(path.startsWith("webcam:")){
    const wNum = parseInt(path.substr(7))
    if(wNum<Object.keys(webcams).length){
      const device= webcams[Object.keys(webcams)[wNum]] 
      med =  initWebcam(device)
      return med
    }
    else{
      console.error('webcam num',wNum,'does not exists' )
    }
  }
  else if (path==="none"){
    return
  }
  else{
    path='assets/'+path
    if(path.endsWith(".mp4")){
     med = createVideo(path,
      ()=>{
        med.loop();
        med.volume(0);
      })
     med.hide()

   }
   else if(path.endsWith(".jpg")){
    med = loadImage(path)
  }
  else{
    console.error("extention not supported",path)
  }
  return med
}
}

function draw(){
  if(transparentImg){
    drawBG();
    transparentImg.loadPixels()
    colorToAlpha(transparentImg,colorToRemove,sliderThresh.elt.valueAsNumber,sliderTol.elt.valueAsNumber)
    blurAlpha(transparentImg,1)
    const fitR = fitStretched(transparentImg,canvas)

    transparentImg.updatePixels()
    image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
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

