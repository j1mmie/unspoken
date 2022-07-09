import { getParamsStore, getPropertyStore, TypeHint } from './Meta'

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

export function indexAt(index:number, typeHint?:TypeHint):(PropertyDecorator) {
  return function(target:object, propertyKey:(string | symbol)):void {
    const isArray = Array.isArray(typeHint)
    const store = getPropertyStore(target)

    store[index] = {
      propertyKey: propertyKey.toString(),
      typeHint:   _getTypeHint(typeHint),
      isArray:    isArray
    }
  }
}

export function indexed(typeHint?:TypeHint):ParameterDecorator {
  // propertyKey is always undefined for ParameterDecorators. Its useless.
  return function(target:any, propertyKey:(string | symbol), paramIndex:number):void {
    const isArray = Array.isArray(typeHint)
    const store = getParamsStore(target)

    store[paramIndex] = {
      paramIndex:  paramIndex,
      propertyKey: propertyKey,
      typeHint:    _getTypeHint(typeHint),
      isArray:     isArray
    }
  }
}
