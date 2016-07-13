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

**smartobject** is a _Smart Object_ Class that helps you create [_IPSO_](http://www.ipso-alliance.org/) _Smart Objects_ in your JavaScript applications. If you'd like use IPSO data model in your projects or products, you can use **smartobject** as the base class to abstract your hardware, sensor modules, or gadgets into plugins (node.js packages) for users convenience.  
  
IPSO defines a hierarchical data model to decribe real-world gadgets, such as temperature sensors and light switches. IPSO uses _**Object**_ to tell what kind of a gadget is, and uses _**Object Instance**_ to tell which one a gadget is. An _Object_ is like a class, and _Object Instance_ is the entity of an _Object_. Each _Object Instance_ has an unique _**Object Instance Id**_ to identify itself from other gadgets with the same class. The _**Resources**_ are used to describe what attributes may a gadget have, for example, a temperature sensor may have attributes such as _sensorValue_, _unit_, _minMeaValue_, .etc.  
  
[Note]: The _italics_, such _Object_, _Object Id_, _Object Instance_, and _Object Instance Id_, are used to distinguish the _IPSO Objects_ from the JavaScript objects.  
  

<a name="Installation"></a>
## 2. Installation

> $ npm install smartobject --save

<a name="Usage"></a>
## 3. Usage

Here is a quick example to show you how to create your _Smart Object_ with only few steps:

```js
// Step 1: Import the SmartObject Class
var SmartObject = require('smartobject');

// Step 2: New a SmartObject instance to have all your IPSO Objects in it
var so = new SmartObject();

// Step 3: Initialize a 'temperature' Object Instance in your smart object 'so'.  
//         - 'temperature' is the IPSO Object Identifier (oid).
//         - 0 is the Object Instance Id (iid).
//         - { sensorValue, units } contains all Resources (attributes) this sensor has.  
//         - sensorValue and units are the Resource Id (rid)

so.init('temperature', 0, {
    sensorValue: 31,
    units : 'Celsius'
});


// Init more temperature sensors (each with an unique iid)
so.init('temperature', 1, {
    sensorValue: 28,
    units : 'Celsius'
});

so.init('temperature', 2, {
    sensorValue: 72.6,
    units : 'Fahrenheit'
});

// Init other gadgets
so.init('magnetometer', 0, {
    xValue: 18,
    yValue: 21,
    zValue: 231
});

so.init('dIn', 0, { dInState: 1 });
so.init('dIn', 1, { dInState: 0 });
so.init('dIn', 6, { dInState: 0 });
so.init('dIn', 7, { dInState: 1 });
```

<a name="Resources"></a>
## 4. Resources Planning

Imagine that you have to read the temperature value from which sensor with one-wire interface, and you'd like to export this sensor to an IPSO smart object, but how to? And how do you update the temperature value to your smart object, polling it regularly? How do you do with the access control? Which _Resource_ is readable? Which is writable? And which is remotely executable?  

The great benefit of using **smartobject** in your application is that you almost need not to tackle the allocation of Resources by yourself. It provides a scheme to help you with management of reading/writing your hardware or executing a procedure on the machine. All you have to do is to plan and define your _Resources_ well, and then use **smartobject** methods to access them.  

Please refer to [Resources Planning with **smartobject**](#) for more detials.  

<a name="APIs"></a>
## 5. APIs

* [new SmartObject()](#API_smartobject)
* [init()](#API_init)
* [objectList()](#API_objectList)
* [has()](#API_has)
* [get()](#API_get)
* [set()](#API_set)
* [read()](#API_read)
* [write()](#API_write)
* [exec()](#API_exec)
* [dump()](#API_dump)
* [dumpSync()](#API_dumpSync)


*************************************************
## SmartObject Class
Exposed by `require('smartobject')`.  

<a name="API_smartobject"></a>
### new SmartObject()
Create a new instance of SmartObject class. This document will use `so` to indicate this kind of instance. A `so` can hold many _IPSO Objects_ in it.  

**Arguments:**  

1. none

**Returns:**  

* (_Object_): **so**  

**Examples:** 

```js
var SmartObject = require('smartobject');

var so = new SmartObject();
```

*************************************************
<a name="API_init"></a>
### init(oid, iid, resrcs[, opt])
Initialize an _Object Instance_ in `so`. `oid` is the [_IPSO Object Id_](https://github.com/simenkid/lwm2m-id#Identifiers) to indicate what kind of your gadget is, for example, `'temperature'`. `iid` is the _Object Instance Id_ to tell a _Instance_ from the others. `resrcs` is an object that wraps all the _Resources_ up.  
  
* Simply speaking, `oid` is like a namespace to manage all the same kind of _IPSO Object Instances_. For example, our `so` has a `'temperature'` namespace, and there are 3 temperature sensors(_Object Instances_) within this namespace.  
* You can initialize an _Object Instance_ with an empty `resrcs = {}`, and then use `set()` method to add _Resources_ one by one to the _Instance_. In my experience, initialize an _Object Instance_ with all _Resources_ at once is more elegant, for example, you can manage all your _Resources_ in a separated module, and export the whole thing to your main app to do the initialization).  
* Be careful, invoking `init()` upon an existing _Instance_ will firstly remove all the _Resources_ it has and then put the new _Resources_ into it. Thus, it is better to initialize your _Instance_ only once throughout your code.  
* [Resources Planning Tutorial](#TODO) will show you the how-tos about initializing your _Resources_ and exporting your hardware to _IPSO Resources_.
  
**Arguments:**  

1. `oid` (_String_ | _Number_): _IPSO Object Id_. `oid` indicates what kind of your gadget is, for example, `'temperature'` apparently tells it's a temperature sensor. `oid` also accepts a numeric id defined by IPSO, for example, you can give it a number of `3303`, and `so` will internally turn it into its string version, say `'temperature'`, as a key.  
2. `iid` (_String_ | _Number_): _Object Instance Id_, which tells different _Instances_. For example, if you have 3 temperature sensors on your machine, then you can assign an unique `iid` to each of them to distinguish one from the others. It would be nice to use numbers, i.e., `0`, `1`, `2`, `3`, as the `iid` to strictly meet the IPSO definition. But strings are also accepted, e.g., `'sen01'`, `'sen02'`, `'sen03'`, it is just like a handle to help you distinguish different _Instances_ within the same _Object_ class.  
3. `resrcs` (_Object_): _IPSO Resources_, which is an object with **rid-value pairs** to describe the _Resources_. Each key in `resrcs` is a _Resource Id_, which can be a string or a number. And each value can be a primitive, an data object, or an object with specific methods, i.e. read(), write(), exec(). [Resources Planning Tutorial](#TODO) will give you some hints.  
4. `opt` (_Object_): An option object, default is `{ ipsoOnly: false }` if not given. If it is given with `{ ipsoOnly: true }`, then `oid` must be an IPSO-defined _Object Id_, `iid` must be a number, and _Resource Ids_ within `resrcs` must all be IPSO-defined _Resource Ids_, or init() will throw Errors.  

**Returns:**  

* (_Object_): The initialized _Object Instance_.  

**Examples:** 

```js
var so = new SmartObject();

so.init('temperature', 0, {
    sensorValue: 31,
    units : 'Celsius'
});

so.init('temperature', 1, {
    sensorValue: 75,
    units : 'Fahrenheit'
});

so.init('temperature', 18, {
    sensorValue: 301,
    units : 'Kelvin'
});

// Dump the whole Smart Object
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
    //             sensorValue: 75,
    //             units : 'Fahrenheit'
    //         },
    //         '18': {
    //             sensorValue: 301,
    //             units : 'Kelvin'
    //         }
    //     }
    // }
});

// Dump the 'temperature' Object
so.dump('temperature', function (err, data) {
    if (!err)
        console.log(data);
    // {
    //     '0': {
    //         sensorValue: 31,
    //         units : 'Celsius'
    //     },
    //     '1': {
    //         sensorValue: 75,
    //         units : 'Fahrenheit'
    //     },
    //     '18': {
    //         sensorValue: 301,
    //         units : 'Kelvin'
    //     }
    // }
});

// Dump the 'temperature' sensor (Object Instance) with iid = 18
so.dump('temperature', 18, function (err, data) {
    if (!err)
        console.log(data);
    // {
    //     sensorValue: 301,
    //     units : 'Kelvin'
    // }
});
```

*************************************************
<a name="API_objectList"></a>
### objectList()
Returns the list of _Objects_ and _Object Instances_ with their identifiers. If an _Id_ is an IPSO-defined one, it will be turned into a numeric one. When you're using LWM2M interface, you may need this method to generate the _Object List_ for registering.  
  
**Arguments:**  

1. _none_  

**Returns:**  

* (_Array_): Returns an array that contains all the identifiers, each element is in the form of `{ oid: 3301, iid: [ 0, 1, 2, 3 ] }`.  

**Examples:** 

```js
var so = new SmartObject();

so.init('temperature', 0, {
    sensorValue: 31,
    units : 'Celsius'
});

so.init('temperature', 18, {
    sensorValue: 301,
    units : 'Kelvin'
});

so.init('illuminance', 0, {
    sensorValue: 128.6
});

so.initResrc('presence', 6, {
    dInState: 0
});

so.initResrc('myGadget', 'gad72', {
    myResource: 'hello_world'
});

so.objectList();
// [
//     { oid: 3303, iid: [ 0, 18 ] },
//     { oid: 3301, iid: [ 0 ] },
//     { oid: 3302, iid: [ 6 ] },
//     { oid: 'myGadget', iid: [ 'gad72' ] }    // not IPSO-defined
// ]
```

*************************************************
<a name="API_has"></a>
### has(oid[, iid[, rid]])
To see if `so` has the specified _Object_, _Object Instance_, or _Resource_.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   

**Returns:**  

* (_Boolean_): Returns `true` if target exists, otherwise `false`.  

**Examples:** 

```js
// Checks if so has the 'humidity' Object
so.has('humidity');                       // true

// Checks if so has the 'foo' Object Instance with iid = 0
so.has('foo', 0);                         // false

// Checks if so has the 'sensorValue' Resource in temperature sensor 8
so.has('temperature', 8, 'sensorValue');  // true
```

*************************************************
<a name="API_get"></a>
### get(oid, iid, rid)
Synchronously get the specified _Resource_.  

* At client-side (machine), the `get()` method is usually used to get the raw _Resource_ which may be an object with read/write/exec callbacks. If you like to read the **exact value** of a _Resource_, you should use the `read()` method. Since reading something from somewhere may require some special and asynchronous operations, such as reading data from a wire, and reading from a database.  
* At server-side (data center), the _Resource values_ are simple data pieces requested from machines. Thus, use `get()` to get the _stored value of a Resource on the server_ is no problem.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   

**Returns:**  

* (_Depends_): Returns the _Resource_ value, or `undefined` if _Resource_ does not exist.  

**Examples:** 

```js
so.get('temperature', 2, 'sensorValue');  // 26.4

// If the Resource is an object with read/write/exec method(s)
so.get('temperature', 1, 'sensorValue');
// {
//     read: function (cb) {
//              ...
//     }
// }

// If you do like read the exact value from the temperature sensor,
// please use read()
so.read('temperature', 1, 'sensorValue', function (err, data) {
    if (!err)
        console.log(data);  // 18.4
});

```

*************************************************
<a name="API_set"></a>
### set(oid, iid, rid, value)
Synchronously set a value to the specified _Resource_.  

* At client-side (machine), the `set()` method is usually used to **initialize** a _Resource_, but not write a value to a _Resource_. If you like to write a value to the _Resource_, you should use the `write()` method. Since writing something to somewhere may require some special and asynchronous operations, such as writing data to a wire, and writing data to a database.  
* At server-side (data center), use `set()` to _store the value of a Resource on the server_ is no problem. For example, when your request of reading a _Resource_ from a remote machine is responded back, you can use `set()` to store that _Resource value_ on the server.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
4. `value` (_Primitives_ | _Object_): _Resource_ data or an object with read/write/exec method(s). This method will throw if `value` is given with a function.  

**Returns:**  

* (_Boolean_): Returns `true` if set successfully, else returns `false` if the _Object Instance_ does not exist (_Resource_ cannot be set).  

**Examples:** 

```js
so.set('dIn', 0, 'dInState', 1);    // true
so.set('dOut', 1, 'dOutState', 0);  // true

so.set('dOut', 2, 'dOutState', function (cb) {
    gpioA3.read(function (state) {  // assume gpioA3 is a handle to your hardware
        cb(null, state);
    });
});  // true
```

*************************************************
<a name="API_read"></a>
### read(oid, iid, rid, callback[, opt])
Asynchronously read the specified _Resource_ value.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
4. `callback` (_Function_): `function (err, data) { ... }`. Will be called when reading is done or any error occurs, where `data` is the _Resource_ value. (When an error occurs, `so` will pass you a string like `'_notfound_'` with `data`, you can use it as a hint to choose a status code to respond back to the requester.)  
5. `opt` (_Object_): An option used to read _Resources_ in restrict mode, default is `{ restrict: false }`. If it is given with `{ restrict: true }`, this method will follow the access control specification defined by IPSO. This option may be set to `true` to respond to a remote _read request_ (access from outside world should be under control).  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                  |  
|----------------|------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Resource_ not found.                                              |  
| Error object   | `'_unreadable_'` | _Resource_ is unreadable.                                          |  
| Error object   | `'_exec_'`       | _Resource_ is unreadable (Becasue it is an executable _Resource_). |  
| `null`         | Depends          | _Resource_ is successfully read.                                   |  


**Returns:**  

* (_none_)  

**Examples:** 

```js
so.read('temperature', 1, 'sensorValue', function (err, data) {
    if (!err)
        console.log(data);  // 18.4
});

so.read('actuation', 0, 'dimmer', function (err, data) {
    if (!err)
        console.log(data);  // 62
});

so.read('illuminance', 1, 'maxMeaValue', function (err, data) {
    if (err) {
        console.log(err);   //  Error: 'Resource is unreadable.'
        console.log(data);  // '_unreadable_'
    }
});

so.read('accelerometer', 2, 'minRangeValue', function (err, data) {
    if (err) {
        console.log(err);   //  Error: 'Resource not found.'
        console.log(data);  // '_notfound_'
    }
});

so.read('barometer', 6, 'resetMinMaxMeaValues', function (err, data) {
    if (err) {
        console.log(err);   //  Error: 'Resource is unreadable.'
        console.log(data);  // '_exec_'
    }
});
```

*************************************************
<a name="API_write"></a>
### write(oid, iid, rid, value, callback[, opt])
Asynchronously write a value to the specified _Resource_.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
4. `value` (_Depends_): The value to write to the specified _Resource_.  
5. `callback` (_Function_): `function (err, data) { ... }`. Will be called when writing is done or any error occurs, where `data` is the _Resource_ value written. (When an error occurs, `so` will pass you a string like `'_notfound_'` with `data`, you can use it as a hint to choose a status code to respond back to the requester.)  
6. `opt` (_Object_): An option used to write _Resources_ in restrict mode.  

* This table show you what results may the callback receive:   

|       err      |      data        |       Description                                                  |  
|----------------|------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`   | _Resource_ not found.                                              |  
| Error object   | `'_unwritable_'` | _Resource_ is unwritable.                                          |  
| Error object   | `'_exec_'`       | _Resource_ is unwritable (Becasue it is an executable _Resource_). |  
| `null`         | Depends          | _Resource_ is successfully write.                                  |  


**Returns:**  

* (_none_)  

**Examples:** 

```js
so.write('actuation', 0, 'onOff', 1, function (err, data) {
    if (!err)
        console.log(data);  // 1
});

so.write('temperature', 1, 'sensorValue', 26, function (err, data) {
    if (err) {
        console.log(err);   // Error: 'Resource is unwritable.'
        console.log(data);  // _unwritable_
    }
});

so.write('presence', 3, 'busyToClearDelay', function (err, data) {
    if (err) {
        console.log(err);   //  Error: 'Resource not found.'
        console.log(data);  // '_notfound_'
    }
});

so.write('barometer', 6, 'resetMinMaxMeaValues', function (err, data) {
    if (err) {
        console.log(err);   //  Error: 'Resource is unwritable.'
        console.log(data);  // '_exec_'
    }
});
```

*************************************************
<a name="API_exec"></a>
### exec(oid, iid, rid, args, callback)
Execute the specified _Resource_. The executable _Resource_ is a procedure you've defined, for example, blinking a led for _N_ times when the _Resource_ is invoked.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `rid` (_String_ | _Number_): _Resource Id_ of the target.   
4. `args` (_Array_): The parameters required by the procedure.  
5. `callback` (_Function_): `function (err, data) { ... }`. Will be called when execution is performed or any error occurs, where `data` is anything your procedure like to return back. For example, when a blinking led prcedure starts, you may like return an object `{ status: 'ok', led: 6, times: 10, speed: 5 }` to the callback to tell something about this execution.  
  
* This table show you what results may the callback receive:   

|       err      |      data          |       Description                                                  |  
|----------------|--------------------|--------------------------------------------------------------------|  
| Error object   | `'_notfound_'`     | _Resource_ not found.                                              |  
| Error object   | `'_unexecutable_'` | _Resource_ is unexecutable.                                        |  
| Error object   | `'_badarg_'`       | Input arguments is not an array.                                   |  
| `null`         | Depends            | _Resource_ is successfully executed, `data` depends on your will.  |  

**Returns:**  

* (_none_)  

**Examples:** 

```js
// Assume we have initialized an Object Instance like this:
so.init('foo_object', 0, {
    foo: 60,
    bar: 'hello',
    blink: {
        exec: function (args, cb) {
            var ledPin = args[0],
                times = args[1];

            myHardwareController.blinkLed(ledPin, times, function (err) {
                if (err)
                    cb(err);
                else
                    cb(null, { status: 'success', led: ledPin, times: times });
            });
        }
    }
});

// Excute the blink Resource on it
so.exec('foo_object', 0, 'blink', [ 3, 10 ], function (err, data) {
    if (!err)
        console.log(data);  // { status: 'success', led: 3, times: 10 }
});

// Excute a Resource that doesn't exist
so.exec('foo_object', 0, 'show', [], function (err, data) {
    if (err) {
        console.log(err);   // Error: 'Resource not found.'
        console.log(data);  // '_notfound_'
    }
});
```

*************************************************
<a name="API_dump"></a>
### dump([oid[, iid],] callback[, opt])
Asynchronously dump data from `so`. This dumping method uses the asynchronous `read()` under the hood.  

* Given with `oid`, `iid`, and a `callback` to dump data of an _Object Instance_.  
* Given with `oid` and a `callback` to dump data of an _Object_.  
* Given with only a `callback` to dump data of whole _Smart Object_.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  
3. `callback` (_Function_): `function (err, data) { }`.  
4. `opt` (_Object_): An option used to dump _Resources_ in restrict mode.  

**Returns:**  

* (none)

**Examples:** 

```js
// Dump Object Instance: 'temperature' sensor with iid = 18
so.dump('temperature', 18, function (err, data) {
    if (!err)
        console.log(data);
    // {
    //     sensorValue: 301,
    //     units : 'Kelvin'
    // }
});

// Dump Object: all 'temperature' sensors
so.dump('temperature', function (err, data) {
    if (!err)
        console.log(data);
    // {
    //     '0': {
    //         sensorValue: 31,
    //         units : 'Celsius'
    //     },
    //     '1': {
    //         sensorValue: 75,
    //         units : 'Fahrenheit'
    //     },
    //     '18': {
    //         sensorValue: 301,
    //         units : 'Kelvin'
    //     }
    // }
});

// Dump whole Smart Object
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
    //             sensorValue: 75,
    //             units : 'Fahrenheit'
    //         },
    //         '18': {
    //             sensorValue: 301,
    //             units : 'Kelvin'
    //         }
    //     }
    // }
});
```

*************************************************
<a name="API_dumpSync"></a>
### dumpSync([oid[, iid]])
Synchronously dump data from `so`. This dumping method uses the synchronous `get()` under the hood. This method should only be used at server-side (since at server-side, all stored _Objects_ are simply data pieces).  

* Given with both `oid` and `iid` to dump data of an _Object Instance_.  
* Given with only `oid` to dump data of an _Object_.  
* Given with no ids to dump data of whole _Smart Object_.  

**Arguments:**  

1. `oid` (_String_ | _Number_): _Object Id_ of the target.  
2. `iid` (_String_ | _Number_): _Object Instance Id_ of the target.  

**Returns:**  

* (_Object_): The dumped data, can be from an _Object Instance_, an _Object_, or whole _Smart Object_.  

**Examples:** 

```js
// These examples are assuming that we are at server-side.
var myDevice = myController.find('0x12AE3B4D77886644'); // find the device
var so = myDevice.getSmartObject();                     // get the smart object on the device

// Dump Object Instance: 'temperature' sensor with iid = 18
so.dumpSync('temperature', 18);
// {
//     sensorValue: 301,
//     units : 'Kelvin'
// }

// Dump Object: all 'temperature' sensors
so.dumpSync('temperature');
// {
//     '0': {
//         sensorValue: 31,
//         units : 'Celsius'
//     },
//     '1': {
//         sensorValue: 75,
//         units : 'Fahrenheit'
//     },
//     '18': {
//         sensorValue: 301,
//         units : 'Kelvin'
//     }
// }

// Dump whole Smart Object
so.dumpSync();
// {
//     temperature: {
//         '0': {
//             sensorValue: 31,
//             units : 'Celsius'
//         },
//         '1': {
//             sensorValue: 75,
//             units : 'Fahrenheit'
//         },
//         '18': {
//             sensorValue: 301,
//             units : 'Kelvin'
//         }
//     }
// }
```
