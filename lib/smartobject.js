'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

function SmartObject(role) {
// [!-start]
    // Default is for client-side use, should have read/write/exec callback scheme
    this._role = role || 'client';

    if (role === 'client') {
        this.prototype.writeResource = writeResource;
        this.prototype.execResource = execResource;
    } else if (role === 'server') {
        this.prototype.readResourceSync = readResourceSync;
        this.prototype.dumpSync = dumpSync;
    } else {
        throw new Error('Unknown role, cannot instantiate the smart object.');
    }
// [!-end]
}

/*************************************************************************************************/
/*** Public Methods                                                                            ***/
/*************************************************************************************************/
// ok
SmartObject.prototype.has = function (oid, iid, rid) {
    var oidkey = getOidKey(oid), 
        ridkey,
        has = false;

    if (!_.isUndefined(iid) && !isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isUndefined(rid) && !isValidArgType(rid)) 
        throw new TypeError('rid should be a String or a Number.');

    has = _.isObject(this[oidkey]);

    if (has && !_.isNil(iid)) {
        has = has && _.isObject(this[oidkey][iid]);
        if (has && !_.isNil(rid)) {
            ridkey = getRidKey(oid, rid);
            has = !_.isUndefined(this[oidkey][iid][ridkey]);
        }
    }

    return has;
};

// ok, this is like readSync
SmartObject.prototype.get = function (oid, iid, rid) {
    var oidkey = getOidKey(oid), 
        ridkey,
        target;

    if (this.has(oid, iid, rid)) {
        target = this[oidkey];

        if (!_.isNil(iid)) {
            target = this[oidkey][iid];

            if (!_.isNil(rid)) {
                ridkey = getRidKey(oid, rid);
                target = this[oidkey][iid][ridkey];
            }
        }
    }

    return target;
};

// ok, like write sync
SmartObject.prototype.setResource = function (oid, iid, rid, value) {
    var oidkey = getOidKey(oid), 
        ridkey,
        set = false;

    if (!this.has(oid, iid, rid))
        return set;

    this[oidkey][iid][ridkey] = value;
    set = true;

    return set;
};

// ok
SmartObject.prototype.objectList = function (oid, iid, rid) {
    var objList = [];

    _.forEach(this, function (obj, oid) {
        if (_.isObject(obj)) {
            _.forEach(obj, function (inst, iid) {
                var iidNum = parseInt(iid);
                iidNum = _.isNaN(iidNum) ? iid : iidNum;

                if (_.isObject(inst))
                    objList.push({ oid: getOidNum(oid), iid: iidNum });
            });
        }
    });

    return objList;
};

// ok
SmartObject.prototype.create = function (oid) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    this[oid] = this[oid] || {};
    return oid;
};

// ok
// Use createIpsoOnly() if the user like me to check for him
SmartObject.prototype.createIpsoOnly = function (oid) {
    var oidKey = getOidKey(oid);
    return isIpsoOid(oidKey) ? this.create(oidKey) : null;
};

SmartObject.prototype.addResources = function (oid, iid, resrcs) {
    var self = this,
        oidKey = getOidKey(oid),
        ridKey = null,
        newIObj = false;

    if (!this.has(oidKey))
        return null;

    if (_.isPlainObject(iid) && _.isNil(resrcs)) {
        resrcs = iid;
        iid = null;
    }

    if (_.isNil(iid)) {
        if (this._role === 'server')
            throw new TypeError('iid must be given, and it should be a String or a Number.');
        else
            iid = getFreeIid(this, oidKey);
    }

    if (!isValidArgType(iid))
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isPlainObject(resrcs) || _.isEmpty(resrcs)) 
        throw new TypeError('resource should be an object, and the object should not be empty.');

    this[oidKey][iid] = this[oidKey][iid] || {};

    _.forEach(resrcs, function (val, rid) {
        if (_.isFunction(val) || _.isNil(val))  {
            // [FIXME] why we don't accept null?
            throw new TypeError('resource cannot be a function, null, or undefined.');
        }

        ridKey = getRidKey(oidKey, rid);

        if (_.isObject(val))
            val._isCb = _.isFunction(val.read) || _.isFunction(val.write) || _.isFunction(val.exec);

        self[oidKey][iid][ridKey] = val;
    });

    return {
        oid: oidKey,
        iid: iid.toString(),
        rid: ridKey
    };
};

SmartObject.prototype.readResource = function (oid, iid, rid, callback) {
    if (!isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    var oidKey = getOidKey(oid),
        ridKey = getRidKey(oid, rid),
        rsc;

    function invokeCbNextTick(err, val, cb) {
        if (_.isFunction(cb))
            process.nextTick(function () {
                cb(err, val);
            });
    }

    rsc = this.get(oid, iid, rid);

    if (_.isUndefined(rsc)) {
        invokeCbNextTick(new Error('Resource not found.'), null, callback);
    } else {
        // an exec resource cannot be read, so checks for it first
        if (_.isObject(rsc) && rsc._isCb) {
            if (_.isFunction(rsc.exec)) {
                invokeCbNextTick(null, '_unreadable_', callback);
            } else if (_.isFunction(rsc.read)) {
                rsc.read(function (err, val) {
                    invokeCbNextTick(err, val, callback);
                });
            } else {
                invokeCbNextTick(null, '_unreadable_', callback);
            }
        } else if (_.isObject(rsc)) {
            invokeCbNextTick(null, _.omit(rsc, [ '_isCb' ]), callback);
        } else { 
            invokeCbNextTick(null, rsc, callback);
        }
    }
};

SmartObject.prototype.dump = function (callback) {
    var self = this,
        dump = {},
        count = numOfResources(this);
// [!-start]
    _.forEach(this, function (obj, oid) {
        if (oid === '_role') return;    // skip this inner tag
// [!-end]
        dump[oid] = {};                                 // create a {} for each oid (Object)
        _.forEach(obj, function (iObj, iid) {
            dump[oid][iid] = {};                        // create a {} for each iid (iObject)
            _.forEach(iObj, function (rsc, rid) {       // asyncly dump resources into an iObject
                self.readResource(oid, iid, rid, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        dump[oid][iid][rid] = data;
                        count -= 1;

                        if (count === 0 && _.isFunction(callback))
                            callback(null, dump);
                    }
                });
            });
        });
    });
};

