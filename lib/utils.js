
const _ = require('busyman')
const lwm2mId = require('lwm2m-id')

const utils = {}

utils.isValidArgType = function (param) {
  return _.isNumber(param) ? !isNaN(param) : _.isString(param)
}

utils.isIpsoOid = function (oid) {
  return !!lwm2mId.getOid(oid)
}

utils.getOidKey = function (oid) {
  // lwm2m-id itself will throw TypeError if oid is not a string and not a number
  const oidItem = lwm2mId.getOid(oid)
  return oidItem ? oidItem.key : oid
}

utils.getOidNum = function (oid) {
  // lwm2m-id itself will throw TypeError if oid is not a string and not a number
  const oidItem = lwm2mId.getOid(oid)
  return oidItem ? oidItem.value : oid
}

utils.getRidKey = function (oid, rid) {
  // lwm2m-id itself will throw TypeError if rid is not a string and not a number
  const ridItem = lwm2mId.getRid(oid, rid)
  return ridItem ? ridItem.key : rid
}

utils.invokeCbNextTick = function (err, val, cb) {
  if (_.isFunction(cb)) {
    process.nextTick(() => {
      cb(err, val)
    })
  }
}

/** ********************************************************************************************** */
/** * Synchronous Data Dumper                                                                   ** */
/** ********************************************************************************************** */
utils.dumpObjectSync = function (obj) {
  const dumped = {}

  _.forEach(obj, (inst, instId) => {
    dumped[instId] = inst.dumpSync()
  })

  return dumped
}

/** ********************************************************************************************** */
/** * Asynchronous Data Dumper                                                                  ** */
/** ********************************************************************************************** */
utils.dumpObject = function (obj, opt, callback) {
  const dumped = {}
  let instNum = _.isObject(obj) ? _.keys(obj).length : 0
  let errReturned = false

  if (_.isFunction(opt)) {
    callback = opt
    opt = undefined
  }

  _.forEach(obj, (inst, instId) => {
    inst.dump(opt, (err, resrcs) => {
      if (err && !errReturned) {
        // do not (instNum - 1), or callback will be invoked twice
        errReturned = true
        callback(err, null)
      } else {
        dumped[instId] = resrcs
        instNum -= 1

        if (instNum === 0) callback(null, dumped)
      }
    })
  })
}

utils.dumpSmartObject = function (so, opt, callback) {
  const dumped = {}
  let objNum = 0
  let errReturned = false

  if (_.isFunction(opt)) {
    callback = opt
    opt = undefined
  }

  _.forEach(so, (obj, oidKey) => {
    if (_.isObject(obj)) objNum += 1
  })

  _.forEach(so, (obj, oidKey) => {
    utils.dumpObject(obj, opt, (err, data) => {
      if (err && !errReturned) {
        errReturned = true
        callback(err, null)
      } else {
        dumped[oidKey] = data
        objNum -= 1

        if (objNum === 0) callback(null, dumped)
      }
    })
  })
}

utils.cloneResourceObject = function (rObj) {
  const cloned = {}

  if (rObj._isCb) {
    _.forEach(rObj, (rval, rkey) => {
      if (rkey === 'read' || rkey === 'write' || rkey === 'write') cloned[rkey] = `_${rkey}_` // '_read_', '_write_', '_exec_'
    })
  } else {
    _.forEach(rObj, (rval, rkey) => {
      if (_.isFunction(rval)) return

      cloned[rkey] = rval
    })
  }

  delete cloned._isCb
  return cloned
}

module.exports = utils
