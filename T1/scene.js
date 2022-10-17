import * as THREE from "three";
import { createGroundPlaneWired } from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import Player from "./player.js";

import { degreesToRadians, radiansToDegrees  } from '../libs/util/util.js';

export default class MainScene extends THREE.Scene {

  plane; //Ground Plane
  player; //Player
  paredes = []; //Walls
  keyboard = new KeyboardState();
  s=90;  
  clock = new THREE.Clock();

  obstaclesHitbox = []; // Obstacles
  obstaclesObj = [];
  floor = [];

  cameraOffset = new THREE.Vector3(-20,20,20)

  //Infos
  display = document.querySelector(".display");

  controls = {
    w: document.querySelector(".w"),
    s: document.querySelector(".s"),
    a: document.querySelector(".a"),
    d: document.querySelector(".d"),
  }
  
  camera={
    holder:new THREE.Object3D(),
    cameraOrto:new THREE.OrthographicCamera(-window.innerWidth / this.s, window.innerWidth / this.s,
    window.innerHeight / this.s, window.innerHeight / -this.s, 0.1, 9999),
    cameraPerspective: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  }
  
  actualCamera;

  speed=0.1;

  constructor(){
    super();
    this.player = new Player(this.keyboard, this);
    this.actualCamera = this.camera.cameraOrto;
    this.initialize();
  }

  //Função para adicionar elementos iniciais da cena
  initialize() {
    //Creating Ground Plane
    this.plane = createGroundPlaneWired(250, 250, "rgb(255,200,23)");
    this.plane.position.set(0,-.2,0);
    this.add(this.plane);
    let axesHelper = new THREE.AxesHelper(20)
    // this.add(axesHelper);

    this.initializeCamera();

    this.add(this.player.obj);

    this.criaCubo(-5, .5, 1);
    this.criaCubo(5, .5, 1);
    this.criaCubo(1, .5, 5);
    this.criaCubo(5, .5, -5);
    //creating ground tiles
    for(let i= -50; i<= 50; i++){
       for(let j= -50; j<=50; j++){

        this.criaChao(i*(2.15+.05),-.05,j*(2.15+.05));
        }
     }

   
    //creating walls

     //wall 1
    for(let i= -110; i<=110;i++){
          this.criaParede(i,0.5,110);
    }
    //wall 2
    for(let i= -110; i<=110;i++){
      this.criaParede(i,0.5,-110);
    }
    //wall 3
    for(let i= -110; i<=110;i++){
      this.criaParede(110,0.5,i);
    }
    //wall 4
    for(let i= -110; i<=110;i++){
      this.criaParede(-110,0.5,i);
    }
  }

  update() {
    let delta = this.clock.getDelta();
    
    let playerPosition = new THREE.Vector3();
    const cameraOffset = this.cameraOffset;
    
    this.player.obj.getWorldPosition(playerPosition);
    this.camera.holder.position.copy(playerPosition.add(cameraOffset));

    for(let control of Object.keys(this.controls)){
      if (this.keyboard.pressed(control.toUpperCase()))
        this.controls[control].style.color="red";
      else  
      this.controls[control].style.color="white";
    }
    
    if (this.keyboard.pressed("C")){      
      if(this.actualCamera == this.camera.cameraOrto) this.actualCamera = this.camera.cameraPerspective
      else this.actualCamera = this.camera.cameraOrto;
    } 

    this.player.update(delta, this.obstaclesHitbox);
    this.keyboard.update();
    this.updateDisplay();
  }

  initializeCamera(){
    const position = this.cameraOffset;

    this.camera.holder.add(this.camera.cameraOrto);
    this.camera.holder.add(this.camera.cameraPerspective);
    this.camera.holder.position.copy(position);

    this.add(this.camera.holder); 
    this.camera.cameraOrto.lookAt(0,0,0);   
    this.camera.cameraPerspective.lookAt(0,0,0);   
  }

  getCamera(){
    return this.actualCamera;
  }

  updateDisplay(){        
    this.display.innerHTML=
    `      State: ${this.player.state}
      WalkingDirection: ${JSON.stringify(this.player.obj.position)}`
  }

  criaChao(x, y, z) {
    const geometry = new THREE.BoxGeometry(2.15, 0.1, 2.15);
    const material = new THREE.MeshStandardMaterial({ color: 'rgb(255,255,155)' });
    const cube = new THREE.Mesh(geometry, material);   

    cube.position.set(x, y, z);
    this.add(cube);
  }
  
  criaCubo(x, y, z) {
    const geometry = new THREE.BoxGeometry(2.15, 2.15, 2.15);
    const material = new THREE.MeshStandardMaterial({ color: 'rgb(150,150,30)' });
    const cube = new THREE.Mesh(geometry, material);   
    
    cube.castShadow = true;
    cube.position.set(x, y, z);
    
    const box = new THREE.Box3().setFromObject(cube);
    geometry.computeBoundingBox();
    box.copy(geometry.boundingBox).applyMatrix4( cube.matrixWorld );
    
    const helper = new THREE.Box3Helper( box, 0xffff00 );
    this.add(cube);

    this.obstaclesHitbox.push(box);
    this.obstaclesObj.push(cube);
  }

  criaParede(x, y, z) {
    const geometry = new THREE.BoxGeometry(2.15, 2.15, 2.15);
    const material = new THREE.MeshStandardMaterial({ color: 'rgb(150,150,30)' });
    const cube = new THREE.Mesh(geometry, material);   
    
    cube.castShadow = true;
    cube.position.set(x, y, z);
    
    const box = new THREE.Box3().setFromObject(cube);
    geometry.computeBoundingBox();
    box.copy(geometry.boundingBox).applyMatrix4( cube.matrixWorld );
    
    const helper = new THREE.Box3Helper( box, 0xffff00 );
    this.add(cube);

    this.obstaclesHitbox.push(box);
  }
}
