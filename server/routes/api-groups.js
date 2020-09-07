module.exports = (database, app) => {
    app.post('/api/add-group', (request, response) => {
        database.collection('groups').find().count().then(count => {
            let group = request.body.groupForm;
            let channels = request.body.channels;
            database.collection('groups').insertOne({ _id: count + 1, name: group.name, description: group.description, avatar: group.avatar,
                users: group.users, assistants: group.assistants, active: group.active }).then(group => {
                    if (group.insertedCount > 0) {
                        if (channels.length > 0) {
                            database.collection('channels').find().count().then(count => {
                                channels.map((channel, index) => {
                                    database.collection('channels').insertOne({ _id: count + (index + 1), groupId: group.ops[0]._id,
                                        name: channel, users: channel == 'General Chat' && group.ops[0].users.length > 0 ? group.ops[0].users : [], connectedUsers: [], messages: [], active: true }).then()
                                }); 
                            });
                        }
                        response.send({ ok: true, message: `Successfully Added Group '${group.ops[0].name}'`});
                    } else {
                        response.send({ ok: false, message: `Failed to Add Group '${group.ops[0].name}'`});
                    }
                });
            });
    });

    app.post('/api/remove-group', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $set: { active: false }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Removed Group '${request.body.group.name}`});
            } else {
                response.send({ ok: true, message: `Failed to Remove Group '${request.body.group.name}`});
            }
        });
    });

    app.get('/api/get-groups', (request, response) => {
        database.collection('groups').find({ active: true }).toArray().then(groups => {
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