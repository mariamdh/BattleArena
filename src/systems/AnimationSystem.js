import { Assets, Texture } from 'pixi.js';

export class AnimationSystem {
    constructor(entities) {
        this.entities = entities;
    }

    update(delta) {
        for (let entity of this.entities.values()) {
            if (!entity.hasComponent('AnimationController')) continue;
            if (!entity.sprite) continue;

            const animCtrl = entity.getComponent('AnimationController');
            const animTeam = entity.getComponent('Team');
            if (animCtrl.state !== animCtrl.previousState) {
                const frames = [];
                let animVals = this.getAnimName(animCtrl.state);
                const animName = animCtrl.spriteName+"_"+animVals[0];
                animCtrl.speed = animVals[1];
                animCtrl.loop = animVals[2];
                let idleLength = Assets.get(animTeam.faction).animations[animName].length;
                for(let x=0; x<idleLength; x++){
                    const val = x.toString().padStart(3, '0');
                    frames.push(Texture.from(animName+"_"+val+".png"));
                }
                entity.sprite.textures = frames;
                entity.sprite.animationSpeed = animCtrl.speed;
                entity.sprite.loop = animCtrl.loop;
                entity.sprite.play();
                animCtrl.previousState = animCtrl.state;
            }
        }
    }

    getAnimName(state) {
        switch (state) {
            case 'walk': return ['Walking',0.5,true];
            case 'throw': return ['Throwing',0.5,false];
            case 'die': return ['Dying',0.5,false];
            case 'slash': return ['Slashing',0.5,false];
            case 'idle':
            default: return ['Idle',0.2,true];
        }
    }
}
