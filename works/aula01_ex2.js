import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const normalMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(cubeGeometry, normalMaterial);
// position the cube
cube.position.set(0.0, 0.0, 2.0);
// add the cube to the scene
scene.add(cube);

//creating a sphere
const sphereGeometry= new THREE.SphereGeometry(2,30,30);
const sphere= new THREE.Mesh(sphereGeometry, normalMaterial);
sphere.position.set(5,0,2)
scene.add(sphere)

//creating a cylinder
const cylinderGeometry= new THREE.CylinderGeometry(1.5,1.5,10,20);
const cylinder= new THREE.Mesh(cylinderGeometry, normalMaterial);
cylinder.position.set(-5,0,1.5)
scene.add(cylinder)

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}