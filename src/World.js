import {Entity} from "./core/Entity";
import { AnimatedSprite,Assets,Texture,Container } from "pixi.js";
import { Globals } from "./Globals.js";
import { Position } from './components/Position.js';
import { Health } from './components/Health.js';
import { Velocity } from './components/Velocity.js';
import { Team } from './components/Team.js';
import { Attack } from './components/Attack.js';
import {AnimationController} from './components/AnimationController.js';

export class World{
    constructor() {
        this.entities = new Map();
        this.entityid = 0;
        this.systems = [];
    }

    createEntity(x,y,team,aiType){
        const entity = new Entity(this.entityid);
        this.entities.set(this.entityid,entity);
        const sprite = this.setSprite();
        const container = new Container();
        this.setEntityComponents(entity,x,y,team,aiType);
        entity.sprite = sprite;
        entity.container = container;
        this.entityid++;

        return entity;
    }

    setEntityComponents(entity,x,y,team,aiType){
        entity.addComponent(new Position(x, y));
        entity.addComponent(new Velocity(0,0));
        entity.addComponent(new Health(100));
        entity.addComponent(new Team(team));
        entity.addComponent(new Attack(aiType));
        entity.addComponent(new AnimationController("idle",Globals.entity[team][0]));
    }
        
    setSprite(){
        const frames = [];
        let idleLength = Assets.get("player").animations["0_Valkyrie_Idle"].length;
        for(let x=0; x<idleLength; x++){
            const val = x.toString().padStart(3, '0');
            frames.push(Texture.from("0_Valkyrie_Idle_"+val+".png"));
        }
        const sprite = new AnimatedSprite(frames);
        return sprite;
    }

    spriteStatus(status){
        for (let entity of this.entities.values()) {
            const animCtrl = entity.getComponent('AnimationController');
            animCtrl.state = status;
        }
    }
}