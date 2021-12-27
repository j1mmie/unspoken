"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackIndex = exports.unpack = void 0;
const Meta_1 = require("./Meta");
function _unpackProp(rootCtor, indexMeta, value) {
    if (indexMeta.isArray && indexMeta.typeHint) {
        return value.map((_) => unpack(indexMeta.typeHint, _));
    }
    else if (indexMeta.typeHint) {
        return _unpackArray(rootCtor, indexMeta.typeHint, value);
    }
    else {
        return value;
    }
}
function _unpackArray(rootCtor, currentCtor, array) {
    if (array === null)
        return undefined;
    if (!Array.isArray(array)) {
        throw new Error(`Unspoken: In ${rootCtor.name}, expected array at ${currentCtor.name}. Got: ${JSON.stringify(array)}`);
    }
    const target = Reflect.construct(currentCtor, []);
    const indexMetas = (0, Meta_1.getIndexingMetas)(target);
    for (let i = 0; i < indexMetas.length; i++) {
        const value = _unpackProp(rootCtor, indexMetas[i], array[i]);
        Reflect.set(target, indexMetas[i].propertyKey, value);
    }
    return target;
}
function unpack(rootCtor, array) {
    return _unpackArray(rootCtor, rootCtor, array);
}
exports.unpack = unpack;
function unpackIndex(rootCtor, array, index) {
    return _unpackArray(rootCtor, rootCtor, array[index]);
}
exports.unpackIndex = unpackIndex;
//# sourceMappingURL=Unpack.js.map