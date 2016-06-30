## Resources Planning Tutorial

Use API `addResource(oid[, iid], resrc)` to initialize your Resource, where `oid` and `iid` are the _Object Id_ and _Object Instance Id_, respectively. `resrc` is an object containing a single piece of _IPSO Resource_ to be added to the _Object Instance_. The key in `resrc` object should be an `rid` and the value is the corresponding _Resource value_.  

<br />

********************************************

### _Resource value_ is a primitive

_Resource value_ can be a simple primitive, such as a number, a string, and a bool. Here is an example of temperatur sensor: 
  
```js
// oid = 'temperature' tells the so that you have a temperature sensor Object
// iid = 0 tells the so to instantiate this sensor with an identifier of 0
so.addResource('temperature', 0, {
    sensorValue: 20,
    units: 'cel'
});
```
  
********************************************
  

#### Poll and write the sensed value to the _Resource_

You may think that the temperature is a time-varying value, and just giving it a number is definitely not a good idea. You developers have responsibility for making this sensor play correctly. Let me show you an example:
  
```js
so.addResource('temperature', 0, {
    sensorValue: 20,
    units: 'cel'
});

// Assume that temperature value is just read from a particular analog pin  
// Here, I use setInterval() to poll the pin every 60 seconds and write the sensed value to the corresponding Resource
setInterval(function () {
    var analogVal = analogPin0.read();
    so.writeResrc('temperature', 0, 'sensorValue', analogVal);
}, 60*1000);
```
  
So far, polling seems just fine in this temperature sensing example. The problem of polling is that the requester may not always get the newest value each time it requests for the sensorValue.  

A solution to this problem is to poll the sensor more frequently, e.g., every 100ms, I think you never want to do so to keep your device busy. This is where *smartobject** read/write/exec callback scheme can help.  
  
********************************************
  

### _Resource value_ is an object equipped with read or write method(s)

**smartobject** allows a _Resource value_ to be an object with `read` and/or `write` method(s). You can tell **so** how to read/write your _Resource_ through this kind of object. Each time someone requests for the _Resource_, **so** will invoke the read() method on that _Resource_ to get its current value, e.g. reading from a gpio immediately.  

#### Readable Resource  
It is very simple to use this pattern. The first thing you need to know is that the signature of `read` method is `function(cb)`, where `cb(err, value)` is an err-back function that **you should call** and pass the read value through its second argument when read operation accomplishes. If any error occurs, pass the error through the first argument.  

Let's go back to the previous example:  
  
```js
so.addResource('temperature', 0, {
    sensorValue: {
        read: function (cb) {
            var analogVal = analogPin0.read();
            cb(null, analogVal);
        }
    },
    units: 'cel'
});
```
  
See, it's simple. If you define this object with a read method, this _Resource_ will be inherently readable.  
  
#### Writable Resource  
The pattern for a writable _Resource_ is similar. The signature of `write` method is `function(value, cb)`, where `value` is the value to wirte to this _Resource_ and `cb(err, value)` is an err-back function that you should call and pass the written value through its second argument. Example again:  
  
```js
so.addResource('actuation', 6, {
    onOff: {
        write: function (value, cb) {
            digitalPin2.write(value);

            var digitalVal = digitalPin2.read();
            cb(null, digitalVal);
        }
    }
});
```
  
In this example, we only define the write method for the _Resource_, thus it is writable but not readable. If someone is trying to read this _Resource_, he will get a special value of string `'_unreadable_'` passing to the second argument of `callback`.  
  
#### Readable and writable Resource  

If this Resource is both readable and writable, you should give both of read and write methods to it:
  
```js
so.addResource('actuation', 6, {
    onOff: {
        read: function () {
            var digitalVal = digitalPin2.read();
            cb(null, digitalVal);
        },
        write: function (value, cb) {
            digitalPin2.write(value);
            cb(null, digitalPin2.read());
        }
    }
});
```
  
Ok, good! You've not only learned how to read/write a _Resource_ but also learned how to do the 'Access Control' on a _Resource_. If the _Resource value_ is a primitive, **smartobject** will flow the access rules from IPSO specification. If your _Resource value_ is a primitive and you don't want to follow the default access rules, you can wrap it up with the special object we've just introduced. See this example:
  
```js
var tempVal = 26;

so.addResource('temperature', 0, {
    sensorValue: {
        read: function (cb) {
            cb(null, tempVal);
        }
    },
    units: 'cel'
});
```
  
Next, let's take a look at something really cool - an _executable Resource_.  

  
********************************************
  
### _Excutable Resource_

This kind of _Resource_ allows you to issue a procedure on the **so**, for example, ask your device to blink a LED for 10 times. You can define some useful and interesting remote procedure calls(RPCs) with executable _Resources_.  

To do so, give your _Resource_ an object with the `exec` method. In this case, the _Resource_ will be inherently an executable one, you will get a special value of string `'_exec_'` when accessing (read/write) it. This means that read and write methods are meaningless to an _executable Resource_ even if you do give an object with these two methods to the _Resource_.  

If the _Resource_ is not an executable one, **smartoject** will respond a special value of `'_unexecutable_'` when you trying to invoke it.  
  
#### Example: An excutable Resource to blink a led  

[TBD]

It's time to show you an example. Assume that we have an executable Resource `function(led, t)` on the Device to start blinking the `led` with `t` times.  
  
```js
function blinkLed(led, t) {
    // logic of blinking an led
}

so.addResource('myObject', 0, {
    blink: {
        exec: function (led, t, cb) {
            blinkLed(led, t);       // invoke the procedure
            cb(null, 'blinking');   // cb(status, data), default status is 204(Changed)
                                    // data is something you want to respond to the Server
        }
    }
});
```
  
The signature of `exec` method is `function(...[, cb])`, and
* The number of arguments depends on your own definition  
* The callback `cb(status, data)` is optional and should be called if you want to respond something back to the Server  
* The first argument of the callback is **status**, which is a numeric code.  
* If `cb` is not given or got called, **mqtt-node** will regard this execution as a successful one and respond the default status 204(Changed) with an undefined data to the Server.  
* Since **mqtt-node** doesn't know what your procudure is doing, developers must be responsible for creating the resulted response on their own.  

As mentioned in LWM2M specification, the Client should response a status code of 400(BadRequest) if it doesn't understand the argument in the payload. Let me show you an example:  
  
```js
so.addResource('myObject', 0, {
    blink: {
        exec: function (led, t, cb) {
            if (typeof t !== 'number') {
                cb(400, null);              // Put a status code to tell "what's wrong"
            } else {
                blinkLed(led, t);
                cb(204, 'blinking');
            }
        }
    }
});
```
  
### Excutable Resource is Good

An Executable Resource is a necessary if you like to do something complicated.  

Think of that how do you blink a certain led with arbitrary times if you are just using general readable/writable Resources? That can be a pain in the ass. In addtion, the difference bewteen LWMQN and LWM2M on Executable Resources is that LWMQN allows an executable Resource to response data back to the Server and LWM2M just response status to the Server by definition. RPCs in LWMQN is more interactive.  

IoT is not just about reading something from or writing something to machines. An Executable Resource is very powerful and it let your machines do more things and be more automatic.  