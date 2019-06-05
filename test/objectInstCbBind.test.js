/* eslint-env mocha */
const { expect } = require('chai')
const SmartObject = require('../index.js')

const smartObj = new SmartObject()

describe('Smart Object - Instance read/write/exec cb bind this to instance itself', () => {
  describe('#read', () => {
    it('should bind this to instance itself in read method', (done) => {
      smartObj.init(3303, 0, {
        a: 'hello world',
        5700: {
          read (cb) {
            cb(null, this)
          }
        }
      })

      smartObj.read(3303, 0, 5700, (err, val) => {
        expect(err).to.be.equal(null)
        if (val === smartObj.temperature[0]) done()
      })
    })
  })

  describe('#write', () => {
    it('should bind this to instance itself in write method', (done) => {
      smartObj.init('positioner', 1, {
        5536: {
          write (val, cb) {
            cb(null, this)
          }
        }
      })

      smartObj.write('positioner', 1, 5536, 10, (err, val) => {
        expect(err).to.be.equal(null)
        if (val === smartObj.positioner[1]) done()
      })
    })
  })

  describe('#exec', () => {
    it('should bind this to instance itself in exec method', (done) => {
      smartObj.init('positioner', 2, {
        5605: {
          exec (cb) {
            cb(null, this)
          }
        }
      })

      smartObj.exec('positioner', 2, 5605, [], (err, val) => {
        expect(err).to.be.equal(null)
        if (val === smartObj.positioner[2]) done()
      })
    })
  })
})
