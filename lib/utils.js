var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

utils = {};

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
    if (_.isFunction(cb))
        process.nextTick(function () {
            cb(err, val);
        });
}

module.exports = utils;
