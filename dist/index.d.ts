import 'reflect-metadata';
import * as Pack from './Pack';
import * as Unpack from './Unpack';
export declare const Unspoken: {
    pack: typeof Pack.pack;
    unpack: typeof Unpack.unpack;
    unpackIndex: typeof Unpack.unpackIndex;
};
export { indexAt } from './Decorator';
