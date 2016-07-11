'use strict';

var _ = require('busyman'),
    utils = require('./utils'),
    ObjInstance = require('./object_instance');

function SmartObject() {}

/*************************************************************************************************/
/*** Public Methods: Smart Object Initialization                                               ***/
/*************************************************************************************************/
// ok
SmartObject.prototype.create = function (oid, iid, opt) {
    var oidkey;

    opt = opt || { ipsoOnly: false };

    if (_.isNil(iid))
        throw new TypeError('iid should be given with a number or a string.');
    else if (!_.isPlainObject(opt))
        throw new TypeError('opt should be an object if given.');
    else if (opt.ipsoOnly && !_.isNumber(iid))
        throw new TypeError('iid must be a number (ipsoOnly).');
    else if (opt.ipsoOnly && !utils.isIpsoOid(oid))
        throw new Error('oid in not an IPSO-defined Object.');

    oidKey = utils.getOidKey(oid);
    this[oidKey] = this[oidKey] || {};

    if (!_.isNil(this[oidKey][iid]))
        throw new Error('Object instance of iid ' + iid + ' already exists. Cannot create.');

    this[oidKey][iid] = new ObjInstance(oid, iid);

    return this[oidKey][iid];
};

/*************************************************************************************************/
/*** Public Methods: Smart Object Initialization                                               ***/
/*************************************************************************************************/
// // ok, throw error if namepace doesn't exist, throw error if namepace doesn't exist
// SmartObject.prototype.insert = function (oid, iid, resrcs, opt) {
//     var objInst = this.get(oid, iid);

//     if (!objInst)
//         throw new Error('No such Object or Object Instance, cannot insert resources to it.');

//     return objInst.insert(resrcs, opt);
// };

// ok, auto create namespace
SmartObject.prototype.init = function (oid, iid, resrcs, opt) {
    var objInst = this.get(oid, iid) || this.create(oid, iid, opt);

    return objInst.init(resrcs, opt);
};

/*************************************************************************************************/
/*** Public Methods: Synchronous                                                               ***/
/*************************************************************************************************/
// ok
SmartObject.prototype.has = function (oid, iid, rid) {
    var oidKey = utils.getOidKey(oid),
        obj = this[oidKey],
        objInst,
        resrc,
        has = !!obj;

    if (has) {
        if (!_.isUndefined(iid)){
            objInst = obj[iid];
            has = !!objInst;
            if (has && !_.isUndefined(rid)) {
                resrc = objInst.get(rid);
                has = !_.isUndefined(resrc);
            }
        }
    }

    return has;
};

// ok
SmartObject.prototype.objectList = function () {
    var objList = [];

    _.forEach(this, function (obj, oidKey) {
        if (_.isObject(obj)) {
            _.forEach(obj, function (inst, iid) {
                var iidNum = parseInt(iid);
                iidNum = _.isNaN(iidNum) ? iid : iidNum;

                if (_.isObject(inst))
                    objList.push({ oid: utils.getOidNum(oidKey), iid: iidNum });
            });
        }
    });

    return objList;
};

// ok
SmartObject.prototype.get = function (oid, iid, rid) {
    var oidkey = utils.getOidKey(oid), 
        ridkey,
        target = this[oidkey];

    if (target) {
        if (!_.isNil(iid)) {
            if (!isValidArgType(iid))
                throw new TypeError('iid should be a String or a Number.');

            target = target[iid];

            if (!_.isUndefined(target) && !_.isUndefined(rid))
                target = target.get(rid);
        }
    }

    return target;
};

SmartObject.prototype.setResource = function (oid, iid, rid, value) {
    var oidkey = getOidKey(oid), 
        ridkey = getRidKey(oid, rid),
        set = false;

    if (!isValidArgType(iid))
        throw new TypeError('iid should be a String or a Number.');
    
    if (!this.has(oid, iid, rid))
        return set;

    this[oidkey][iid][ridkey] = value;
    set = true;

    return set;
};

