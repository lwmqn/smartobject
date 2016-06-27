'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

function SmartObject() {}

SmartObject.prototype.dump = function (callback) {
    var self = this,
        dump = {},
        count = 0,
        chkErr = null;

    _.forEach(this, function (obj, oid) {
        _.forEach(obj, function (iObj, iid) {
            _.forEach(iObj, function (rsc, rid) {
                count += 1;
            });
        });
    });

    _.forEach(this, function (obj, oid) {
        dump[oid] = {};
        _.forEach(obj, function (iObj, iid) {
            dump[oid][iid] = {};
            _.forEach(iObj, function (rsc, rid) {
                self.readResource(oid, iid, rid, function (err, data) {
                    chkErr = chkErr || err;
                    dump[oid][iid][rid] = data;
                    count -= 1;

                    if (count === 0 && _.isFunction(callback))
                        callback(chkErr, dump);
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
                if (rsc._isCb)
                    dump[oid][iid][rid] = 'Function';
                else
                    dump[oid][iid][rid] = rsc;  
            });
        });
    });

    return _.cloneDeep(dump);
};

SmartObject.prototype.has = function (oid, iid, rid) {
    var oidkey = getOidKey(oid), 
        ridkey,
        has = false;

    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    if (!_.isNil(iid) && !isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isNil(rid) && !isValidArgType(rid)) 
        throw new TypeError('rid should be a String or a Number.');

    if (!_.isUndefined(oid)) {
        has = !_.isUndefined(this[oidkey]);
        if (has && !_.isUndefined(iid)) {
            has = !_.isUndefined(this[oidkey][iid]);
            if (has && !_.isUndefined(rid)) {
                ridkey = getRidKey(oid, rid);
                has = !_.isUndefined(this[oidkey][iid][ridkey]);
            }
        }
    }

    return has;
};

SmartObject.prototype.create = function (oid) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    var oidKey = getOidKey(oid);

    if (!isIpsoOid(oidKey))
        return null;
    else 
        return this.createAny(oidKey);
};

/************************ DANGEROUS ************************/
SmartObject.prototype.createAny = function (oid) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    this[oid] = this[oid] || {};
   
    return oid;
};

SmartObject.prototype.addResource = function (oid, iid, rsc) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    var self = this,
        oidKey = getOidKey(oid),
        ridKey = null,
        newIObj = false;

    if (_.isPlainObject(iid) && _.isNil(rsc)) {
        rsc = iid;
        iid = null;
    }
    
    if (!this.has(oidKey))
        return null;

    if (_.isNil(iid)) {
        iid = unoccupiedIid(this, oidKey);
    } else if (!isValidArgType(iid)) {
        throw new TypeError('iid should be a String or a Number.');
    }

    if (!_.isPlainObject(rsc) || _.isEmpty(rsc)) 
        throw new TypeError('resource should be an object, and the object should be not empty.');

    this[oidKey][iid] = this[oidKey][iid] || {};

    _.forEach(rsc, function (val, key) {
        if (_.isFunction(val) || _.isNil(val)) 
            throw new TypeError('resource cannot be a function, null, or undefined.');

        ridKey = getRidKey(oidKey, key);

        if (_.isObject(val))
            val._isCb = _.isFunction(val.read) || _.isFunction(val.write) || _.isFunction(val.exec);

        self[oidKey][iid][ridKey] = val;
    });

    return { oid: oidKey, iid: iid.toString(), rid: ridKey };
};

SmartObject.prototype.readResource = function (oid, iid, rid, callback) {
    if (!isValidArgType(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    if (!isValidArgType(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    if (!isValidArgType(rid)) 
        throw new TypeError('rid should be a String or a Number.');

    var oidKey = getOidKey(oid),
        ridKey = getRidKey(oid, rid),
        rsc;

    function invokeCb(err, val, cb) {
        if (_.isFunction(cb))
            process.nextTick(function () {
                cb(err, val);
            });
    }

    if (!this.has(oid, iid, rid)) {
        invokeCb(new Error('not found the resource.'), null, callback);
    } else {
        rsc = this[oidKey][iid][ridKey]; 

        if (_.isObject(rsc) && rsc._isCb) {
            if (_.isFunction(rsc.read)) {
                rsc.read(function (err, val) {
                    invokeCb(err, val, callback);
                });
            } else if (_.isFunction(rsc.exec)) {
                invokeCb(null, '_exec_', callback);
            } else {
                invokeCb(null, '_unreadable_', callback);
            }
        } else if (_.isObject(rsc)) {
            invokeCb(null, _.omit(rsc, ['_isCb']), callback);
        } else { 
            invokeCb(null, rsc, callback);
        }
    }
};

/*********************************************************
 * private function                                      *
 *********************************************************/
function isValidArgType(param) {
    var isValid = true;

    if (typeof param !== 'number' && typeof param !== 'string') {
        isValid = false;
    } else if (typeof param === 'number') {
        isValid = !isNaN(param);
    }

    return isValid;
}

function isIpsoOid (oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? true : false;
}

function getOidKey (oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : oid;
}

function getRidKey (oid, rid) {
    var ridItem = lwm2mId.getRid(oid, rid);

    if (_.isUndefined(rid))
        rid = oid;

    return ridItem ? ridItem.key : rid;
}

function unoccupiedIid(so, oid) {
    var iid = 0;

    if (so[oid]) {
        while (so[oid][iid]) {
          iid++;
        }
    } 

    return iid;
}

module.exports = SmartObject;
