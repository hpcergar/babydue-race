import Config from '../config'
import AuthService from './AuthService'

export default class {

    constructor() {
        this.authService = new AuthService();
    }

    /**
     *
     * @param playerName
     * @param score
     * @returns {boolean}
     */
    saveScore(playerName, score) {
        // If the name of the player is empty, we do not save it to the toplist
        if (_.isEmpty(playerName)) {
            return;
        }

        let result = false;

        // Login to server, if not then go to failed auth
        $.ajax({
            url: '/highscores/' + this.authService.getEmail() + '?email=' + this.authService.getEmail()
            + '&signature=' + this.authService.getSignature()
            + '&score=' + this.authService.signScore(score),
            data: JSON.stringify({score: score}),
            type: 'PUT',
            contentType: "application/json",
            headers: this.authService.generateAuthHeader(),
            success: function (json) {
                console.log(json)
                result = true
            },
            error: function (err) {
                console.log(err)
                alert('Error in connection')
            },
            async: false
        });

        return result;
    }

    /**
     *
     * @returns {Array}
     */
    getTop10() {

        let top10 = [];
        // Login to server, if not then go to failed auth
        $.ajax({
            url: '/highscores?email=' + this.authService.getEmail() + '&signature=' + this.authService.getSignature(),
            headers: this.authService.generateAuthHeader(),
            success: function (json) {
                console.log(json)
                top10 = json
            },
            error: function (err) {
                console.log(err)
                alert('Error in connection')
            },
            async: false
        });

        return top10;
    }
}