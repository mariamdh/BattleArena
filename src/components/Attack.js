import { Component } from '../core/Component.js';

export class Attack extends Component {
  constructor(range = 100, cooldown = 1) {
    super();
    this.range = range;
    this.cooldown = cooldown;
    this.lastAttack = 0;
  }
}