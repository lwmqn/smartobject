'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

var utils = {};

utils.isValidArgType = function (param) {
    return _.isNumber(param) ? !isNaN(param) : _.isString(param);
};

utils.isIpsoOid = function (oid) {
    return lwm2mId.getOid(oid) ? true : false;
};

utils.getOidKey = function (oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : oid;
};

utils.getOidNum = function (oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.value : oid;
};

utils.getRidKey = function (oid, rid) {
    // lwm2m-id itself will throw TypeError if rid is not a string and not a number
    var ridItem = lwm2mId.getRid(oid, rid);
    return ridItem ? ridItem.key : rid;
};

utils.invokeCbNextTick = function (err, val, cb) {
    if (_.isFunction(cb)) {
        process.nextTick(function () {
            cb(err, val);
        });
    }
};

/*************************************************************************************************/
/*** Synchronous Data Dumper                                                                   ***/
/*************************************************************************************************/
utils.dumpObjectSync = function (obj) {
    var dumped = {};

    _.forEach(obj, function (inst, instId) {
        dumped[instId] = inst.dumpSync();
    });

    return dumped;
};

/*************************************************************************************************/
/*** Asynchronous Data Dumper                                                                  ***/
/*************************************************************************************************/
utils.dumpObject = function (obj, callback, opt) {
    var dumped = {},
        instNum = _.isObject(obj) ? _.keys(obj).length : 0,
        errReturned = false;

    _.forEach(obj, function (inst, instId) {
        inst.dump(function (err, resrcs) {
            if (err && !errReturned) {
                // do not (instNum - 1), or callback will be invoked twice
                errReturned = true;
                callback(err, null);
            } else {
                dumped[instId] = resrcs;
                instNum -= 1;

                if (instNum === 0)
                    callback(null, dumped);
            }
        }, opt);
    });
};

utils.dumpSmartObject = function (so, callback, opt) {
    var dumped = {},
        objNum = 0,
        errReturned = false;

    _.forEach(so, function (obj, oidKey) {
        if (_.isObject(obj))
            objNum += 1;
    });

    _.forEach(so, function (obj, oidKey) {
        utils.dumpObject(obj, function (err, data) {
            if (err && !errReturned) {
                errReturned = true;
                callback(err, null);
            } else {
                dumped[oidKey] = data;
                objNum -= 1;

                if (objNum === 0)
                    callback(null, dumped);
            }
        }, opt);
    });
};

utils.cloneResourceObject = function (rObj) {
    var cloned = {};

    if (rObj._isCb) {
        _.forEach(rObj, function (rval, rkey) {
            if (rkey === 'read' || rkey === 'write' || rkey === 'write')
                cloned[rkey] = '_' + rkey + '_';    // '_read_', '_write_', '_exec_'
        });
    } else {
        _.forEach(rObj, function (rval, rkey) {
            if (_.isFunction(rval))
                return;

            cloned[rkey] = rval;
        });
    }

    delete cloned._isCb;
    return cloned;
};

module.exports = utils;
