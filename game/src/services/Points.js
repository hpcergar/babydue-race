
export default class {

    constructor (game) {
        this.points = game.attr.playerPoints
    }

    /**
     *
     * @param name
     * @returns {*[]}
     */
    getPoint(name) {
        const point = this.points.find(point => point.name === name)
        if(!point){
            console.error('Undefined point: ' + name)
            return [0,0]
        }
        return [point.x, point.y]
    }

    /**
     * Retrieve game player starting point
     * @returns {*[]}
     */
    getStartPoint() {
        return this.getPoint('playerStartPoint')
    }

    /**
     * Retrieve game player end point (level-end, before end transition)
     * @returns {*[]}
     */
    getEndPoint() {
        return this.getPoint('playerEndPoint')
    }
}