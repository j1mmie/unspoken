import { Unspoken, indexAt } from '../src'


// Branding / tagging as described here:
//  - https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
//  - https://twitter.com/mattpocockuk/status/1625173884885401600?lang=en
// This test suite ensures that Branding works seamlessly and without any special attention from the user.
export type Brand<TBase, TBrandIdentifier> = TBase & { __brand: TBrandIdentifier }

export type Miles      = Brand<number, 'Miles'>
export type Seconds    = Brand<number, 'Seconds'>
export type Pounds     = Brand<number, 'Pounds'>
export type InstanceId = Brand<number, 'Instance'>
export type DatabaseId = Brand<string, 'DatabaseId'>

export class BrandedTestClass {
  @indexAt(0) miles:Miles
  @indexAt(1) seconds:Seconds
  @indexAt(2) pounds:Pounds
  @indexAt(3) instanceId:InstanceId
  @indexAt(4) databaseId:DatabaseId

  constructor(
    miles:Miles,
    seconds:Seconds,
    pounds:Pounds,
    instanceId:InstanceId,
    databaseId:DatabaseId
  ) {
    this.miles      = miles
    this.seconds    = seconds
    this.pounds     = pounds
    this.instanceId = instanceId
    this.databaseId = databaseId
  }
}

function addMiles(miles1:Miles, miles2:Miles):Miles {
  return (miles1 + miles2) as Miles
}

function addSeconds(seconds1:Seconds, seconds2:Seconds):Seconds {
  return (seconds1 + seconds2) as Seconds
}

function addPounds(pounds1:Pounds, pounds2:Pounds):Pounds {
  return (pounds1 + pounds2) as Pounds
}

function isValidInstanceId(instanceId:InstanceId):boolean {
  return instanceId > 0
}

function isValidDatabaseId(databaseId:DatabaseId):boolean {
  return databaseId.length > 0
}


test('Branded types are serialized to primitive types, and deserialized back to Branded types (as far as the compiler knows)', () => {
  const inputMiles1 = 9  as Miles
  const inputMiles2 = 63 as Miles

  const brand1 = new BrandedTestClass(
    inputMiles1,
    20 as Seconds,
    30 as Pounds,
    40 as InstanceId,
    '50' as DatabaseId
  )

  const brand2 = new BrandedTestClass(
    inputMiles2,
    100 as Seconds,
    95 as Pounds,
    90 as InstanceId,
    '85' as DatabaseId
  )

  const packed1 = Unspoken.pack(BrandedTestClass, brand1)
  const packed2 = Unspoken.pack(BrandedTestClass, brand2)

  expect(packed1).toEqual([9, 20, 30, 40, '50'])
  expect(packed2).toEqual([63, 100, 95, 90, '85'])

  const unpacked1 = Unspoken.unpack(BrandedTestClass, packed1)
  const unpacked2 = Unspoken.unpack(BrandedTestClass, packed2)

  if (!unpacked1) throw 'Unable to unpack object 1'
  if (!unpacked2) throw 'Unable to unpack object 2'

  const miles = addMiles(unpacked1.miles, unpacked2.miles)
  expect(miles).toBe(72)

  // Unable to test, but it is important that something like this would cause
  // a compiler / eslint error:
  // const mileSeconds = addSeconds(unpacked1.miles, unpacked2.seconds)

  const seconds = addSeconds(unpacked1.seconds, unpacked2.seconds)
  expect(seconds).toBe(120)

  const pounds = addPounds(unpacked1.pounds, unpacked2.pounds)
  expect(pounds).toBe(125)

  const instanceId = unpacked1.instanceId
  expect(isValidInstanceId(instanceId)).toBe(true)

  const databaseId = unpacked1.databaseId
  expect(isValidDatabaseId(databaseId)).toBe(true)
})
