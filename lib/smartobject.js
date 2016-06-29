'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

function SmartObject() {}

SmartObject.prototype.dump = function (callback) {
    var self = this,
        dump = {},
        count = numOfResources(this);

    _.forEach(this, function (obj, oid) {
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

SmartObject.prototype.dumpSync = function () {
    var dump = {};

    _.forEach(this, function (obj, oid) {
        dump[oid] = {};
        _.forEach(obj, function (iObj, iid) {
            dump[oid][iid] = {};
            _.forEach(iObj, function (rsc, rid) {
                dump[oid][iid][rid] = rsc._isCb ? '_callback_' : rsc;
            });
        });
    });

    return dump;
};

SmartObject.prototype.has = function (oid, iid, rid) {
    var oidkey, 
        ridkey,
        has = false;

    if (!_.isUndefined(iid) && !isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isUndefined(rid) && !isValidArgType(rid)) 
        throw new TypeError('rid should be a String or a Number.');

    oidkey = getOidKey(oid);

    has = !_.isUndefined(this[oidkey]);

    if (has && !_.isUndefined(iid)) {
        has = !_.isUndefined(this[oidkey][iid]);
        if (has && !_.isUndefined(rid)) {
            ridkey = getRidKey(oid, rid);
            has = !_.isUndefined(this[oidkey][iid][ridkey]);
        }
    }

    return has;
};

/************************ createAny is dangerous ********************/
SmartObject.prototype.createAny = function (oid) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    this[oid] = this[oid] || {};
    return oid;
};
/********************************************************************/

SmartObject.prototype.create = function (oid) {
    var oidKey = getOidKey(oid);
    return isIpsoOid(oidKey) ? this.createAny(oidKey) : null;
};

SmartObject.prototype.addResource = function (oid, iid, rsc) {
    var self = this,
        oidKey = getOidKey(oid),
        ridKey = null,
        newIObj = false;

    if (!this.has(oidKey))
        return null;

    if (_.isPlainObject(iid) && _.isNil(rsc)) {
        rsc = iid;
        iid = null;
    }

    if (_.isNil(iid))
        iid = getFreeIid(this, oidKey);
    else if (!isValidArgType(iid))
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isPlainObject(rsc) || _.isEmpty(rsc)) 
        throw new TypeError('resource should be an object, and the object should not be empty.');

    this[oidKey][iid] = this[oidKey][iid] || {};

    _.forEach(rsc, function (val, rid) {
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

    if (!this.has(oid, iid, rid)) {
        invokeCbNextTick(new Error('Resource not found.'), null, callback);
    } else {
        rsc = this[oidKey][iid][ridKey];

        if (_.isObject(rsc) && rsc._isCb) {
            if (_.isFunction(rsc.read)) {
                rsc.read(function (err, val) {
                    invokeCbNextTick(err, val, callback);
                });
            } else if (_.isFunction(rsc.exec)) {
                invokeCbNextTick(null, '_exec_', callback);
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

/*********************************************************
 * private function                                      *
 *********************************************************/
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

function getFreeIid(so, oid) {
    var iid = 0;

    if (so[oid]) {
        while (so[oid][iid]) {
          iid += 1;
        }
    } 

    return iid;
}

function numOfResources(so) {
    var count = 0;

    _.forEach(so, function (obj, oid) {
        _.forEach(obj, function (iObj, iid) {
            _.forEach(iObj, function (rsc, rid) {
                count += 1;
            });
        });
    });

    return count;
}

module.exports = SmartObject;
