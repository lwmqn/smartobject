const _ = require('busyman')
const lwm2mId = require('lwm2m-id')

const utils = require('./utils')

function ObjectInstance (oidKey, iid, parent) {
  if (!_.isString(oidKey)) throw new TypeError("oid should be a string, such as 'temperature'.")

  const oDef = lwm2mId.getOdef(oidKey)
  if (oDef && !oDef.multi) {
    if (iid !== 0 && iid !== '0') throw new Error(`Object ${oidKey} does not acccept multiple instances, its iid must always be 0.`)
  }

  this.oid = oidKey // oid is a string
  this.iid = iid // iid is a string or a number

  Object.defineProperty(this, 'parent', {
    value: parent, writable: false, enumerable: false, configurable: false
  })
  Object.defineProperty(this, '_state', {
    value: {}, writable: false, enumerable: false, configurable: false
  })
}

/** ********************************************************************************************** */
/** * Public Methods: Getter and Setter                                                         ** */
/** ********************************************************************************************** */
ObjectInstance.prototype.init = function (resrcs, setup) {
  // each time of init(), all resources and inner resrcs._state will be cleared. Use .set() to add/modify resource
  const self = this.clear()

  if (!_.isPlainObject(resrcs)) throw new TypeError('Resources should be wrapped in an object.')

  if (!_.isUndefined(setup) && !_.isFunction(setup)) throw new TypeError('setup should be a function if given.')

  if (!_.isUndefined(resrcs._state)) {
    if (_.isPlainObject(resrcs._state)) _.assign(this._state, resrcs._state)
    else throw new TypeError('resrcs._state must be an object if given.')

    delete resrcs._state
  }

  _.forEach(resrcs, (rVal, rKey) => {
    if (self.parent.ipsoOnly) {
      if (!lwm2mId.getRid(self.oid, rKey)) throw new TypeError(`Resource id: ${rKey} is not an IPSO-defined resource.`)
    }

    if (_.isObject(rVal)) {
      rVal._isCb = _.isFunction(rVal.read) || _.isFunction(rVal.write) || _.isFunction(rVal.exec)

      if (_.isFunction(rVal.read)) rVal.read = rVal.read.bind(self)

      if (_.isFunction(rVal.write)) rVal.write = rVal.write.bind(self)

      if (_.isFunction(rVal.exec)) rVal.exec = rVal.exec.bind(self)
    }

    self.set(rKey, rVal) // set will turn rid to string
  })

  if (_.isFunction(setup)) setup.call(this)
}

ObjectInstance.prototype.has = function (rid) {
  const ridkey = validateRid(rid) && utils.getRidKey(this.oid, rid)

  return Object.prototype.hasOwnProperty.call(this, ridkey)
}

ObjectInstance.prototype.get = function (rid) {
  const ridkey = validateRid(rid) && utils.getRidKey(this.oid, rid)

  return this[ridkey]
}

ObjectInstance.prototype.set = function (rid, value) {
  if (_.isUndefined(value) || _.isFunction(value)) throw new TypeError('Resource cannot be a function or undefined.')

  const ridkey = validateRid(rid) && utils.getRidKey(this.oid, rid)

  this[ridkey] = value

  return this
}

ObjectInstance.prototype.clear = function () {
  const self = this
  const { _state } = this

  _.forEach(this, (v, k) => {
    // 'parent' and '_state' will not be enumerated
    if (k === 'oid' || k === 'iid') return

    self[k] = null
    delete self[k]
  })

  // clean inner _state
  _.forEach(_state, (v, k) => {
    _state[k] = null
    delete _state[k]
  })

  return this
}

ObjectInstance.prototype.dump = function (opt, callback) {
  // do not dump keys: 'oid', 'iid'. 'parent' and _state' are un-enumerable, thus won't be dumped.
  const self = this
  const dumped = {}
  let errReturned = false
  let resrcNum = _.keys(this).length

  if (_.isFunction(opt)) {
    callback = opt
    opt = undefined
  }

  function tryDumping (err) {
    if (err) {
      // do not (resrcNum - 1), or callback will be invoked twice
      errReturned = true
      callback(err, null)
    } else {
      resrcNum -= 1
      if (resrcNum === 0) callback(null, dumped)
    }
  }

  _.forEach(this, (val, ridKey) => {
    if (ridKey === 'oid' || ridKey === 'iid') return tryDumping()

    self.read(ridKey, opt, (err, data) => {
      const isUnreadable = err && (data === '_exec_' || data === '_unreadable_')

      if (!err || isUnreadable) {
        dumped[ridKey] = data
        tryDumping()
      } else if (err && !errReturned) {
        tryDumping(err)
      }
    })
  })
}

