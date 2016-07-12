var _ = require('busyman'),  
    expect = require('chai').expect, 
    Smartobject = require('../index.js');

var smartObj = new Smartobject();

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

        smartObj.create('foo');
        smartObj.createIpsoOnly(3303);

        smartObj.addResources(3303, 0, { 5700: 30 });
        smartObj.addResources(3303, 1, { 5700: { read: function (cb) { cb(null, 87); } }});
        smartObj.addResources('foo', 0, { 'a': '10' });

        smartObj.dump(function (err, result) {
            if (_.isEqual(result, so)) {
                done();
            }
        });
    });
});

describe('dumpSync Check', function () {

    // it('should be a function', function () {
    //     expect(smartObj.dumpSync).to.be.a('function');
    // });

    // it('should get all object', function () {
    //     var so = {
    //         temperature: {
    //             '0': {
    //                 sensorValue: 30
    //             },
    //             '1': {
    //                 sensorValue: '_callback_'
    //             }
    //         },
    //         'foo': {
    //             '0': {
    //                 'a': '10'
    //             }
    //         }
    //     };
        
    //     expect(smartObj.dumpSync()).to.be.eql(so);
    // });
});
