import {Game} from './game'
import AuthService from './services/AuthService'
import $ from 'jquery';


let authService = new AuthService(),
    email = authService.getEmail(),
    signature = authService.getSignature(),
    authHeader = authService.generateAuthHeader(email, signature);

function startGame(){
    window.game = new Game({email, signature, authHeader})
}

function authError(){
    console.log('Error logging in');
    window.location.replace("/calendar");
}


// Login to server, if not then go to failed auth
$.ajax({
    url:'/login?email=' + email + '&signature=' + signature,
    headers:authHeader,
    success:startGame,
    error:authError
});


