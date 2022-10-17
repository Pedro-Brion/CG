import * as THREE from "three";
import MainScene from "./scene.js";

import {
  initRenderer,
  onWindowResize,
  createLightSphere,
  initDefaultBasicLight,
} from "../libs/util/util.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import { arraySlice } from "three/src/animation/animationutils.js";

let scene, renderer, light; // Initial variables
renderer = initRenderer(); // Init a basic renderer
scene = new MainScene(); // Create main scene

const camera= scene.camera.cameraOrto;

let cubes = [];

//Light
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

render();
function render() {
  requestAnimationFrame(render);
  const actualCamera = scene.getCamera();
  // console.log(actualCamera)
  
	raycaster.setFromCamera( pointer, actualCamera );

  renderer.render(scene, actualCamera); // Render scene  
  scene.update();
}

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onClick (event){  
  const intersects = raycaster.intersectObjects( scene.obstaclesObj );

  if(cubes.map(cube=>cube.obj).includes(intersects[0].object)){
    let index = cubes.map(cube=>cube.obj)
      .indexOf(intersects[0].object);
    
    cubes[index].clicked = !cubes[index].clicked;
    intersects[0].object.material.color.set( cubes[index].clicked ? 'rgb(150,95,100)' : 'rgb(150,150,30)' ) 
  }
  else{
    cubes.push({
      obj : intersects[0].object,
      clicked : true
    })
    intersects[0].object.material.color.set( 'rgb(150,95,100)' ) 
  }
  console.log(cubes.map(cube=>cube.clicked))    
}

window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'pointerdown', onClick );

window.requestAnimationFrame(render);
