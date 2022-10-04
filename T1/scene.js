import * as THREE from "three";
import { createGroundPlaneWired } from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import Player from "./player.js";
export default class MainScene extends THREE.Scene {


  plane; //Ground Plane
  player = new Player(); //Player
  paredes = []; //Walls
  obstaculo = []; // Obstacles
  keyboard = new KeyboardState();
  s=72;
  
  camera={
    holder:new THREE.Object3D(),
    camera:new THREE.OrthographicCamera(-window.innerWidth / this.s, window.innerWidth / this.s,
    window.innerHeight / this.s, window.innerHeight / -this.s, -this.s, this.s),
  }

  speed=0.1;

  //Função para adicionar elementos iniciais da cena
  initialize() {
    this.player.initialize();
    //Creating Ground Plane
    this.plane = createGroundPlaneWired(20, 20, "rgb(255,200,23)");
    this.add(this.plane);

    this.add(this.player.obj);

    //Creating Wall Objects
    this.criaParede(0, 1.5, 10);
    this.criaParede(0, 1.5, -10);
    this.criaParede(10, 1.5, 0);
    this.criaParede(-10, 1.5, 0);

    this.paredes[2].rotateY(Math.PI / 2);
    this.paredes[3].rotateY(Math.PI / 2);

    let axesHelper = new THREE.AxesHelper(12);
    this.add(axesHelper);

    //Creating Obstacles Objects

    this.criaCubo(5, .5, 1);
    this.criaCubo(-5, .5, 1);
    this.criaCubo(1, .5, -5);
    this.criaCubo(1, .5, 5);

    
    this.initializeCamera();
  }

  update() {
    
    let playerPosition = new THREE.Vector3();
    const cameraOffset = new THREE.Vector3(-10,10,10);
    
    this.player.obj.getWorldPosition(playerPosition);
    this.camera.holder.position.copy(playerPosition.add(cameraOffset));

    if (this.keyboard.pressed("W")) {
      this.player.moveForward(this.speed);
      this.player.changeAngle('north')
    };    
    if (this.keyboard.pressed("S")) {
      this.player.moveForward(this.speed)
      this.player.changeAngle("south")
    };
    if (this.keyboard.pressed("A")) {
      this.player.moveForward(this.speed)
      this.player.changeAngle("west")
    };
    if (this.keyboard.pressed("D")) {
      this.player.moveForward(this.speed)
      this.player.changeAngle("east")
    };


    this.player.update();
    this.keyboard.update();
  }

  initializeCamera(){
    const position = new THREE.Vector3(-10,10,10)

    this.camera.holder.add(this.camera.camera);
    this.camera.holder.position.copy(position);

    this.add(this.camera.holder); 
    this.camera.camera.lookAt(0,0,0);   
  }

  criaParede(x, y, z) {
    const geometry = new THREE.BoxGeometry(20, 3, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.paredes.push(cube);
    cube.position.set(x, y, z);
    this.add(cube);
  }
  criaCubo(x, y, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.obstaculo.push(cube);
    cube.position.set(x, y, z);
    this.add(cube);
  }
}
