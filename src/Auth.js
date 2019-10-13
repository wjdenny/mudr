const regex = {
    validEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

class Auth {
    static authorize(client) {
        return new Promise((resolve, reject) => {
            client.ask('E-mail address: ')
            .then((data) => { 
                if (data.match(regex.validEmail)) { 
                    client.username = data; 
                    return client.ask('Password: ');
                } else { reject(`'${data}' is not a valid email address.`); }
            }, (error) => { reject(error); })
            .then((data) => {
                client.authorized = true;
                Logger.verbose(
                    `${client.username} has logged in.`, 
                    { 
                        label: 'auth', 
                        remote: client.remote 
                    }
                );
                
                resolve(client)
            }, (error) => { reject(error); })
        });
    }
}

module.exports = Auth;