import * as Meta from './Meta'

function _getTypeHint(type:any) {
  const isArray = Array.isArray(type)

  if (isArray) {
    if (type.length > 0) {
      return type[0]
    } else {
      return undefined
    }
  } else {
    return type
  }
}

export function indexAt<T>(index:number, type?:([] | Meta.NewableAny | [Meta.NewableAny])):Meta.PropertyCallback {
  return function(target:object, propertyKey:string):void {
    const isArray = Array.isArray(type)
    const store = Meta.getIndexStore(target)

    store[index] = {
      propertyKey: propertyKey,
      typeHint: _getTypeHint(type),
      isArray: isArray
    }
  }
}
