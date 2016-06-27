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
        expect(function () { return smartObj.readResource(3303, '1'); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', undefined); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', null); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', NaN); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', []); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', {}); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', true); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', new Date()); }).to.throw(TypeError);
        expect(function () { return smartObj.readResource(3303, '1', function () {}); }).to.throw(TypeError);
    });

    it('should get Resource value', function (done) {
        smartObj.create(3303);
        smartObj.createAny('foo');

        smartObj.addResource(3303, 0, { 5700: 30 });
        smartObj.addResource(3303, 1, { 5700: { read: function (cb) { cb(null, 87); } }});
        smartObj.addResource('foo', 0, { 'a': '10' });

        smartObj.readResource(3303, 0, 5700, function (err, result) {
            if (_.isEqual(result, 30)) {
                done();
            }
        });
    });

    it('should get Resource value', function (done) {
        smartObj.readResource('temperature', '1', 'sensorValue', function (err, result) {
            if (_.isEqual(result, 87)) {
                done();
            }
        });
    });

    it('should get Resource value', function (done) {
        smartObj.readResource('foo', 0, 'a', function (err, result) {
            if (_.isEqual(result, '10')) {
                done();
            }
        });
    });
});

describe('dump Check', function () {

    it('should be a function', function () {
        expect(smartObj.dump).to.be.a('function');
    });

    it('should get all object', function (done) {
        var so = {
            temperature: {
                '0': {
                    sensorValue: 30
                },
                '1': {
                    sensorValue: 87
                }
            },
            'foo': {
                '0': {
                    'a': '10'
                }
            }
        };

        smartObj.dump(function (err, result) {
            if (_.isEqual(result, so)) {
                done();
            }
        });
    });
});

describe('dumpSync Check', function () {

    it('should be a function', function () {
        expect(smartObj.dumpSync).to.be.a('function');
    });

    it('should get all object', function () {
        var so = {
            temperature: {
                '0': {
                    sensorValue: 30
                },
                '1': {
                    sensorValue: 'Function'
                }
            },
            'foo': {
                '0': {
                    'a': '10'
                }
            }
        };
        
        expect(smartObj.dumpSync()).to.be.eql(so);
    });
});
