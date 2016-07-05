var expect = require('chai').expect,
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('createIpsoOnly Check', function () {

    it('should be a function', function () {
        expect(smartObj.createIpsoOnly).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.createIpsoOnly(); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(undefined); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(null); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly([]); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly({}); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(true); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.createIpsoOnly(function () {}); }).to.throw(TypeError);

        expect(function () { return smartObj.createIpsoOnly(3); }).not.to.throw(Error);
        expect(function () { return smartObj.createIpsoOnly('3'); }).not.to.throw(Error);
        expect(function () { return smartObj.createIpsoOnly('xxx'); }).not.to.throw(Error);
    });

    it('should return an ipso oid and createIpsoOnly an Object', function () {
        expect(smartObj.createIpsoOnly(3303)).to.be.eql('temperature');
        expect(smartObj.temperature).to.be.eql({});
    });

    it('should return null and not createIpsoOnly an Object', function () {
        expect(smartObj.createIpsoOnly('foo')).to.be.eql(null);
        expect(smartObj.foo).to.be.eql(undefined);
    });
});

describe('create Check', function () {

    it('should be a function', function () {
        expect(smartObj.create).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.create(); }).to.throw(TypeError);
        expect(function () { return smartObj.create(undefined); }).to.throw(TypeError);
        expect(function () { return smartObj.create(null); }).to.throw(TypeError);
        expect(function () { return smartObj.create(NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.create([]); }).to.throw(TypeError);
        expect(function () { return smartObj.create({}); }).to.throw(TypeError);
        expect(function () { return smartObj.create(true); }).to.throw(TypeError);
        expect(function () { return smartObj.create(new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.create(function () {}); }).to.throw(TypeError);

        expect(function () { return smartObj.create(3); }).not.to.throw(Error);
        expect(function () { return smartObj.create('3'); }).not.to.throw(Error);
        expect(function () { return smartObj.create('xxx'); }).not.to.throw(Error);
    });

    it('should return an oid and create an Object', function () {
        expect(smartObj.create('foo')).to.be.eql('foo');
        expect(smartObj.foo).to.be.eql({});
    });
});
