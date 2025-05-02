export class MovementSystem {
    constructor(entities) {
        this.entities = entities;
    }
    update(delta) {
        for (let entity of this.entities.values()) {
            if (entity.hasComponent("Position") && entity.hasComponent("Velocity")) {
                const pos = entity.getComponent('Position');
                const vel = entity.getComponent('Velocity');
                const team = entity.getComponent("Team");
                pos.x += vel.vx * delta.deltaTime;
                pos.y += vel.vy * delta.deltaTime;
                entity.container.x = pos.x;
                entity.container.y = pos.y;
            }
        }
    }
}