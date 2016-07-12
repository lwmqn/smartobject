var expect = require('chai').expect,
    ObjectInstance = require('../lib/object_instance'); 

var objectInst = new ObjectInstance('temperature', 0);

describe('Object Instance - Functional Check', function () {
    describe('#.init()', function () {
        it('should add a Resource', function () {
            objectInst.init({ 5700: 30 });
            expect(objectInst.sensorValue).to.be.eql(30);
        });

        it('should clear all the Resources', function () {
            objectInst.init({ 5701: 'c' });
            expect(objectInst.sensorValue).to.be.eql(undefined);
            expect(objectInst.units).to.be.eql('c');
        });

        it('should return id and add a Resource when rsc include function', function () {
            objectInst.init({ 
                5700: {
                    read: function (cb) {
                        cb(null, 25);
                    }    
                }
            });

            expect(objectInst.sensorValue._isCb).to.be.true;
        });
    });

    describe('#.has()', function () {
        it('should return true if target is exist', function () {
            expect(objectInst.has(5700)).to.be.true;
            expect(objectInst.has('5700')).to.be.true;
            expect(objectInst.has('sensorValue')).to.be.true;
        });

        it('should return false if target is not exist', function () {
            expect(objectInst.has(5702)).to.be.false;
            expect(objectInst.has(5703)).to.be.false;
        });
    });

    describe('#.get()', function () {
        it('should return rsc if target is exist', function () {
            expect(typeof objectInst.get(5700).read).to.be.eql('function');
            expect(typeof objectInst.get('5700').read).to.be.eql('function');
            expect(typeof objectInst.get('sensorValue').read).to.be.eql('function');
        });

        it('should return undefined if target is not exist', function () {
            expect(objectInst.get(5702)).to.be.eql(undefined);
            expect(objectInst.get(5703)).to.be.eql(undefined);
        });
    });

    describe('#.set()', function () {
        it('should return true and add a Resource', function () {
            expect(objectInst.set(5701, 'f')).to.be.eql(objectInst);
            expect(objectInst.get(5701)).to.be.eql('f');
        });
    });

    describe('#.dump()', function () {
        it('should', function () {
            // objectInst.dump();
        });
    });

    describe('#.dumpSync()', function () {
        it('should', function () {
            // objectInst.dumpSync();
        });
    });

    describe('#.read()', function () {
        it('should', function () {
            // objectInst.read();
        });
    });

    describe('#.write()', function () {
        it('should', function () {
            // objectInst.write();
        });
    });

    describe('#.exec()', function () {
        it('should', function () {
            // objectInst.exec();
        });
    });

    describe('#.clear()', function () {
        it('should', function () {
            // objectInst.clear();
        });
    });
});