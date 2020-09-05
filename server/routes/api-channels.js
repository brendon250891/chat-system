module.exports = (database, app) => {
    app.get('/api/get-all-channels', (request, response) => {
        database.collection('channels').find().toArray().then(channels => {
            if (channels) {
                response.send({ok: true, channels: channels });
            } else {
                response.send({ ok: false, message: "Failed to get any channels" });
            }
        });
    });

    app.post('/api/get-channels', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId, active: true }).toArray().then(channels => {
            response.send(channels);
        });
    });

    app.post('/api/get-removed-channels', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId, active: false }).toArray().then(channels => {
            response.send(channels);
        });
    });

    app.post('/api/can-access-channel', (request, response) => {
        database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
            let hasAccess = false;
            channel.users.forEach(user => {
                if (user == request.body.userId) {
                    hasAccess = true;
                }
            });
            response.send({ ok: hasAccess, message: hasAccess ? '' : `You don't have access to channel '${channel.name}'`});
        });
    });

    app.post('/api/join-channel', (request, response) => {
        const update = { $addToSet: { connectedUsers: request.body.userId }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
            if (result.lastErrorObject.updatedExisting) {
                response.send({ ok: true, message: `Connected to Channel '${result.value.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Connect to Channel '${result.value.name}'`});
            }
        });
    });

    app.post('/api/leave-channel', (request, response) => {
        const update = { $pull: { connectedUsers: request.body.userId }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
            response.send({ok: true, message: `Left Channel`});
        });
    });

    app.post('/api/get-online-channel-users', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId }).toArray().then(channels => {
            
        });
    });

    app.post('/api/get-messages', (request, response) => {
        database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
            response.send(channel.messages);
        });
    });

    app.post('/api/save-message', (request, response) => {
        const update = { $push: { messages: request.body.message }}
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
            response.send(result);
        });
    });

    app.post('/api/add-channel', (request, response) => {
        database.collection('channels').find().count().then(count => {
            database.collection('channels').insertOne({ 
                _id: count + 1,
                groupId: request.body.groupId,
                name: request.body.channel,
                users: request.body.users,
                connectedUsers: [],
                messages: [],
                active: true,
            }).then(result => {
                if (result.insertedCount > 0) {
                    response.send({ ok: true, message: `Successfully Created Channel '${result.ops[0].name}'.`});
                } else {
                    response.send({ ok: false, message: `Failed to Create Channel '${result.ops[0].name}'.`});
                }
            });
        });
    });

    app.post('/api/remove-channel', (request, response) => {
        const update = { $set: { active: false }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Removed Channel '${document.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to Removed Channel '${document.value.name}`});
            }            
        });
    });

    app.post('/api/reactivate-channel', (request, response) => {
        const update = { $set: { active: true }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Reactivated Channel '${document.value.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Reactivate Channel '${document.value.name}'`});
            }
        });
    });

    app.post('/api/invite-user-to-channel', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            const update = { $addToSet: { users: user._id }};
            database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
                if (document.lastErrorObject.n > 0) {
                    response.send({ ok: true, message: `Invited '${user.username}' to '${document.value.name}'`});
                } else {
                    response.send({ ok: true, message: `Failed to Invite '${user.username}' to '${document.value.name}'`});
                }
            });
        });
    });

    app.post('/api/user-in-channel', (request, response) => {
        database.collection('users').findOne({ username: request.body.username, active: true }).then(user => {
            database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
                if (channel.users.includes(request.body.userId)) {
                    response.send({ ok: true, message: `'${user.username}' is Already a Member of ${channel.name}`});
                } else {
                    response.send({ ok: false, message: `'${user.username}' is not a Member of ${channel.name}`});
                }
            });
        });
    });

    app.post('/api/remove-user-from-channel', (request, response) => {
        console.log(request.body);
        const update = { $pull: { users: request.body.user._id }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Removed '${request.body.user.username}' from ${document.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to Remove '${request.body.user.username}' from ${document.value.name}`});
            }
        });
    });
}