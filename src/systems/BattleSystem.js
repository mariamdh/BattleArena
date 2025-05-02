import { Graphics } from "pixi.js";
import { BattleArena } from "../BattleArena";
import { Globals } from "../Globals";

function waitForAnimation(sprite) {
    return new Promise(resolve => {
        // make sure we only fire once
        const handler = () => {
            sprite.onComplete = null;
            resolve();
        };
        sprite.onComplete = handler;
    });
}

export class BattleSystem {
    constructor(app,entities,backwid) {
        this.app = app;
        this.entities = entities;
        this.backwid = backwid;
        this.state = 'approach'; 
        this.collectTeams();
    }

    collectTeams(){
        this.players = [];
        this.enemy = [];
        for(let e of this.entities.values()){
            const team = e.getComponent("Team").faction;
            if (team === "player") this.players.push(e);
            else this.enemy.push(e);
        }
    }

    update(delta) {
        switch (this.state) {
            case "approach":   this.handleApproach();   break;
            //case "battle":     this.handleBattle();     break;
            case "battleEnd":  /* nothing */          break;
        }
    }

    handleApproach() {
        let allArrived = true;
        for (let p of this.players) {
            const position = p.getComponent('Position');
            const velocity = p.getComponent('Velocity');
            const animState = p.getComponent('AnimationController');
            if(animState.state == "walk"){
                if (position.x < 300) {
                    velocity.vx = 1.5; 
                    allArrived = false;
                } else {
                    position.oldX = position.x;
                    position.oldY = position.y;
                    velocity.vx = 0;
                    animState.state = "idle";
                    //playerAnimState.state = "throw";
                }
            }
        }
        for (let e of this.enemy) { 
            const position = e.getComponent('Position');
            const velocity = e.getComponent('Velocity');
            const animState = e.getComponent('AnimationController');
            if(animState.state == "walk"){
                if (position.x > this.backwid-300) {
                    velocity.vx = -1.5; 
                    allArrived = false;
                } else {
                    position.oldX = position.x;
                    position.oldY = position.y;
                    velocity.vx = 0;
                    animState.state = "idle";
                    //playerAnimState.state = "idle";
                    //this.state = "battle";
                    //console.log("Inside HAndle Approach-------------")
                }
            }
        }
        if(allArrived){
            this.state = "battle";
            this.doBattleSequence();
        }
    }

    async doBattleSequence(){
        while (this.state === "battle") {
            const aliveEnemies = this.enemy.filter(e => e.getComponent("Health").hp > 0);
            if (aliveEnemies.length <= 0) { this.state = "battleEnd"; break; }
            if (this.players.every(p => p.getComponent("Health").hp <= 0)) {
              this.state = "battleEnd"; break;
            }
      
            // Player turn
            const player = this.players[0];
            const target  = aliveEnemies[0];
            await this.playerStrike(player, target);
            if (target.getComponent("Health").hp <= 0) continue;
      
            // Enemy turn
            await this.enemyStrike(target, player);
        }
        console.log("→ Battle ended:", this.state);
    }

    async playerStrike(player, target) {
        // 1) play throw animation
        player.getComponent("AnimationController").state = "throw";
        await waitForAnimation(player.sprite);
    
        // 2) spawn projectile & await hit
        await this.launchProjectile(player, target);
    
        // 3) return player to idle
        player.getComponent("AnimationController").state = "idle";
    }

    launchProjectile(player, target) {
        return new Promise(resolve => {
            const pPos = player.getComponent("Position");
            const tPos = target.getComponent("Position");
            const proj = new Graphics()
                .circle(0, 0, 10)
                .fill(0xff0000)
            proj.position.set(pPos.x, pPos.y);
            Globals.app.stage.addChild(proj);
    
            const dx = tPos.x - pPos.x, dy = tPos.y - pPos.y;
            const len = Math.hypot(dx, dy);
            const speed = 10;
            const vx = dx/len*speed, vy = dy/len*speed;
    
            const tick = (dt) => {
                proj.x += vx*dt.deltaTime;
                proj.y += vy*dt.deltaTime;
                if (Math.hypot(proj.x - tPos.x, proj.y - tPos.y) < 10) {
                    Globals.app.ticker.remove(tick);
                    Globals.app.stage.removeChild(proj);
                    // damage
                    const hp = target.getComponent("Health");
                    hp.hp -= 50;
                    // hit flash
                    target.sprite.tint = 0xff0000;
                    setTimeout(() => target.sprite.tint = 0xffffff, 100);
                    resolve();
                }
            };
            Globals.app.ticker.add(tick);
        });
    }

    async enemyStrike(enemy, player) {
        // 1) walk up close
        enemy.getComponent("AnimationController").state = "walk";
        await this.moveEntityTo(enemy, player.getComponent("Position"), 50);
    
        // 2) play slash animation
        enemy.getComponent("AnimationController").state = "slash";
        await waitForAnimation(enemy.sprite);
    
        // 3) apply damage
        const hp = player.getComponent("Health");
        hp.hp -= 20;
        player.sprite.tint = 0xff0000;
        setTimeout(() => player.sprite.tint = 0xffffff, 100);
    
        // 4) return to position
        enemy.getComponent("AnimationController").state = "walk";
        await this.moveEntityTo(enemy, 
          { x: enemy.getComponent("Position").oldX, y: enemy.getComponent("Position").oldY },
          5
        );

        // 5) return to idle
        enemy.getComponent("AnimationController").state = "idle";
    }
    
    moveEntityTo(entity, targetPos, stopDist) {
        return new Promise(resolve => {
            const pos = entity.getComponent("Position");
            const vel = entity.getComponent("Velocity");
            const tick = (delta) => {
                const dx = targetPos.x - pos.x, dy = targetPos.y - pos.y;
                const len = Math.hypot(dx, dy), speed = 5;
                if (len < stopDist) {
                    Globals.app.ticker.remove(tick);
                    vel.vx = vel.vy = 0;
              
                    resolve();
                } else {
                    vel.vx = dx/len*speed;
                    vel.vy = dy/len*speed;
                }
            };
            Globals.app.ticker.add(tick);
        });
    }
}