/*************************************************************************************************/
/*** Client-only prototype methods                                                             ***/
/*************************************************************************************************/
// [!-start]
function writeResource(oid, iid, rid, value, callback) {
    var oidKey = getOidKey(oid),
        ridKey,
        rsc;

    if (!isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    ridKey = getRidKey(oid, rid);

    function invokeCbNextTick(err, val, cb) {
        if (_.isFunction(cb))
            process.nextTick(function () {
                cb(err, val);
            });
    }

    if (!this.has(oid, iid, rid)) {
        invokeCbNextTick(new Error('Resource not found.'), null, callback);
    } else {
        rsc = this[oidKey][iid][ridKey];

        if (_.isObject(rsc) && rsc._isCb) {
            if (_.isFunction(rsc.exec)) {
                invokeCbNextTick(null, '_unwritable_', callback);
            } else if (_.isFunction(rsc.write)) {
                rsc.write(value, function (err, val) {
                    invokeCbNextTick(err, val, callback);
                });
            } else {
                invokeCbNextTick(null, '_unwritable_', callback);
            }
        } else if (_.isFunction(resrc)) {
            invokeCbNextTick(new Error('Resource cannot be a function.'), null, callback);
        } else { 
            this[oidKey][iid][ridKey] = value;
            invokeCbNextTick(null, value, callback);
        }
    }
};

function execResource(oid, iid, rid, argus, callback) {
    if (!isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    var oidKey = getOidKey(oid),
        ridKey = getRidKey(oid, rid),
        rsc;

    function invokeCbNextTick(err, val, cb) {
        if (_.isFunction(cb))
            process.nextTick(function () {
                cb(err, val);
            });
    }

    if (_.isFunction(argus)) {
        callback = argus;
        argus = [];
    }

    if (_.isUndefined(argus))
        argus = [];

    if (!this.has(oid, iid, rid)) {
        invokeCbNextTick(new Error('Resource not found.'), null, callback);
    } else if (!_.isArray(argus)) {
        invokeCbNextTick(new TypeError('argus should be an array.'), null, callback);
    } else {
        rsc = this[oidKey][iid][ridKey];

        if (_.isObject(rsc) && _.isFunction(rsc.exec)) {
            argus.push(function (execErr, val) {
                invokeCbNextTick(execErr, val, callback);
            });
            rsc.exec.apply(this, argus);
        } else {
            invokeCbNextTick(null, '_unexecutable_', callback);
        }
    }
};
// [!-end]

/*************************************************************************************************/
/*** Server-only prototype methods                                                             ***/
/*************************************************************************************************/
function dumpSync() {
    var dump = {};

    _.forEach(this, function (obj, oid) {
// [!-start]
        if (oid === '_role') return;    // skip this inner tage
// [!-end]

        dump[oid] = {};
        _.forEach(obj, function (iObj, iid) {
            dump[oid][iid] = {};
            _.forEach(iObj, function (rsc, rid) {
                dump[oid][iid][rid] = rsc._isCb ? '_callback_' : _.cloneDeep(rsc);
            });
        });
    });

    return dump;
};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function isValidArgType(param) {
    var isValid = true;

    if (!_.isNumber(param) && !_.isString(param))
        isValid = false;
    else if (_.isNumber(param))
        isValid = !isNaN(param);

    return isValid;
}

function isIpsoOid(oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? true : false;
}

function getOidKey(oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : oid;
}

function getOidNum(oid) {
    // lwm2m-id itself will throw TypeError if oid is not a string and not a number
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.value : oid;
}

function getRidKey(oid, rid) {
    var ridItem;

    if (_.isUndefined(rid)) {
        rid = oid;
        oid = undefined;
    }

    // lwm2m-id itself will throw TypeError if rid is not a string and not a number
    ridItem = lwm2mId.getRid(oid, rid);
    return ridItem ? ridItem.key : rid;
}

function getFreeIid(so, oidKey) {
    var iid = null;

    if (so[oidKey]) {
        iid = 0;

        while (!_.isNil(so[oidKey][iid])) {
          iid += 1;
        }
    }

    return iid;
}

function numOfResources(so) {
    var count = 0;

    _.forEach(so, function (obj, oid) {
// [!-start]
        if (oid === '_role') return;    // skip this inner tag
// [!-end]
        _.forEach(obj, function (iObj, iid) {
            _.forEach(iObj, function (rsc, rid) {
                count += 1;
            });
        });
    });

    return count;
}

module.exports = SmartObject;
