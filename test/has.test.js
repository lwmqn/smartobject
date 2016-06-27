var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('has Check', function () {

    it('should be a function', function () {
        expect(smartObj.has).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.has(); }).to.throw(TypeError);
        expect(function () { return smartObj.has(undefined, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(null, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(NaN, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has([], '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has({}, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(true, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(new Date(), '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(function () {}, '1', 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        expect(function () { return smartObj.has(3303, NaN, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, [], 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, {}, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, true, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, new Date(), 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, function () {}, 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rid is not a number and not a string', function () {
        expect(function () { return smartObj.has(3303, '1', NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, '1', []); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, '1', {}); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, '1', true); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, '1', new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.has(3303, '1', function () {}); }).to.throw(TypeError);
    });

    it('should return true if target is exist', function () {
        smartObj.create(3303);
        smartObj.createAny('foo');

        smartObj.addResource(3303, 0, { 5700: 30 });
        smartObj.addResource(3303, 1, { 5700: { read: function (cb) { cb(null, 87); } }});
        smartObj.addResource('foo', 0, { 'a': '10' });


        expect(smartObj.has(3303, 0, 5700)).to.be.true;
        expect(smartObj.has('3303', '0', '5700')).to.be.true;
        expect(smartObj.has('temperature', '0', 'sensorValue')).to.be.true;

        expect(smartObj.has(3303, 1, 5700)).to.be.true;
        expect(smartObj.has('foo', 0, 'a')).to.be.true;
    });

    it('should return false if target is not exist', function () {
        expect(smartObj.has(3304, 0, 5700)).to.be.false;
        expect(smartObj.has(3303, 1, 5701)).to.be.false;
        expect(smartObj.has(3303, 2, 5700)).to.be.false;
    });

});