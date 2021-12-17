import * as Meta from './Meta'

export function indexAt<T>(index:number, type?:(Meta.NewableAny | [Meta.NewableAny])):Meta.PropertyCallback {
  return function(target:object, propertyKey:string):void {
    const isArray = Array.isArray(type)
    const store = Meta.getIndexStore(target)
    store[index] = {
      propertyKey: propertyKey,
      typeHint: isArray ? type[0] : type,
      isArray: isArray
    }
  }
}
