import * as THREE from 'three';
import { degreesToRadians } from '../libs/util/util.js';

export default class Player{
    hitbox;
    angle=degreesToRadians(0);
    targetAngle=degreesToRadians(45);
    stepAngle=0;
    turning=false;
    obj = new THREE.Object3D();
    initialize(){
        const hitboxConfig = {
            material: new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" }),
            geometry: new THREE.BoxGeometry(1, 2, 1),
        };

        this.hitbox = new THREE.Mesh(hitboxConfig.geometry, hitboxConfig.material);
        this.obj.add(this.hitbox);

        this.obj.position.set(0,1,0)

        const axesHelper = new THREE.AxesHelper(5)
        this.obj.add(axesHelper);
    }
    update(){
        if(this.angle!== this.targetAngle)
            this.angle+= this.stepAngle;
        else this.turning = false;
        this.obj.rotation.y=this.angle;
    }
    moveForward=(speed)=>{
        this.obj.translateX(speed);
    }
    changeAngle(direction){
        if(this.turning) return;

        this.turning = true;
        const map={
            north:45,
            west:135,
            south:225,
            east:315,
        }
        this.targetAngle = degreesToRadians(map[direction]) || 0;
        this.stepAngle = (this.targetAngle - this.angle)/5;
    }
}