'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

var utils = require('./utils');

function ObjectInstance(oidKey, iid) {
    if (!_.isString(oidKey))
        throw new TypeError("oid should be a string, such as 'temperature'.");

    this.oid = oidKey;    // oid is a string
    this.iid = iid;       // iid is a string or a number
}

/*************************************************************************************************/
/*** Public Methods: Getter and Setter                                                         ***/
/*************************************************************************************************/
ObjectInstance.prototype.has = function (rid) {
    var ridkey = utils.getRidKey(this.oid, rid);
    return this.hasOwnProperty(ridkey);
};

ObjectInstance.prototype.get = function (rid) {
    var ridkey = utils.getRidKey(this.oid, rid);
    return this[ridkey];
};

ObjectInstance.prototype.set = function (rid, value) {
    if (_.isUndefined(value) || _.isFunction(value))
        throw new TypeError('Resource cannot be a function or undefined.');

    var ridkey = utils.getRidKey(this.oid, rid);
    this[ridkey] = value;

    return this;
};

ObjectInstance.prototype.clear = function () {
    var self = this;
    _.forEach(this, function (v, k) {
        if (k === 'oid' || k === 'oid')
            return;

        self[k] = null;
        delete self[k];
    });

    return this;
};

ObjectInstance.prototype.init = function (resrcs, opt) {
    // each time of init(), all resources will be cleared. Please use .set() to add/modify resource
    var self = this.clear();

    opt = opt || { ipsoOnly: false };

    if (!_.isObject(resrcs) || _.isArray(resrcs))
        throw new TypeError('Resources should be wrapped in an object.');
    else if (!_.isObject(opt))
        throw new TypeError('opt should be an object if given.');

    _.forEach(resrcs, function (rVal, rKey) {
        if (opt.ipsoOnly) {
            if (!lwm2mId.getRid(self.oid, rKey))
                throw new TypeError('Resource id: ' + rKey + ' is not an IPSO-defined resource.');
        }

        if (_.isObject(rVal))
            rVal._isCb = _.isFunction(rVal.read) || _.isFunction(rVal.write) || _.isFunction(rVal.exec);

        self.set(rKey, rVal);   // set will turn rid to string
    });
};

ObjectInstance.prototype.dump = function (callback) {
    // do not dump keys: 'oid', 'iid'
    var self = this,
        dumped = {},
        resrcNum = _.keys(this).length;

    _.forEach(this, function (val, ridKey) {
        if (ridkey === 'oid' || ridkey === 'iid') {
            resrcNum -= 1;
        } else {
            self.read(ridKey, function (err, data) {
                if (err) {
                    if (data === '_exec_' || data === '_unreadable_') {
                        resrcNum -= 1;
                        callback(null, data);
                    } else {
                        // do not (resrcNum - 1), or callback will be invoked twice
                        callback(err, null);
                    }
                } else {
                    dumped[ridkey] = data;
                    resrcNum -= 1;

                    if (resrcNum === 0)
                        callback(null, dumped);
                }
            });
        }
    });
};

ObjectInstance.prototype.dumpSync = function () {
    // do not dump keys: 'oid', 'iid'
    var self = this,
        dumped = {};

    _.forEach(this, function (rval, ridKey) {
        var clonedObj;

        if (ridkey === 'oid' || ridkey === 'iid' || _.isFunction(val))
            return;

        if (_.isObject(rval)) {
            clonedObj = utils.cloneResourceObject(rval);
            dumped[ridKey] = clonedObj;
        } else if (!_.isFunction(rval)) {
            dumped[ridKey] = rval;
        }
    });

    return dumped;
};

