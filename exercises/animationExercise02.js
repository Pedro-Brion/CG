import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initDefaultSpotlight,
        initCamera,
        createGroundPlane,
        onWindowResize} from "../libs/util/util.js";

let scene    = new THREE.Scene();    // Create main scene
let renderer = initRenderer();    // View function in util/utils
let light    = initDefaultSpotlight(scene, new THREE.Vector3(7.0, 7.0, 7.0)); 
let camera   = initCamera(new THREE.Vector3(3.6, 4.6, 8.2)); // Init camera in this position
let trackballControls = new TrackballControls(camera, renderer.domElement );

let initialPosition1 = new THREE.Vector3(0,0.2,0);
let initialPosition2 = new THREE.Vector3(0,0.2,3);

// Show axes 

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

let groundPlane = createGroundPlane(10, 10, 40, 40); // width, height, resolutionW, resolutionH
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Create spheres
let geometry = new THREE.SphereGeometry( 0.2, 32, 16 );
let material = new THREE.MeshPhongMaterial({color:"red", shininess:"200"});

//Sphere 1
let sphere1 = new THREE.Mesh(geometry, material);
  sphere1.castShadow = true;
  sphere1.position.set(0, 0.2, 0);
scene.add(sphere1);

//Sphere 2
let sphere2 = new THREE.Mesh(geometry, material);
  sphere2.castShadow = true;
  sphere2.position.set(0, 0.2, 3);
scene.add(sphere2);

// Variables that will be used for linear interpolation
const lerpConfig1 = {
  destination: new THREE.Vector3(5,0.2,0),
  alpha: 0.01,
  move: true
}
const lerpConfig2 = {
  destination: new THREE.Vector3(5 ,0.2,3),
  alpha: 0.05,
  move: true
}

buildInterface();
render();

function reset() {
  sphere1.position.copy(initialPosition1);
  sphere2.position.copy(initialPosition2);
}

function moveSphere(sphere,speed){
  if(sphere.position.x<5){
    sphere.translateX(speed);
  }
}

function buildInterface()
{
  const controls=new function (){
    this.onReset = reset;
  }
      
  let gui = new GUI();
  let folder = gui.addFolder("Lerp Options");
    folder.open();
    folder.add(lerpConfig1, 'move', true).name("Bola1");
    folder.add(lerpConfig2, 'move', true).name("Bola2");
    folder.add(controls,'onReset',false).name("Reset")
}

function render()
{
  trackballControls.update();

  if(lerpConfig1.move) moveSphere(sphere1,0.1)
  if(lerpConfig2.move) moveSphere(sphere2,0.15);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}