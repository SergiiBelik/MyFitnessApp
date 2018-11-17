const EventEmitter = require('events')

class MyEventEmitterObject extends EventEmitter {
    constructor() {
        super();
        document.getElementById('yesterday').addEventListener('click', () => this.emit('yesterday', 'yesterday' ))
        document.getElementById('today').addEventListener('click', () => this.emit('today', 'today' ))
    }
}

let myEmitter = new MyEventEmitterObject()

myEmitter.on('yesterday', (what) => {
  console.log(`you clicked ${what} button`)
})

myEmitter.on('today', (what) => {
  console.log(`you clicked ${what} button`)
})