/*************************************************************************************************/
/*** Public Methods: Asynchronous Read/Write/Exec                                              ***/
/*************************************************************************************************/
ObjectInstance.prototype.read = function (rid, callback, opt) {
    var self = this,
        rsc = this.get(rid);

    opt = opt || { restrict: false };

    if (_.isUndefined(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    else if (_.isFunction(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);

    function restrictRead(rsc, cb) {
        var rdef = lwm2mId.getRdef(self.oid, rid);
        if (rdef) {
            if (rdef.access === 'R' || rdef.access === 'RW')
                return utils.invokeCbNextTick(null, rsc, cb);
            else
                return utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', cb);
        } else {
            return utils.invokeCbNextTick(null, rsc, cb);
        }
    }

    if (!_.isPlainObject(rsc)) {
        if (opt.restrict)
            return restrictRead(rsc, callback);
        else
            return utils.invokeCbNextTick(null, rsc, callback);
    }

    // if we are here, rsc is a plain object
    if (!rsc._isCb) {
        if (opt.restrict)
            return restrictRead(rsc, callback);
        else
            return utils.invokeCbNextTick(null, _.omit(rsc, [ '_isCb' ], callback));
    }

    // rsc should be read from users callback
    if (_.isFunction(rsc.exec)) {
        // an exec resource cannot be read, so checks for it first
        utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_exec_', callback);
    } else if (_.isFunction(rsc.read)) {
        rsc.read(function (err, val) {
            utils.invokeCbNextTick(err, val, callback);
        });
    } else {
        utils.invokeCbNextTick(new Error('Resource is unreadable.'), '_unreadable_', callback);
    }
};

ObjectInstance.prototype.write = function (rid, value, callback, opt) {
    var self = this,
        rsc = this.get(rid);

    opt = opt || { restrict: false };

    if (_.isUndefined(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    else if (_.isFunction(rsc))
        return utils.invokeCbNextTick(new Error('Resource cannot be a function.'), '_notfound_', callback);

    function restrictWrite(valToWrite, cb) {
        var rdef = lwm2mId.getRdef(self.oid, rid);
        if (rdef) {
            if (rdef.access === 'W' || rdef.access === 'RW') {
                self.set(rid, valToWrite);
                return utils.invokeCbNextTick(null, valToWrite, cb);
            } else {
                return utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', cb);
            }
        } else {
            self.set(rid, valToWrite);
            return utils.invokeCbNextTick(null, valToWrite, cb);
        }
    }

    if (!_.isPlainObject(rsc)) {
        if (opt.restrict) {
            return restrictWrite(value, callback);
        } else {
            this.set(rid, value);
            return utils.invokeCbNextTick(null, value, callback);
        }
    }

    // if we are here, rsc is a plain object
    if (!rsc._isCb) {
        if (opt.restrict) {
            return restrictWrite(value, callback);
        } else {
            this.set(rid, value);
            return utils.invokeCbNextTick(null, _.omit(value, [ '_isCb' ]), callback);
        }
    }

    // rsc should be written by users callback
    if (_.isFunction(rsc.exec)) {
        // an exec resource cannot be written, so checks for it first
        utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_exec_', callback);
    } else if (_.isFunction(rsc.write)) {
        rsc.write(value, function (err, val) {
            utils.invokeCbNextTick(err, val, callback);
        });
    } else {
        utils.invokeCbNextTick(new Error('Resource is unwritable.'), '_unwritable_', callback);
    }
};

ObjectInstance.prototype.exec = function (rid, argus, callback) {
    var rsc = this.get(rid);

    if (_.isFunction(argus)) {
        callback = argus;
        argus = [];
    }
    argus = argus || [];

    if (_.isUndefined(rsc)) {
        invokeCbNextTick(new Error('Resource not found.'), '_notfound_', callback);
    } else if (!_.isArray(argus)) {
        invokeCbNextTick(new TypeError('argus should be an array.'), '_badreq_', callback);
    } else {
        if (_.isObject(rsc) && _.isFunction(rsc.exec)) {
            argus.push(function (execErr, rspObj) {
                // rspObj: { status, value }
                invokeCbNextTick(execErr, rspObj, callback);
            });
            rsc.exec.apply(this, argus);
        } else {
            invokeCbNextTick(new Error('Resource is unexecutable.'), '_unexecutable_', callback);
        }
    }
};

module.exports = ObjectInstance;

