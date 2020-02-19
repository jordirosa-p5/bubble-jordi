let mida, midaAnterior;
let grupPlataformes, parets;
//let spriteSheetCamina, spriteSheetAturat;
let bobSprite, bubSprite, bombFocSprite;
let grupChans, grupTrets;
let caminaAnimation, aturatAnimation, chanAnim, bombFocAnim, tretFocAnim;
let imgBubCamina, imgBubBoca;
let midaBob = 200;
let velBob = 4;
let maxGravetat = 5;
let velGravetat = maxGravetat;
let midaPlat;
let bobATerra = false;
let chanTimeout;

function preload() {

    // specify width and height of each frame and number of frames
    let spriteSheetCamina = loadSpriteSheet('img/bob_camina.png', 16, 16, 6);
    caminaAnimation = loadAnimation(spriteSheetCamina);
    let spriteSheetAturat = loadSpriteSheet('img/bob_camina.png', 16, 16, 2);
    aturatAnimation = loadAnimation(spriteSheetAturat);

    let spriteSheetBombFoc = loadSpriteSheet('img/bombollaFoc.png', 16, 16, 3);
    bombFocAnim = loadAnimation(spriteSheetBombFoc);
    let spriteSheetTretFoc = loadSpriteSheet('img/tretFoc.png', 16, 16, 6);
    tretFocAnim = loadAnimation(spriteSheetTretFoc);


    imgBubCamina = loadImage("img/bub01.png");
    imgBubBoca = loadImage("img/bub_boca02.png");

    chanAnim = loadAnimation('img/chan1.png', 'img/chan2.png', 'img/chan3.png', 'img/chan4.png');

}

function setup() {
    //Creem el canvas quadrat de la mida que toqui
    mida = midaFinestra();
    midaAnterior = mida;
    createCanvas(mida, mida);
    grupPlataformes = new Group();
    parets = new Group();
    grupChans = new Group();
    grupTrets = new Group();

    //Creem l'sprite del Bob i les seves animacions
    bobSprite = createSprite(width - 100, 100, 16, 16);
    //bobSprite.debug = true;
    bobSprite.scale = mida / midaBob;
    let animBobAturat = bobSprite.addAnimation('aturat', aturatAnimation);
    animBobAturat.frameDelay = 50;
    let animBobCaminant = bobSprite.addAnimation('caminant', caminaAnimation);
    animBobCaminant.frameDelay = 8;
    bobSprite.dispara = false;

    bubSprite = createSprite(100, 100, 16, 16);
    bubSprite.addImage(imgBubCamina);
    bubSprite.scale = mida / midaBob;
    bubSprite.maxSpeed = velBob;
    bubSprite.potDisparar = true;

    nouChan();
    nouChan();
    nouChan();

    setTimeout(creaBombFoc, random(3000, 6000));

    //Creem el grup de plataformes
    creaPlataformes();
}

function draw() {
    //clear();
    background(255);

    if (velGravetat < maxGravetat) {
        velGravetat += velGravetat + 0.001;
    }

    bobSprite.collide(parets);

    if (!bobSprite.overlap(grupPlataformes, comprovaSaltPlat)) {
        bobSprite.setSpeed(velGravetat, 90);
        bobATerra = false;
    } else {
        bobSprite.setSpeed(0, 0);
        bobATerra = true;
    }

    bubSprite.collide(parets);
    bubSprite.collide(grupPlataformes);

    grupChans.collide(parets, canviaDireccioChan);
    grupChans.collide(grupPlataformes, canviaDireccioChan);

    if (bombFocSprite) {
        bubSprite.overlap(bombFocSprite, bubAgafaBombFoc);
    }


    grupChans.overlap(grupTrets, chanMor);


    //Comprovem tecles / moviment
    let bubMovent = false;

    if (keyIsPressed) {
        //console.log(key);
        if (keyIsDown(RIGHT_ARROW)) {
            bobSprite.changeAnimation('caminant');
            bobSprite.mirrorX(-1);
            bobSprite.addSpeed(velBob, 0);
            //        } else if (keyCode === DOWN_ARROW) {
            //            bobSprite.changeAnimation('caminant');
            //            bobSprite.addSpeed(velBob, 90);
        }
        if (keyIsDown(LEFT_ARROW)) {
            bobSprite.changeAnimation('caminant');
            bobSprite.mirrorX(1);
            bobSprite.addSpeed(velBob, 180);
        }
        if (keyIsDown(UP_ARROW) && bobATerra) {
            velGravetat = 0;
            bobSprite.changeAnimation('caminant');
            bobSprite.setSpeed(velBob * 25, 270);
        }

        if (keyIsDown(65)) { //tecla A
            bubSprite.mirrorX(1);
            bubSprite.addSpeed(velBob, 180);
            bubMovent = true;
        }
        if (keyIsDown(68)) { //tecla D
            bubSprite.mirrorX(-1);
            bubSprite.addSpeed(velBob, 0);
            bubMovent = true;
        }
        if (keyIsDown(87)) { //tecla W
            bubSprite.addSpeed(velBob, 270);
            bubMovent = true;
        }
        if (keyIsDown(83)) { //tecla S
            bubSprite.addSpeed(velBob, 90);
            bubMovent = true;
        }
        if (keyIsDown(74)) { //tecla J
            if (bubSprite.potDisparar) {
                bubSprite.potDisparar = false

                bubSprite.addImage(imgBubCamina);
                bubSprite.addImage(imgBubBoca);

                setTimeout(function () {
                    bubSprite.addImage(imgBubCamina)
                }, 300);

                setTimeout(function () {
                    bubSprite.potDisparar = true;
                }, 400);

                if (bubSprite.dispara) {
                    let tretFocSprite = createSprite(bubSprite.position.x, bubSprite.position.y, 16, 16);
                    let tretFocSpAnim = tretFocSprite.addAnimation('surtTretFoc', tretFocAnim);
                    tretFocSpAnim.frameDelay = 8;
                    tretFocSprite.scale = mida / midaBob;
                    tretFocSprite.mirrorX(bubSprite.mirrorX());
                    tretFocSprite.setCollider("rectangle");
                    tretFocSprite.life=200;
                    //tretFocSprite.debug = true;
                    if (bubSprite.mirrorX() > 0) {
                        tretFocSprite.setSpeed(10, 180);
                    } else {
                        tretFocSprite.setSpeed(10, 0);
                    }
                    grupTrets.add(tretFocSprite);
                }

            }
        }

    } else {
        bobSprite.changeAnimation('aturat');
        if (!bubMovent) {
            bubSprite.setSpeed(0, 0);
        }
    }

    //li diem a  p5.play que dibuixi tot on toqui
    drawSprites();
}

