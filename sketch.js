/* Declaration des variables necessaires au programmes */
'use strict'
p5.disableFriendlyErrors = true; // disables FES
var button;
var sliderThresh,sliderTol,selBackground,selForeground,selRes,flashyColorChk ;
var colorToRemove = [0,255,0]
var colorToRemove2 
var thresh = 100;
var bgImg;
var allUIs;
var showUI;
var canvas;
var transparentImg;
var recorder ;

/* Initialisation du programme, cette partie du code n'est exécutée qu'une seule fois */
function setup() {
  
  // Ici on définit les medias (photos + videos) que l'on va utiliser dans le programme 
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
  
  /*  Cette partie est necessaire à l'initialisation du programme, mais vous n'avez pas besoin de la comprendre aujourd'hui ;)*/
  canvas = setupCanvas() // function to setup canvas and other stuffs hidden from student
  recorder, transparentImg = otherSetups(canvas, medias); 
  /* ---------------------------------- */

  /* Vous pouvez rajouter du code en dessous */

}


/* Cette partie du code dessine sur le "canvas". La fonction draw() est exécutée en boucle */
function draw(){
  if(transparentImg){
    drawBG();
    drawFG();
  }
}


/* ------------------------------------------------------------ */
/* Quelques fonctions utiles en dessous : 
   affichage du fond, du premier plan, 
   et récupération de la couleur où on clique 
*/


/* Cette fonction dessine le "Background" => c'est à dire le fond de l'image */
function drawBG(){
  background(0);
  const fitR = fitStretched(transparentImg,canvas) ;
  if(bgImg){
    fill(255);
    image(bgImg,fitR.left,fitR.top, fitR.width, fitR.height);
  }
  else{
    fill(0,255,0);
    rect(fitR.left,fitR.top, fitR.width, fitR.height);
  }
}

/* Cette fonction dessin le "Foreground" => premier plan de l'image */
function drawFG(){
  transparentImg.loadPixels();
  colorToAlpha(transparentImg,colorToRemove,sliderThresh.value(),0,sliderTol.value());
  transparentImg.updatePixels();
  const fitR = fitStretched(transparentImg,canvas);
  image(transparentImg,fitR.left,fitR.top, fitR.width, fitR.height);
}

/* Recupération de la couleur à l'endroit où l'on clique avec la souris */
function mouseClicked(e){
  let color = getColorUnderMouseClick(e,transparentImg,flashyColorChk.checked()); 
  if(color){
    if(keyIsDown(SHIFT)){colorToRemove2 = color}
    else{colorToRemove = color}    
  }
}



