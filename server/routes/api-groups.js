const { request } = require("express");

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

    app.post('/api/get-group', (request, response) => {
        database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
            response.send(group);
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
        database.collection('groups').find().toArray().then(groups => {
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

    app.post('/api/add-user-to-group', (request, response) => {
        console.log(request.body.username);
        console.log(request.body.group);
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            // console.log(user);
            const update = { $addToSet: { users: user._id }};
            database.collection('groups').findOneAndUpdate({ name: request.body.group }, update).then(group => {
                if (group.lastErrorObject.n > 0) {
                    database.collection('channels').findOneAndUpdate({ groupId: group.value._id, name: "General Chat" }, update).then(channel => {
                        if (channel.lastErrorObject.n > 0) {
                            response.send({ ok: true, message: `'${user.username}' Has Been Invited To '${group.value.name}'`});
                        } else {
                            response.send({ ok: false, message: `Failed to Invite '${user.username}' to '${group.value.name}'`});
                        }
                    });
                }
            })
        })
    });

    app.post('/api/get-all-group-users', (request, response) => {
        database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
            database.collection('users').find({ _id: { $in : group.users }}).toArray().then(users => {
                response.send(users);
            });
        });
    });

    app.post('/api/remove-user-from-group', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.groupId }, { $pull: { users: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `'${request.body.user.username}' Has Been Removed From ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to Remove '${request.body.user.username}' From ${group.value.name}`});
            }
        })
    });

    app.post('/api/promote-user-to-group-assistant', (requset, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $addToSet: { assistants: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `'${request.body.user.username}' is Now An Assistant for ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to promote '${request.body.user.username}'`});
            }
        });
    });

    app.post('/api/demote-user-from-group-assistant', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $pull: { assistants: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `User '${request.body.user.username}' is no Longer an Assistant for ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to demote '${request.body.user.username}'`});
            }
        });
    });

    app.post('/api/reactivate-group', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $set: { active: true }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Reactivated Group '${request.body.group.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Reactivate Group '${request.body.group.name}'`});
            }
        })
    });

    app.post('/api/group-exists', (request, response) => {
        database.collection('groups').findOne({ name: request.body.group }).then(group => {
            if (group) {
                response.send({ ok: true, message: `Group '${group.name}' Already Exists`});
            } else {
                response.send({ ok: false, message: `Group '${request.body.group}' Does Not Exist`});
            }
        });
    });
}