module.exports = (database, app) => {
    app.get('/api/get-groups', (request, response) => {
        database.collection('groups').find({}).toArray().then(groups => {
            response.send(groups);
        });
    });

    app.post('/api/get-user-groups', (request, response) => {
       database.collection('users').findOne({ username: request.body.username }).then(user => {
            database.collection('groups').find({ users: user._id }).toArray().then( group => {
                response.send(group);
            });
       });
    });

    app.post('/api/get-online-users', (request, response) => {
        database.collection('groups').findOne({ id: request.body.groupId }).then(group => {
            let onlineUsers = [];
            group.channels.forEach(channel => {
                database.collection('users').find({ _id: { $in : channel.users }, active: true }).toArray().then(users => {
                    onlineUsers.push(users);
                });
            });
            response.send(onlineUsers);
        });
    });

    app.post('/api/user-in-group', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
                if (group.users.includes(user._id)) {
                    response.send({ ok: true, message: `User '${user.username}' is Already a Member of ${group.name}`});
                } else {
                    response.send({ ok: false, message: `User '${user.username}' is not a Member of ${group.name}`  });
                }
            });
        });
    });

    app.post('/api/invite-user-to-group', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            const update = { $addToSet: { users: user._id }};
            database.collection('groups').findOneAndUpdate({ _id: request.body.groupId }, update).then(group => {
                const update = { $addToSet: { users: user._id }};
                if (group.lastErrorObject.n > 0) {
                    database.collection('channels').findOneAndUpdate({ groupId: group.value._id, name: "General Chat" }, update).then(channel => {
                        if (channel.lastErrorObject.n > 0) {
                            response.send({ ok: true, message: `'${user.username}' Has Been Invited To '${group.value.name}'`});
                        } else {
                            response.send({ ok: false, message: `Failed to Invite '${user.username}' to '${group.value.name}'`});
                        }
                    });
                }
            });
        }); 
    });

    app.post('/api/get-all-group-users', (request, response) => {
        database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
            database.collection('users').find({ _id: { $in : group.users }}).toArray().then(users => {
                response.send(users);
            });
        });
    });
}