module.exports = (database, app) => {
    app.post('/api/user-exists', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }, (error, user) => {
            response.send(user == null ? false : true);
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