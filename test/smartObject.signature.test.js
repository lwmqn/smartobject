/* eslint-env mocha */
const { expect } = require('chai')
const SmartObject = require('../index.js')

const smartObj = new SmartObject()

describe('Smart Object - Signature Check', () => {
  describe('#.init()', () => {
    it('should be a function', () => {
      expect(smartObj.init).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.init()).to.throw(TypeError)
      expect(() => smartObj.init(undefined)).to.throw(TypeError)
      expect(() => smartObj.init(null)).to.throw(TypeError)
      expect(() => smartObj.init(NaN)).to.throw(TypeError)
      expect(() => smartObj.init([])).to.throw(TypeError)
      expect(() => smartObj.init({})).to.throw(TypeError)
      expect(() => smartObj.init(true)).to.throw(TypeError)
      expect(() => smartObj.init(new Date())).to.throw(TypeError)
      expect(() => smartObj.init(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.init(3302)).to.throw(TypeError)
      expect(() => smartObj.init(3302, undefined)).to.throw(TypeError)
      expect(() => smartObj.init(3302, null)).to.throw(TypeError)
      expect(() => smartObj.init(3302, NaN)).to.throw(TypeError)
      expect(() => smartObj.init(3302, [])).to.throw(TypeError)
      expect(() => smartObj.init(3302, {})).to.throw(TypeError)
      expect(() => smartObj.init(3302, true)).to.throw(TypeError)
      expect(() => smartObj.init(3302, new Date())).to.throw(TypeError)
      expect(() => smartObj.init(3302, () => {})).to.throw(TypeError)
    })

    it('should throw TypeError if resrcs is not an object', () => {
      expect(() => smartObj.init(3302, 1, undefined)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 2, null)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 3, NaN)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 4, 10)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 5, 'xx')).to.throw(TypeError)
      expect(() => smartObj.init(3302, 6, [])).to.throw(TypeError)
      expect(() => smartObj.init(3302, 7, true)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 8, new Date())).to.throw(TypeError)
      expect(() => smartObj.init(3302, 9, () => {})).to.throw(TypeError)

      expect(() => smartObj.init(3302, 0, {})).not.to.throw(TypeError)
    })

    it('should throw TypeError if given opt is not an object', () => {
      expect(() => smartObj.init(3302, 11, {}, 10)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 12, {}, 'xx')).to.throw(TypeError)
      expect(() => smartObj.init(3302, 13, {}, [])).to.throw(TypeError)
      expect(() => smartObj.init(3302, 14, {}, true)).to.throw(TypeError)
      expect(() => smartObj.init(3302, 15, {}, new Date())).to.throw(TypeError)
      expect(() => smartObj.init(3302, 17, {}, {})).to.throw(TypeError)

      expect(() => smartObj.init(3302, 16, {}, () => {})).not.to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a number when ipsoOnly is true', () => {
      smartObj.ipsoOnly = true
      expect(() => smartObj.init(3304, 'x', {})).to.throw(TypeError)
    })

    it('should throw Error if oid is not in an IPSO-defined when ipsoOnly is true', () => {
      smartObj.ipsoOnly = true
      expect(() => smartObj.init(9453, 0, {})).to.throw(Error)
    })

    it('should throw Error if rid is not in an IPSO-defined when ipsoOnly is true', () => {
      smartObj.ipsoOnly = true
      expect(() => smartObj.init(3304, 0, { 9999: 20 })).to.throw(Error)
    })
  })

  describe('#.create()', () => {
    it('should be a function', () => {
      expect(smartObj.create).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.create()).to.throw(TypeError)
      expect(() => smartObj.create(undefined)).to.throw(TypeError)
      expect(() => smartObj.create(null)).to.throw(TypeError)
      expect(() => smartObj.create(NaN)).to.throw(TypeError)
      expect(() => smartObj.create([])).to.throw(TypeError)
      expect(() => smartObj.create({})).to.throw(TypeError)
      expect(() => smartObj.create(true)).to.throw(TypeError)
      expect(() => smartObj.create(new Date())).to.throw(TypeError)
      expect(() => smartObj.create(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      smartObj.ipsoOnly = false

      expect(() => smartObj.create(3304)).to.throw(TypeError)
      expect(() => smartObj.create(3304, undefined)).to.throw(TypeError)
      expect(() => smartObj.create(3304, null)).to.throw(TypeError)
      expect(() => smartObj.create(3304, NaN)).to.throw(TypeError)
      expect(() => smartObj.create(3304, [])).to.throw(TypeError)
      expect(() => smartObj.create(3304, {})).to.throw(TypeError)
      expect(() => smartObj.create(3304, true)).to.throw(TypeError)
      expect(() => smartObj.create(3304, new Date())).to.throw(TypeError)
      expect(() => smartObj.create(3304, () => {})).to.throw(TypeError)

      expect(() => smartObj.create(3304, 2)).not.to.throw(TypeError)
      expect(() => smartObj.create(3304, 'b')).not.to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a number when ipsoOnly is true', () => {
      expect(() => {
        smartObj.ipsoOnly = true
        return smartObj.create(3304, 'x1')
      }).to.throw(TypeError)
    })

    it('should throw Error if oid is not in an IPSO-defined when ipsoOnly is true', () => {
      smartObj.ipsoOnly = true
      expect(() => smartObj.create(9453, 0)).to.throw(Error)
    })
  })

  describe('#.remove()', () => {
    it('should be a function', () => {
      expect(smartObj.remove).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.remove()).to.throw(TypeError)
      expect(() => smartObj.remove(undefined)).to.throw(TypeError)
      expect(() => smartObj.remove(null)).to.throw(TypeError)
      expect(() => smartObj.remove(NaN)).to.throw(TypeError)
      expect(() => smartObj.remove([])).to.throw(TypeError)
      expect(() => smartObj.remove({})).to.throw(TypeError)
      expect(() => smartObj.remove(true)).to.throw(TypeError)
      expect(() => smartObj.remove(new Date())).to.throw(TypeError)
      expect(() => smartObj.remove(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.remove(3304)).to.throw(TypeError)
      expect(() => smartObj.remove(3304, undefined)).to.throw(TypeError)
      expect(() => smartObj.remove(3304, null)).to.throw(TypeError)
      expect(() => smartObj.remove(3304, NaN)).to.throw(TypeError)
      expect(() => smartObj.remove(3304, [])).to.throw(TypeError)
      expect(() => smartObj.remove(3304, {})).to.throw(TypeError)
      expect(() => smartObj.remove(3304, true)).to.throw(TypeError)
      expect(() => smartObj.remove(3304, new Date())).to.throw(TypeError)
      expect(() => smartObj.remove(3304, () => {})).to.throw(TypeError)

      expect(() => smartObj.remove(3304, 2)).not.to.throw(TypeError)
      expect(() => smartObj.remove(3304, 'b')).not.to.throw(TypeError)
    })
  })

  describe('#.objectList()', () => {
    it('should be a function', () => {
      expect(smartObj.objectList).to.be.a('function')
    })
  })

  describe('#.has()', () => {
    it('should be a function', () => {
      expect(smartObj.has).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.has()).to.throw(TypeError)
      expect(() => smartObj.has(undefined, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has(null, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has(NaN, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has([], '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has({}, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has(true, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has(new Date(), '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.has(() => {}, '1', 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      smartObj.init(3303, 0, {})
      expect(() => smartObj.has(3303, null, 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, NaN, 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, [], 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, {}, 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, true, 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, new Date(), 'a')).to.throw(TypeError)
      expect(() => smartObj.has(3303, () => {}, 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      expect(() => smartObj.has(3303, 0, null)).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, NaN)).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, [])).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, {})).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, true)).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, new Date())).to.throw(TypeError)
      expect(() => smartObj.has(3303, 0, () => {})).to.throw(TypeError)
    })
  })

  describe('#.findObject()', () => {
    it('should be a function', () => {
      expect(smartObj.findObject).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.findObject()).to.throw(TypeError)
      expect(() => smartObj.findObject(undefined)).to.throw(TypeError)
      expect(() => smartObj.findObject(null)).to.throw(TypeError)
      expect(() => smartObj.findObject(NaN)).to.throw(TypeError)
      expect(() => smartObj.findObject([])).to.throw(TypeError)
      expect(() => smartObj.findObject({})).to.throw(TypeError)
      expect(() => smartObj.findObject(true)).to.throw(TypeError)
      expect(() => smartObj.findObject(new Date())).to.throw(TypeError)
      expect(() => smartObj.findObject(() => {})).to.throw(TypeError)

      expect(() => smartObj.findObject(5700)).not.to.throw(TypeError)
      expect(() => smartObj.findObject('temperature')).not.to.throw(TypeError)
    })
  })

  describe('#.findObjectInstance()', () => {
    it('should be a function', () => {
      expect(smartObj.findObjectInstance).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.findObjectInstance()).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(undefined)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(null)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(NaN)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance([])).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance({})).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(true)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(new Date())).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.findObjectInstance(5700)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, undefined)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, null)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, NaN)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, [])).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, {})).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, true)).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, new Date())).to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, () => {})).to.throw(TypeError)

      expect(() => smartObj.findObjectInstance(5700, 0)).not.to.throw(TypeError)
      expect(() => smartObj.findObjectInstance(5700, 'xx')).not.to.throw(TypeError)
    })
  })

  describe('#.isReadable()', () => {
    it('should be a function', () => {
      expect(smartObj.isReadable).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.isReadable()).to.throw(TypeError)
      expect(() => smartObj.isReadable(undefined, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(null, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(NaN, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable([], '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable({}, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(true, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(new Date(), '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(() => {}, '1', 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      expect(() => smartObj.isReadable(3303)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, undefined, 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, null, 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, NaN, 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, [], 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, {}, 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, true, 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, new Date(), 'a')).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, () => {}, 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      smartObj.init(3303, 1, {})
      expect(() => smartObj.isReadable(3303, 1)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, undefined)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, null)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, NaN)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, [])).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, {})).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, true)).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, new Date())).to.throw(TypeError)
      expect(() => smartObj.isReadable(3303, 1, () => {})).to.throw(TypeError)
    })
  })

  describe('#.isWritable()', () => {
    it('should be a function', () => {
      expect(smartObj.isWritable).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.isWritable()).to.throw(TypeError)
      expect(() => smartObj.isWritable(undefined, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(null, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(NaN, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable([], '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable({}, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(true, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(new Date(), '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(() => {}, '1', 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      expect(() => smartObj.isWritable(3303)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, undefined, 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, null, 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, NaN, 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, [], 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, {}, 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, true, 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, new Date(), 'a')).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, () => {}, 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      expect(() => smartObj.isWritable(3303, 1)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, undefined)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, null)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, NaN)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, [])).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, {})).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, true)).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, new Date())).to.throw(TypeError)
      expect(() => smartObj.isWritable(3303, 1, () => {})).to.throw(TypeError)
    })
  })

  describe('#.isExecutable()', () => {
    it('should be a function', () => {
      expect(smartObj.isExecutable).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.isExecutable()).to.throw(TypeError)
      expect(() => smartObj.isExecutable(undefined, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(null, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(NaN, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable([], '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable({}, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(true, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(new Date(), '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(() => {}, '1', 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      expect(() => smartObj.isExecutable(3303)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, undefined, 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, null, 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, NaN, 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, [], 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, {}, 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, true, 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, new Date(), 'a')).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, () => {}, 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      expect(() => smartObj.isExecutable(3303, 1)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, undefined)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, null)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, NaN)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, [])).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, {})).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, true)).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, new Date())).to.throw(TypeError)
      expect(() => smartObj.isExecutable(3303, 1, () => {})).to.throw(TypeError)
    })
  })

  describe('#.get()', () => {
    it('should be a function', () => {
      expect(smartObj.get).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.get()).to.throw(TypeError)
      expect(() => smartObj.get(undefined, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get(null, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get(NaN, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get([], '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get({}, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get(true, '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get(new Date(), '1', 'a')).to.throw(TypeError)
      expect(() => smartObj.get(() => {}, '1', 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      expect(() => smartObj.get(3303)).to.throw(TypeError)
      expect(() => smartObj.get(3303, undefined, 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, null, 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, NaN, 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, [], 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, {}, 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, true, 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, new Date(), 'a')).to.throw(TypeError)
      expect(() => smartObj.get(3303, () => {}, 'a')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      expect(() => smartObj.get(3303, 1)).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, undefined)).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, null)).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, NaN)).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, [])).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, {})).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, true)).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, new Date())).to.throw(TypeError)
      expect(() => smartObj.get(3303, 1, () => {})).to.throw(TypeError)
    })
  })

  describe('#.set()', () => {
    it('should be a function', () => {
      expect(smartObj.set).to.be.a('function')
    })

    it('should throw TypeError if input oid is not a number and not a string', () => {
      expect(() => smartObj.set()).to.throw(TypeError)
      expect(() => smartObj.set(undefined, '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(null, '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(NaN, '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set([], '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set({}, '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(true, '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(new Date(), '1', 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(() => {}, '1', 'a', 'xx')).to.throw(TypeError)
    })

    it('should throw TypeError if input iid is not a number and not a string', () => {
      expect(() => smartObj.set(3303)).to.throw(TypeError)
      expect(() => smartObj.set(3303, undefined, 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, null, 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, NaN, 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, [], 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, {}, 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, true, 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, new Date(), 'a', 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, () => {}, 'a', 'xx')).to.throw(TypeError)
    })

    it('should throw TypeError if input rid is not a number and not a string', () => {
      smartObj.init(3303, 2, {})
      expect(() => smartObj.set(3303, 2)).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, undefined, 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, null, 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, NaN, 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, [], 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, {}, 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, true, 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, new Date(), 'xx')).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, () => {}, 'xx')).to.throw(TypeError)
    })

    it('should throw TypeError if value is undefined or a function', () => {
      expect(() => smartObj.set(3303, 2, 5700, undefined)).to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, () => {})).to.throw(TypeError)

      expect(() => smartObj.set(3303, 2, 5700, null)).not.to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, NaN)).not.to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, [])).not.to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, {})).not.to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, true)).not.to.throw(TypeError)
      expect(() => smartObj.set(3303, 2, 5700, new Date())).not.to.throw(TypeError)
    })
  })

  describe('#.dumpSync()', () => {
    it('should be a function', () => {
      expect(smartObj.dumpSync).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.dumpSync(undefined)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(null)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(NaN)).to.throw(TypeError)
      expect(() => smartObj.dumpSync([])).to.throw(TypeError)
      expect(() => smartObj.dumpSync({})).to.throw(TypeError)
      expect(() => smartObj.dumpSync(true)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(new Date())).to.throw(TypeError)
      expect(() => smartObj.dumpSync(() => {})).to.throw(TypeError)

      expect(() => smartObj.dumpSync(3303)).not.to.throw(TypeError)
      expect(() => smartObj.dumpSync('temperature')).not.to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.dumpSync(3303, undefined)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, null)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, NaN)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, [])).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, {})).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, true)).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, new Date())).to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, () => {})).to.throw(TypeError)

      expect(() => smartObj.dumpSync(3303, 0)).not.to.throw(TypeError)
      expect(() => smartObj.dumpSync(3303, 'xx')).not.to.throw(TypeError)
    })
  })

  describe('#.dump()', () => {
    it('should be a function', () => {
      expect(smartObj.dump).to.be.a('function')
    })

    it('should throw TypeError if callback is not a function', () => {
      expect(() => smartObj.dump()).to.throw(Error)
      expect(() => smartObj.dump(undefined)).to.throw(TypeError)
      expect(() => smartObj.dump(null)).to.throw(TypeError)
      expect(() => smartObj.dump(NaN)).to.throw(TypeError)
      expect(() => smartObj.dump(10)).to.throw(TypeError)
      expect(() => smartObj.dump('xx')).to.throw(TypeError)
      expect(() => smartObj.dump([])).to.throw(TypeError)
      expect(() => smartObj.dump({})).to.throw(TypeError)
      expect(() => smartObj.dump(true)).to.throw(TypeError)
      expect(() => smartObj.dump(new Date())).to.throw(TypeError)

      expect(() => smartObj.dump(() => {})).not.to.throw(TypeError)
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.dump(undefined, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(null, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(NaN, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump([], () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(true, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(new Date(), () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(() => {}, () => {})).to.throw(TypeError)

      expect(() => smartObj.dump({}, () => {})).not.to.throw(TypeError) // opt
      expect(() => smartObj.dump(3303, {}, () => {})).not.to.throw(TypeError) // opt
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.dump(3303, undefined, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, null, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, NaN, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, [], () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, true, () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, new Date(), () => {})).to.throw(TypeError)
      expect(() => smartObj.dump(3303, () => {}, () => {})).to.throw(TypeError)

      expect(() => smartObj.dump(3303, {}, () => {})).not.to.throw(TypeError) // opt
      expect(() => smartObj.dump(3303, 0, {}, () => {})).not.to.throw(TypeError) // opt
    })

    it('should throw TypeError if given opt is not an object', () => {
      expect(() => smartObj.dump(3303, 2, () => {}, 10)).to.throw(TypeError)
      expect(() => smartObj.dump(3303, 2, () => {}, 'xx')).to.throw(TypeError)
      expect(() => smartObj.dump(3303, 2, () => {}, [])).to.throw(TypeError)
      expect(() => smartObj.dump(3303, 2, () => {}, true)).to.throw(TypeError)
      expect(() => smartObj.dump(3303, 2, () => {}, new Date())).to.throw(TypeError)

      expect(() => smartObj.dump(3303, 2, () => {}, () => {})).not.to.throw(TypeError)
      expect(() => smartObj.dump(3303, 2, {}, () => {})).not.to.throw(TypeError)
    })
  })

  describe('#.read()', () => {
    it('should be a function', () => {
      expect(smartObj.read).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.read()).to.throw(TypeError)
      expect(() => smartObj.read(undefined)).to.throw(TypeError)
      expect(() => smartObj.read(null)).to.throw(TypeError)
      expect(() => smartObj.read(NaN)).to.throw(TypeError)
      expect(() => smartObj.read([])).to.throw(TypeError)
      expect(() => smartObj.read({})).to.throw(TypeError)
      expect(() => smartObj.read(true)).to.throw(TypeError)
      expect(() => smartObj.read(new Date())).to.throw(TypeError)
      expect(() => smartObj.read(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.read(3303)).to.throw(TypeError)
      expect(() => smartObj.read(3303, undefined)).to.throw(TypeError)
      expect(() => smartObj.read(3303, null)).to.throw(TypeError)
      expect(() => smartObj.read(3303, NaN)).to.throw(TypeError)
      expect(() => smartObj.read(3303, [])).to.throw(TypeError)
      expect(() => smartObj.read(3303, {})).to.throw(TypeError)
      expect(() => smartObj.read(3303, true)).to.throw(TypeError)
      expect(() => smartObj.read(3303, new Date())).to.throw(TypeError)
      expect(() => smartObj.read(3303, () => {})).to.throw(TypeError)
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => smartObj.read(3303, 2)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, undefined)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, null)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, NaN)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, [])).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, {})).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, true)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, new Date())).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, () => {})).to.throw(TypeError)

      expect(() => smartObj.read(3303, 2, 5700)).not.to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 'temperature')).not.to.throw(TypeError)
    })

    it('should throw TypeError if given opt is not an object', () => {
      const cb = function () {}
      expect(() => smartObj.read(3303, 2, 5700, 10, cb)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 5700, 'xx', cb)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 5700, [], cb)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 5700, true, cb)).to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 5700, new Date(), cb)).to.throw(TypeError)

      expect(() => smartObj.read(3303, 2, 5700, () => {}, cb)).not.to.throw(TypeError)
      expect(() => smartObj.read(3303, 2, 5700, {})).not.to.throw(TypeError)
    })
  })

  describe('#.write()', () => {
    it('should be a function', () => {
      expect(smartObj.write).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.write()).to.throw(TypeError)
      expect(() => smartObj.write(undefined)).to.throw(TypeError)
      expect(() => smartObj.write(null)).to.throw(TypeError)
      expect(() => smartObj.write(NaN)).to.throw(TypeError)
      expect(() => smartObj.write([])).to.throw(TypeError)
      expect(() => smartObj.write({})).to.throw(TypeError)
      expect(() => smartObj.write(true)).to.throw(TypeError)
      expect(() => smartObj.write(new Date())).to.throw(TypeError)
      expect(() => smartObj.write(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.write(5700)).to.throw(TypeError)
      expect(() => smartObj.write(5700, undefined)).to.throw(TypeError)
      expect(() => smartObj.write(5700, null)).to.throw(TypeError)
      expect(() => smartObj.write(5700, NaN)).to.throw(TypeError)
      expect(() => smartObj.write(5700, [])).to.throw(TypeError)
      expect(() => smartObj.write(5700, {})).to.throw(TypeError)
      expect(() => smartObj.write(5700, true)).to.throw(TypeError)
      expect(() => smartObj.write(5700, new Date())).to.throw(TypeError)
      expect(() => smartObj.write(5700, () => {})).to.throw(TypeError)
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => smartObj.write()).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, undefined)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, null)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, NaN)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, [])).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, {})).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, true)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, new Date())).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, () => {})).to.throw(TypeError)

      expect(() => smartObj.write(3303, 2, 5700, 30)).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 'temperature', 30)).not.to.throw(TypeError)
    })

    it('should throw TypeError if value is undefined or a function', () => {
      expect(() => smartObj.write(3303, 2, 5700, undefined)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, () => {})).to.throw(TypeError)

      expect(() => smartObj.write(3303, 2, 5700, null)).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, NaN)).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, [])).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, {})).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, true)).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, new Date())).not.to.throw(TypeError)
    })

    it('should throw TypeError if given opt is not an object', () => {
      const cb = function () {}
      expect(() => smartObj.write(3303, 2, 5700, 30, 10, cb)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, 30, 'xx', cb)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, 30, [], cb)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, 30, true, cb)).to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, 30, new Date(), cb)).to.throw(TypeError)

      expect(() => smartObj.write(3303, 2, 5700, 30, () => {}, cb)).not.to.throw(TypeError)
      expect(() => smartObj.write(3303, 2, 5700, 30, {})).not.to.throw(TypeError)
    })
  })

  describe('#.exec()', () => {
    it('should be a function', () => {
      expect(smartObj.exec).to.be.a('function')
    })

    it('should throw TypeError if oid is not a string or a number', () => {
      expect(() => smartObj.exec()).to.throw(TypeError)
      expect(() => smartObj.exec(undefined)).to.throw(TypeError)
      expect(() => smartObj.exec(null)).to.throw(TypeError)
      expect(() => smartObj.exec(NaN)).to.throw(TypeError)
      expect(() => smartObj.exec([])).to.throw(TypeError)
      expect(() => smartObj.exec({})).to.throw(TypeError)
      expect(() => smartObj.exec(true)).to.throw(TypeError)
      expect(() => smartObj.exec(new Date())).to.throw(TypeError)
      expect(() => smartObj.exec(() => {})).to.throw(TypeError)
    })

    it('should throw TypeError if iid is not a string or a number', () => {
      expect(() => smartObj.exec(5700)).to.throw(TypeError)
      expect(() => smartObj.exec(5700, undefined)).to.throw(TypeError)
      expect(() => smartObj.exec(5700, null)).to.throw(TypeError)
      expect(() => smartObj.exec(5700, NaN)).to.throw(TypeError)
      expect(() => smartObj.exec(5700, [])).to.throw(TypeError)
      expect(() => smartObj.exec(5700, {})).to.throw(TypeError)
      expect(() => smartObj.exec(5700, true)).to.throw(TypeError)
      expect(() => smartObj.exec(5700, new Date())).to.throw(TypeError)
      expect(() => smartObj.exec(5700, () => {})).to.throw(TypeError)
    })

    it('should throw TypeError if rid is not a string or a number', () => {
      expect(() => smartObj.exec()).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, undefined)).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, null)).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, NaN)).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, [])).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, {})).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, true)).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, new Date())).to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, () => {})).to.throw(TypeError)

      expect(() => smartObj.exec(3303, 2, 5700, 30)).not.to.throw(TypeError)
      expect(() => smartObj.exec(3303, 2, 'temperature', 30)).not.to.throw(TypeError)
    })
  })
})
