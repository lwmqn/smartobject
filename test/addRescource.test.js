var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('addResource Check', function () {

    it('should be a function', function () {
        expect(smartObj.addResource).to.be.a('function');
    });

    it('should throw TypeError if input oid is not a number and not a string', function () {
        expect(function () { return smartObj.addResource(); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(undefined, '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(null, '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(NaN, '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource([], '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource({}, '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(true, '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(new Date(), '1', { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(function () {}, '1', { 'a': '10' }); }).to.throw(TypeError);
    });

    it('should throw TypeError if input iid is not a number and not a string', function () {
        smartObj.create(3303);

        expect(function () { return smartObj.addResource(3303); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, NaN, { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, [], { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, {}, { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, true, { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, new Date(), { 'a': '10' }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, function () {}, { 'a': '10' }); }).to.throw(TypeError);
    });

    it('should throw TypeError if input rsc is not a number and not a string', function () {
        expect(function () { return smartObj.addResource(3303, '1'); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', undefined); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', null); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', []); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', {}); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', true); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', function () {}); }).to.throw(TypeError);
    });

    it('should throw TypeError if input val is a number, null or undefined', function () {
        expect(function () { return smartObj.addResource(3303, '1', { 'a': function () {} }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', { 'a': null }); }).to.throw(TypeError);
        expect(function () { return smartObj.addResource(3303, '1', { 'a': undefined }); }).to.throw(TypeError);
    });

    it('should return id and add a Resource', function () {
        expect(smartObj.addResource(3303, 0, { 'a': '10' })).to.be.eql({ oid: 'temperature', iid: '0', rid: 'a'});
    });

    it('should return id and add a Resource when without given iid', function () {
        expect(smartObj.addResource(3303, { 'b': '10' })).to.be.eql({ oid: 'temperature', iid: '2', rid: 'b'});
    });

    it('should return id and add a Resource when rsc include function', function () {
        expect(smartObj.addResource(3303, 0, { 'c': {
            read: function (cb) {
                cb(null, 20);
            }    
        } })).to.be.eql({ oid: 'temperature', iid: '0', rid: 'c'});

        expect(smartObj.temperature[0].c._isCb).to.be.true;
    });

    it('should return null when the given oid was not create', function () {
        expect(smartObj.addResource(3304, { 'a': '10' })).to.be.eql(null);
    });
});