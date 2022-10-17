import * as THREE from 'three';
import { FBXLoader } from '../build/jsm/loaders/FBXLoader.js';

export default class Player{

    scene;

    //Mesh
    hitbox;
    box;
    obj;
    mixer;
    animations= {};

    //Character State
    state;

    //Control Variables
    rotationAxis = new THREE.Vector3(0,1,0);
    stepAngle;
    targetAngle = Math.PI/4;
    angle;
    direction;

    //Constants
    speed=10;
    //Inputs
    keyboardState;
    directions = ["W","A","S","D"];

    constructor(keyboard, scene){
        this.keyboardState = keyboard;
        this.state         = "Idle";
        this.obj           = new THREE.Object3D();
        this.scene = scene;
        this.initialize();
    }

    initialize(){
        this.loadModel();
        const hitboxConfig = {
            material: new THREE.MeshBasicMaterial({ color: "rgb(255,50,70)" }),
            geometry: new THREE.CylinderGeometry(.5, .5, 4),
        };
        hitboxConfig.material.wireframe = true;

        this.hitbox = new THREE.Mesh(hitboxConfig.geometry, hitboxConfig.material);
        this.hitbox.position.set(0,2,0);
        
        this.box = new THREE.Box3().setFromObject(this.hitbox);
        this.angle = this.obj.rotation.y;
    }

    update(delta, obstacles){             
        if(this.mixer) this.mixer.update(delta);
        const keysPressed = this.directions.filter(direction=>{
            return this.keyboardState.pressed(direction);
        });
        this.handleState(keysPressed)

        if(this.state != 'Idle'){
            this.stepAngle = this.calculateInterpolation(keysPressed);
            if(this.stepAngle < Math.PI/90 && this.stepAngle > -Math.PI/90){
                this.obj.rotation.y = this.targetAngle;
                this.rotating = false;
            }
            else
                this.obj.rotation.y+=this.stepAngle;            
        }

        if(this.state === "Walk"){
            let colided = false;
            let colidedObj=null;
            let moveX;
            let moveZ;

            colided = obstacles.some(obstacle =>{
                if(this.box.intersectsBox(obstacle)){
                    colidedObj = obstacle
                    return true;
                }
                return false;
            });
            
            const matrix = new THREE.Matrix4();
            matrix.extractRotation( this.obj.matrix );

            this.direction = new THREE.Vector3( 0, 0, 1 );
            this.direction.applyMatrix4(matrix);

            this.direction.y = 0;
            this.direction.normalize();

            moveX = this.direction.x * this.speed * delta;
            moveZ =  this.direction.z * this.speed * delta;

            if(colided){
                moveX = 0;
                moveZ = 0;
                let playerCenter = new THREE.Vector3();
                let objCenter = new THREE.Vector3();
                let offset = new THREE.Vector3();

                this.box.getCenter(playerCenter);
                colidedObj.getCenter(objCenter);                
                offset.copy(playerCenter);

                offset.sub(objCenter);
                
                offset.y= 0
                offset.normalize();
                
                moveX = offset.x * this.speed * delta;
                moveZ = offset.y * this.speed * delta;
            }


            this.obj.position.x += moveX;
            this.obj.position.z += moveZ;
            
            this.box.translate(new THREE.Vector3(moveX,0,moveZ))
            
        }
    }

    handleState(keysPressed){
        const toPlay = keysPressed.length>0 ? 'Walk' : 'Idle'
        
        if (toPlay !== this.state){
            const next = this.animations[toPlay]
            const current = this.animations[this.state]

            current.fadeOut(0.2)
            next.reset().fadeIn(0.2).play()

            this.state = toPlay;
        }
    }

    calculateInterpolation(keysPressed){
        
        let targetDirection = 0;
        let diff = 0;
        let step;

        if(keysPressed.includes("W")){
            targetDirection = 3*Math.PI/4;
            if(keysPressed.includes("A")) targetDirection      += Math.PI/8; 
            else if(keysPressed.includes("D")) targetDirection -= Math.PI/8;
                                          
        }
        else if(keysPressed.includes("S")){
            targetDirection = -Math.PI/4;
            if(keysPressed.includes("A"))      targetDirection -= Math.PI/8;
            else if(keysPressed.includes("D")) targetDirection += Math.PI/8; 
        }
        else if(keysPressed.includes("A")) targetDirection = 5*Math.PI/4;
        else if(keysPressed.includes("D")) targetDirection = Math.PI/4;
        
        this.targetAngle = targetDirection;
        this.angle = this.obj.rotation.y;

        diff = this.targetAngle-this.angle;

        if(Math.abs(diff) > Math.PI){
            diff = -((2*Math.PI - Math.abs(diff)) * diff/Math.abs(diff)); //Menor rotação
        }

        step = diff/4

        return step;       
    }

    loadModel(){
        const loader = new FBXLoader()
        loader.setPath('./assets/character/')

        loader.load('Idle.fbx', (fbx)=>{
            fbx.scale.setScalar(0.02);
            fbx.traverse(c => {
                c.castShadow =c.isMesh;
                c.receiveShadow =c.isMesh;
              });
            this.mixer = new THREE.AnimationMixer( fbx );
            
            const action = this.mixer.clipAction( fbx.animations[ 0 ] );
            this.animations['Idle'] = action

            action.play();
            this.obj.add(fbx);

            const loader = new FBXLoader()
            loader.setPath('./assets/character/')

            loader.load('Walking.fbx', (fbx)=>{
                this.animations['Walk'] = this.mixer.clipAction (fbx.animations[0])
            })
        })
    }
}