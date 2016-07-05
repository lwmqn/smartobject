var expect = require('chai').expect, 
    Smartobject = require('../index.js'); 

var smartObj = new Smartobject();

describe('objectList Check', function () {
	it('should return objectList', function () {
		smartObj.createIpsoOnly(3303);
		smartObj.addResources(3303, 0, { 5700: 30 });
		smartObj.addResources(3303, 1, { 5700: 30 });

		expect(smartObj.objectList()).to.be.eql([{ oid: 3303, iid: 0 }, { oid: 3303, iid: 1 }]);
	});
});