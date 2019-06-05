/* eslint-env mocha */
const _ = require('busyman')
const { expect } = require('chai')
const ObjectInstance = require('../lib/object_instance')

const objectInst = new ObjectInstance('temperature', 0, { ipsoOnly: false })
const objectInst2 = new ObjectInstance('temperature', 0, { ipsoOnly: false })
const objectInstPwr = new ObjectInstance('pwrMea', 0, { ipsoOnly: false })

describe('Object Instance - Functional Check', () => {
  describe('#.init()', () => {
    it('should add a Resource', () => {
      objectInst.init({ 5700: 30 })
      expect(objectInst.sensorValue).to.be.eql(30)
    })

    it('should clear all the Resources', () => {
      objectInst.init({ 5701: 'c' })
      expect(objectInst.sensorValue).to.be.eql(undefined)
      expect(objectInst.units).to.be.eql('c')
    })

    it('should return id and add a Resource when rsc include function', () => {
      objectInst.init({
        5700: {
          read (cb) {
            cb(null, 25)
          }
        }
      })

      expect(objectInst.sensorValue._isCb).to.be.equal(true)
    })
  })

  describe('#.has()', () => {
    it('should return true if target is exist', () => {
      expect(objectInst.has(5700)).to.be.equal(true)
      expect(objectInst.has('5700')).to.be.equal(true)
      expect(objectInst.has('sensorValue')).to.be.equal(true)
    })

    it('should return false if target is not exist', () => {
      expect(objectInst.has(5702)).to.be.equal(false)
      expect(objectInst.has(5703)).to.be.equal(false)
    })
  })

  describe('#.get()', () => {
    it('should return rsc if target is exist', () => {
      expect(typeof objectInst.get(5700).read).to.be.eql('function')
      expect(typeof objectInst.get('5700').read).to.be.eql('function')
      expect(typeof objectInst.get('sensorValue').read).to.be.eql('function')
    })

    it('should return undefined if target is not exist', () => {
      expect(objectInst.get(5702)).to.be.eql(undefined)
      expect(objectInst.get(5703)).to.be.eql(undefined)
    })
  })

  describe('#.set()', () => {
    it('should return true and add a Resource', () => {
      expect(objectInst.set(5701, 'f')).to.be.eql(objectInst)
      expect(objectInst.get(5701)).to.be.eql('f')
    })
  })

  describe('#.dumpSync()', () => {
    it('should return object instance', () => {
      const obj = {
        sensorValue: {
          read: '_read_'
        },
        units: 'f'
      }

      expect(objectInst.dumpSync()).to.be.eql(obj)
    })
  })

  describe('#.dump()', () => {
    it('should get whole object instance', (done) => {
      const obj = {
        sensorValue: 20,
        units: 'c',
        5702: '_unreadable_',
        5703: 'x',
        5704: '_exec_'
      }

      objectInst.init({
        5700: 20,
        5701: {
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

      objectInst.dump((err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) {
          done()
        }
      })
    })

    it('should get whole object instance whit restrict is true', (done) => {
      const obj = {
        instActivePwr: 20,
        minMeaActivePwr: 'c',
        activePwrCal: '_unreadable_',
        currCal: 'x',
        resetCumulEnergy: '_exec_'
      }

      objectInstPwr.init({
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

      objectInstPwr.dump({ restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (_.isEqual(result, obj)) {
          done()
        }
      })
    })

    it('should return error', (done) => {
      objectInst2.sensorValue = function () {}
      objectInst2.units = function () {}

      objectInst2.dump((err, result) => {
        if (err) {
          done()
        }
      })
    })
  })

  describe('#.read()', () => {
    it('should pass the read value when Resources is a primitive', (done) => {
      objectInst.read(5700, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 20) done()
      })
    })

    it('should pass the read value when Resources is readable', (done) => {
      objectInst.read(5701, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'c') done()
      })
    })

    it('should pass the read value when Resources is readable and writable', (done) => {
      objectInst.read(5703, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'x') done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      objectInstPwr.read(5800, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 20) done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      objectInstPwr.read(5801, { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'c') done()
      })
    })

    it('should pass the read value when restrict is true', (done) => {
      objectInstPwr.read(5821, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'x') done()
      }, { restrict: true })
    })

    it('should pass _unreadable_ when restrict is true', (done) => {
      objectInstPwr.read(5806, { restrict: true }, (err, result) => {
        if (err && result === '_unreadable_') done()
      })
    })

    it('should pass _unreadable_ when Resources is writable', (done) => {
      objectInst.read(5702, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unreadable_') done()
      })
    })

    it('should pass _exec_ when Resources is executable ', (done) => {
      objectInst.read(5704, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_exec_') done()
      })
    })

    it('should pass not found error', (done) => {
      objectInst.read(5706, (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })
  })

  describe('#.write()', () => {
    it('should write Resource and pass the write value when Resources is a primitive', (done) => {
      objectInst.write(5700, 22, (err, result) => {
        expect(err).to.be.equal(null)
        if ((result === 22) && (objectInst.get(5700) === 22)) done()
      })
    })

    it('should and pass the write value when Resources is writable', (done) => {
      objectInst.write(5702, 24, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 24) done()
      })
    })

    it('should pass the write value when Resources is readable and writable', (done) => {
      objectInst.write(5703, 26, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 26) done()
      })
    })

    it('should pass the write value when restrict is true', (done) => {
      objectInstPwr.write(5806, 'f', { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'f' && (objectInstPwr.get(5806) === 'f')) done()
      })
    })

    it('should pass the write value when restrict is true', (done) => {
      objectInstPwr.write(5821, 'y', { restrict: true }, (err, result) => {
        expect(err).to.be.equal(null)
        if (result === 'y' && (objectInstPwr.get(5821) === 'y')) done()
      })
    })

    it('should pass the write value when restrict is true', (done) => {
      objectInstPwr.write(5800, 30, { restrict: true }, (err, result) => {
        if (err && result === '_unwritable_' && (objectInstPwr.get(5800) === 20)) done()
      })
    })

    it('should pass _unwritable_ when restrict is true', (done) => {
      objectInstPwr.write(5801, 'x', { restrict: true }, (err, result) => {
        if (err && result === '_unwritable_' && (objectInstPwr.get(5801) === 'c')) done()
      })
    })

    it('should pass _unwritable_ when Resources is readable', (done) => {
      objectInst.write(5701, 20, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unwritable_') done()
      })
    })

    it('should pass _exec_ when Resources is excutable', (done) => {
      objectInst.write(5704, 20, (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_exec_') done()
      })
    })

    it('should pass not found error', (done) => {
      objectInst.write(5706, 'C', (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })
  })

  describe('#.exec()', () => {
    it('should exec Resource and pass true through its second argument', (done) => {
      objectInst.exec(5704, [20], (err, result) => {
        expect(err).to.be.equal(null)
        if (result === true) done()
      })
    })

    it('should pass _unexecutable_ when Resources is a primitive', (done) => {
      objectInst.exec(5700, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass _unexecutable_ when Resources is readable', (done) => {
      objectInst.exec(5701, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass _unexecutable_ when Resources is writable', (done) => {
      objectInst.exec(5702, [20], (err, result) => {
        expect(err).to.be.an('error')
        if (result === '_unexecutable_') done()
      })
    })

    it('should pass not argus error', (done) => {
      objectInst.exec(5704, '20', (err, result) => {
        if (err) done()
      })
    })

    it('should pass not found error', (done) => {
      objectInst.exec(5706, [20], (err, result) => {
        if (err && result === '_notfound_') done()
      })
    })
  })

  describe('#.clear()', () => {
    it('should return object instance and remove all Resources', () => {
      expect(objectInst.clear()).to.be.eql(new ObjectInstance('temperature', 0))
      expect(objectInst.get('sensorValue')).to.be.eql(undefined)
      expect(objectInst.get('units')).to.be.eql(undefined)
    })
  })
})
