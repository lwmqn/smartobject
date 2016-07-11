'use strict';

var _ = require('busyman'),
    lwm2mId = require('lwm2m-id');

var utils = require('./utils');

// ok
function ObjectInstance(oidKey, iid) {
    if (!_.isString(oidKey))
        throw new TypeError("oid should be a string, such as 'temperature'.");

    this.oid = oidKey;    // oid is a string
    this.iid = iid;       // iid is a string or a number
}

/*************************************************************************************************/
/*** Public Methods: Getter and Setter                                                         ***/
/*************************************************************************************************/
// ok
ObjectInstance.prototype.get = function (rid) {
    var ridkey = utils.getRidKey(this.oid, rid);
    return this[ridkey];
};

// ok
ObjectInstance.prototype.set = function (rid, value) {
    if (_.isUndefined(value) || _.isFunction(value))
        throw new TypeError('Resource cannot be a function or undefined.');

    var ridkey = utils.getRidKey(this.oid, rid);
    this[ridkey] = value;

    return this;
};

// ok
ObjectInstance.prototype.has = function (rid) {
    var ridkey = utils.getRidKey(this.oid, rid);
    return this.hasOwnProperty(ridkey);
};

// ok
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

// ok
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

// ok
ObjectInstance.prototype.dump = function (callback) {
    // do not dump keys: 'oid', 'iid'
    var self = this,
        dumped = {},
        resrcNum =_.keys(this).length : 0;

    _.forEach(this, function (val, ridKey) {
        if (ridkey === 'oid' || ridkey === 'iid') {
            resrcNum -= 1;
        } else {
            self.read(ridKey, function (err, data) {
                if (err) {
                    callback(err, null);
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

// ok
ObjectInstance.prototype.dumpSync = function () {
    // do not dump keys: 'oid', 'iid'
    var self = this,
        dumped = {};

    _.forEach(this, function (rval, ridKey) {
        var clonedObj;

        if (ridkey === 'oid' || ridkey === 'iid' || _.isFunction(val))
            return;

        if (_.isObject(rval)) {
            clonedObj = cloneResourceObject(rval);
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
ObjectInstance.prototype.read = function (rid, callback) {
    var rsc = this.get(rid);

    if (_.isUndefined(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), null, callback);
    else if (_.isFunction(rsc))
        return utils.invokeCbNextTick(new Error('Resource not found.'), null, callback);
    else if (!_.isPlainObject(rsc))
        return utils.invokeCbNextTick(null, rsc, callback);

    // if we are here, rsc is a plain object
    if (!rsc._isCb)
        return utils.invokeCbNextTick(null, _.omit(rsc, [ '_isCb' ]), callback);

    // rsc should be read from users callback
    if (_.isFunction(rsc.exec)) {
        // an exec resource cannot be read, so checks for it first
        utils.invokeCbNextTick(null, '_exec_', callback);
    } else if (_.isFunction(rsc.read)) {
        rsc.read(function (err, val) {
            utils.invokeCbNextTick(err, val, callback);
        });
    } else {
        utils.invokeCbNextTick(null, '_unreadable_', callback);
    }
};

ObjectInstance.prototype.write = function (rid, value, callback) {
    var rsc = this.get(rid);

    if (_.isUndefined(rsc)) {
        return utils.invokeCbNextTick(new Error('Resource not found.'), null, callback);
    } else if (_.isFunction(rsc)) {
        return utils.invokeCbNextTick(new Error('Resource cannot be a function.'), null, callback);
    }

    //----------------------------------------------------------------------------------------
    if (_.isObject(rsc) && rsc._isCb) {
        if (_.isFunction(rsc.exec)) {
            utils.invokeCbNextTick(null, '_exec_', callback);
        } else if (_.isFunction(rsc.write)) {
            rsc.write(value, function (err, val) {
                utils.invokeCbNextTick(err, val, callback);
            });
        } else {
            utils.invokeCbNextTick(null, '_unwritable_', callback);
        }
    }  else { 
        if (this.setResource(oid, iid, rid, value))
            utils.invokeCbNextTick(null, value, callback);
        else
            utils.invokeCbNextTick(new Error('Resource not found.'), null, callback);
    }
};

ObjectInstance.prototype.exec = function (rid, argus, callback) {

};

/*************************************************************************************************/
/*** Private Functions                                                                         ***/
/*************************************************************************************************/
function cloneResourceObject = function (rObj) {
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

module.exports = ObjectInstance;
