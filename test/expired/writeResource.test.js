var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('writeResource Check', function () {

    it('should be a function', function () {
        expect(smartObj.writeResource).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.writeResource(); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(undefined, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(null, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(NaN, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource([], '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource({}, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(true, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(new Date(), '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(function () {}, '1', 'a', 'xx'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.createIpsoOnly(3303);
        expect(function () { return smartObj.writeResource(3303); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, undefined, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, null, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, NaN, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, [], 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, {}, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, true, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, new Date(), 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, function () {}, 'a', 'xx'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rid is not a number and not a string', function () {
        smartObj.addResources(3303, 1, { 5700: 30 });
        expect(function () { return smartObj.writeResource(3303, '1'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', undefined, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', null, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', NaN, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', [], 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', {}, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', true, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', new Date(), 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.writeResource(3303, '1', function () {}, 'xx'); }).to.throw(TypeError);
    });

    it('should write Resource and pass the write value through its second argument ', function (done) {
        smartObj.writeResource(3303, 1, 5700, 38, function (err, result) {
            if ((result === 38) && (smartObj.get(3303, 1, 5700) === 38))
                done();
        });
    });

    it('should write Resource and pass the write value through its second argument ', function (done) {
        smartObj.addResources(3303, 2, { 5700: { write: function (val, cb) {
            cb(null, val);
        }}});

        smartObj.writeResource(3303, 2, 5700, 20, function (err, result) {
            if (result === 20)
                done();
        });
    });

    it('should return _unwritable_', function (done) {
        smartObj.addResources(3303, 3, { 5700: { read: function (cb) {
            cb(null, 50);
        }}});

        smartObj.writeResource(3303, 3, 5700, 20, function (err, result) {
            if (result === '_unwritable_')
                done();
        });
    });

    it('should return _exec_', function (done) {
        smartObj.addResources(3303, 4, { 5700: { exec: function (n, cb) {
            cb(null, true);
        }}});

        smartObj.writeResource(3303, 4, 5700, 20, function (err, result) {
            if (result === '_exec_')
                done();
        });
    });

    it('should return not found error', function (done) {
        smartObj.writeResource(3303, 1, 5701, 'C', function (err, result) {
            if (err)
                done();
        });
    });
});