import { Unspoken, indexAt } from '../src'
import * as MsgPack from '@msgpack/msgpack'
import { gzip, ungzip } from 'node-gzip'

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
  console.log('MsgPack + Unspoken', msgPackUnspoken.byteLength)

  // Output:
  // packed: ["Beatles",[["John",29,["vocals","guitar"]],["Paul",27,["vocals","guitar"]],["George",26,["vocals","bass"]],["Ringo",29,["drums"]]]]
  // unpacked: {"name":"Beatles","members":[{"name":"John","age":29,"instruments":["vocals","guitar"]},{"name":"Paul","age":27,"instruments":["vocals","guitar"]},{"name":"George","age":26,"instruments":["vocals","bass"]},{"name":"Ringo","age":29,"instruments":["drums"]}]}

  const unpacked = Unspoken.unpack(Band, packed)
  expect(unpacked).toMatchObject(beatles)
})