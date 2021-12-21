# unspoken

Convert objects to arrays, removing keys and extraneous structure. Rebuild objects from arrays if you know their schema.

![Branches Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_branches.json) ![Lines Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_lines.json) ![Functions Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_functions.json) ![Statements Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/j1mmie/17ea5fefe3b3fc7fe430382821173e13/raw/unspoken-main_statements.json)

### TL;DR

Convert a large object like this:

```json
/* 266 bytes (100%) */

{
  "name": "Beatles",
  "members": [
    {
      "name": "John",
      "age": 29,
      "instruments": ["vocals", "guitar"]
    },
    {
      "name": "Paul",
      "age": 27,
      "instruments": ["vocals", "guitar", "piano"]
    },
    {
      "name": "George",
      "age": 26,
      "instruments": ["vocals", "bass"]
    },
    {
      "name": "Ringo",
      "age": 29,
      "instruments": ["drums"]
    }
  ]
}

```

To a smaller array, removing the keys:

```json
/* 132 bytes (49.6%) */

["Beatles",[["John",29,["vocals","guitar"]],["Paul",
27,["vocals","guitar"]],["George",26,["vocals",
"bass"]],["Ringo",29,["drums"]]]]
```

And when combined with MessagePack, this:

```
/* 91 bytes, 34.2% (show as hex code) */

92 a7 42 65 61 74 6c 65 73 94 93 a4 4a 6f 68 6e
1d 92 a6 76 6f 63 61 6c 73 a6 67 75 69 74 61 72
93 a4 50 61 75 6c 1b 92 a6 76 6f 63 61 6c 73 a6
67 75 69 74 61 72 93 a6 47 65 6f 72 67 65 1a 92
a6 76 6f 63 61 6c 73 a4 62 61 73 73 93 a5 52 69
6e 67 6f 1d 91 a5 64 72 75 6d 73
```

Then send it over the wire, where the recipient can reconstruct it back to the original, usable object!

### More info

When sending data over the wire, the recipient might expect the sender to structure it a certain way. If both sides know the structure, then it's useless to send structural metadata along with the data. Unspoken allows you to avoid sending more data than is necessary.

Unspoken works particularly nice with [MessagePack](https://github.com/msgpack). You can pack an object into an array and then use MessagePack to compress it. On the receiving end, you can decompress it and then unpack it to get it back to it's original, usable form.

Unspoken works perfectly with the [C# MessagePack library](https://github.com/neuecc/MessagePack-CSharp)'s default, "contractual" mode. You can communicate between C# and Typescript/Javascript so long as both sender and receiver define their contract the same way.

## Install

```bash
npm install --save-dev unspoken
```

## Examples

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
