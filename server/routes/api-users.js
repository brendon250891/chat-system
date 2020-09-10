module.exports = (database, app) => {
    app.post('/api/user-exists', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
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

    app.post('/api/update-user', (request, response) => {
        database.collection('users').findOneAndUpdate({ _id: request.body.user._id }, { $set: request.body.user }).then(result => {
            if (result.lastErrorObject.n != 0) {
                response.send({ ok: true, message: `Successfully Updated Your Account Details`});
            } else {
                response.send({ ok: false, message: `An Error Occurred While Updating Your Account Details.`});
            }
        });
    });

    app.post('/api/update-password', (request, response) => {
        database.collection('passwords').findOneAndUpdate({ user: request.body.userId }, { $set: { password: request.body.newPassword }}).then(result => {
            if (result.lastErrorObject.n != 0) {
                response.send({ ok: true, message: `Successfully Changed Your Password`});                
            } else {
                response.send({ ok: false, message: `An Error Occurred While Updating Changing Your Password`});
            }
        });
    });

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

    app.post('/api/add-user', (request, response) => {
        let user = request.body.user;
        database.collection('users').find().count().then(count => {
            database.collection('users').insertOne({
                _id: count + 1,
                username: user.username,
                email: user.email,
                avatar: user.avatar ?? "",
                role: user.role ?? "",
                active: true
            }).then(u => {
                if (u.insertedCount > 0) {
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
    });

    app.post('/api/deactivate-user', (request, response) => {
        database.collection('users').findOneAndUpdate({ username: request.body.username }, { $set: { active: false }}).then(user => {
            if (user.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Deactivated Account '${request.body.username}'`});
            } else {
                response.send({ ok: false, message: `Failed to Deactivate Account '${request.body.username}'`});
            }
        });
    });

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