smartobject
========================

## Table of Contents

1. [Overview](#Overview)  
2. [Installation](#Installation)  
3. [Usage](#Usage)  
4. [APIs](#APIs)  


<a name="Overview"></a>
## 1. Overview


<a name="Installation"></a>
## 2. Installation

> $ npm install smartobject --save

<a name="Usage"></a>
## 3. Usage

```js
var smartObj = require('smartobject');

smartObj.create('temperature');
smartObj.addResource('temperature', 0, {
    sensorValue: '31', 
    units : 'Celsius'
});
```

<a name="APIs"></a>
## 6. APIs

* [dump()](#API_dump)
* [has()](#API_has)
* [create()](#API_create)
* [addResource()](#API_addResource)

*************************************************
<a name="API_dump"></a>
### dump(attrs[, callback])
Dump record of the Smart Object.

**Arguments:**  

1. none

**Returns:**  

* (_Object_): A data object of Smart Object record.

**Examples:** 

```js
smartObj.dump();    // {
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
<a name="API_create"></a>
### create(oid)
Create an Object on smartObj.  

**Arguments:**  

1. `oid` (_String_ | _Number_): Id of the Object that you want to create.

**Returns:**  

* (_String_): Object Id.

**Examples:** 

```js
smartObj.create('temperature');     // 'temperature'
smartObj.create(3303);              // 'temperature'
```

*************************************************
<a name="API_addResource"></a>
### addResource(oid[, iid], rsc)
Add the Resources on smartObj.  

**Arguments:**  

1. `oid` (_String_ | _Number_): Id of the Object that owns the Resources.  
2. `iid` (_String_ | _Number_): Id of the Object Instance that owns the Resources. It's common to use a number as `iid`, but using a string is also accepted. If without iid, Smart Object will be given an unoccupied iid.
3. `rsc` (_Object_): An object with **rid-value pairs** to describe the Resource.  

**Returns:**  

* (_Object_): A Smart Object instance.

**Examples:** 

```js
// oid = 'humidity', iid = 0
smartObj.addResource('humidity', 0, { sensorValue: 33 });  // { oid: 'humidity', iid: 0, rid: 'sensorValue' }

// oid = 'humidity', without iid
smartObj.addResource('humidity', { sensorValue: 42 });     // { oid: 'humidity', iid: 1, rid: 'sensorValue' }

smartObj.dump();    // {
                    //  humidity: {
                    //      '0': {
                    //          sensorValue: 33
                    //      },
                    //      '1': {
                    //          sensorValue: 42
                    //      }
                    //  }
                    // }
```

*************************************************
