'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

function SmartObject() {}

SmartObject.prototype.dump = function () {
    var self = this,
        dumped = {};

    _.forOwn(this, function (n, key) {
        dumped[key] = n;
    });

    return _.cloneDeep(dumped);
};

SmartObject.prototype.has = function (oid, iid, rid) {
    var oidkey = oidKey(oid), 
        has = false,
        ridkey;

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

    if (!_.isPlainObject(rsc))
        throw new Error('Resource should be an object.');
    
    this[oidKey][iid] = this[oidKey][iid] || {};

    _.forEach(rsc, function (val, key) {
        this[oidKey][iid][ridKey] = val;
    });

    return { oid: oidKey, iid: iid, rid: ridKey };
};

var smartObject = new SmartObject();

/*********************************************************
 * private function                                      *
 *********************************************************/
function oidKey (oid) {
    var oidItem = lwm2mId.getOid(oid);
    return oidItem ? oidItem.key : oid;
}

function ridKey (oid, rid) {
    var ridItem = lwm2mId.getRid(oid, rid);

    if (_.isUndefined(rid))
        rid = oid;

    return ridItem ? ridItem.key : rid;
}

module.exports = smartObject;
