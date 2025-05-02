import { Component } from '../core/Component.js';

export class AnimationController extends Component {
  constructor(initialState = 'idle',spriteName) {
    super();
    this.state = initialState;
    this.previousState = null;
    this.speed = 0;
    this.loop = false;
    this.spriteName = spriteName;
  }
}