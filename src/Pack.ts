import { getIndexingMetas, IndexAtMeta, Newable } from './Meta'

type PackedArray = (any[] | undefined)

function _packArray<T extends object>(rootCtor:Newable<T>, arr:T[], parentMeta?:IndexAtMeta,):any[] {
  if (!arr.length) return []

  const cachedMetas = getIndexingMetas(arr[0])

  return arr.map(function(item:any) {
    return _packObject(rootCtor, item, cachedMetas, parentMeta)
  })
}

function _packProperty<T extends object>(rootCtor:Newable<T>, indexMeta:IndexAtMeta, value:(T | T[])):any {
  if (value === undefined) {
    return undefined
  } else if (Array.isArray(value)) {
    if (indexMeta.isArray && indexMeta.typeHint) {
      return _packArray(indexMeta.typeHint, value, indexMeta)
    } else {
      throw new Error(`Unspoken: In '${rootCtor.name}', property value for '${indexMeta.propertyKey}' is an array, but indexAt typeHint was not specified as an array '(indexAt(0, [MyClass]))'.`)
    }
  } else if (indexMeta.typeHint) {
    return _packObject(rootCtor, value, undefined, indexMeta)
  } else {
    return value
  }
}

function _packObject<T>(rootCtor:Newable<T>, obj:T, cachedMetas?:IndexAtMeta[], parentPropMeta?:IndexAtMeta):PackedArray {
  if (obj === undefined) return undefined

  const presentObj = obj as unknown as object

  const indexMetas = cachedMetas ?? getIndexingMetas(obj)
  if (!indexMetas.length) {
    if (presentObj.constructor.name === 'Object') {
      throw new Error(`Unspoken: In '${rootCtor.name}', tried to pack an object that has no indexable information. Expected: ${parentPropMeta?.typeHint ?? rootCtor.name}, Got: ${JSON.stringify(obj)}`)
    } else {
      return []
    }
  }

  const arr = new Array<any>(indexMetas.length)
  for (let i = 0; i < indexMetas.length; i++) {
    const indexMeta = indexMetas[i]
    const value = Reflect.get(presentObj, indexMeta.propertyKey)
    const packedValue = _packProperty(rootCtor, indexMeta, value)
    arr[i] = packedValue
  }

  return arr
}

export function pack<T>(ctor:Newable<T>, obj:T):PackedArray {
  if (obj === undefined) return undefined

  const indexMetas = getIndexingMetas(ctor.prototype)

  return _packObject(ctor, obj as unknown as T, indexMetas)
}
