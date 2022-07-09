export const METADATA_KEY = Symbol('unspoken:index')
export const PARAMS_KEY   = Symbol('unspoken:params')

export type PropertyDecorator  = (target:Object, propertyKey:string) =>void
export type ParameterDecorator = (target:Object, propertyKey:(string | symbol), parameterIndex:number) => void

export type NewableAny       = {new(...params:any[]):any}
export type Newable<T>       = {new(...params:any[]):T}
export type NewableNoArgs<T> = {new():T}

export type TypeHint = ([] | NewableAny | [NewableAny])

export type PropertyMeta = {
  propertyKey:string,
  typeHint?:NewableAny,
  isArray:boolean
}

export function getPropertyStore(target:object) {
  let store:(PropertyMeta[] | undefined) = Reflect.getOwnMetadata(METADATA_KEY, target)

  if (!store) {
    store = new Array<PropertyMeta>()

    // If this is the first time we're defining a metadata store for this
    // object, get the superclass's metadata first, and merge it into our
    // store.
    const superStore = Reflect.getMetadata(METADATA_KEY, target)
    if (superStore !== undefined && Array.isArray(superStore)) {
      store.push(...superStore)
    }

    Reflect.defineMetadata(METADATA_KEY, store, target)
  }

  return store
}

export type ParamMeta = {
  paramIndex:number,
  propertyKey:(string | symbol),
  typeHint?:NewableAny,
  isArray:boolean
}

export function getParamsStore(target:object) {
  let store:(ParamMeta[] | undefined) = Reflect.getMetadata(PARAMS_KEY, target)

  if (!store) {
    store = []
    console.log(`Defining metadata at ${PARAMS_KEY.toString()} on ${JSON.stringify(target)}`)
    Reflect.defineMetadata(PARAMS_KEY, store, target)
  }

  return store
}

export function getIndexingMetas(origin:Object):PropertyMeta[] {
  // This function returns metadata about which fields are
  // indexed on an object, and in which order.

  // Note: If a class extends an Unspoken object but doesn't
  // define any of its own fields, then we need to get indexing
  // data from the superclass.

  // The following first checks the object for metadata,
  // then the superclass, then finally fails gracefully

  return Reflect.getOwnMetadata(METADATA_KEY, origin) ??
         Reflect.getMetadata(METADATA_KEY, origin) ??
         []
}
