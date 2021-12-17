const metadataKey = Symbol('unspoken:index')

export type PropertyCallback = {(target:object, propertyKey:string):void}
export type NewableAny       = {new(...params:any[]):any}
export type Newable<T>       = {new(...params:any[]):T}
export type NewableNoArgs<T> = {new():T}

export type IndexAtMeta = {
  propertyKey:string,
  typeHint?:NewableAny,
  isArray:boolean
}

export function getIndexStore(target:object) {
  let store:(IndexAtMeta[] | undefined) = Reflect.getMetadata(metadataKey, target)

  if (!store) {
    store = new Array<IndexAtMeta>()
    Reflect.defineMetadata(metadataKey, store, target)
  }

  return store
}

export function getIndexingMetas(origin:Object):IndexAtMeta[] {
  return Reflect.getMetadata(metadataKey, origin) ?? []
}
