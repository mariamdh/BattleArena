import { Component } from '../core/Component.js';

export class Health extends Component {
  constructor(hp = 100) {
    super();
    this.hp = hp;
    this.maxHp = hp;
  }
}