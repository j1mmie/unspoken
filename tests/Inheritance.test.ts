import { Unspoken, indexAt } from '../src'

test('Inheritance', async () => {
  class Fruit {
    @indexAt(0) name:string

    constructor(name:string) {
      this.name = name
    }
  }

  class Banana extends Fruit {
    constructor() {
      super('Banana')
    }
  }

  class Apple extends Fruit {
    @indexAt(1) seedCount:number
    @indexAt(2) brand:string

    constructor(seedCount:number, brand:string) {
      super('Apple')
      this.seedCount = seedCount
      this.brand = brand
    }
  }

  class Fuji extends Apple {
    @indexAt(3) origin:string
    @indexAt(4) tasty:boolean

    constructor(origin:string, tasty:boolean) {
      super(2, 'FujiCorp')
      this.origin = origin
      this.tasty = tasty
    }
  }

  class Clem extends Fruit {
    @indexAt(1) orange:boolean
    @indexAt(2) rating:number

    constructor(orange:boolean, rating:number) {
      super('Clementine')
      this.orange = orange
      this.rating = rating
    }
  }

  const packedBanana = Unspoken.pack(Banana, new Banana())
  const packedApple  = Unspoken.pack(Apple,  new Apple(23, 'Mac'))
  const packedFruit  = Unspoken.pack(Fruit,  new Fruit('Abstract'))
  const packedFuji   = Unspoken.pack(Fuji,   new Fuji('Kyoto', true))
  const packedClem   = Unspoken.pack(Clem,   new Clem(true, 4.5))

  expect(packedBanana).toMatchObject(['Banana'])
  expect(packedApple).toMatchObject(['Apple', 23, 'Mac'])
  expect(packedFruit).toMatchObject(['Abstract'])
  expect(packedFuji).toMatchObject(['Apple', 2, 'FujiCorp', 'Kyoto', true])
  expect(packedClem).toMatchObject(['Clementine', true, 4.5])
})