ObjectInstance.prototype.dumpSync = function () {
  // do not dump keys: 'oid', 'iid'
  const dumped = {}

  _.forEach(this, (rval, ridKey) => {
    let clonedObj

    if (ridKey === 'oid' || ridKey === 'iid' || _.isFunction(rval)) return

    if (_.isObject(rval)) {
      clonedObj = utils.cloneResourceObject(rval)
      dumped[ridKey] = clonedObj
    } else if (!_.isFunction(rval)) {
      dumped[ridKey] = rval
    }
  })

  return dumped
}

/** ********************************************************************************************** */
/** * Public Methods: Asynchronous Read/Write/Exec                                              ** */
/** ********************************************************************************************** */
ObjectInstance.prototype.read = function (rid, opt, callback) {
  const self = this
  const rsc = this.get(rid)

  if (_.isFunction(opt)) {
    callback = opt
    opt = undefined
  }

  opt = opt || { restrict: false }

  if (!validateResource(rsc, callback)) return
  if (!_.isPlainObject(opt)) throw new TypeError('opt should be an object if given.')

  function restrictRead (rsc, cb) {
    const rdef = lwm2mId.getRdef(self.oid, rid)
    const isReadable = rdef && (rdef.access === 'R' || rdef.access === 'RW')

    // no definition is always readable
    if (!rdef || isReadable) {
      return utils.invokeCbNextTick(null, rsc, cb)
    }
    utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', cb)
  }

  if (!_.isPlainObject(rsc)) return opt.restrict ? restrictRead(rsc, callback) : utils.invokeCbNextTick(null, rsc, callback)

  // if we are here, rsc is a plain object
  if (!rsc._isCb) return opt.restrict ? restrictRead(rsc, callback) : utils.invokeCbNextTick(null, _.omit(rsc, ['_isCb']), callback)

  // rsc should be read from users callback
  // an exec resource cannot be read, so checks for it first
  if (_.isFunction(rsc.exec)) {
    return utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_exec_', callback)
  }

  if (!_.isFunction(rsc.read)) return utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', callback)

  rsc.read((err, val) => {
    utils.invokeCbNextTick(err, val, callback)
  })
}

ObjectInstance.prototype.write = function (rid, value, opt, callback) {
  const self = this
  const rsc = this.get(rid)

  if (_.isFunction(opt)) {
    callback = opt
    opt = undefined
  }

  opt = opt || { restrict: false }

  if (!validateResource(rsc, callback)) return
  if (!_.isPlainObject(opt)) throw new TypeError('opt should be an object if given.')

  function restrictWrite (valToWrite, cb) {
    const rdef = lwm2mId.getRdef(self.oid, rid)
    const isWritable = rdef && (rdef.access === 'W' || rdef.access === 'RW')

    if (!rdef || isWritable) { // no definition is always writable
      self.set(rid, valToWrite)
      return utils.invokeCbNextTick(null, valToWrite, cb)
    }
    return utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', cb)
  }

  if (!_.isPlainObject(rsc)) {
    if (!opt.restrict) this.set(rid, value)
    return opt.restrict ? restrictWrite(value, callback) : utils.invokeCbNextTick(null, value, callback)
  }

  // if we are here, rsc is a plain object
  if (!rsc._isCb) {
    if (!opt.restrict) this.set(rid, value)
    return opt.restrict ? restrictWrite(value, callback) : utils.invokeCbNextTick(null, _.omit(value, ['_isCb']), callback)
  }

  // rsc should be written by users callback
  // an exec resource cannot be written, so checks for it first
  if (_.isFunction(rsc.exec)) {
    return utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_exec_', callback)
  }

  if (!_.isFunction(rsc.write)) return utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', callback)

  rsc.write(value, (err, val) => {
    utils.invokeCbNextTick(err, val, callback)
  })
}

ObjectInstance.prototype.exec = function (rid, argus, callback) {
  const rsc = this.get(rid)

  if (_.isFunction(argus)) {
    callback = argus
    argus = []
  }
  argus = argus || []

  if (_.isUndefined(rsc)) return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback)
  if (!_.isArray(argus)) return utils.invokeCbNextTick(new TypeError('argus should be an array.'), '_badreq_', callback)

  if (!_.isObject(rsc) || !_.isFunction(rsc.exec)) return utils.invokeCbNextTick(new Error('Resource is unexecutable.'), '_unexecutable_', callback)

  argus.push((execErr, rspObj) => { // rspObj: { status, value }
    utils.invokeCbNextTick(execErr, rspObj, callback)
  })
  rsc.exec.apply(this, argus)
}

/** ********************************************************************************************** */
/** * Private Functions                                                                         ** */
/** ********************************************************************************************** */
function validateRid (rid) {
  if (!utils.isValidArgType(rid)) throw new TypeError('rid should be given with a number or a string.')
  return true
}

function validateResource (rsc, callback) {
  let isValid = false

  if (_.isUndefined(rsc)) utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback)
  else if (_.isFunction(rsc)) utils.invokeCbNextTick(new Error('Resource cannot be a function.'), '_notfound_', callback)
  else isValid = true

  return isValid
}

module.exports = ObjectInstance