function dumpSync() {
    var dump = {};

    _.forEach(this, function (obj, oidKey) {
        if (_.isObject(obj)) {
            dump[oidKey] = {};

            _.forEach(obj, function (iObj, iid) {
                dump[oidKey][iid] = {};
                _.forEach(iObj, function (rsc, ridKey) {
                    dump[oidKey][iid][ridKey] = rsc._isCb ? '_callback_' : _.cloneDeep(rsc);
                });
            });
        }

    });

    return dump;
}
/*************************************************************************************************/
/*** Public Methods: Asynchronous                                                              ***/
/*************************************************************************************************/
SmartObject.prototype.dump = function (oid, iid, callback) {
    var dumped = {},
        dumpType = 'so';

    if (arguments.length === 0) {
        callback = undefined;
        dumpType = 'so';
    } else if (arguments.length === 1) {
        callback = oid;
        dumpType = 'so';
    } else if (arguments.length === 2) {
        callback = iid;
        dumpType = 'obj';
    } else if (arguments.length === 3) {
        dumpType = 'objInst';
    } else {
        throw new Error('Bad arguments.');
    }

    if (!_.isFunction(callback))
        throw new Error('Callback should be a function.');

    if (dumpType === 'so')
        dumpSmartObject(this, callback);
    else if (dumpType === 'obj')
        dumpObject(this, oid, callback);
    else if (dumpType === 'objInst')
        dumpObjectInstance(this, oid, iid, callback);
    else
        invokeCbNextTick(new Error('Unkown type to dump.'), null, callback);

};

// ok
SmartObject.prototype.read = function (oid, iid, rid, callback) {
    var objInst = this.get(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'));
    else
        return objInst.read(rid, callback);
};

// ok
SmartObject.prototype.write = function (oid, iid, rid, value, callback) {
    var objInst = this.get(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'));
    else
        return objInst.read(rid, value, callback);
};

// ok
SmartObject.prototype.exec = function (oid, iid, rid, argus, callback) {
    var objInst = this.get(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'));
    else
        return objInst.exec(rid, argus, callback);
};

/*************************************************************************************************/
/*** Private Functions:  Asynchronous Data Dumper                                              ***/
/*************************************************************************************************/
function dumpObjectInstance(so, oid, iid, callback) {
    var objInst = so.get(oid, iid),
        dumped = objInst ? {} : null,
        resrcNum = objInst ? _.keys(objInst).length : 0;

    if (!objInst) {
        callback(new Error('Target not found, cannot dump.'), null)
    } else {
        _.forEach(objInst, function (val, ridKey) {
            so.readResource(oid, iid, ridKey, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    dumped[ridKey] = data;
                    resrcNum -= 1;

                    if (resrcNum === 0 && _.isFunction(callback))
                        callback(null, dumped);
                }
            });
        });
    }
}

function dumpObject(so, oid, callback) {
    var obj = so.get(oid),
        dumped = obj ? {} : null,
        instNum = obj ? _.keys(obj).length : 0;

    if (!obj) {
        callback(new Error('Target not found, cannot dump.'), null);
    } else {
        _.forEach(obj, function (objInst, iidKey) {
            dumpObjectInstance(so, oid, iidKey, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    dumped[iidKey] = data;
                    instNum -= 1;

                    if (instNum === 0 && _.isFunction(callback))
                        callback(null, dumped);
                }
            });
        });
    }
}

function dumpSmartObject(so, callback) {
    var dumped = {},
        objNum = _.keys(so).length;

    _.forEach(so, function (obj, oidKey) {
        dumpObject(so, oidKey, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                dumped[oidKey] = data;
                objNum -= 1;

                if (objNum === 0 && _.isFunction(callback))
                    callback(null, dumped);
            }
        });
    });
}



module.exports = SmartObject;
