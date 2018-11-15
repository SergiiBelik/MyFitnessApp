const EventEmitter = require('events')

class MyEventEmitterObject extends EventEmitter {
    constructor() {
        super();
        document.getElementById('breakfast').addEventListener('click', () => this.emit('button', 'breakfast' ))
        document.getElementById('lunch').addEventListener('click', () => this.emit('button', 'lunch' ))
        document.getElementById('dinner').addEventListener('click', () => this.emit('button', 'dinner' ))
    }
}

let myEmitter = new MyEventEmitterObject()
myEmitter.on('button', (what) => {
  console.log(`you clicked ${what} button`)
})