////////////////////////////////////////////////////////
function creaPlataformes() {

    grupPlataformes.removeSprites();
    parets.removeSprites();

    let altPlat = width / 32;

    //Paret d'avall de tot
    let avall = createSprite((width / 2), (height - (altPlat / 2)), width, round(altPlat));
    console.log("mida:" + mida + "   w/2:" + width / 2 + "  h:" + height);
    avall.shapeColor = color("#f7b1f5");
    grupPlataformes.add(avall);

    //Paret esquerra
    let esquerra = createSprite(round(altPlat / 2), round(height / 2), round(altPlat), height);
    esquerra.shapeColor = color("#f7b1f5");
    parets.add(esquerra);

    //Paret dreta
    let dreta = createSprite(round(width - (altPlat / 2)), round(height / 2), round(altPlat), height);
    dreta.shapeColor = color("#f7b1f5");
    parets.add(dreta);

    //Paret d'adalt de tot
    let adalt = createSprite(round(width / 2), round(altPlat / 2), width, round(altPlat));
    adalt.shapeColor = color("#f7b1f5");
    parets.add(adalt);

    //plataforma a 2/3
    let dosTers = createSprite(round(width / 2), round(height * 0.75), round(width * 0.5), round(altPlat));
    dosTers.shapeColor = color("#f7b1f5");
    grupPlataformes.add(dosTers);

}


function comprovaSaltPlat(jugador, plataf) {
    if (jugador.position.y > plataf.position.y) {
        jugador.position.y -= jugador.height;
        jugador.collide(plataf);
    }
}

function canviaDireccioChan(chanSp) {
    let novaDireccio = random(0, 360);
    chanSp.setSpeed(random(1, velBob), novaDireccio);
    if (novaDireccio > 270 || novaDireccio < 90) {
        chanSp.mirrorX(-1);
    } else {
        chanSp.mirrorX(1);
    }
    clearInterval(chanTimeout);
    chanTimeout = setTimeout(canviaDireccioChan, random(1000, 3000), chanSp);
}

function creaBombFoc() {
    bombFocSprite = createSprite(random(50, width - 50), random(50, width - 50), 16, 16);
    let bombollaEsperant = bombFocSprite.addAnimation('bomb', bombFocAnim);
    bombollaEsperant.frameDelay = 8;
    bombFocSprite.scale = mida / midaBob;
}

function bubAgafaBombFoc(bub, bomb) {
    bomb.remove();
    bub.dispara = true;
}

function nouChan() {
//    let chanSprite = createSprite(windowWidth / 2, windowHeight / 2, 16, 16);
    let chanSprite = createSprite(random(windowWidth), random(windowHeight), 16, 16);
    let chanSpriteCaminant = chanSprite.addAnimation('chanCaminant', chanAnim);
    chanSpriteCaminant.frameDelay = 8;
    chanSprite.scale = mida / midaBob;
    chanSprite.maxSpeed = velBob;
    //chanSprite.debug = true;
    canviaDireccioChan(chanSprite);
    grupChans.add(chanSprite);

    setTimeout(nouChan, random(4000, 20000))
}

function chanMor(chanSp, tretSp) {
    chanSp.remove();
    console.log(grupChans.length);
}

function midaFinestra() {
    let midaFinal;
    if (window.innerWidth >= window.innerHeight) {
        midaFinal = window.innerHeight;
    } else {
        midaFinal = window.innerWidth;
    }
    return midaFinal;
}

function windowResized() {
    midaAnterior = mida;
    mida = midaFinestra();
    bobSprite.position.x = bobSprite.position.x * mida / midaAnterior;
    bobSprite.position.y = bobSprite.position.y * mida / midaAnterior;
    bubSprite.position.x = bubSprite.position.x * mida / midaAnterior;
    bubSprite.position.y = bubSprite.position.y * mida / midaAnterior;
    grupChans.forEach(function (chanSprite) {
        chanSprite.position.x = chanSprite.position.x * mida / midaAnterior;
        chanSprite.position.y = chanSprite.position.y * mida / midaAnterior;
        chanSprite.scale = mida / midaBob;
    });
    resizeCanvas(mida, mida);
    this.camera.position.x = width / 2;
    this.camera.position.y = height / 2;
    bobSprite.scale = mida / midaBob;
    bubSprite.scale = mida / midaBob;
    creaPlataformes();
}
