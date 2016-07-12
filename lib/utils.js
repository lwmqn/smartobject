var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

var utils = {};

utils.isValidArgType = function (param) {
    var isValid = true;

    if (!_.isNumber(param) && !_.isString(param))
        isValid = false;
    else if (_.isNumber(param))
        isValid = !isNaN(param);

    return isValid;
}

utils.isIpsoOid = function (oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? true : false;
}

utils.getOidKey = function (oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : oid;
}

utils.getOidNum = function (oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.value : oid;
}

utils.getRidKey = function (oid, rid) {
    var ridItem;

    if (_.isUndefined(rid)) {
        rid = oid;
        oid = undefined;
    }

    // lwm2m-id itself will throw TypeError if rid is not a string and not a number
    ridItem = lwm2mId.getRid(oid, rid);
    return ridItem ? ridItem.key : rid;
}

utils.invokeCbNextTick = function (err, val, cb) {
    if (_.isFunction(cb)) {
        process.nextTick(function () {
            cb(err, val);
        });
    }
}

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
utils.dumpObject = function (obj, callback) {
    var dumped = {},
        instNum = _.isObject(obj) ? _.keys(obj).length : 0;

    _.forEach(obj, function (inst, instId) {
        inst.dump(function (err, resrcs) {
            if (err) {
                // do not (instNum - 1), or callback will be invoked twice
                callback(err, null);
            } else {
                dumped[instId] = resrcs;
                instNum -= 1;

                if (instNum === 0)
                    callback(null, dumped);
            }
        });
    });
};

utils.dumpSmartObject = function (so, callback) {
    var dumped = {},
        objNum = _.keys(so).length;

    _.forEach(so, function (obj, oidKey) {
        utils.dumpObject(obj, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                dumped[oidKey] = data;
                objNum -= 1;

                if (objNum === 0)
                    callback(null, dumped);
            }
        });
    });
};

utils.cloneResourceObject = function (rObj) {
    var cloned = {};

    if (rObj._isCb) {
        _.forEach(rObj, function (rval, rkey) {
            if (rkey === 'read')
                cloned.read = '_read_';
            else if (rkey === 'write')
                cloned.write = '_write_';
            else if (rkey === 'exec')
                cloned.write = '_exec_';
        });
    } else {
        _.forEach(rObj, function (rval, rkey) {
            if (_.isFunction(rval))
                return;
            else
                cloned[rkey] = rval;
        });
    }

    delete cloned._isCb;
    return cloned;
};

module.exports = utils;
