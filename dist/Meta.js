"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexingMetas = exports.getIndexStore = void 0;
const metadataKey = Symbol('unspoken:index');
function getIndexStore(target) {
    let store = Reflect.getMetadata(metadataKey, target);
    if (!store) {
        store = new Array();
        Reflect.defineMetadata(metadataKey, store, target);
    }
    return store;
}
exports.getIndexStore = getIndexStore;
function getIndexingMetas(origin) {
    return Reflect.getMetadata(metadataKey, origin) ?? [];
}
exports.getIndexingMetas = getIndexingMetas;
//# sourceMappingURL=Meta.js.map