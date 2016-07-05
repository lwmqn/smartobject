var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('get Check', function () {

    it('should be a function', function () {
        expect(smartObj.get).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.get(); }).to.throw(TypeError);
        expect(function () { return smartObj.get(undefined, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(null, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(NaN, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get([], '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get({}, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(true, '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(new Date(), '1', 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(function () {}, '1', 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.createIpsoOnly(3303);
        expect(function () { return smartObj.get(3303, NaN, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, [], 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, {}, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, true, 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, new Date(), 'a'); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, function () {}, 'a'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rid is not a number and not a string', function () {
        smartObj.addResources(3303, 1, { 5700: 30 });
        expect(function () { return smartObj.get(3303, '1', NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, '1', []); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, '1', {}); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, '1', true); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, '1', new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.get(3303, '1', function () {}); }).to.throw(TypeError);
    });

    it('should return rsc if target is exist', function () {
        var func = function (cb) { cb(null, 87); };

        smartObj.create('foo');

        smartObj.addResources(3303, 1, { 5700: { read: func }});
        smartObj.addResources('foo', 0, { 'a': '10' });


        expect(typeof smartObj.get(3303, 1, 5700).read).to.be.eql('function');
        expect(typeof smartObj.get('3303', '1', '5700').read).to.be.eql('function');
        expect(typeof smartObj.get('temperature', '1', 'sensorValue').read).to.be.eql('function');
        expect(smartObj.get(3303, 1, 5700)._isCb).to.be.true;

        expect(smartObj.get('foo', 0, 'a')).to.be.eql('10');
    });

    it('should return undefined if target is not exist', function () {
        expect(smartObj.get(3304, 0, 5700)).to.be.eql(undefined);
        expect(smartObj.get(3303, 4, 5701)).to.be.eql(undefined);
        expect(smartObj.get(3303, 5, 5700)).to.be.eql(undefined);
    });

});