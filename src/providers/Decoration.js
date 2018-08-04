'use strict';

export default class {
    constructor(map, layerName, layer = undefined) {
        // TODO Load other objects
        // TODO Refactor this out of here
        // ORDER Matters for layer objects!
        map.createFromObjects(layerName, 'Scarecrow', 'autumn-objects', 20, true, false, layer);
        map.createFromObjects(layerName, 'Tree', 'autumn-objects', 17, true, false, layer);
        map.createFromObjects(layerName, 'Tree-yellow', 'autumn-objects', 21, true, false, layer);
        map.createFromObjects(layerName, 'Flower-orange-small', 'autumn-objects', 5, true, false, layer);
    }
}