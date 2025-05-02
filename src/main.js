import { Application} from "pixi.js";
import { BattleArena } from "./BattleArena.js";

const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x000000,
});

const arena = await BattleArena.create(app);
document.body.appendChild(app.canvas);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  app.renderer.resize(w, h);
}
window.addEventListener('resize', resize);
resize();