const singletons = {canvas:{},greenScreenMedia : {}}

function meanDistColor(a,b,i){
  const dr = Math.abs(a[i] - b[0])
  const dg = Math.abs(a[i+1] - b[1])
  const db = Math.abs(a[i+2] - b[2])
  return (dr+dg+db)/3
}

function normDistColor(a,b,i){
  const dr = a[i] - b[0]
  const dg = a[i+1] - b[1]
  const db = a[i+2] - b[2]
  return Math.sqrt((dr*dr+dg*dg+db*db)/3)
}

function meanC(b,i){
  return (b[i+0]+b[i+1]+b[i+2])/3
}
function stdC(b,mean,i){
  return Math.sqrt(((b[i+0] - mean)*(b[i+0] - mean) + 
                (b[i+1] - mean)*(b[i+1] - mean)+
                (b[i+2] - mean)*(b[i+2] - mean)) / 3)
}

function centerC(b,i){
  return (b[i] + 2.0*b[i+1] + 3.0*b[i+2])/6.0
}

function shapeDistColor(a,b,i){
  const meanA = meanC(a,i)
  const stdA  = stdC(a,meanA,i)
  const centerA = centerC(a,i)
  const meanB = meanC(b,0)
  const stdB  = stdC(b,meanB,0)
  const centerB = centerC(b,0)
  const stdDist = Math.max(0,Math.min(255.0,Math.abs(stdA-stdB)))
  // const nDist = normDistColor(a,b,i)
  const centerDist = Math.max(0,Math.min(255.0,Math.abs(centerA-centerB)))
  const al = 0.5
  return centerDist*al + (1-al)*stdDist
  // return centerDist*stdDist/255.0
}


function setupCanvas(){
  const canvas = createCanvas();
  // isHighRes = true;//!isMobile()
  canvas.size(getCanvasResW(),getCanvasResH())
  
  
  if(isHighRes){greenScreenMedia ={width:640, height:480};}
  else{greenScreenMedia ={width:640, height:480};}
  
  
  setSmoothedCanvas(canvas.canvas,true)

  frameRate(30);

  pixelDensity(1);
  singletons.canvas = canvas;
  window.setTimeout(()=>{ windowResized()},0)
  return canvas;

}



function setupWebcams(cb){
  navigator.mediaDevices.enumerateDevices()
  .then(devices=> {
    var num = 0
    const webcams = {}
    devices.forEach(function(device) {
      if(device.kind=="videoinput"){
        console.log(device.kind + ": " + device.label +
          " id = " + device.deviceId);
        console.log(device)
        var name =  "camera:"+num
        if (device.label){
          name = device.label
        }
        else{
          num+=1
        }
        webcams[name] = device
      }
    });
    cb(webcams);

  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}


function initWebcam(device){
  let caps =  {width:{max:640},height:{max:480}}
  // if(device.getCapabilities)
  //   {caps = device.getCapabilities() }

  const constraints = device?{
    audio:false,
    video:{
      deviceId:device.deviceId,
      width:Math.min(caps.width.max,getCanvasResW()),
      height:Math.min(caps.height.max,getCanvasResH()),
    }
  }
  : VIDEO

  singletons.greenScreenMedia = createCapture(constraints,d=>{
    // debugger
  });
  singletons.greenScreenMedia.hide()
  return singletons.greenScreenMedia

}

function _smoothRel(x,c){
  if(x<0)return 0
  if(x>1) return 1
  return 3*x*x - 2*x*x*x
}
function smoothRel(x,c){
  if(x<0)return 0
  if(x>1) return 1
  return Math.pow(x,c)
}

function colorToAlpha(img,color,threshold,tolerance){
  if(!img  || img.pixels===undefined)return
  img.loadPixels()
  if(  img.pixels.length===0)return
  if(!tolerance){
    tolerance = .5;

  }
  const curve = 1;
  const w = img.width
  const h = img.height
  const pixT = img.pixels
  for(let x = 0 ; x < w ; x++){
    for(let  y = 0 ; y < h ; y++){
      const i = (y*w+x)*4;
      const dist = shapeDistColor(pixT,color,i);
      let relDist = smoothRel((1-(threshold+tolerance-dist)/(2*tolerance)),curve)
      
      const ta = dist>threshold+tolerance?255:
      Math.max(0,255*relDist);
      
      pixT[i+3] = ta

    }
  }
  img.updatePixels();
}


function getColorUnderMouseClick(e){
  const canvas = singletons.canvas
  const greenScreenMedia = singletons.greenScreenMedia
    if(e.srcElement != singletons.canvas.canvas )//|| (mouseStart.x>0 && mouseStart.x!=mouseX))
      { return;}

  const fitR = fitStretched(greenScreenMedia,canvas)
  const mouseRelX = mouseX - fitR.left
  const mouseRelY = mouseY - fitR.top
  const iCam = Math.floor(mouseRelX*greenScreenMedia.width/fitR.width);
  const jCam = Math.floor(mouseRelY*greenScreenMedia.height/fitR.height);
  console.log(iCam,jCam,fitR)
  const loc = (jCam*greenScreenMedia.width + iCam)*4;
  // greenScreenMedia.loadPixels();
  const c = [
    singletons.greenScreenMedia.pixels[loc + 0],
    singletons.greenScreenMedia.pixels[loc + 1],
    singletons.greenScreenMedia.pixels[loc + 2],
    ]
    return c;
}