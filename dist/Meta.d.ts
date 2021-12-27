export declare type PropertyCallback = {
    (target: object, propertyKey: string): void;
};
export declare type NewableAny = {
    new (...params: any[]): any;
};
export declare type Newable<T> = {
    new (...params: any[]): T;
};
export declare type NewableNoArgs<T> = {
    new (): T;
};
export declare type IndexAtMeta = {
    propertyKey: string;
    typeHint?: NewableAny;
    isArray: boolean;
};
export declare function getIndexStore(target: object): IndexAtMeta[];
export declare function getIndexingMetas(origin: Object): IndexAtMeta[];
