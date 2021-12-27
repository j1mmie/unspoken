# unspoken

Compress a keyed object to a keyless array. Rebuild the original object from array-form if you know (or can assume) what it's original Type was.

This library is particularly useful when serializing objects for network transmission. A naive approach would include the schema of the object along with the data (i.e., JSON). But if the recipient already expects some schema, then let that remain an unspoken agreement, and just send the important stuff.

This is the opposite of a "contractless" approach. A contractless serializer would transmit schema over the wire.

Unspoken is designed to be used with other compression passes, like [MessagePack](https://github.com/msgpack) or [Gzip](https://www.npmjs.com/package/node-gzip)

![Branches Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_branches.json) ![Lines Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_lines.json) ![Functions Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_functions.json) ![Statements Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_statements.json)

### Compression results

We'll use the 257 byte object in [tests/Example.test.ts](tests/Example.test.ts)

| Process            | Compressed Bytes | Ratio  |
|--------------------|------------------|--------|
| JSON               | 257              | 100%   |
| MsgPack            | 188              | 73.1%  |
| Gzip               | 138              | 53.7%  |
| Unspoken           | 132              | 51.3%  |
| Unspoken + MsgPack | 91               | 35.4%  |

Larger objects with fewer strings will have more dramatic compression results.

### More info

Unspoken works particularly nice with [MessagePack](https://github.com/msgpack). You can pack an object into an array and then use MessagePack to compress it. On the receiving end, you can decompress it and then unpack it to get it back to it's original, usable form.

Unspoken works perfectly with the [C# MessagePack library](https://github.com/neuecc/MessagePack-CSharp)'s default "indexed keys" mode. You can communicate between C# and Typescript/Javascript so long as both sender and receiver define their contract the same way.

## Install

```bash
npm install --save-dev unspoken
```

## How to use

1. Define schema contract using decorators
2. Pack the data into an array
3. (Optional) Compress it further using MessagePack, gzip, etc
4. Uncompress / unpack the array back into the original object.

### Importing
The 2 most common imports are:

```
import { Unspoken, indexAt } from 'unspoken'
```

### Defining a schema

#### indexAt

##### indexAt Usage

`@indexAt(index, typeHint) name:type`

where:

- `index` - a unique, sequential numeric id. Both the sender and recipient must specify the same index for the same property, otherwise the contracts will mismatch and deserialization will fail.

- `typeHint` - a hint for the type of object expected at the current index. For primitive types, this argument can be omitted. For objects, it must be the Type (classname) of the object. For Arrays, it should be the Type wrapped in square brackets. For a primitive array, simply `[]` will suffice.

- `name` - The name of the instance variable that you would normally use duration declaration.

- `type` - The type of the instance variable that you would normally use during declaration.

##### Examples

```
class Parent {
  @indexAt(0) name:string
  @indexAt(1) age:number
  @indexAt(2, Child) favoriteChild:Child
  @indexAt(3, []) alternateNames:string[]
  @indexAt(4, [Child]) allChildren:Child[]
}
```

##### Notes

On Type hints: It's unfortunate, but Typescript's current reflection capabilities make them a requirement. It is impossible to determine the type of a property at runtime, and so it's constructor must be passed in somewhere. Hence the hints.

On decorators: Decorators are convenient for annotation, but one drawback is that they cannot be used in constructor arguments. For example, this does not work:

```
class Demo {
  constructor(
    @indexAt(0) public age:number // DOES NOT WORK
  )
}
```

So often an Unspoken object requires both a declaration section as well as a constructor for assignments.

### Packing

It's as simple as:

```
const array = Unspoken.pack(TypeOfObject, object)
```

### Unpacking

Likewise, you can unpack an array back to the Type of object from whence it came. But you must know the Type before hand. For example:

```
const object = Unspoken.unpack(TypeOfObject, array)
```


## Example

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
