import { Newable } from './Meta';
export declare type PackedArray = (any[] | undefined);
export declare function pack<T>(ctor: Newable<T>, obj: T): PackedArray;
