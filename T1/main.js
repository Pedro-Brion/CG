import * as THREE from "three";
import MainScene from "./scene.js";

import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  onWindowResize,
  createGroundPlaneWired,
  getMaxSize,
} from "../libs/util/util.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";

let scene, renderer, camera, light; // Initial variables
scene = new MainScene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

//

// const modelName = './assets/armor.glb'

// var loader = new GLTFLoader();
// loader.load(
//   modelName,
//   function (gltf) {
//     var obj = gltf.scene;
//     obj.traverse(function (child) {
//       if (child) {
//         child.castShadow = true;
//       }
//     });
//     obj.traverse(function (node) {
//       if (node.material) node.material.side = THREE.DoubleSide;
//     });

//     // Only fix the position of the centered object
//     // The man around will have a different geometric transformation

//     obj = normalizeAndRescale(obj, 2);
//     obj = fixPosition(obj);
   
//     scene.add(obj);

//     // Create animationMixer and push it in the array of mixers
//     var mixerLocal = new THREE.AnimationMixer(obj);
//     mixerLocal.clipAction(gltf.animations[0]).play();
//     mixer.push(mixerLocal);
//   },
//   onProgress,
//   onError
// );

// function normalizeAndRescale(obj, newScale)
// {
//   var scale = getMaxSize(obj); // Available in 'utils.js'
//   obj.scale.set(newScale * (1.0/scale),
//                 newScale * (1.0/scale),
//                 newScale * (1.0/scale));
//   return obj;
// }

// function fixPosition(obj)
// {
//   // Fix position of the object over the ground plane
//   var box = new THREE.Box3().setFromObject( obj );
//   if(box.min.y > 0)
//     obj.translateY(-box.min.y);
//   else
//     obj.translateY(-1*box.min.y);
//   return obj;
// }

// function onError() { };

// function onProgress ( xhr, model ) {
//     if ( xhr.lengthComputable ) {
//       var percentComplete = xhr.loaded / xhr.total * 100;
//     }
// }

scene.initialize();

render();
function render() {
  scene.update()
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
