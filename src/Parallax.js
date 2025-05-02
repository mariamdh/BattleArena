import { Assets,Sprite } from "pixi.js";

export function createParallaxLayer(app, container, factor) {
    const tex = Assets.get('background');
    const sprite = new Sprite(tex);
    const scaleX = app.screen.width / sprite.texture.width;
    const scaleY = app.screen.height / sprite.texture.height;
    sprite.scale.set(Math.min(scaleX, scaleY));
    sprite.scrollFactor = factor;
    container.addChild(sprite);
    return sprite;  
}
  
  export function setupParallaxLayers(app, container) {
    return Promise.all([
      createParallaxLayer(app, container, 0.2),
    ]);
  }