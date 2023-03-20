# unspoken

![image](https://user-images.githubusercontent.com/4650220/148303626-d1e525c7-6305-4438-82a7-9e9489b1664c.png)

Pack network messages more efficiently. Compress keyed objects into indexed arrays. Decompress arrays back into usable objects. Unspoken is compatible with [MessagePack-CSharp](https://github.com/neuecc/MessagePack-CSharp)'s [Contractless Resolvers](https://github.com/neuecc/MessagePack-CSharp#use-indexed-keys-instead-of-string-keys-contractless)

Unspoken w/ MessagePack is more space efficient than Protobufs, and it's easier to use. No compilers or generated code required.

It's particularly useful when de/serializing data for quick network messages, like in multiplayer games and other socket-server applications.

A naïve client + server would communicate using whole JSON objects, including keys. The keys provide context, essentially sending the "schema", or "contract", over the wire too. But if the recipient already knows the context, then let it remain an unspoken agreement, and just send the important stuff.

Unspoken works best when paired with an other encoding or compression layer, like [MessagePack](https://github.com/msgpack) or [Gzip](https://www.npmjs.com/package/node-gzip)

![Branches Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_branches.json) ![Lines Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_lines.json) ![Functions Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_functions.json) ![Statements Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_statements.json)

## Table of Contents

- [More Info](#more-info)
  + [Compression results](#compression-results)
  + [Compatibility with MessagePack](#compatibility-with-messagepack)
- [Installation](#installation)
- [Usage](#usage)
  + [Importing](#importing)
  + [Defining a schema](#defining-a-schema)
    - [indexAt](#indexat)
      * [indexAt Usage](#indexat-usage)
      * [Examples](#examples)
      * [Notes](#notes)
  + [Packing](#packing)
  + [Unpacking](#unpacking)
  + [Partial Contracts](#partial-contracts)
- [Quick Reference Example](#quick-reference-example)


## More Info

### Compression results

We'll use the 257 byte object in [tests/Example.test.ts](tests/Example.test.ts)

| Process                  | Compressed Bytes | Ratio  |
|--------------------------|------------------|--------|
| JSON                     | 257              | 100%   |
| MessagePack              | 188              | 73.1%  |
| Gzip                     | 138              | 53.7%  |
| Unspoken                 | 132              | 51.3%  |
| Protobufs                | 105              | 40.8%  |
| Unspoken & MessagePack ❤️ | 91               | 35.4%  |

Larger objects with fewer strings will have more dramatic compression results.

### Compatibility with MessagePack

Unspoken works particularly well with [MessagePack](https://github.com/msgpack). You can pack an object into an array and then use MessagePack to compress it. On the receiving end, you can decompress it and then unpack it to get it back to it's original, usable form.

Unspoken works perfectly with the [C# MessagePack library](https://github.com/neuecc/MessagePack-CSharp)'s default "indexed keys" mode, and uses a similar decorator-based API. You can communicate between C# and Typescript/Javascript so long as both sender and receiver define their contracts the same way.

## Installation

```bash
npm install --save-dev unspoken
```

## Usage

1. Define schema contract using decorators
2. Pack the data into an array
3. (Optional) Compress it further using MessagePack, gzip, etc
4. Uncompress / unpack the array back into the original object.

### Importing
The 2 most common imports are:

```typescript
import { Unspoken, indexAt } from 'unspoken'
```

### Defining a schema

#### indexAt

##### indexAt Usage

```typescript
@indexAt(index, typeHint) name:type
```

where:

- `index` - a unique, sequential numeric id. Both the sender and recipient must specify the same index for the same property, otherwise the contracts will mismatch and deserialization will fail.

- `typeHint` - a hint for the type of object expected at the current index. For primitive types, this argument can be omitted. For objects, it must be the Type (classname) of the object. For Arrays, it should be the Type wrapped in square brackets. For a primitive array, simply `[]` will suffice.

- `name` - The name of the instance variable that you would normally use duration declaration.

- `type` - The type of the instance variable that you would normally use during declaration.

##### Examples

```typescript
class Parent {
  @indexAt(0) name:string
  @indexAt(1) age:number
  @indexAt(2, Child) favoriteChild:Child
  @indexAt(3, []) alternateNames:string[]
  @indexAt(4, [Child]) allChildren:Child[]
}
```

##### Notes

- Unspoken classes may extend other Unspoken classes, so long as they don't define the same index numbers.
 i.e., The following is valid

  ```typescript
  class SuperClass {
    @indexAt(0) method:string
  }

  class SubClass extends SuperClass {
    @indexAt(1) data:string
  }
  ```

  See the section titled [Partial Contracts](#partial-contracts) for an example using this type of structure.

- On Type hints: It's unfortunate, but Typescript's current reflection capabilities make them a requirement. It is impossible to determine the type of a property at runtime, and so it's constructor must be passed in somewhere. It's redundant and I will explore approaches to removing this from the API in the future.

- On decorators: Decorators are convenient for annotation, but one drawback is that they cannot be used in constructor arguments. For example, this does not work:

```typescript
class Demo {
  constructor(
    @indexAt(0) public age:number // DOES NOT WORK
  )
}
```

So often an Unspoken object requires both a declaration section as well as a constructor for assignments.

### Packing

It's as simple as:

```typescript
const array = Unspoken.pack(TypeOfObject, object)
```

### Unpacking

Likewise, you can unpack an array back to the Type of object from whence it came. But you must know the Type before hand. For example:

```typescript
const object = Unspoken.unpack(TypeOfObject, array)
```

### Partial Contracts
or, **What if I don't know the original object's Type?**

Sometimes the recipient may not know what type of packed data was sent. For example, if the content of the transmission is a subclass of some wrapper.

Take the following example, which defines a base class `Request`, and two subclasses: `LoginRequest` and `ChangePasswordRequest`.

```typescript
class Request {
  @indexAt(0) method:string

  constructor(method:string) {
    this.method = method
  }
}

class LoginRequest extends Request {
  @indexAt(1) userName:string
  @indexAt(2) password:string

  constructor(userName:string, password:string) {
    super('login')
    this.userName = userName
    this.password = password
  }
}

class ChangePasswordRequest extends Request {
  @indexAt(1) newPassword:string

  constructor(newPassword:string) {
    super('changePassword')
    this.newPassword = newPassword
  }
}
```

Instead of attempting to fully unpack the array-forms of these objects, Unspoken can partially unpack them in order to glean more info. If we give Unspoken the `Request` constructor as a Type hint, it will only unpack the information available in *that* class's definition. In this example, that's nothing but the `method` instance variable.

Let's create a new Request and send it to a recipient. On the receiving end, they'll detect what kind of request it is, then unpack it completely.

```typescript
const request = new LoginRequest('jimmie', 'hunter2')
const packedRequest = Unspoken.pack(LoginRequest, request)

// packedRequest == ['login', 'jimmie', 'hunter2']
// Pretend we send it over the network. It gets received by another client below:

const partial = Unspoken.unpack(Request, packedRequest)
if (!partial) throw 'An error occured while parsing a request.'

switch (partial.method) {
  case 'login':
    const loginRequest = Unspoken.unpack(LoginRequest, packedRequest)
    handleLogin(loginRequest)
    break
  case 'changePassword':
    const changePasswordRequest = Unspoken.unpack(ChangePasswordRequest, packedRequest)
    handleChangePassword(changePasswordRequest)
    break
  default:
    console.log('Unknown request method received')
    break
}
```

Now the handler methods, `handleLogin` and `handleChangePassword`, will execute only when their associated method has been requested, and they'll receive the appropriate input.


## Quick Reference Example

(Taken from [tests/Example.test.ts](tests/Example.test.ts))

```typescript
import { Unspoken, indexAt } from 'unspoken'

class Member {
  @indexAt(0) name:string
  @indexAt(1) age:number
  @indexAt(2, []) instruments:string[]

  constructor(name:string, age:number, ...instruments:string[]) {
    this.name = name
    this.age = age
    this.instruments = instruments
  }
}

class Band {
  @indexAt(0) name:string
  @indexAt(1, [Member]) members:Member[]

  constructor(name:string, ...members:Member[]) {
    this.name = name
    this.members = members
  }
}

const beatles = new Band('Beatles',
  new Member('John',   29, 'vocals', 'guitar'),
  new Member('Paul',   27, 'vocals', 'guitar'),
  new Member('George', 26, 'vocals', 'bass'),
  new Member('Ringo',  29, 'drums'),
)

const packed = Unspoken.pack(Band, beatles)
console.log(`packed: ${JSON.stringify(packed)}`)

const unpacked = Unspoken.unpack(Band, packed)
console.log(`unpacked: ${unpacked}`)
```

