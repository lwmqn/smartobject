/* eslint-env mocha */
const { expect } = require('chai')
const SmartObject = require('../index.js')

const hal = {
  led1: 'led1',
  led2: 'led2'
}

let innerHalRef
const innerHal = {
  led3: 'led3',
  led4: 'led4'
}

const smartObj1 = new SmartObject(hal)
const smartObj2 = new SmartObject(innerHal, function () {
  innerHalRef = this.hal
  this.hal.x = 0
})

smartObj1.init('test', 0, {
  r1: 1,
  r2: 2
})

const resrc2 = {
  _state: {
    state1: 'state1',
    state2: 'state2'
  },
  r1: 1,
  r2: 2
}

smartObj2.init('test', 0, resrc2)

describe('Smart Object - Hal', () => {
  describe('#smartObj1 this.hal', () => {
    it('should equal to hal', () => {
      expect(smartObj1.hal).to.be.equal(hal)
      expect(smartObj1.hal.led1).to.be.equal('led1')
      expect(smartObj1.hal.led2).to.be.equal('led2')
    })
  })

  describe('#smartObj2 this.hal', () => {
    it('should equal to innerHal', () => {
      expect(smartObj2.hal).to.be.equal(innerHalRef)
      expect(smartObj2.hal.led3).to.be.equal('led3')
      expect(smartObj2.hal.led4).to.be.equal('led4')
      expect(smartObj2.hal.x).to.be.equal(0)
    })
  })
})

describe('Smart Object Instance - Resource', () => {
  describe('#smartObj1.test instance: this.parent.hal', () => {
    it('should equal to hal', () => {
      const inst = smartObj1.findObjectInstance('test', 0)
      expect(inst.parent.hal).to.be.equal(hal)
    })

    it('r1 should equal to 1', () => {
      const inst = smartObj1.findObjectInstance('test', 0)
      expect(inst.r1).to.be.equal(1)
    })

    it('r2 should equal to 2', () => {
      const inst = smartObj1.findObjectInstance('test', 0)
      expect(inst.r2).to.be.equal(2)
    })
  })
})

describe('Smart Object Instance - _state', () => {
  describe('#smartObj2.test instance: this._state', () => {
    it('state1 should equal to state1', () => {
      const inst = smartObj2.findObjectInstance('test', 0)
      expect(inst._state.state1).to.be.equal('state1')
    })

    it('state1 should equal to state2', () => {
      const inst = smartObj2.findObjectInstance('test', 0)
      expect(inst._state.state2).to.be.equal('state2')
    })
  })
})

describe('Smart Object Instance - init then clear', () => {
  describe('#smartObj2.test instance: init', () => {
    it('state1 should equal to state1', () => {
      const inst = smartObj2.findObjectInstance('test', 0)

      smartObj2.init('test', 0, {})
      expect(inst._state.state1).to.be.equal(undefined)
    })

    it('state1 should equal to state2', () => {
      const inst = smartObj2.findObjectInstance('test', 0)

      smartObj2.init('test', 0, {})
      expect(inst._state.state2).to.be.equal(undefined)
    })
  })
})
