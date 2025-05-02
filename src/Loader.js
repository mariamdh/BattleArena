import { Assets } from 'pixi.js';
import { assets } from './core/Assets';

export async function loadAssets() {
    try{
        Assets.addBundle("main", assets);
        await Assets.loadBundle("main");
        console.log("Assets loaded");
        //console.log(Assets.cache);
    }catch(error){
        console.error(error);
    }
  
}