module.exports = {
    secretkey :"ILOVEINDIA",

    dbconfig : {
        development: {
            //url to be used in link generation
            url: 'http://127.0.0.1',
            port: 8081,                            
           database: {
                HOST: '127.0.0.1',
                MONGO_PORT: '27017',
                MONGO_DB: 'language_curry'
            },
        },
        
        // development: {
        //     //url to be used in link generation
        //     url: 'http://my.site.com',
        //     //mongodb connection settings
        //     database: {
        //         host: '127.0.0.1',
        //         port: '27017',
        //         db: 'language_curry'
        //     },
        //     //server details
        //     server: {
        //         host: '127.0.0.1',
        //         port: 8081
        //     }
        // },
        production: {
            //url to be used in link generation
            url: 'http://35.154.141.103',
            port: 8081,                            
           database: {
                HOST_PATH: 'http://35.154.141.103',
                HOST: '35.154.141.103',
                PORT: 8081,                
                MONGO_USERNAME: 'admin',
                MONGO_PASSWORD: 'oursport_admin',
                MONGO_PORT: 27017,
                MONGO_AUTH_DB: 'admin',
                MONGO_DB: 'language_curry',
            },
        }
    }
}
