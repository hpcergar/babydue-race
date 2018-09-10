module.exports = {
    apps : [{
        name      : 'babydue-race',
        script    : 'app.js',
        env: {
            NODE_ENV: 'development'
        },
        env_production : {
            NODE_ENV: 'production'
        }
    }]
};