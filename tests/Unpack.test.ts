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

test('unpack a subclass based on a hint', () => {
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

  const request = new LoginRequest('jimmie', 'hunter2')
  const packedRequest = Unspoken.pack(LoginRequest, request)

  const hint = Unspoken.unpack(Request, packedRequest)
  if (!hint) throw 'Unable to unpack hint '

  expect(hint.method).toBe('login')
  const unpackedRequest = Unspoken.unpack(LoginRequest, packedRequest)
  if (!unpackedRequest) throw 'Unable to unpack final object'

  expect(unpackedRequest.method).toBe('login')
  expect(unpackedRequest.userName).toBe('jimmie')
  expect(unpackedRequest.password).toBe('hunter2')
})

test('unpack throws when field annotated as array is not actually an array', () => {
  expect(() => {
    Unspoken.unpack(TestClasses.ClassWithArray, [['Jimmie']])
  }).toThrow()
})

