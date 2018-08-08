'use strict';
import phaserSlopes from 'phaserSlopes'

export default class {
    constructor(map, game) {

        // Add tilesets images (not objects nor spritesheets)
        map.tilesets.forEach(t => {
            if(t.properties.length > 0){
                let type = t.properties.find(p => p.name === 'type')
                if(type && type.value === 'image'){
                    map.addTilesetImage(t.name, t.name);
                }
            }
        })

        // create map layers
        this.layers = {};
        map.layers.forEach(layer => {
            this.layers[layer.name] = map.createLayer(layer.name);

            let properties = undefined !== layer.properties.length ? layer.properties : []
            properties.forEach(p => {
                if(p.name === 'main' && p.value === true) {
                    this.mainLayer = layer.name
                }

                if(p.name === 'collision' && p.value === true){
                    let collision_tiles = [];
                    let firstGid = properties.find(subp => subp.name === 'firstGid')
                    layer.data.forEach(data_row => { // find tiles used in the layer
                        data_row.forEach( tile => {
                            // check if it's a valid tile index and isn't already in the list
                            if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                                collision_tiles.push(tile.index);
                            }
                        });
                    });
                    map.setCollision(collision_tiles, true, layer.name);

                    game.slopes.convertTilemapLayer(this.layers[layer.name], 'ninja', firstGid ? firstGid.value : undefined)

                    // TODO Remove this
                    // this.layers[layer.name].debug = true
                }

                if(p.name === 'main' && p.value === true) {
                    this.mainLayer = layer.name
                }
            })
        });

        // Set world bounds to main layer
        if(this.mainLayer !== undefined){
            this.layers[this.mainLayer].resizeWorld()
        }
    }

    handleBackground(){

    }

    getLayers(){
        return this.layers;
    }

    getMainLayer() {
        return this.layers[this.mainLayer];
    }
}