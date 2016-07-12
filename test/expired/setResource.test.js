var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('setResource Check', function () {

    it('should be a function', function () {
        expect(smartObj.setResource).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.setResource(); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(undefined, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(null, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(NaN, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource([], '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource({}, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(true, '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(new Date(), '1', 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(function () {}, '1', 'a', 'xx'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.createIpsoOnly(3303);
        expect(function () { return smartObj.setResource(3303); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, undefined, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, null, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, NaN, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, [], 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, {}, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, true, 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, new Date(), 'a', 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, function () {}, 'a', 'xx'); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rid is not a number and not a string', function () {
        smartObj.addResources(3303, 1, { 5700: 30 });
        expect(function () { return smartObj.setResource(3303, '1'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', undefined, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', null, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', NaN, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', [], 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', {}, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', true, 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', new Date(), 'xx'); }).to.throw(TypeError);
        expect(function () { return smartObj.setResource(3303, '1', function () {}, 'xx'); }).to.throw(TypeError);
    });

    it('should return true and add a Resource', function () {
        expect(smartObj.setResource(3303, '1', 5700, 25)).to.be.true;
        expect(smartObj.get(3303, '1', 5700)).to.be.eql(25);
    });
});