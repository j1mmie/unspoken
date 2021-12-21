import { Unspoken, indexAt } from '../src'
import * as TestClasses from './utils/TestClasses.test'

test('pack simple object', () => {
  const obj = new TestClasses.ClassSimple('Paul')
  const packed = Unspoken.pack(TestClasses.ClassSimple, obj)

  expect(packed).toMatchObject(['Paul'])
})

test('pack undefined to undefined', () => {
  const packed = Unspoken.pack(TestClasses.ClassSimple, undefined)
  expect(packed).toBeUndefined()
})

test('pack nested object', () => {
  const child = new TestClasses.ClassChild('Heather', 8)
  const parent = new TestClasses.ClassWithChild('Paul', child)

  const packed = Unspoken.pack(TestClasses.ClassWithChild, parent)
  expect(packed).toMatchObject(['Paul', ['Heather', 8]])
})

test('pack object with undefined field', () => {
  const obj = new TestClasses.ClassSimpleUndefinable(undefined)
  const packed = Unspoken.pack(TestClasses.ClassSimpleUndefinable, obj)

  expect(packed).toMatchObject([undefined])
})

test('pack object with empty array', () => {
  const obj = new TestClasses.ClassWithArray()

  const packed = Unspoken.pack(TestClasses.ClassWithArray, obj)
  expect(packed).toMatchObject([[]])
})

test('pack object with populated array', () => {
  const children = [
    new TestClasses.ClassSimple('John'),
    new TestClasses.ClassSimple('Paul'),
    new TestClasses.ClassSimple('George'),
    new TestClasses.ClassSimple('Ringo'),
  ]
  const obj = new TestClasses.ClassWithArray(...children)

  const packed = Unspoken.pack(TestClasses.ClassWithArray, obj)
  expect(packed).toMatchObject([[['John'], ['Paul'], ['George'], ['Ringo']]])
})

test('throw if pack receives object with anonymous child object', () => {
  class BrokenClass {
    @indexAt(0, Object) child:Object

    constructor(child:Object) {
      this.child = child
    }
  }

  const obj = new BrokenClass(new Object())

  expect(() => {
    Unspoken.pack(BrokenClass, obj)
  }).toThrow()
})

test('pack creates empty child object if child object has no annotations', () => {
  class BrokenChild {
    name:string = 'Brian'
  }

  class BrokenParent {
    @indexAt(0, BrokenChild) child:BrokenChild

    constructor(child:BrokenChild) {
      this.child = child
    }
  }

  const child = new BrokenChild()
  const obj = new BrokenParent(child)
  const packed = Unspoken.pack(BrokenParent, obj)
  expect(packed).toMatchObject([[]])
})

test('pack throws if it receives a mis-annotated array', () => {
  class BrokenClass {
    @indexAt(0) items:string[]

    constructor(...items:string[]) {
      this.items = items
    }
  }

  const obj = new BrokenClass('A', 'B', 'C', 'D')

  expect(() => {
    Unspoken.pack(BrokenClass, obj)
  }).toThrow()
})


test('pack throws if it receives a plain old javascript object', () => {
  expect(() => {
    Unspoken.pack(Object, {})
  }).toThrow()
})

test('pack will pack undefined array items that are properly annotated', () => {
  const children = [
    new TestClasses.ClassSimple('John'),
    new TestClasses.ClassSimple('Paul'),
    new TestClasses.ClassSimple('George'),
    new TestClasses.ClassSimple('Ringo'),
  ]
  const obj = new TestClasses.ClassWithArray(...children)

  Reflect.set(obj.children, 2, undefined)

  var packed = Unspoken.pack(TestClasses.ClassWithArray, obj)

  expect(packed).toMatchObject([[['John'], ['Paul'], undefined, ['Ringo']]])
})
