module.exports = (database, app) => {
    /**
     * Checks if a user exists
     * @param username - The username to try and find.
     */
    app.post('/api/user-exists', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            if (request.body.userId && user._id == request.body.userId) {
                response.send({ ok: false });
            }
            if (user) {
                if (user.active) {
                    // user exists and is active
                    response.send({ ok: true, message: `'${user.username}' is Already in Use`});
                } else {
                    // user exists and is not active
                    response.send({ ok: true, message: `'${user.username}' is in Use (Deactivated)`});
                }
            } else {
                // user has never existed
                response.send({ ok: false , message: `User '${request.body.username}' Does Not Exist`});
            }
        });
    });

    /**
     * Retrieves a user from the collection
     * @param username - A username to try and find.
     * @param userId - An id to try and find
     */
    app.post('/api/get-user', (request, response) => {
        let query = request.body.userId ? { _id: request.body.userId } : { username: request.body.username };
        database.collection('users').findOne(query).then(user => {
            if (user) {
                response.send({ ok: true, user: user  });
            } else {
                if (request.body.userId) {
                    response.send({ ok: false, message: `Failed to Find User` });
                } else {
                    response.send({ ok: false, message: `Failed to Find User '${request.body.username}'`});
                }
            }
        });
    });

    /**
     * Updates a user document in the collection
     * @param user - The user object with updated values to set.
     */
    app.post('/api/update-user', (request, response) => {
        database.collection('users').findOneAndUpdate({ _id: request.body.user._id }, { $set: request.body.user }).then(result => {
            if (result.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Updated Your Account Details`});
            } else {
                response.send({ ok: false, message: `An Error Occurred While Updating Your Account Details.`});
            }
        });
    });

    /**
     * Updates a users password
     * @param userId - The id of the user that is changing their password
     * @param newPassword - The password that the user is changing to
     */
    app.post('/api/update-password', (request, response) => {
        database.collection('passwords').findOneAndUpdate({ user: request.body.userId }, { $set: { password: request.body.newPassword }}).then(result => {
            if (result.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Changed Your Password`});                
            } else {
                response.send({ ok: false, message: `An Error Occurred While Updating Changing Your Password`});
            }
        });
    });

    /**
     * Gets all online users for a group chat
     * @param groupId - The id of the group to retrieve online users
     */
    app.post('/api/get-online-users', async (request, response) => {
        let allOnlineUsers = [];        
        database.collection('channels').find({ groupId: request.body.groupId }).toArray().then(channels => {
            let promises = [];        
            channels.map(async (channel, index) => {
                promises.push(new Promise(resolve => {
                    database.collection('users').find({ _id: { $in: channel.connectedUsers }}).toArray().then(onlineUsers => {
                        resolve(allOnlineUsers.push(onlineUsers));
                    });
                }));
            });
            Promise.all(promises).then(() => {
                response.send(allOnlineUsers);
            });
        });
    });

    /**
     * Adds a new user to the collection
     * @param user - The user object to insert
     */
    app.post('/api/add-user', (request, response) => {
        let user = request.body.user;
        if (user && user.password) {
            database.collection('users').find().count().then(count => {
                database.collection('users').insertOne({
                    _id: count + 1,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar ?? "",
                    role: user.role ?? "",
                    active: true
                }).then(u => {
                    if (u.insertedCount > 0 && user.password) {
                        database.collection('passwords').insertOne({ user: u.ops[0]._id, password: user.password }).then(password => {
                            if (password.insertedCount > 0) {
                                response.send({ ok: true, message: `Created Account '${u.ops[0].username}'`});
                            } else {
                                response.send({ ok: false, message: `Failed to Create Account '${user.username}'`});
                            }
                        });
                    } else {
                        response.send({ ok: false, message: `Failed to Create Account '${user.username}'`});
                    }
                });
            });
        } else {
            response.send({ ok: false, message: `Failed to Create Account '${user.username}'`});
        }
    });

    /**
     * Deactivate a user account
     * @param username - The username of the account to deactivate
     */
    app.post('/api/deactivate-user', (request, response) => {
        database.collection('users').findOneAndUpdate({ username: request.body.username }, { $set: { active: false }}).then(user => {
            if (user.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Deactivated Account '${request.body.username}'`});
            } else {
                response.send({ ok: false, message: `Failed to Deactivate Account '${request.body.username}'`});
            }
        });
    });

    /**
     * Reactivates a user account
     * @param username - The username of the account to reactivate
     */
    app.post('/api/activate-user', (request, response) => {
        database.collection('users').findOneAndUpdate({ username: request.body.username }, { $set: { active: true }}).then(user => {
            if (user.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Activated Account '${request.body.username}'`});
            } else {
                response.send({ ok: false, message: `Failed to Activate Account '${request.body.username}'`});
            }
        });
    });
}