var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();
describe('execResource Check', function () {

    it('should be a function', function () {
        expect(smartObj.execResource).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.execResource(); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(undefined, '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(null, '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(NaN, '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource([], '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource({}, '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(true, '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(new Date(), '1', 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(function () {}, '1', 'a', []); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.createIpsoOnly(3303);
        expect(function () { return smartObj.execResource(3303); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, undefined, 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, null, 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, NaN, 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, [], 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, {}, 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, true, 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, new Date(), 'a', []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, function () {}, 'a', []); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rid is not a number and not a string', function () {
        smartObj.addResources(3303, 1, { 5700: 30 });
        expect(function () { return smartObj.execResource(3303, '1'); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', undefined, []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', null, []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', NaN, []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', [], []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', {}, []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', true, []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', new Date(), []); }).to.throw(TypeError);
        expect(function () { return smartObj.execResource(3303, '1', function () {}, []); }).to.throw(TypeError);
    });

    it('should write Resource and pass the write value through its second argument ', function (done) {
        smartObj.addResources(3303, 2, { 5700: { exec: function (n, cb) {
            cb(null, true);
        }}});

        smartObj.execResource(3303, 2, 5700, [ 20 ], function (err, result) {
            if (result === true)
                done();
        });
    });

    it('should return _unwritable_', function (done) {
        smartObj.addResources(3303, 3, { 5700: { read: function (cb) {
            cb(null, 50);
        }}});

        smartObj.execResource(3303, 3, 5700, [ 20 ], function (err, result) {
            if (result === '_unexecutable_')
                done();
        });
    });

    it('should return _exec_', function (done) {
        smartObj.addResources(3303, 4, { 5700: { write: function (val, cb) {
            cb(null, val);
        }}});

        smartObj.execResource(3303, 4, 5700, [ 20 ], function (err, result) {
            if (result === '_unexecutable_')
                done();
        });
    });

    it('should return not argus error', function (done) {
        smartObj.execResource(3303, 2, 5700, '20', function (err, result) {
            if (err)
                done();
        });
    });

    it('should return not found error', function (done) {
        smartObj.execResource(3303, 2, 5701, [ 20 ], function (err, result) {
            if (err)
                done();
        });
    });
});