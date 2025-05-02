export class Entity {
    constructor(id) {
      this.id = id;
      this.components = new Map();
    }
  
    addComponent(component) {
      this.components.set(component.constructor.name, component);
    }
  
    getComponent(name) {
      return this.components.get(name);
    }
  
    hasComponent(name) {
      return this.components.has(name);
    }
}