import * as THREE from 'three';
import { Vector3 } from '../build/three.module.js';
import { degreesToRadians, radiansToDegrees  } from '../libs/util/util.js';

export default class Player{
    //Mesh
    hitbox;
    obj;

    //Character State
    state;

    //Control Variables
    rotationAxis = new THREE.Vector3(0,1,0);
    stepAngle;
    targetAngle = Math.PI/4;
    angle;

    //Constants
    speed=.1;

    //Inputs
    keyboardState;
    directions = ["W","A","S","D"];

    constructor(keyboard){
        this.keyboardState = keyboard;
        this.state         = "Idle";
        this.obj           = new THREE.Group();
        this.initialize();
    }

    initialize(){
        const hitboxConfig = {
            material: new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" }),
            geometry: new THREE.CylinderGeometry(.5, .5, 2),
        };
        const frontConfig = {
            material: new THREE.MeshBasicMaterial({ color: "rgb(230,255,0)" }),
            geometry: new THREE.SphereGeometry(.2),
        };

        this.hitbox = new THREE.Mesh(hitboxConfig.geometry, hitboxConfig.material);
        const front = new THREE.Mesh(frontConfig.geometry, frontConfig.material)
        front.position.set(0.5,1,0)

        this.obj.add(front);
        this.obj.add(this.hitbox);

        this.angle = this.obj.rotation.y;
        this.walkDirection= new THREE.Vector3(1,0,0)

        this.obj.position.set(0,1,0);

        const axesHelper = new THREE.AxesHelper(5)
        this.obj.add(axesHelper);
    }

    update(delta){
        const keysPressed = this.directions.filter(direction=>{
            return this.keyboardState.pressed(direction);
        });

        if(keysPressed.length>0){
            this.state = "Walk";
            this.rotating = true;
            this.stepAngle = this.calculateInterpolation(keysPressed);
            if(this.stepAngle < Math.PI/90 && this.stepAngle > -Math.PI/90){
                this.obj.rotation.y = this.targetAngle;
                this.rotating = false;
            }
            this.obj.rotation.y+=this.stepAngle;            
        }
        else{
            this.state = "Idle";
        }

        if(this.state === "Walk"){
            this.obj.translateX(this.speed)
        }
    }
    moveForward(speed){
    }
    calculateInterpolation(keysPressed){
        let targetDirection = 0;
        let diff = 0;
        let step;

        if(keysPressed.includes("W")){
            targetDirection = Math.PI/4;
            if(keysPressed.includes("A")) targetDirection      += Math.PI/8; 
            else if(keysPressed.includes("D")) targetDirection -= Math.PI/8;
                                          
        }
        else if(keysPressed.includes("S")){
            targetDirection = (5*Math.PI)/4;
            if(keysPressed.includes("A"))      targetDirection -= Math.PI/8;
            else if(keysPressed.includes("D")) targetDirection += Math.PI/8; 
        }
        else if(keysPressed.includes("A")) targetDirection = 3*Math.PI/4;
        else if(keysPressed.includes("D")) targetDirection = -Math.PI/4;
        
        this.targetAngle = targetDirection;
        this.angle = this.obj.rotation.y;
        diff = this.targetAngle-this.angle;

        if(Math.abs(diff) > Math.PI){
            diff = -((2*Math.PI - Math.abs(diff)) * diff/Math.abs(diff));
        }

        step = diff/2

        return step;       
    }
}