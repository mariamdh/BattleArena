import { Component } from '../core/Component.js';

export class Team extends Component {
  constructor(faction = 'neutral') {
    super();
    this.faction = faction;
  }
}