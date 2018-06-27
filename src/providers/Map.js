'use strict';

import Phaser from 'phaser'
import config from '../config'
import Prefab from '../models/Prefab'

const TYPE_SPRITESHEET = 'spritesheet'
const TYPE_IMAGE = 'image'
const TYPE_TILEMAP = 'tilemap'
const TYPE_TILEMAP_JSON = 'tilemap-json'

export default class {
    /**
     * Should be called on preload function
     *
     * @param game
     * @param assetScale
     * @param prefixes
     */
    constructor(game, assetScale, prefixes) {
        this.game = game
        this.prefabs = []
        this.assetScale = assetScale
        this.prefixes = prefixes

        // Create each asset difned
        Object.entries(config.assets.list).forEach(([key, value]) => {
            let source = "string" === typeof value.source ? this.source(value.source, assetScale, prefixes, value.type) : null;

            // let prefab =
            this.prefabs[key] = this.factory(value.type, {
                key,
                source,
                width: value.width || undefined,
                height: value.height || undefined,
            })
            this.prefabs.push(this.prefabs[key]);
        })
    }

    /**
     * Retrieve source path
     * @param value
     * @param assetScale
     * @param prefixes
     * @param type
     * @returns {string}
     */
    source(value, assetScale, prefixes, type) {
        let scale = assetScale || config.scales.default,
            prefix = typeof prefixes.main != "undefined" ? prefixes.main : '',
            source = value || '',
            prefixType = typeof prefixes[type] != "undefined" ? prefixes[type] : ''

        return prefix + prefixType + source.replace(':scale', scale);
    }

    /**
     * Main factory method
     * @param type
     * @param options
     * @returns {{setChildren(*): void, getEntity(): *, getChildren(): *}}
     */
    factory(type, options) {
        let entity;
        switch (type) {
            case TYPE_TILEMAP:
                entity = this.factoryTilemap(options.key, options.source);
                break;
            case TYPE_TILEMAP_JSON:
                entity = this.factoryTilemapJSON(options.key, options.source);
                break;
            case TYPE_SPRITESHEET:
                entity = this.factorySpritesheet(options.key, options.source, options.width, options.height);
                break;
            case TYPE_IMAGE:
                entity = this.factoryImage(options.key, options.source);
                break;
        }

        return new Prefab(options.key, type, options.source, entity);
    }

    /**
     *
     * @param name
     * @param source
     * @param data
     * @returns {*[]}
     */
    factoryTilemap(name, source, data) {
        return this.game.load.tilemap(name, source, data, Phaser.Tilemap.TILED_JSON);
    }

    /**
     *
     * @param name
     * @param source
     * @returns {*[]}
     */
    factoryTilemapJSON(name, source) {
        return this.game.load.text(name, source);
    }

    /**
     *
     * @param source
     * @param tilesets
     * @returns {*[]}
     */
    factoryTilemapChildren(source, tilesets) {

        // Use in boot state::create()

        // Fill tilemap
        let rootPath,
            tilemapPrefabs = [],
            splited = source.split('/')

        splited.pop()
        // We assume tilemap assets are in the same path
        rootPath = splited.join('/')

        // Loop on tilemap data to load sub assets
        tilesets.forEach(item => {
            // let type = _.find(item.properties, {'name': "type"}).value;
            let type = item.properties.find(property => property.name === 'type').value,
                key = item.name;

            tilemapPrefabs[key] = this.factory(type, {
                key,
                source: rootPath + '/' + item.image,
                width: type === TYPE_SPRITESHEET ? item.tilewidth : undefined,
                height: type === TYPE_SPRITESHEET ? item.tileheight : undefined,
            })
            tilemapPrefabs.push(tilemapPrefabs[key])
        })


        return tilemapPrefabs;

    }

    /**
     *
     * @param name
     * @param source
     * @param width
     * @param height
     * @returns {*}
     */
    factorySpritesheet(name, source, width, height) {
        return this.game.load.spritesheet(name, source, width, height);
    }

    /**
     *
     * @param name
     * @param source
     * @returns {*}
     */
    factoryImage(name, source) {
        return this.game.load.image(name, source);
    }


    create() {
        // TODO Loop over prefabs, take tilemaps and load their children

        this.prefabs.forEach(prefab => {
            switch(prefab.type){
                // Not working, tilesets have empty image once loaded in Phaser :(
                // case TYPE_TILEMAP:
                //     prefab.setChildren(this.factoryTilemapChildren(this.game.add.tilemap(prefab.key), prefab.source))
                //     break;
                case TYPE_TILEMAP_JSON:
                    // Load tilemap from JSON stored in cache
                    let data = this.game.cache.getText(prefab.key);
                    data = JSON.parse(data)
                    prefab.setEntity(this.factoryTilemap(prefab.key, null, data))

                    // Add children
                    prefab.setChildren(this.factoryTilemapChildren(prefab.source, data.tilesets))
                    break;
            }
        })

        return this.prefabs;
    }
}