'use strict';


export default class {
    constructor( key, type, source, phaserEntity) {
        this.key = key
        this.type = type
        this.source = source
        this.entity = phaserEntity
    }

    setChildren(children) {
        this.children = children
    }

    getEntity() {
        return this.entity;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    getChildren() {
        return this.children;
    }
}