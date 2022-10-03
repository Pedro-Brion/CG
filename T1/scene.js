import * as THREE from "three";
import { createGroundPlaneWired } from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
export default class MainScene extends THREE.Scene {


  plane; //Ground Plane
  player; //Player
  paredes = []; //Walls
  obstaculo = []; // Obstacles
  keyboard = new KeyboardState();
  
  camera={
    holder:null,
    camera:null,
  }

  speed=0.1;

  //Função para adicionar elementos iniciais da cena
  initialize() {
    //Creating Ground Plane
    this.plane = createGroundPlaneWired(20, 20, "rgb(255,200,23)");
    this.add(this.plane);

    //Creating Player
    const hitboxConfig = {
      material: new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" }),
      geometry: new THREE.BoxGeometry(1, 2, 1),
    };
    this.player = new THREE.Mesh(hitboxConfig.geometry, hitboxConfig.material);
    this.player.position.set(0, 1, 0);

    this.add(this.player);

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
  }

  update() {
    this.keyboard.update();
    if (this.keyboard.pressed("A")) this.player.translateX(-this.speed); //Velocidade está dobrando na diagonal
    if (this.keyboard.pressed("D")) this.player.translateX(this.speed);
    if (this.keyboard.pressed("W")) this.player.translateZ(-this.speed);
    if (this.keyboard.pressed("S")) this.player.translateZ(this.speed);
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
