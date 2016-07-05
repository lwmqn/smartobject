var _ = require('busyman'),  
    expect = require('chai').expect, 
    Smartobject = require('../index.js');

var smartObj = new Smartobject();

describe('readResource Check', function () {

    it('should be a function', function () {
        expect(smartObj.readResource).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.readResource(); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(undefined, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(null, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(NaN, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource([], '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource({}, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(true, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(new Date(), '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(function () {}, '1', 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.createIpsoOnly(3303);
        expect(function () { return smartObj.readResource(3303); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, undefined, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, null, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, NaN, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, [], 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, {}, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, true, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, new Date(), 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, function () {}, 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rsc is not a number and not a string', function () {
        smartObj.addResources(3303, 0, { 5700: 30 });
        expect(function () { return smartObj.readResource(3303, '0'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', undefined); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', null); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', []); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', {}); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', true); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '0', function () {}); }).to.throw(TypeError);
    });

    it('should pass the read value through its second argument', function (done) {
        smartObj.create('foo');

        smartObj.addResources(3303, 1, { 5700: { read: function (cb) { cb(null, 87); } }});
        smartObj.addResources('foo', 0, { 'a': '10' });

        smartObj.readResource(3303, 0, 5700, function (err, result) {
            if (result === 30) {
                done();
            }
        });
    });

    it('should pass the read value through its second argument', function (done) {
        smartObj.readResource('temperature', '1', 'sensorValue', function (err, result) {
            if (result === 87) {
                done();
            }
        });
    });

    it('should pass the read value through its second argument', function (done) {
        smartObj.readResource('foo', 0, 'a', function (err, result) {
            if (result === '10') {
                done();
            }
        });
    });

    it('should return _unwritable_', function (done) {
        smartObj.addResources(3303, 3, { 5700: { write: function (val, cb) {
            cb(null, val);
        }}});

        smartObj.readResource(3303, 3, 5700, function (err, result) {
            if (result === '_unreadable_')
                done();
        });
    });

    it('should return _exec_', function (done) {
        smartObj.addResources(3303, 4, { 5700: { exec: function (n, cb) {
            cb(null, true);
        }}});

        smartObj.readResource(3303, 4, 5700, function (err, result) {
            if (result === '_exec_')
                done();
        });
    });

    it('should return not found error', function (done) {
        smartObj.readResource(3303, 1, 5701, function (err, result) {
            if (err)
                done();
        });
    });
});
