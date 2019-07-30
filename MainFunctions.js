const singletons = {canvas:{}}





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

  const wcMedia = createCapture(constraints,d=>{
    // debugger
  });
  wcMedia.hide()
  return wcMedia

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
  
  if(  img.pixels.length===0)return
  if(!tolerance){
    tolerance = 0.0001;

  }
  const curve = 1;
  const w = img.width
  const h = img.height
  const pixT = img.pixels

for(let y = 0 ; y < h ; y++){
  for(let x = y%2 ; x < w ; x+=2){
    
      const i = (y*w+x)*4;
      const dist = hsvDist(pixT,color,i);
      let relDist = smoothRel((1-(threshold+tolerance-dist)/(2*tolerance)),curve)
      
      const ta = dist>threshold+tolerance?255:
      Math.max(0,255*relDist);
      
      // pixT[i+3] = 255
      // pixT[i+2] = ta
      // pixT[i+1] = 0
      // pixT[i] = 0
      pixT[i+3] = ta

    }
  }
  
}

function blurAlpha(img,size){
    if(!img  || img.pixels===undefined)return
  
  if(  img.pixels.length===0)return

  
  const w = img.width
  const h = img.height
  const pixT = img.pixels

for(let  y = 1 ; y < h-1 ; y++){
  for(let x = (y%2)+1; x < w-1 ; x+=2){
    
      const i =  (y*w+    x)*4+3;
      const it = ((y-1)*w+x)*4+3;
      const ib = ((y+1)*w+x)*4+3;
      const il = ((y)*w+x-1)*4+3;
      const ir = ((y)*w+x+1)*4+3;
      const ta = (pixT[it] + pixT[ib] + pixT[ir] + pixT[il])/4
      
      // pixT[i-3] = ta
      // pixT[i-2] = 0
      // pixT[i-1] = 0
      // pixT[i] = 255
      pixT[i] = ta

    }
  }

}


function getColorUnderMouseClick(e,greenScreenMedia){
  const canvas = singletons.canvas
  
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
    greenScreenMedia.pixels[loc + 0],
    greenScreenMedia.pixels[loc + 1],
    greenScreenMedia.pixels[loc + 2],
    ]
    return c;
}

