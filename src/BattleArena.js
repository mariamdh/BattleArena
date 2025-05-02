import { Container,Graphics } from "pixi.js";
import { setupParallaxLayers } from './Parallax.js';
import { World } from "./World.js";
import { loadAssets } from "./Loader.js";
import { Globals } from "./Globals.js";
import { AnimationSystem } from "./systems/AnimationSystem.js";
import { BattleSystem } from "./systems/BattleSystem.js";
import { MovementSystem } from "./systems/MovementSystem.js";
import { HealthSystem } from "./systems/HealthSystem.js";

export class BattleArena {
    constructor(app) {
        this.app = app;
        this.timer = 0;
        this.readyToBattle = false;
        console.log('Inside BattleArena');
    }

    static async create(app) {
        let arena = new BattleArena(app);
        Globals.screen.width = app.screen.width;
        Globals.screen.height = app.screen.height;
        Globals.app = app;
        await arena.init();
        return arena;
    }
    async init() {
        await loadAssets();
        this.ScreenSetup();
        
       
        this.app.ticker.add(delta => this.update(delta));
        console.log(this.backgroundContainer.width);
    }

    ScreenSetup(){
        this.backgroundContainer = new Container();
        this.gameContainer = new Container();
        this.app.stage.addChild(this.backgroundContainer);
        this.app.stage.addChild(this.gameContainer);  

        this.parallaxLayers = setupParallaxLayers(this.app, this.backgroundContainer);

        this.world = new World();
        this.addEntities();

        this.animationSystem = new AnimationSystem(this.world.entities);
        this.battleSystem = new BattleSystem(this.app,this.world.entities,this.backgroundContainer.width);
        this.movementSystem = new MovementSystem(this.world.entities);
        this.healthSystem = new HealthSystem(this.world.entities);
        
    }

    update(delta){
        if (!this.readyToBattle) {
            this.timer += delta.deltaTime / 60;
            if (this.timer >= 2) {
                this.readyToBattle = true;
                this.world.spriteStatus("walk");
            }
        }else{
            this.animationSystem.update(delta);
            this.battleSystem.update(delta);
            this.movementSystem.update(delta);
            this.healthSystem.update(delta);
        }
        //this.updateCamera();
    }

    /*updateCamera(){
        for (let layer of this.parallaxLayers) {
            layer.tilePosition.x += 1*layer.scrollFactor;
        }
    }*/

    addEntities(){
        console.log()
        this.SetUpEntities(-50,340,"player","throw",1);
        //this.SetUpEntities(Globals.screen.width+50, 380, 'enemy', 'patrol',-1);
        this.SetUpEntities(this.backgroundContainer.width+50, 380, 'enemy', 'patrol',-1);
    }

    SetUpEntities(x,y,playerType,playerAction,flip){
        const entity = this.world.createEntity(x,y,playerType,playerAction);
        let pos = entity.getComponent('Position');
        entity.container.x = pos.x;
        entity.container.y = pos.y;
        entity.sprite.anchor.set(0.5);
        entity.sprite.scale.x = flip;

        const graphics = new Graphics();
        graphics.rect(-20, -entity.sprite.height/2, 50, 10);
        graphics.fill(0xfeeb77);
        graphics.rect(-20, -entity.sprite.height/2, 50, 10);
        graphics.stroke({ width: 2, color: 0xfeeb77 });
        entity.healthGraphic = graphics;
        entity.container.addChild(graphics);
        entity.container.addChild(entity.sprite);
        this.gameContainer.addChild(entity.container);
    }
}

