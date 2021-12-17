import { Unspoken, indexAt } from '../src'

class ClassSimple {
  @indexAt(0) name:string

  constructor(name:string) {
    this.name = name
  }
}

class ClassSimpleUndefinable {
  @indexAt(0) name:(string | undefined)

  constructor(name?:string) {
    this.name = name
  }
}
class ClassChild {
  @indexAt(0) age:number

  constructor(age:number) {
    this.age = age
  }
}

class ClassWithChild {
  @indexAt(0) name:string
  @indexAt(1, ClassChild) child:ClassChild

  constructor(name:string, child:ClassChild) {
    this.name  = name
    this.child = child
  }
}

class ClassWithArray {
  @indexAt(0, [ClassSimple]) children:ClassSimple[]

  constructor(children:ClassSimple[]) {
    this.children = children
  }
}

test('pack simple object', () => {

  const obj = new ClassSimple('Paul')
  const packed = Unspoken.pack(ClassSimple, obj)

  expect(packed).toMatchObject(['Paul'])
})

test('pack undefined to undefined', () => {

  const packed = Unspoken.pack(ClassSimple, undefined)
  expect(packed).toBeUndefined()
})

test('pack nested object', () => {

  var child = new ClassChild(8)
  var parent = new ClassWithChild('Paul', child)

  const packed = Unspoken.pack(ClassWithChild, parent)
  expect(packed).toMatchObject(['Paul', [8]])
})

test('pack object with undefined field', () => {

  const obj = new ClassSimpleUndefinable(undefined)
  const packed = Unspoken.pack(ClassSimpleUndefinable, obj)

  expect(packed).toMatchObject([undefined])
})

test('pack object with empty array', () => {

  var obj = new ClassWithArray([])

  const packed = Unspoken.pack(ClassWithArray, obj)
  expect(packed).toMatchObject([[]])
})

test('pack object with populated array', () => {
  var children = [
    new ClassSimple('John'),
    new ClassSimple('Paul'),
    new ClassSimple('George'),
    new ClassSimple('Ringo'),
  ]
  var obj = new ClassWithArray(children)

  const packed = Unspoken.pack(ClassWithArray, obj)
  expect(packed).toMatchObject([[['John'], ['Paul'], ['George'], ['Ringo']]])
})

test('pack throws if mis-annotated array', () => {
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




test('unpack simple object', () => {
  const unpacked = Unspoken.unpack(ClassSimple, ['Paul'])

  expect(unpacked).toMatchObject(new ClassSimple('Paul'))
})
