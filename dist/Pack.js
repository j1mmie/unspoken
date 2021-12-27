"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pack = void 0;
const Meta_1 = require("./Meta");
function _packArray(rootCtor, arr, parentMeta) {
    if (!arr.length)
        return [];
    const cachedMetas = (0, Meta_1.getIndexingMetas)(arr[0]);
    return arr.map(function (item) {
        return _packObject(rootCtor, item, cachedMetas, parentMeta);
    });
}
function _packProperty(rootCtor, indexMeta, value) {
    if (value === undefined) {
        return undefined;
    }
    else if (Array.isArray(value)) {
        if (indexMeta.isArray && indexMeta.typeHint !== undefined) {
            return _packArray(indexMeta.typeHint, value, indexMeta);
        }
        else if (indexMeta.isArray && indexMeta.typeHint === undefined) {
            return value;
        }
        else {
            throw new Error(`Unspoken: In '${rootCtor.name}', property value for '${indexMeta.propertyKey}' is an array, but indexAt typeHint was not specified as an array '(indexAt(0, [MyClass]))'.`);
        }
    }
    else if (indexMeta.typeHint) {
        return _packObject(rootCtor, value, undefined, indexMeta);
    }
    else {
        return value;
    }
}
function _packObject(rootCtor, obj, cachedMetas, parentPropMeta) {
    if (obj === undefined)
        return undefined;
    const presentObj = obj;
    const indexMetas = cachedMetas ?? (0, Meta_1.getIndexingMetas)(obj);
    if (!indexMetas.length) {
        if (presentObj.constructor.name === 'Object') {
            throw new Error(`Unspoken: In '${rootCtor.name}', tried to pack an object that has no indexable information. Expected: ${parentPropMeta?.typeHint ?? rootCtor.name}, Got: ${JSON.stringify(obj)}`);
        }
        else {
            return [];
        }
    }
    const arr = new Array(indexMetas.length);
    for (let i = 0; i < indexMetas.length; i++) {
        const indexMeta = indexMetas[i];
        const value = Reflect.get(presentObj, indexMeta.propertyKey);
        const packedValue = _packProperty(rootCtor, indexMeta, value);
        arr[i] = packedValue;
    }
    return arr;
}
function pack(ctor, obj) {
    if (obj === undefined)
        return undefined;
    const indexMetas = (0, Meta_1.getIndexingMetas)(ctor.prototype);
    return _packObject(ctor, obj, indexMetas);
}
exports.pack = pack;
//# sourceMappingURL=Pack.js.map