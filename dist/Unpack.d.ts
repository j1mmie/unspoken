import { Newable } from './Meta';
import { PackedArray } from './Pack';
export declare function unpack<T>(rootCtor: Newable<T>, array: (any[] | null | PackedArray)): (T | undefined);
export declare function unpackIndex<T>(rootCtor: Newable<T>, array: any[], index: number): (T | undefined);
