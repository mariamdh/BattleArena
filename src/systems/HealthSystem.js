import { Graphics } from "pixi.js";

export class HealthSystem {
    constructor(entities) {
        this.entities = entities;
        this.length = 50;
    }
    update(delta) {
        for (let entity of this.entities.values()) {
            if (entity.hasComponent("Health")) {
                const pos = entity.getComponent('Health');

                let healthPerc = Math.floor(this.length*pos.hp)/100;
                const graphics = new Graphics();
                graphics.rect(-20, -entity.sprite.height/2, healthPerc, 10);
                graphics.fill(0xfeeb77);
                graphics.rect(-20, -entity.sprite.height/2, this.length, 10);
                graphics.stroke({ width: 2, color: 0xfeeb77 });
                entity.healthGraphic.clear();
                entity.healthGraphic = graphics;
                entity.container.addChild(graphics);

                if(pos.hp <= 0){
                    entity.getComponent('AnimationController').state = "die";
                }
            }
        }
    }
}