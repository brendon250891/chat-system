module.exports = (database, app) => {
    /**
     * Checks that the login details provided match what is stored in the database.
     * @param username - The user's username
     * @param password - The password to compare against
     */
    app.post('/api/login', (request, response) => { 
        database.collection('users').findOne({ username: request.body.username }, (error, user) => {
            if (user) {
                if (user.active) {
                    database.collection('passwords').findOne({ user: user._id }, (error, password) => {
                        response.send(password.password == request.body.password ? { ok: true, user: user } : { ok: false, message: "Invalid user credentials given" });
                    });
                } else {
                    response.status(403).send("Account has been disabled.");
                }
            } else {
                response.send({ ok: false, message: "Invalid user credentials given"});
            }
        });
    });

    /**
     * Adds a new user to the collection when they register
     * @param username - The username chosen for the user
     * @param email - The users email
     * @param avatar - The users avatar
     * @param role - The role of the user
     * @param active - The status of the users account
     */
    app.post('/api/register', (request, response) => {
        database.collection('users').find().count().then(count => {
            database.collection('users').insertOne({ 
                _id: count + 1, 
                username: request.body.username, 
                email: request.body.email,
                avatar: request.body.avatar ?? "",
                role: request.body.role ?? "",
                active: true
            }, (error, result) => {
                if (result.insertedCount == 1) {
                    response.send({ ok: true, message: `Successfully created account '${request.body.username}'`});
                } else {
                    response.send({ ok: false, message: `Failed to create account '${request.body.username}'`});
                }
            });
        })
    });
}