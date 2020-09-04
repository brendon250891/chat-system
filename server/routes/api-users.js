module.exports = (database, app) => {
    app.post('/api/user-exists', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            if (user) {
                if (user.active) {
                    // user exists and is active
                    response.send({ ok: true, message: `'${user.username}' is Already in Use`});
                } else {
                    // user exists and is not active
                    response.send({ ok: false, message: `'${user.username}' is in Use (Deactivated)`});
                }
            } else {
                // user has never existed
                response.send({ ok: false , message: `'${request.body.username}' Does not Exist`});
            }
        });
    });

    app.post('/api/get-user', (request, response) => {
        database.collection('users').findOne({ _id: request.body.userId }).then(user => {
            response.send(user);
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
}