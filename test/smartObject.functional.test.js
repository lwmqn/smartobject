var expect = require('chai').expect, 
    SmartObject = require('../index.js'); 

var smartObj = new SmartObject();

describe('Smart Object - Functional Check', function () {
    describe('#.init()', function () {
        it('should add a Resource', function () {
            smartObj.init(3303, 0, { 5700: 30 });
            expect(smartObj.temperature[0].sensorValue).to.be.eql(30);
        });

        it('should clear all the Resources', function () {
            smartObj.init(3303, 0, { 5701: 'c' });
            expect(smartObj.temperature[0].sensorValue).to.be.eql(undefined);
            expect(smartObj.temperature[0].units).to.be.eql('c');
        });

        it('should return id and add a Resource when rsc include function', function () {
            smartObj.init(3303, 0, { 
                5700: {
                    read: function (cb) {
                        cb(null, 25);
                    }    
                }
            });

            expect(typeof smartObj.temperature[0].sensorValue.read).to.be.eql('function');
            expect(smartObj.temperature[0].sensorValue._isCb).to.be.true;
        });
    });

    describe('#.create()', function () {
        it('should create an Object Instance', function () {
            smartObj.create(3303, 1);
            expect(smartObj.temperature[1].oid).to.be.eql('temperature');
            expect(smartObj.temperature[1].iid).to.be.eql(1);
        });
    });

    describe('#.objectList()', function () {
        it('should return objectList', function () {
            expect(smartObj.objectList()).to.be.eql([{ oid: 3303, iid: [ 0, 1 ]}]);
        });
    });

    describe('#.has()', function () {

    });

    describe('#.findObject()', function () {

    });

    describe('#.findsmartObjance()', function () {

    });

    describe('#.get()', function () {

    });

    describe('#.set()', function () {

    });

    describe('#.dumpSync()', function () {

    });

    describe('#.dump()', function () {

    });

    describe('#.read()', function () {

    });

    describe('#.write()', function () {

    });

    describe('#.exec()', function () {

    });
});