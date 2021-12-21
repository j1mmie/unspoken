import { Unspoken, indexAt } from '../src'
import * as TestClasses from './utils/TestClasses.test'

test('unpack simple object', () => {
  const unpacked = Unspoken.unpack(TestClasses.ClassSimple, ['Paul'])

  expect(unpacked).toMatchObject(new TestClasses.ClassSimple('Paul'))
})

test('unpack null returns undefined', () => {
  const unpacked = Unspoken.unpack(TestClasses.ClassSimple, null)

  expect(unpacked).toBeUndefined()
})

test('unpack object with child property', () => {
  const unpacked = Unspoken.unpack(TestClasses.ClassWithChild, ['John', ['Julian', 9]])

  const expected = new TestClasses.ClassWithChild('John',
    new TestClasses.ClassChild('Julian', 9),
  )

  expect(unpacked).toMatchObject(expected)
})

test('unpack object with child array', () => {
  const unpacked = Unspoken.unpack(TestClasses.ClassWithArray, [[['Jimmie'], ['Tessa'], ['Jill']]])

  const expected = new TestClasses.ClassWithArray(
    new TestClasses.ClassSimple('Jimmie'),
    new TestClasses.ClassSimple('Tessa'),
    new TestClasses.ClassSimple('Jill'),
  )

  expect(unpacked).toMatchObject(expected)
})

test('unpackIndex unpacks a specific item from an array', () => {
  const input = [['Jimmie'], ['Tessa'], ['Jill']]
  const unpacked = Unspoken.unpackIndex(TestClasses.ClassSimple, input, 1)
  const expected = new TestClasses.ClassSimple('Tessa')

  expect(unpacked).toMatchObject(expected)
})

test('unpack throws when field annotated as array is not actually an array', () => {
  class BrokenClass {
    @indexAt(0, [TestClasses.ClassWithChild]) child:TestClasses.ClassSimple

    constructor(child:TestClasses.ClassSimple) {
      this.child = child
    }
  }
  expect(() => {
    Unspoken.unpack(TestClasses.ClassWithArray, [['Jimmie']])
  }).toThrow()
})

