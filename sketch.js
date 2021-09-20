// VARIÁVEL/ESCOPO GLOBAL
var trex, trex_correndo, trex_morreu;
var solo, soloinvisivel, imagemdosolo;
 
var nuvem, imagemdanuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao = 0;

var recomeco;
var imglol;
var gObstaculo, gNuvem;

var JOGANDO = 0;
var DERROTA = 1;
var estadoJogo = JOGANDO;

var colisao, pulo, pointcheck;

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_morreu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  recomeco = loadImage("restart.png");
  imglol = loadImage("gameOver.png"); 
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  colisao = loadSound("die.mp3")
  pulo = loadSound("jump.mp3")
  pointcheck = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
 
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("morreu" , trex_morreu);
  trex.scale = 0.5;
  
  trex.setCollider("rectangle",0,0,100,100);
  //trex.debug = true;
  
  lol = createSprite(300,100,20,50);
  lol.addImage(imglol);
  lol.scale = 0;
  
  lul = createSprite(300,140,20,50);
  lul.addImage(recomeco);
  lul.scale = 0;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  // CONCATENAR
  // console.log("Oi" + 5);
  
  // criar grupos de obstáculos e nuvens
  gObstaculo = new Group();
  gNuvem = new Group();
  
  // VARIÁVEL/ESCOPO LOCAL
  // var escorpiao = "AMOGUS";
  // console.log(escorpiao);
}

function draw() {
  background(180);
  
  text("Pontuação: "+ pontuacao, 450,40);
  
  if(estadoJogo == JOGANDO) {
    solo.velocityX = -(6 + pontuacao/100);
    pontuacao = pontuacao + Math.round(frameRate()/60);
    trex.changeAnimation("running", trex_correndo);
    lul.scale = 0;
    lol.scale = 0;
    
    if ( pontuacao % 400 === 0 && pontuacao>0) {
      pointcheck.play();
    }
    gerarNuvens();
    gerarObstaculos();
    
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -13;
      pulo.play();
    }
    
    if(gObstaculo.isTouching(trex)&& trex.y >= 160) {
      // trex.velocityY = -13;
      // pulo.play();
      estadoJogo = DERROTA;
      colisao.play();
      gObstaculo.lifetime = 300;
      gNuvem.lifetime = 200;
    }
  }
  else if (estadoJogo == DERROTA) {
    solo.velocityX = 0;
    
    trex.changeAnimation("morreu", trex_morreu);
    
    gObstaculo.setVelocityXEach(0);
    gNuvem.setVelocityXEach(0);
    
    lol.scale = 1;
    lul.scale = 0.5;
    
  }
    
  // gravidade show show
  trex.velocityY = trex.velocityY + 0.8;

  if (solo.x < 0){
    solo.x = solo.width/2;
  }

  // mousePressedOver
  if(mousePressedOver(lul)||keyDown("enter")&&estadoJogo == DERROTA ) {
    reset();
  }
  
  
  
  
  
  
  trex.collide(soloinvisivel);
  
  drawSprites();
}

// reset()
// destroyEach()

function reset(){
  estadoJogo = JOGANDO;
  gObstaculo.destroyEach();
  gNuvem.destroyEach();
  pontuacao = 0
}

function gerarObstaculos(){
  if (frameCount % 50 === 0){
    var obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX = -(6 + pontuacao/100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;
      case 2: obstaculo.addImage(obstaculo2);
        break;
      case 3: obstaculo.addImage(obstaculo3);
        break;
      case 4: obstaculo.addImage(obstaculo4);
        break;
      case 5: obstaculo.addImage(obstaculo5);
        break;
      case 6: obstaculo.addImage(obstaculo6);
        break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo           
    obstaculo.scale = 0.5;
    
   //adicione cada obstáculo ao grupo
   gObstaculo.add(obstaculo);
  }
}

function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    
    nuvem.scale = 0.5;
    nuvem.velocityX = -(3 + pontuacao/100);
    nuvem.lifetime = 210;
    
    gNuvem.add(nuvem);
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
  }
}