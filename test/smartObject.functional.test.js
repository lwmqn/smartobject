/* eslint-env mocha */
const _ = require('busyman')
const { expect } = require('chai')
const SmartObject = require('../index.js')

const smartObj = new SmartObject()

describe('Smart Object - Functional Check', () => {
  describe('#.init()', () => {
    it('should add a Resource', () => {
      smartObj.init(3303, 0, { 5700: 30 })
      expect(smartObj.temperature[0].sensorValue).to.be.eql(30)
    })

    it('should clear all the Resources', () => {
      smartObj.init(3303, 0, { 5701: 'c' })
      expect(smartObj.temperature[0].sensorValue).to.be.eql(undefined)
      expect(smartObj.temperature[0].units).to.be.eql('c')
    })

    it('should return id and add a Resource when rsc include function', () => {
      smartObj.init(3303, 0, {
        5700: {
          read (cb) {
            cb(null, 25)
          }
        }
      })

      expect(typeof smartObj.temperature[0].sensorValue.read).to.be.eql('function')
      expect(smartObj.temperature[0].sensorValue._isCb).to.be.equal(true)
    })

    it('should add a Multi-Resource', () => {
      smartObj.init('multiResource', 0, {
        5700: {
          0: 'x',
          1: 'y',
          2: 'z'
        }
      })

      expect(smartObj.multiResource[0][5700][0]).to.be.eql('x')
      expect(smartObj.multiResource[0][5700]._isCb).to.be.equal(false)
    })
  })

  describe('#.create()', () => {
    it('should create an Object Instance', () => {
      smartObj.create(3303, 1)
      expect(smartObj.temperature[1].oid).to.be.eql('temperature')
      expect(smartObj.temperature[1].iid).to.be.eql(1)
    })
  })

  describe('#.remove()', () => {
    it('should remove an Object Instance', () => {
      smartObj.init(3303, 2, {
        5700: 20
      })
      expect(smartObj.temperature[2].sensorValue).to.be.eql(20)

      smartObj.remove(3303, 2)
      expect(smartObj.temperature[2]).to.be.eql(undefined)
      expect(smartObj.findObjectInstance(3303, 2)).to.be.eql(undefined)
    })
  })

  describe('#.objectList()', () => {
    it('should return objectList', () => {
      expect(smartObj.objectList()).to.be.eql([{ oid: 3303, iid: [0, 1] }, { oid: 'multiResource', iid: [0] }])
    })
  })

  describe('#.has()', () => {
    it('should return true if target is exist', () => {
      expect(smartObj.has(3303, 0, 5700)).to.be.equal(true)
      expect(smartObj.has('3303', '0', '5700')).to.be.equal(true)
      expect(smartObj.has('temperature', 0, 'sensorValue')).to.be.equal(true)
    })

    it('should return false if target is not exist', () => {
      expect(smartObj.has(3303, 0, 5702)).to.be.equal(false)
      expect(smartObj.has(3303, 0, 5703)).to.be.equal(false)
      expect(smartObj.has(3304, 0, 5700)).to.be.equal(false)
      expect(smartObj.has(3304, 0, 5701)).to.be.equal(false)
    })
  })

  describe('#.findObject()', () => {
    it('should return object if target is exist', () => {
      expect(smartObj.findObject(3303)).to.be.eql(smartObj.temperature)
      expect(smartObj.findObject('3303')).to.be.eql(smartObj.temperature)
      expect(smartObj.findObject('temperature')).to.be.eql(smartObj.temperature)
    })

    it('should return undefined if target is not exist', () => {
      expect(smartObj.findObject(3304)).to.be.eql(undefined)
      expect(smartObj.findObject(3305)).to.be.eql(undefined)
      expect(smartObj.findObject('3304')).to.be.eql(undefined)
      expect(smartObj.findObject('temper')).to.be.eql(undefined)
    })
  })

  describe('#.findObjectInstance()', () => {
    it('should return object instance if target is exist', () => {
      expect(smartObj.findObjectInstance(3303, 0)).to.be.eql(smartObj.temperature[0])
      expect(smartObj.findObjectInstance(3303, 1)).to.be.eql(smartObj.temperature[1])
      expect(smartObj.findObjectInstance('3303', '0')).to.be.eql(smartObj.temperature[0])
      expect(smartObj.findObjectInstance('temperature', 0)).to.be.eql(smartObj.temperature[0])
    })

    it('should return undefined if target is not exist', () => {
      expect(smartObj.findObjectInstance(3304, 0)).to.be.eql(undefined)
      expect(smartObj.findObjectInstance(3305, 0)).to.be.eql(undefined)
      expect(smartObj.findObjectInstance('3304', '1')).to.be.eql(undefined)
      expect(smartObj.findObjectInstance('temper', '2')).to.be.eql(undefined)
    })
  })

  describe('#.get()', () => {
    it('should return rsc if target is exist', () => {
      expect(typeof smartObj.get(3303, 0, 5700).read).to.be.eql('function')
      expect(typeof smartObj.get('3303', '0', '5700').read).to.be.eql('function')
      expect(typeof smartObj.get('temperature', 0, 'sensorValue').read).to.be.eql('function')
    })

    it('should return undefined if target is not exist', () => {
      expect(smartObj.get(3303, 0, 5702)).to.be.eql(undefined)
      expect(smartObj.get(3303, 0, 5703)).to.be.eql(undefined)
    })
  })

  describe('#.set()', () => {
    it('should return true and add a Resource', () => {
      expect(smartObj.set(3303, 1, 5701, 'f')).to.be.equal(true)
      expect(smartObj.get(3303, 1, 5701)).to.be.eql('f')
    })

    it('should return false if target is not exist', () => {
      expect(smartObj.set(3303, 2, 5702, 'xx')).to.be.equal(false)
      expect(smartObj.set(3304, 0, 5703, 'xx')).to.be.equal(false)
    })
  })

  describe('#.dumpSync()', () => {
    it('should return whole smartObj', () => {
      const obj = {
        temperature: {
          0: {
            sensorValue: {
              read: '_read_'
            }
          },
          1: {
            units: 'f'
          }
        },
        multiResource: {
          0: {
            5700: {
              0: 'x',
              1: 'y',
              2: 'z'
            }
          }
        }
      }

      expect(smartObj.dumpSync()).to.be.eql(obj)
    })

    it('should return object', () => {
      const obj = {
        0: {
          sensorValue: {
            read: '_read_'
          }
        },
        1: {
          units: 'f'
        }
      }

      expect(smartObj.dumpSync(3303)).to.be.eql(obj)
    })

    it('should return object instance', () => {
      const obj = {
        sensorValue: {
          read: '_read_'
        }
      }

      expect(smartObj.dumpSync(3303, 0)).to.be.eql(obj)
    })
  })

  describe('#.dump()', () => {
    it('should get whole smartObj', (done) => {
      const obj = {
        temperature: {
          0: {
            sensorValue: 20,
            units: 'c',
            5702: '_unreadable_',
            5703: 'x',
            5704: '_exec_'
          },
          1: {
            units: 'f'
          }
        },
        multiResource: {
          0: {
            5700: {
              0: 'x',
              1: 'y',
              2: 'z'
            }
          }
        }
      }

      smartObj.init(3303, 0, {
        sensorValue: 20,
        units: {
          read (cb) {
            cb(null, 'c')
          }
        },
        5702: {
          write (val, cb) {
            cb(null, val)
          }
        },
        5703: {
          read (cb) {
            cb(null, 'x')
          },
          write (val, cb) {
            cb(null, val)
          }
        },
        5704: {
          exec (val, cb) {
            if (val === 20) cb(null, true)
            else cb(null, false)
          }
        }
      })

      smartObj.dump((err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })

    it('should get an object', (done) => {
      const obj = {
        0: {
          sensorValue: 20,
          units: 'c',
          5702: '_unreadable_',
          5703: 'x',
          5704: '_exec_'
        },
        1: {
          units: 'f'
        }
      }

      smartObj.dump(3303, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })

    it('should get an object instance', (done) => {
      const obj = {
        sensorValue: 20,
        units: 'c',
        5702: '_unreadable_',
        5703: 'x',
        5704: '_exec_'
      }

      smartObj.dump(3303, 0, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })

    it('should get an object instance whit restrict is true', (done) => {
      const obj = {
        instActivePwr: 20,
        minMeaActivePwr: 'c',
        activePwrCal: '_unreadable_',
        currCal: 'x',
        resetCumulEnergy: '_exec_'
      }

      smartObj.init(3305, 0, {
        5800: 20,
        5801: 'c',
        5806: 'd',
        5821: 'x',
        5822: {
          exec (val, cb) {
            if (val === 20) cb(null, true)
            else cb(null, false)
          }
        }
      })

      smartObj.dump(3305, 0, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })

    it('should return error', (done) => {
      smartObj.init(3200, 0, {})
      smartObj.init(3200, 1, {})
      smartObj.dIn[0].dInState = function () {}
      smartObj.dIn[0].counter = function () {}
      smartObj.dIn[1].dInState = function () {}
      smartObj.dIn[1].counter = function () {}

      smartObj.dump(3200, (err, result) => {
        if (err) done()
      })
    })

    it('should return error', (done) => {
      smartObj.init(3201, 0, {})
      smartObj.init(3201, 1, {})
      smartObj.dOut[0].dOutState = function () {}
      smartObj.dOut[0].dOutpolarity = function () {}
      smartObj.dOut[1].dOutState = function () {}
      smartObj.dOut[1].dOutpolarity = function () {}

      smartObj.dump((err, result) => {
        if (err) done()
      })
    })
  })

  describe('#.read()', () => {
    it('should pass the read value when Resources is a primitive', (done) => {
      smartObj.read(3303, 0, 5700, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 20) done()
      })
    })

    it('should pass the read value when Resources is readable', (done) => {
      smartObj.read(3303, 0, 5701, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'c') done()
      })
    })

    it('should pass the read value when Resources is readable and writable', (done) => {
      smartObj.read(3303, 0, 5703, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'x') done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      smartObj.read(3305, 0, 5800, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 20) done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      smartObj.read(3305, 0, 5801, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'c') done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      smartObj.read(3305, 0, 5821, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'x') done()
      })
    })

    it('should pass _unreadable_ when restrict is true', (done) => {
      smartObj.read(3305, 0, 5806, { restrict: true }, (err, result) => {
        expect(err).to.be.an('error')
        if (err && result === '_unreadable_') done()
      })
    })

    it('should pass _unreadable_ when Resources is writable', (done) => {
      smartObj.read(3303, 0, 5702, (err, result) => {
        if (err && result === '_unreadable_') done()
      })
    })

    it('should pass _exec_ when Resources is excutable ', (done) => {
      smartObj.read(3303, 0, 5704, (err, result) => {
        if (err && result === '_exec_') done()
      })
    })

    it('should pass not found error', (done) => {
      smartObj.read(3303, 0, 5706, (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })

    it('should pass the read value when Resources is a Multi-Resource', (done) => {
      const obj = {
        0: 'x',
        1: 'y',
        2: 'z'
      }

      smartObj.read('multiResource', 0, 5700, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })
  })

  describe('#.write()', () => {
    it('should write Resource and pass the write value when Resources is a primitive', (done) => {
      smartObj.write(3303, 0, 5700, 22, (err, result) => {
        expect(err).to.be.equal(null)
        if ((result === 22) && (smartObj.get(3303, 0, 5700) === 22)) done()
      })
    })

    it('should and pass the write value when Resources is writable', (done) => {
      smartObj.write(3303, 0, 5702, 24, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 24) done()
      })
    })

    it('should pass the write value when Resources is readable and writable', (done) => {
      smartObj.write(3303, 0, 5703, 26, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 26) done()
      })
    })

    it('should pass the write value when restrict is true', (done) => {
      smartObj.write(3305, 0, 5806, 'f', { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'f' && (smartObj.get(3305, 0, 5806) === 'f')) done()
      })
    })

    it('should pass the write value when restrict is true', (done) => {
      smartObj.write(3305, 0, 5821, 'y', { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'y' && (smartObj.get(3305, 0, 5821) === 'y')) done()
      })
    })

    it('should pass _unwritable_ when restrict is true', (done) => {
      smartObj.write(3305, 0, 5800, 30, { restrict: true }, (err, result) => {
        if (err && result === '_unwritable_' && (smartObj.get(3305, 0, 5800) === 20)) done()
      })
    })

    it('should pass _unwritable_ when restrict is true', (done) => {
      smartObj.write(3305, 0, 5801, 'x', { restrict: true }, (err, result) => {
        if (err && result === '_unwritable_' && (smartObj.get(3305, 0, 5801) === 'c')) done()
      })
    })

    it('should pass _unwritable_ when Resources is readable', (done) => {
      smartObj.write(3303, 0, 5701, 20, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unwritable_') done()
      })
    })

    it('should pass _exec_ when Resources is excutable', (done) => {
      smartObj.write(3303, 0, 5704, 20, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_exec_') done()
      })
    })

    it('should pass not found error', (done) => {
      smartObj.write(3303, 0, 5706, 'C', (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })

    it('should write Resource and pass the write value when Resources is a Multi-Resource', (done) => {
      const obj = {
        0: 'a',
        1: 'b',
        2: 'c'
      }

      smartObj.write('multiResource', 0, 5700, obj, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) done()
      })
    })
  })

  describe('#.exec()', () => {
    it('should exec Resource and pass true through its second argument', (done) => {
      smartObj.exec(3303, 0, 5704, [20], (err, result) => {
        expect(err).to.be.equal(null)
        if (result === true) done()
      })
    })

    it('should pass _unexecutable_ when Resources is a primitive', (done) => {
      smartObj.exec(3303, 0, 5700, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass _unexecutable_ when Resources is readable', (done) => {
      smartObj.exec(3303, 0, 5701, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass _unexecutable_ when Resources is writable', (done) => {
      smartObj.exec(3303, 0, 5702, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass not argus error', (done) => {
      smartObj.exec(3303, 0, 5704, '20', (err, result) => {
        if (err) done()
      })
    })

    it('should pass not found error', (done) => {
      smartObj.exec(3303, 0, 5706, [20], (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })
  })

  describe('#.isReadable()', () => {
    it('should return true if target is readable', () => {
      expect(smartObj.isReadable(3303, 0, 5700)).to.be.equal(true)
      expect(smartObj.isReadable(3303, 0, 5701)).to.be.equal(true)
      expect(smartObj.isReadable(3303, 0, 5703)).to.be.equal(true)
      expect(smartObj.isReadable('3303', '0', '5700')).to.be.equal(true)
      expect(smartObj.isReadable('temperature', 0, 'sensorValue')).to.be.equal(true)

      expect(smartObj.isReadable(3305, 0, 5800)).to.be.equal(true)
      expect(smartObj.isReadable(3305, 0, 5801)).to.be.equal(true)
      expect(smartObj.isReadable(3305, 0, 5821)).to.be.equal(true)
    })

    it('should return false if target is unreadable', () => {
      expect(smartObj.isReadable(3303, 0, 5702)).to.be.equal(false)
      expect(smartObj.isReadable(3303, 0, 5704)).to.be.equal(false)

      expect(smartObj.isReadable(3305, 0, 5806)).to.be.equal(false)
      expect(smartObj.isReadable(3305, 0, 5822)).to.be.equal(false)
    })
  })

  describe('#.isWritable()', () => {
    it('should return true if target is readable', () => {
      expect(smartObj.isWritable(3303, 0, 5702)).to.be.equal(true)
      expect(smartObj.isWritable(3303, 0, 5703)).to.be.equal(true)

      expect(smartObj.isWritable(3305, 0, 5806)).to.be.equal(true)
      expect(smartObj.isWritable(3305, 0, 5821)).to.be.equal(true)
    })

    it('should return false if target is unreadable', () => {
      expect(smartObj.isWritable(3303, 0, 5700)).to.be.equal(false)
      expect(smartObj.isWritable(3303, 0, 5701)).to.be.equal(false)
      expect(smartObj.isWritable(3303, 0, 5704)).to.be.equal(false)

      expect(smartObj.isWritable(3305, 0, 5800)).to.be.equal(false)
      expect(smartObj.isWritable(3305, 0, 5801)).to.be.equal(false)
      expect(smartObj.isWritable(3305, 0, 5822)).to.be.equal(false)
    })
  })

  describe('#.isExecutable()', () => {
    it('should return true if target is readable', () => {
      expect(smartObj.isExecutable(3303, 0, 5704)).to.be.equal(true)

      expect(smartObj.isExecutable(3305, 0, 5822)).to.be.equal(true)
    })

    it('should return false if target is unreadable', () => {
      expect(smartObj.isExecutable(3303, 0, 5700)).to.be.equal(false)
      expect(smartObj.isExecutable(3303, 0, 5701)).to.be.equal(false)
      expect(smartObj.isExecutable(3303, 0, 5702)).to.be.equal(false)
      expect(smartObj.isExecutable(3303, 0, 5703)).to.be.equal(false)

      expect(smartObj.isExecutable(3305, 0, 5800)).to.be.equal(false)
      expect(smartObj.isExecutable(3305, 0, 5801)).to.be.equal(false)
      expect(smartObj.isExecutable(3305, 0, 5806)).to.be.equal(false)
      expect(smartObj.isExecutable(3305, 0, 5821)).to.be.equal(false)
    })
  })
})
