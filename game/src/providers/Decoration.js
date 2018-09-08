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
        map.createFromObjects(layerName, 'Directions-tower', 'autumn-objects', 14, true, false, layer);
        map.createFromObjects(layerName, 'End-tower', 'autumn-objects', 22, true, false, layer);
        map.createFromObjects(layerName, 'Bunny', 'autumn-objects', 23, true, false, layer);
        map.createFromObjects(layerName, 'Mech-Jump', 'autumn-objects', 27, true, false, layer);
        map.createFromObjects(layerName, 'Mech-Slow', 'autumn-objects', 10, true, false, layer);
        map.createFromObjects(layerName, 'Door', 'autumn-objects', 4, true, false, layer);
        map.createFromObjects(layerName, 'DoorMask', 'autumn-objects', 29, true, false, layer);

        map.createFromObjects(layerName, 'Flower-yellow-small', 'autumn-objects', 13, true, false, layer);
        map.createFromObjects(layerName, 'Flower-yellow-right-small', 'autumn-objects', 25, true, false, layer);
        map.createFromObjects(layerName, 'Flower-orangegreen-small', 'autumn-objects', 7, true, false, layer);
        map.createFromObjects(layerName, 'Flower-orange-right-small', 'autumn-objects', 19, true, false, layer);
        map.createFromObjects(layerName, 'Little-plant-orange', 'autumn-objects', 18, true, false, layer);
        map.createFromObjects(layerName, 'Little-plant-yellow', 'autumn-objects', 24, true, false, layer);
    }
}