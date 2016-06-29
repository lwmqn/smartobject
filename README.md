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

**smartobject** is an utility to help you with creating [_IPSO_](http://www.ipso-alliance.org/) _Smart Objects_ in your applications.  
  
  
[Note]: The _italic_ words, such _Object_, _Object Id_, _Object Instance_, and _Object Instance Id_, are used to distinguish the _IPSO Objects_ from the JavaScript objects.  

<a name="Installation"></a>
## 2. Installation

> $ npm install smartobject --save

<a name="Usage"></a>
## 3. Usage

```js
var SmartObject = require('smartobject');

// step 1: New a SmartObject instance
var so = new SmartObject();

// step 2: Create an IPSO Object 'temperature' on it. 
//         This 'temperature' Object can have many IPSO Object Instances in it, it's like a namespace.
so.create('temperature');

// step 3: Add IPSO Resources to IPSO Object Instance 0 and 1 in the 'temperature' Object.
so.addResource('temperature', 0, { sensorValue: 31 });
so.addResource('temperature', 0, { units : 'Celsius' });

so.addResource('temperature', 1, {
    sensorValue: {
        read: function (cb) {
            adc1.read(function (err, val) {
                cb(err, val);
            });
        }
    }
});

// ...

// step 4: dump data of this Smart Object somewhere in your code
so.dump(function (err, data) {
    if (!err)
        console.log(data);

    // {
    //     temperature: {
    //         '0': {
    //             sensorValue: 31,
    //             units : 'Celsius'
    //         },
    //         '1': {
    //             sensorValue: 24.6,
    //         }
    //     }
    // }
});
```

<a name="Resources"></a>
## 4. Resources Planning

[TBD]

<a name="APIs"></a>
## 5. APIs

* [new SmartObject()](#API_smartobject)
* [create()](#API_create)
* [addResource()](#API_addResource)
* [dump()](#API_dump)
* [has()](#API_has)

*************************************************
## SmartObject Class
Exposed by `require('smartobject')`.  

<a name="API_smartobject"></a>
### new SmartObject()
Create a new instance of SmartObject class. This document will use **so** to indicate this kind of instance. A **so** can hold many _IPSO Objects_ in it.  

**Arguments:**  

1. none

**Returns:**  

* (_Object_): **so**.  

**Examples:** 

```js
var SmartObject = require('smartobject');

var so = new SmartObject();
```

*************************************************
<a name="API_create"></a>
### create(oid)
Create an _IPSO Object_ in **so**. An _IPSO Object Id_ is like a namespace to manage the same kind of _IPSO Object Instances_. For example, our **so** has a 'temperature' namespace(_IPSO Object Id_), and there are 6 temperature sensors(_IPSO Object Instances_) within this namespace.  
  
The _IPSO Object_ will be an empty object at first created, you have to use `addResource()` to put something into it.  
  
**Arguments:**  

1. `oid` (_String_ | _Number_): _IPSO Object Id_ you'd like to create with.  

**Returns:**  

* (_String_): Returns the _IPSO Object Id_ if succeeds, otherwise returns `null` to indicate an invalid `oid` was given.  

**Examples:** 

```js
so.create('temperature');     // 'temperature'
so.create(3303);              // 'temperature'
so.create('foo');             // null
so.create(9453);              // null
```

*************************************************
<a name="API_addResource"></a>
### addResource(oid[, iid], resrc)
Add a single piece of _IPSO Resource_ to an _Object Instance_ in **so**. If `iid` is not explicitly specified, the **so** will create a new _Object Instance_ as well as assign an unused iid to it.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _IPSO Object Id_.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ to specify which _Instance_ owns the Resources. It's common to use a number as `iid`, but using a string is also accepted. The **so** will assign an unused iid to the created _Object Instance_ if `iid` is not given.  
3. `resrc` (_Object_): An object with a **rid-value pair** to describe the _Resource_. _Resource_ value can be a primitive, an data object, or an object with specific methods, i.e. read(), write(), exec().  

**Returns:**  

* (_Object_): An object with identifiers to tell how to point to this _Resource_.  

**Examples:** 

```js
// oid = 'humidity', iid = 0
so.addResource('humidity', 0, { sensorValue: 33 });   // { oid: 'humidity', iid: '0', rid: 'sensorValue' }
so.addResource(3304, 1, { 5700: 56 });                // { oid: 'humidity', iid: '1', rid: 'sensorValue' }
so.addResource('3304', '2', { '5700': 87 });          // { oid: 'humidity', iid: '2', rid: 'sensorValue' }
```

* _Resource_ value is read from particular operations:

```js
so.addResource('dIn', 0, {
    dInState: {
        read: function (cb) {
            // you should call cb(err, value) and pass the read value through its second argument 
            // when read operation accomplishes.
            var val = gpio.read('gpio0');
            cb(null, val);
        }
        // if write method is not given, this Resource will be considered as unwritable
    }
});
```

* _Resource_ value should be written through particular operations:

```js
so.addResource('dOut', 0, {
    dOutState: {
        // if read method is not given, this Resource will be considered as unreadable
        write: function (val, cb) {
            gpio.write('gpio0', val);
            cb(null, val);
        }
    }
});
```

* _Resource_ is an executable procedure that can be called remotely:

```js
so.addResource('led', 0, {
    blink: {
        exec: function (t, cb) {
            blinkLed('led0', t);    // blink led0 for t times
            cb(null, t);            // you can send anything back to the requester 
                                    // through the second argument
        }
    }
});
```

*************************************************
<a name="API_dump"></a>
### dump(callback)
Dump data of this **so**. The dumped data will pass to the second argument of the `callback` if succeeds.  

**Arguments:**  

1. `callback` (_Function_): `function (err, data) { }`.

**Returns:**  

* (none)

**Examples:** 

```js
so.dump(function (err, data) {
    console.log(data);
});    

// {
//  temperature: {
//      '0': {
//          sensorValue: 31,
//          units: 'C'
//      },
//      '1': {
//          sensorValue: 87.8,
//          units: 'F'
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
To see if the target exists.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   

**Returns:**  

* (_Boolean_): Returns `true` if target exists, otherwise `false`.  

**Examples:** 

```js
so.has('humidity');                       // true
so.has('foo', 0);                         // false
so.has('temperature', 0, 'sensorValue');  // true
```
*************************************************
