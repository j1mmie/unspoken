import { Unspoken, indexAt } from '../src'
import * as MsgPack from '@msgpack/msgpack'
import { gzip } from 'node-gzip'

const unprintable:{[key:number]:string} = {
  0x00: '0️⃣',
  0x01: '1️⃣',
  0x02: '2️⃣',
  0x03: '3️⃣',
  0x04: '4️⃣',
  0x05: '5️⃣',
  0x06: '6️⃣',
  0x07: '7️⃣',
  0x08: '8️⃣',
  0x09: '9️⃣',
  0x0A: '🔟',
  0x0B: '⬆️',
  0x0C: '↗️',
  0x0D: '➡️',
  0x0E: '↘️',
  0x0F: '⬇️',
  0x10: '↙️',
  0x11: '⬅️',
  0x12: '↖️',
  0x13: '↕️',
  0x14: '↔️',
  0x15: '↩️',
  0x16: '↪️',
  0x17: '⤴️',
  0x18: '⤵️',
  0x19: '🔃',
  0x1A: '🔄',
  0x1B: '🔀',
  0x1C: '🔁',
  0x1D: '🔂',
  0x1E: '▶️',
  0x1F: '⏩',
  0x20: '⏭️',
  0x5F: '⏯️',
  0x7F: '◀️',
  0x80: '⏪',
  0x81: '⏮️',
  0x82: '🔼',
  0x83: '⏫',
  0x84: '🔽',
  0x85: '⏬',
  0x86: '⏸️',
  0x87: '⏹️',
  0x88: '⏺️',
  0x89: '⏏️',
  0x8a: '🎦',
  0x8b: '🈁',
  0x8c: '🈂️',
  0x8D: '🈷️',
  0x8e: '🈶',
  0x8f: '🈯',
  0x90: '🉐',
  0x91: '🈹',
  0x92: '🈚',
  0x93: '🈲',
  0x94: '🉑',
  0x95: '🈸',
  0x96: '🈴',
  0x97: '🈳',
  0x98: '㊗️',
  0x99: '㊙️',
  0x9a: '🈺',
  0x9b: '🈵',
  0x9c: '🔴',
  0x9d: '🟠',
  0x9e: '🟡',
  0x9f: '🟢',
  0xA0: '🔵',
  0xAD: '🟣',
  0xAF: '🟤',
}

test('Example', async () => {
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

  console.log(`JSON: ${JSON.stringify(beatles).length}`)

  const msgPacked = MsgPack.encode(beatles)
  console.log('MsgPack: ', msgPacked.byteLength)

  const gzipped = await gzip(JSON.stringify(beatles))
  console.log('Gzip: ', gzipped.byteLength)

  const packed = Unspoken.pack(Band, beatles)
  console.log(`Unspoken: ${JSON.stringify(packed).length}`)

  const msgPackUnspoken = MsgPack.encode(packed)
  console.log('MsgPack + Unspoken', msgPackUnspoken)

  const renderable = Array.from(msgPackUnspoken).
    map(code => unprintable[code] ? '▯' : String.fromCharCode(code)).
    join('')

  console.log(renderable)


  // Output:
  // packed: ["Beatles",[["John",29,["vocals","guitar"]],["Paul",27,["vocals","guitar"]],["George",26,["vocals","bass"]],["Ringo",29,["drums"]]]]
  // unpacked: {"name":"Beatles","members":[{"name":"John","age":29,"instruments":["vocals","guitar"]},{"name":"Paul","age":27,"instruments":["vocals","guitar"]},{"name":"George","age":26,"instruments":["vocals","bass"]},{"name":"Ringo","age":29,"instruments":["drums"]}]}

  const unpacked = Unspoken.unpack(Band, packed)
  expect(unpacked).toMatchObject(beatles)
})