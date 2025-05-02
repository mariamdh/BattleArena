import { Component } from '../core/Component.js';

export class Position extends Component {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
    this.oldX = 0;
    this.oldY = 0;
  }
}