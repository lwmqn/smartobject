/* eslint-env mocha */
const { expect } = require('chai')
const ObjectInstance = require('../lib/object_instance')

const objectInst = new ObjectInstance('temperature', 0, { ipsoOnly: false })

describe('Object Instance - Signature Check', () => {
  describe('#.init()', () => {
    it('should be a function', () => {
      expect(objectInst.init).to.be.a('function')
    })

    it('should throw TypeError if resrcs is not an object', () => {
      expect(() => objectInst.init()).to.throw(TypeError)
      expect(() => objectInst.init(undefined)).to.throw(TypeError)
      expect(() => objectInst.init(null)).to.throw(TypeError)
      expect(() => objectInst.init(NaN)).to.throw(TypeError)
      expect(() => objectInst.init(10)).to.throw(TypeError)
      expect(() => objectInst.init('xx')).to.throw(TypeError)
      expect(() => objectInst.init([])).to.throw(TypeError)
      expect(() => objectInst.init(true)).to.throw(TypeError)
      expect(() => objectInst.init(new Date())).to.throw(TypeError)
      expect(() => objectInst.init(() => {})).to.throw(TypeError)

      expect(() => objectInst.init({})).not.to.throw(TypeError)
    })

    it('should throw TypeError if given setup is not a function', () => {
      expect(() => objectInst.init({ 5700: 30 }, 10)).to.throw(TypeError)
      expect(() => objectInst.init({ 5700: 30 }, 'xx')).to.throw(TypeError)
      expect(() => objectInst.init({ 5700: 30 }, [])).to.throw(TypeError)
      expect(() => objectInst.init({ 5700: 30 }, true)).to.throw(TypeError)
      expect(() => objectInst.init({ 5700: 30 }, new Date())).to.throw(TypeError)

      expect(() => objectInst.init({ 5700: 30 }, () => {})).not.to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a number when ipsoOnly is true', () => {
      objectInst.parent.ipsoOnly = true
      expect(() => objectInst.init({ 9453: 30 }, () => {})).to.throw(TypeError)
    })
  })

  describe('#.has()', () => {
    it('should be a function', () => {
      expect(objectInst.has).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.has()).to.throw(TypeError)
      expect(() => objectInst.has(undefined)).to.throw(TypeError)
      expect(() => objectInst.has(null)).to.throw(TypeError)
      expect(() => objectInst.has(NaN)).to.throw(TypeError)
      expect(() => objectInst.has([])).to.throw(TypeError)
      expect(() => objectInst.has({})).to.throw(TypeError)
      expect(() => objectInst.has(true)).to.throw(TypeError)
      expect(() => objectInst.has(new Date())).to.throw(TypeError)
      expect(() => objectInst.has(() => {})).to.throw(TypeError)

      expect(() => objectInst.has(5700)).not.to.throw(TypeError)
      expect(() => objectInst.has('temperature')).not.to.throw(TypeError)
    })
  })

  describe('#.get()', () => {
    it('should be a function', () => {
      expect(objectInst.get).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.get()).to.throw(TypeError)
      expect(() => objectInst.get(undefined)).to.throw(TypeError)
      expect(() => objectInst.get(null)).to.throw(TypeError)
      expect(() => objectInst.get(NaN)).to.throw(TypeError)
      expect(() => objectInst.get([])).to.throw(TypeError)
      expect(() => objectInst.get({})).to.throw(TypeError)
      expect(() => objectInst.get(true)).to.throw(TypeError)
      expect(() => objectInst.get(new Date())).to.throw(TypeError)
      expect(() => objectInst.get(() => {})).to.throw(TypeError)

      expect(() => objectInst.get(5700)).not.to.throw(TypeError)
      expect(() => objectInst.get('temperature')).not.to.throw(TypeError)
    })
  })

  describe('#.set()', () => {
    it('should be a function', () => {
      expect(objectInst.set).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.set(undefined, 'xx')).to.throw(TypeError)
      expect(() => objectInst.set(null, 'xx')).to.throw(TypeError)
      expect(() => objectInst.set(NaN, 'xx')).to.throw(TypeError)
      expect(() => objectInst.set([], 'xx')).to.throw(TypeError)
      expect(() => objectInst.set({}, 'xx')).to.throw(TypeError)
      expect(() => objectInst.set(true, 'xx')).to.throw(TypeError)
      expect(() => objectInst.set(new Date(), 'xx')).to.throw(TypeError)
      expect(() => objectInst.set(() => {}, 'xx')).to.throw(TypeError)

      expect(() => objectInst.set(5700, 'xx')).not.to.throw(TypeError)
      expect(() => objectInst.set('temperature', 'xx')).not.to.throw(TypeError)
    })

    it('should throw TypeError if value is undefined or a function', () => {
      expect(() => objectInst.set(5700, undefined)).to.throw(TypeError)
      expect(() => objectInst.set(5700, () => {})).to.throw(TypeError)

      expect(() => objectInst.set(5700, null)).not.to.throw(TypeError)
      expect(() => objectInst.set(5700, NaN)).not.to.throw(TypeError)
      expect(() => objectInst.set(5700, [])).not.to.throw(TypeError)
      expect(() => objectInst.set(5700, {})).not.to.throw(TypeError)
      expect(() => objectInst.set(5700, true)).not.to.throw(TypeError)
      expect(() => objectInst.set(5700, new Date())).not.to.throw(TypeError)
    })
  })

  describe('#.dump()', () => {
    it('should be a function', () => {
      expect(objectInst.dump).to.be.a('function')
    })

    it('should throw TypeError if given opt is not an object', () => {
      const cb = function () {}
      expect(() => objectInst.dump(10, cb)).to.throw(TypeError)
      expect(() => objectInst.dump('xx', cb)).to.throw(TypeError)
      expect(() => objectInst.dump([], cb)).to.throw(TypeError)
      expect(() => objectInst.dump(true, cb)).to.throw(TypeError)
      expect(() => objectInst.dump(new Date(), cb)).to.throw(TypeError)

      expect(() => objectInst.dump(() => {})).not.to.throw(TypeError)
      expect(() => objectInst.dump({}, cb)).not.to.throw(TypeError)
    })
  })

  describe('#.dumpSync()', () => {
    it('should be a function', () => {
      expect(objectInst.dumpSync).to.be.a('function')
    })
  })

  describe('#.read()', () => {
    it('should be a function', () => {
      expect(objectInst.read).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.read()).to.throw(TypeError)
      expect(() => objectInst.read(undefined)).to.throw(TypeError)
      expect(() => objectInst.read(null)).to.throw(TypeError)
      expect(() => objectInst.read(NaN)).to.throw(TypeError)
      expect(() => objectInst.read([])).to.throw(TypeError)
      expect(() => objectInst.read({})).to.throw(TypeError)
      expect(() => objectInst.read(true)).to.throw(TypeError)
      expect(() => objectInst.read(new Date())).to.throw(TypeError)
      expect(() => objectInst.read(() => {})).to.throw(TypeError)

      expect(() => objectInst.read(5700)).not.to.throw(TypeError)
      expect(() => objectInst.read('temperature')).not.to.throw(TypeError)
    })

    it('should throw TypeError if given opt is not an object', () => {
      const cb = function () {}
      expect(() => objectInst.read(5700, 10, cb)).to.throw(TypeError)
      expect(() => objectInst.read(5700, 'xx', cb)).to.throw(TypeError)
      expect(() => objectInst.read(5700, [], cb)).to.throw(TypeError)
      expect(() => objectInst.read(5700, true, cb)).to.throw(TypeError)
      expect(() => objectInst.read(5700, new Date(), cb)).to.throw(TypeError)

      expect(() => objectInst.read(5700, () => {})).not.to.throw(TypeError)
      expect(() => objectInst.read(5700, {})).not.to.throw(TypeError)
    })
  })

  describe('#.write()', () => {
    it('should be a function', () => {
      expect(objectInst.write).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.write()).to.throw(TypeError)
      expect(() => objectInst.write(undefined)).to.throw(TypeError)
      expect(() => objectInst.write(null)).to.throw(TypeError)
      expect(() => objectInst.write(NaN)).to.throw(TypeError)
      expect(() => objectInst.write([])).to.throw(TypeError)
      expect(() => objectInst.write({})).to.throw(TypeError)
      expect(() => objectInst.write(true)).to.throw(TypeError)
      expect(() => objectInst.write(new Date())).to.throw(TypeError)
      expect(() => objectInst.write(() => {})).to.throw(TypeError)

      expect(() => objectInst.write(5700, 30)).not.to.throw(TypeError)
      expect(() => objectInst.write('temperature', 30)).not.to.throw(TypeError)
    })

    it('should throw TypeError if value is undefined or a function', () => {
      expect(() => objectInst.write(5700, undefined)).to.throw(TypeError)
      expect(() => objectInst.write(5700, () => {})).to.throw(TypeError)

      expect(() => objectInst.write(5700, null)).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, NaN)).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, [])).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, {})).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, true)).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, new Date())).not.to.throw(TypeError)
    })

    it('should throw TypeError if given opt is not an object', () => {
      const cb = function () {}
      expect(() => objectInst.write(5700, 30, 10, cb)).to.throw(TypeError)
      expect(() => objectInst.write(5700, 30, 'xx', cb)).to.throw(TypeError)
      expect(() => objectInst.write(5700, 30, [], cb)).to.throw(TypeError)
      expect(() => objectInst.write(5700, 30, true, cb)).to.throw(TypeError)
      expect(() => objectInst.write(5700, 30, new Date(), cb)).to.throw(TypeError)

      expect(() => objectInst.write(5700, 30, () => {})).not.to.throw(TypeError)
      expect(() => objectInst.write(5700, 30, {})).not.to.throw(TypeError)
    })
  })

  describe('#.exec()', () => {
    it('should be a function', () => {
      expect(objectInst.exec).to.be.a('function')
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => objectInst.exec()).to.throw(TypeError)
      expect(() => objectInst.exec(undefined)).to.throw(TypeError)
      expect(() => objectInst.exec(null)).to.throw(TypeError)
      expect(() => objectInst.exec(NaN)).to.throw(TypeError)
      expect(() => objectInst.exec([])).to.throw(TypeError)
      expect(() => objectInst.exec({})).to.throw(TypeError)
      expect(() => objectInst.exec(true)).to.throw(TypeError)
      expect(() => objectInst.exec(new Date())).to.throw(TypeError)
      expect(() => objectInst.exec(() => {})).to.throw(TypeError)

      expect(() => objectInst.exec(5700)).not.to.throw(TypeError)
      expect(() => objectInst.exec('temperature')).not.to.throw(TypeError)
    })
  })

  describe('#.clear()', () => {
    it('should be a function', () => {
      expect(objectInst.clear).to.be.a('function')
    })
  })
})
