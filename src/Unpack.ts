import { getIndexingMetas, IndexAtMeta, Newable } from './Meta'

function _unpackProp<T>(rootCtor:Newable<T>, indexMeta:IndexAtMeta, value:any):any {
  if (indexMeta.isArray && indexMeta.typeHint) {
    return value.map((_:any) => unpack(indexMeta.typeHint!, _))
  } else if (indexMeta.typeHint) {
    return _unpackArray(rootCtor, indexMeta.typeHint, value)
  } else {
    return value
  }
}

function _unpackArray<T>(rootCtor:Newable<T>, currentCtor:Newable<T>, array:(any[] | null)):(T | undefined) {
  if (array === null) return undefined

  if (!Array.isArray(array)) {
    throw new Error(`Unspoken: In ${rootCtor.name}, expected array at ${currentCtor.name}. Got: ${JSON.stringify(array)}`)
  }

  const target = Reflect.construct(currentCtor, [])
  const indexMetas = getIndexingMetas(target)

  for (let i = 0; i < indexMetas.length; i++) {
    const value = _unpackProp(rootCtor, indexMetas[i], array[i])
    Reflect.set(target, indexMetas[i].propertyKey, value)
  }

  return target as T
}

export function unpack<T>(rootCtor:Newable<T>, array:(any[] | null)):(T | undefined) {
  return _unpackArray(rootCtor, rootCtor, array)
}

export function unpackIndex<T>(rootCtor:Newable<T>, array:any[], index:number):(T | undefined) {
  return _unpackArray(rootCtor, rootCtor, array[index])
}
