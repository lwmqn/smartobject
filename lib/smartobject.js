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
                self.readResrc(oid, iid, rid, function (err, data) {
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
    var self = this,
        dumped = {};

    _.forOwn(this, function (n, key) {
        dumped[key] = n;
    });

    return _.cloneDeep(dumped);
};

SmartObject.prototype.has = function (oid, iid, rid) {
    var oidkey = oidKey(oid), 
        ridkey,
        has = false;

    if (!_.isString(oid) && !_.isNumber(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    if (!_.isNil(iid) && !_.isString(iid) && !_.isNumber(iid)) 
        throw new TypeError('iid should be a String or a Number.');

    if (!_.isNil(rid) && !_.isString(rid) && !_.isNumber(rid)) 
        throw new TypeError('rid should be a String or a Number.');

    if (!_.isUndefined(oid)) {
        has = !_.isUndefined(this[oidkey]);
        if (has && !_.isUndefined(iid)) {
            has = !_.isUndefined(this[oidkey][iid]);
            if (has && !_.isUndefined(rid)) {
                ridkey = ridKey(oid, rid);
                has = !_.isUndefined(this[oidkey][iid][ridkey]);
            }
        }
    }

    return has;
};

SmartObject.prototype.create = function (oid) {
    var oidKey = oidKey(oid);

    if (!_.isString(oid) && !_.isNumber(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    if (_.isUndefined(oidKey))
        return null;
    else 
        this.createAny(oidKey);
};

SmartObject.prototype.createAny = function (oid) {
    if (!_.isString(oid) && !_.isNumber(oid)) 
        throw new TypeError('oid should be a String or a Number.');

    this[oidKey] = this[oidKey] || {};

    return oidKey;
};

SmartObject.prototype.addResource = function (oid, iid, rsc) {
    var self = this,
        oidKey = oidKey(oid),
        ridKey = null;

    if (_.isPlainObject(iid) && _.isNil(rsc)) {
        rsc = iid;
        iid = null;
    }

    if (!_.isString(oid) && !_.isNumber(oid)) 
        throw new TypeError('oid should be a String or a Number.');
    
    if (!this.has(oidKey))
        return null;

    if (_.isNil(iid)) {
        iid = unoccupiedIid(this, oidKey);
    } else if (!_.isString(iid) && !_.isNumber(iid)) {
        throw new TypeError('iid should be a String or a Number.');
    }

    if (!_.isPlainObject(rsc)) 
        throw new Error('resource should be an object.');

    this[oidKey][iid] = this[oidKey][iid] || {};

    _.forEach(rsc, function (val, key) {
        if (_.isFunction(val)) 
            throw new TypeError('resource cannot be a function.');

        if (_.isObject(val))
            val._isCb = _.isFunction(rsc.read) || _.isFunction(rsc.write) || _.isFunction(rsc.exec);

        self.so[oidKey][iid][ridKey] = val;
    });

    return { oid: oidKey, iid: iid, rid: ridKey };
};

SmartObject.prototype.readResource = function (oid, iid, rid, callback) {
    var oidKey = oidKey(oid),
        ridKey = ridKey(oid, rid),
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
        rsc = this.so[oidKey][iid][ridKey]; 

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
function oidKey (oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : undefined;
}

function ridKey (oid, rid) {
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
