"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexingMetas = exports.getIndexStore = void 0;
const METADATA_KEY = Symbol('unspoken:index');
function getIndexStore(target) {
    let store = Reflect.getOwnMetadata(METADATA_KEY, target);
    if (!store) {
        store = new Array();
        // If this is the first time we're defining a metadata store for this
        // object, get the superclass's metadata first, and merge it into our
        // store.
        const superStore = Reflect.getMetadata(METADATA_KEY, target);
        if (superStore !== undefined && Array.isArray(superStore)) {
            store.push(...superStore);
        }
        Reflect.defineMetadata(METADATA_KEY, store, target);
    }
    return store;
}
exports.getIndexStore = getIndexStore;
function getIndexingMetas(origin) {
    // This function returns metadata about which fields are
    // indexed on an object, and in which order.
    // Note: If a class extends an Unspoken object but doesn't
    // define any of its own fields, then we need to get indexing
    // data from the superclass.
    // The following first checks the object for metadata,
    // then the superclass, then finally fails gracefully
    return Reflect.getOwnMetadata(METADATA_KEY, origin) ??
        Reflect.getMetadata(METADATA_KEY, origin) ??
        [];
}
exports.getIndexingMetas = getIndexingMetas;
//# sourceMappingURL=Meta.js.map