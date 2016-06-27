smartobject
========================

[![NPM](https://nodei.co/npm/smartobject.png?downloads=true)](https://nodei.co/npm/smartobject/)  

[![Build Status](https://travis-ci.org/PeterEB/smartobject.svg?branch=develop)](https://travis-ci.org/PeterEB/smartobject)
[![npm](https://img.shields.io/npm/v/smartobject.svg?maxAge=2592000)](https://www.npmjs.com/package/smartobject)
[![npm](https://img.shields.io/npm/l/smartobject.svg?maxAge=2592000)](https://www.npmjs.com/package/smartobject)

## Table of Contents

1. [Overview](#Overview)  
2. [Installation](#Installation)  
3. [Usage](#Usage)  
4. [Resources Planning](#Resources)  
5. [APIs](#APIs)  


<a name="Overview"></a>
## 1. Overview


<a name="Installation"></a>
## 2. Installation

> $ npm install smartobject --save

<a name="Usage"></a>
## 3. Usage

```js
var Smartobject = require('smartobject');

var smartObj = new Smartobject();

smartObj.create('temperature');
smartObj.addResource('temperature', 0, { sensorValue: '31' });
smartObj.addResource('temperature', 0, { units : 'Celsius' });
```

<a name="Resources"></a>
## 4. Resources Planning


<a name="APIs"></a>
## 5. APIs

* [new Smartobject()](#API_smartobject)
* [create()](#API_create)
* [addResource()](#API_addResource)
* [dump()](#API_dump)
* [has()](#API_has)

*************************************************
## Smartobject Class
Exposed by `require('smartobject')`.  


<a name="API_smartobject"></a>
### new Smartobject()
Create a new instance of Smartobject class.

**Arguments:**  

1. none

**Returns:**  

* (_Object_): Smartobject instance.

**Examples:** 

```js
var Smartobject = require('smartobject');

var smartObj = new Smartobject();
```

*************************************************
<a name="API_create"></a>
### create(oid)
Create an Object on smartObj.  

**Arguments:**  

1. `oid` (_String_ | _Number_): Id of the Object that you want to create.

**Returns:**  

* (_String_): IPSO Smart Object Id.

**Examples:** 

```js
smartObj.create('temperature');     // 'temperature'
smartObj.create(3303);              // 'temperature'
smartObj.create('foo');             // null
smartObj.create(9453);              // null
```

*************************************************
<a name="API_addResource"></a>
### addResource(oid[, iid], rsc)
Add the Resources on smartObj.  

**Arguments:**  

1. `oid` (_String_ | _Number_): Id of the Object that owns the Resources.  
2. `iid` (_String_ | _Number_): Id of the Object Instance that owns the Resources. It's common to use a number as `iid`, but using a string is also accepted. If without iid, Smart Object will be given an unoccupied iid.
3. `rsc` (_Object_): An object with **rid-value pairs** to describe the Resource. Resource value can be a primitive, an data object, or an object with specific methods, i.e. read(), write(), exec().

**Returns:**  

* (_Object_): A Smart Object instance.

**Examples:** 

```js
// oid = 'humidity', iid = 0
smartObj.addResource('humidity', 0, { sensorValue: 33 });   // { oid: 'humidity', iid: 0, rid: 'sensorValue' }
smartObj.addResource(3304, 1, { 5700: 56 });                // { oid: 'humidity', iid: 1, rid: 'sensorValue' }
smartObj.addResource('3304', '2', { '5700': 87 });          // { oid: 'humidity', iid: 2, rid: 'sensorValue' }
```

* Resource value is read from particular operations:

```js
smartObj.addResource('dIn', 0, {
    dInState: {
        read: function (cb) {
            // you should call cb(err, value) and pass the read value through its second argument when read operation accomplishes.
            var val = gpio.read('gpio0');
            cb(null, val);
        }
        // if write method is not given, this Resource will be considered as unwritable
    }
});
```

* Resource value should be written through particular operations:

```js
smartObj.addResource('dOut', 0, {
    dOutState: {
        // if read method is not given, this Resource will be considered as unreadable
        write: function (val, cb) {
            gpio.write('gpio0', val);
            cb(null, val);
        }
    }
});
```

* Resource is an executable procedure that can be called remotely:

```js
smartObj.addResource('led', 0, {
    blink: {
        exec: function (t, cb) {
            blinkLed('led0', t);    // bink led0 for t times
            cb(null, t);            // 
        }
    }
});
```

*************************************************
<a name="API_dump"></a>
### dump(callback)
Dump record of the Smart Object.

**Arguments:**  

1. `callback` (_Function_): `function (err, result) { }`.

**Returns:**  

* (none)

**Examples:** 

```js
smartObj.dump(function (err, result) {
    console.log(result);
});    

// {
//  temperature: {
//      '0': {
//          sensorValue: 31,
//          units: 'Celsius'
//      },
//      '1': {
//          sensorValue: 87.8,
//          units: 'Fahrenheit'
//      }
//  },
//  humidity: {
//      '0': {
//          sensorValue: 21,
//          units: 'percent'
//      }
//  }
// }
```

*************************************************
<a name="API_has"></a>
### has(oid[, iid[, rid]])
To see if the target exist.

**Arguments:**  

1. `oid` (_String_ | _Number_): The Object Id of the target.  
2. `iid` (_String_ | _Number_): The Object Instance Id of the target.  
3. `rid` (_String_ | _Number_): The Resource Id of the target.   

**Returns:**  

* (_Boolean_): It will be `true` if target is exist, else `false`.

**Examples:** 

```js
smartObj.has('humidity');                       // true
smartObj.has('foo', 0);                         // false
smartObj.has('temperature', 0, 'sensorValue');  // true
```

*************************************************
