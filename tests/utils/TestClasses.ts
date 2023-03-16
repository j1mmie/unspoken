import { indexAt } from '../../src'

export class ClassSimple {
  @indexAt(0) name:string

  constructor(name:string) {
    this.name = name
  }
}

export class ClassSimpleUndefinable {
  @indexAt(0) name:(string | undefined)

  constructor(name?:string) {
    this.name = name
  }
}

export class ClassSimpleUndefinableArray {
  @indexAt(0) names?:string[]

  constructor(names?:string[]) {
    this.names = names
  }
}

export class ClassChild {
  @indexAt(0) name:string
  @indexAt(1) age:number

  constructor(name:string, age:number) {
    this.name = name
    this.age  = age
  }
}

export class ClassWithChild {
  @indexAt(0) name:string
  @indexAt(1, ClassChild) child:ClassChild

  constructor(name:string, child:ClassChild) {
    this.name  = name
    this.child = child
  }
}

export class ClassWithArray {
  @indexAt(0, [ClassSimple]) children:ClassSimple[]

  constructor(...children:ClassSimple[]) {
    this.children = children
  }
}
