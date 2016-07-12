'use strict';

var _ = require('busyman'),
    utils = require('./utils'),
    ObjInstance = require('./object_instance');

function SmartObject() {}

/*************************************************************************************************/
/*** Public Methods: Smart Object Initialization                                               ***/
/*************************************************************************************************/
SmartObject.prototype.init = function (oid, iid, resrcs, opt) {
    // init() will auto create namespace, and will firstly clear all resources in the Object Instance
    var objInst = this.findObjectInstance(oid, iid) || this.create(oid, iid, opt);
    return objInst.init(resrcs, opt);
};

SmartObject.prototype.create = function (oid, iid, opt) {
    var oidKey;
    opt = opt || { ipsoOnly: false };

    if (!utils.isValidArgType(iid))
        throw new TypeError('iid should be given with a number or a string.');
    else if (!_.isPlainObject(opt))
        throw new TypeError('opt should be an object if given.');
    else if (opt.ipsoOnly && !_.isNumber(iid))
        throw new TypeError('iid must be a number (ipsoOnly).');
    else if (opt.ipsoOnly && !utils.isIpsoOid(oid))
        throw new Error('oid not in an IPSO-defined Object.');

    oidKey = utils.getOidKey(oid);
    this[oidKey] = this[oidKey] || {};

    if (!_.isNil(this[oidKey][iid]))
        throw new Error('Object instance of iid ' + iid + ' already exists. Cannot create.');

    this[oidKey][iid] = new ObjInstance(oidKey, iid);

    return this[oidKey][iid];
};

/*************************************************************************************************/
/*** Public Methods: Synchronous                                                               ***/
/*************************************************************************************************/
SmartObject.prototype.objectList = function () {
    var objList = [];

    _.forEach(this, function (obj, oidKey) {
        var iidList = [];

        if (_.isObject(obj)) {
            _.forEach(obj, function (inst, iid) {
                var iidNum = parseInt(iid);
                iidNum = _.isNaN(iidNum) ? iid : iidNum;

                if (_.isObject(inst))
                    iidList.push(iidNum);
            });

            objList.push({ oid: utils.getOidNum(oidKey), iid: iidList });
        }
    });

    return objList;
};

SmartObject.prototype.has = function (oid, iid, rid) {
    var oidKey = utils.getOidKey(oid),
        obj = this[oidKey],
        objInst,
        resrc,
        has = !!obj;

    if (!_.isUndefined(iid) && !utils.isValidArgType(iid)) 
        throw new TypeError('iid should be given with a number or a string.');

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

SmartObject.prototype.findObject = function (oid) {
    var oidkey = utils.getOidKey(oid);
    return this[oidkey];
};

SmartObject.prototype.findObjectInstance = function (oid, iid) {
    var oidkey = utils.getOidKey(oid), 
        target = this[oidkey];

    if (!utils.isValidArgType(iid)) 
        throw new TypeError('iid should be given with a number or a string.');

    if (target)
        target = target[iid];

    return target;
};

SmartObject.prototype.get = function (oid, iid, rid) {
    var objInst = this.findObjectInstance(oid, iid),
        target;

    if (objInst)
        target = objInst.get(rid);

    return target;
};

SmartObject.prototype.set = function (oid, iid, rid, value) {
    var objInst = this.findObjectInstance(oid, iid),
        set = false;

    if (objInst) {
        objInst.set(rid, value);
        set = true;
    }

    return set;
};

SmartObject.prototype.dumpSync = function (oid, iid) {
    var dumped,
        target,
        dumpType = 'so';

    if (arguments.length === 0)
        dumpType = 'so';
    else if (arguments.length === 1)
        dumpType = 'obj';
    else if (arguments.length === 2)
        dumpType = 'objInst';
    else
        throw new Error('Bad arguments. What do you like to dump?');

    if (dumpType === 'objInst') {
        target = this.findObjectInstance(oid, iid);
        if (target)
            dumped = target.dumpSync();
    } else if (dumpType === 'obj') {
        target = this.findObject(oid);
        if (target)
            dumped = utils.dumpObjectSync(target);
    } else if (dumpType === 'so') {
        dumped = {};
        _.forEach(this, function (o, oidKey) {
            dumped[oidKey] = utils.dumpObjectSync(o);
        });
    }

    return dumped;
};

/*************************************************************************************************/
/*** Public Methods: Asynchronous                                                              ***/
/*************************************************************************************************/
SmartObject.prototype.dump = function (oid, iid, callback, opt) {
    var dumped = {},
        target,
        dumpType = 'so';

    if (arguments.length === 1) {
        callback = oid;
        dumpType = 'so';
    } else if (arguments.length === 2) {
        if (_.isFunction(oid) && _.isPlainObject(iid)) {
            opt = iid;
            callback = oid;
            dumpType = 'so';
        } else {
            callback = iid;
            dumpType = 'obj';
        }
    } else if (arguments.length === 3) {
        if (_.isFunction(iid) && _.isPlainObject(callback)) {
            opt = callback;
            callback = iid;
            dumpType = 'obj';
        } else {
            dumpType = 'objInst';
        }
    } else if (arguments.length === 4) { 
        dumpType = 'objInst';
    }else {
        throw new Error('Bad arguments. What do you like to dump? Do you give me a callback?');
    }

    if (!_.isFunction(callback))
        throw new TypeError('Callback should be a function.');

    if (dumpType === 'objInst') {
        target = this.findObjectInstance(oid, iid);
        if (target)
            target.dump(callback, opt);
    } else if (dumpType === 'obj') {
        target = this.findObject(oid);
        if (target)
            utils.dumpObject(target, callback, opt);
    } else if (dumpType === 'so') {
        target = this;
        utils.dumpSmartObject(target, callback, opt);
    }

    if (!target)
        utils.invokeCbNextTick(new Error('Target not found. Cannot dump.'), null, callback);

    return this;
};

SmartObject.prototype.read = function (oid, iid, rid, callback, opt) {
    var objInst = this.findObjectInstance(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'), '_notfound_', callback);
    else
        return objInst.read(rid, callback, opt);
};

SmartObject.prototype.write = function (oid, iid, rid, value, callback, opt) {
    var objInst = this.findObjectInstance(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'), '_notfound_', callback);
    else
        return objInst.write(rid, value, callback, opt);
};

SmartObject.prototype.exec = function (oid, iid, rid, argus, callback) {
    var objInst = this.findObjectInstance(oid, iid);

    if (!objInst)
        return utils.invokeCbNextTick(new Error('Object or Object Instance not found.'), '_notfound_', callback);
    else
        return objInst.exec(rid, argus, callback);
};

module.exports = SmartObject;
