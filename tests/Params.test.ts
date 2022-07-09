import 'reflect-metadata'
import { Unspoken } from '../src'
import { indexed } from '../src/Decorator'

class Member {
  constructor(
    @indexed() public name:string,
    @indexed() public age:number,
    @indexed([String]) public instruments:string[]
  ) { }
}

class Band {
  constructor(
    @indexed() public name:string,
    @indexed([Member]) public members:Member[]
  ) { }
}

test('params', () => {

  const noodle = new Band('Noodle', [
    new Member('Jimmie', 36, ['sword', 'nunchuks'])
  ])
  const packed = Unspoken.pack(Band, noodle)

  // const unpacked = Unspoken.unpack(Member, packed)

  // expect(unpacked).toMatchObject(dude)
})