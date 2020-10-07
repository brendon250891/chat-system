module.exports = (database, app) => {
    /**
     * Gets all the channels from the collection
     */
    app.get('/api/get-all-channels', (request, response) => {
        database.collection('channels').find({ active: true }).toArray().then(channels => {
            if (channels) {
                response.send({ok: true, channels: channels });
            } else {
                response.send({ ok: false, message: "Failed to get any channels" });
            }
        });
    });

    /**
     * Gets all the channels for a specific group
     * @param groupId - The group to find the channels of
     */
    app.post('/api/get-channels', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId, active: true }).toArray().then(channels => {
            response.send(channels);
        });
    });

    /**
     * Gets any inactive channels for a group
     * @param groupId - The group to find inactive channels for
     */
    app.post('/api/get-removed-channels', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId, active: false }).toArray().then(channels => {
            response.send(channels);
        });
    });

    /**
     * Checks if a user has access to a channel within a group
     * @param channelId - The channel to check
     * @param userId - The user id to look for
     */
    app.post('/api/can-access-channel', (request, response) => {
        database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
            let hasAccess = channel.users.includes(request.body.userId);
            response.send({ ok: hasAccess, message: hasAccess ? '' : `You don't have access to channel '${channel.name}'`});
        });
    });

    /**
     * Adds a user to the connected users array
     * @param userId - The user to add
     * @param channelId - The channel to add the user to
     */
    app.post('/api/join-channel', (request, response) => {
        const update = { $addToSet: { connectedUsers: request.body.userId }};
        new Promise((resolve, reject) => {
            database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
                resolve(result);
            });
        }).then(result => {
            if (result.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Joined Channel '${result.value.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Join Channel`});
            }
        });
    });

    /**
     * Removes a user from the connected users array when they leave
     * @param userId - The user who is leaving
     * @param channelId - The channel to leave
     */
    app.post('/api/leave-channel', (request, response) => {
        const update = { $pull: { connectedUsers: request.body.userId }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
            response.send({ok: true, message: `Left Channel`});
        });
    });

    /** 
     * Gets all the messages for a channel
     * @param channelId - The channel to get the messages for
     */
    app.post('/api/get-messages', (request, response) => {
        database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
            response.send(channel.messages);
        });
    });

    /**
     * Saves a message to a channel
     * @param message - The message to save
     * @param channelId - The channel the message is for
     */
    app.post('/api/save-message', (request, response) => {
        const update = { $push: { messages: request.body.message }}
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, (error, result) => {
            response.send({ ok: true, message: "Successfully Saved Message" });
        });
    });

    /**
     * Adds a new channel
     * @param groupId - The group that the channel belongs to
     * @param channel - The name to give the channel
     * @param users - Any users that are to be given access
     */
    app.post('/api/add-channel', (request, response) => {
        if (request.body.groupId && request.body.channel) {
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
        } else {
            response.send({ ok: false, message: "Failed to Create Channel"});
        }
    });

    /**
     * Removes a channel
     * @param channelId - The id of the channel to be removed
     */
    app.post('/api/remove-channel', (request, response) => {
        const update = { $set: { active: false }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Removed Channel '${document.value.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Remove Channel`});
            }            
        });
    });

    /**
     * Reactivates a channel for use
     * @param channelId - The channel to reactivate
     */
    app.post('/api/reactivate-channel', (request, response) => {
        const update = { $set: { active: true }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.value.active) {
                response.send({ ok: false, message: `Channel '${document.value.name}' is Already Active`});
            } else {
                if (document.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Successfully Reactivated Channel '${document.value.name}'`});
                } else {
                    response.send({ ok: false, message: `Failed to Reactivate Channel '${document.value.name}'`});
                }
            }
        });
    });

    /**
     * Invites a user to a channel
     * @param channelId - The channel to invite the user
     * @param user - The user to invite
     */
    app.post('/api/invite-user-to-channel', (request, response) => {
        let user = request.body.user;
        const update = { $addToSet: { users: user._id }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (document.value.users.includes(user._id)) {
                response.send({ ok: false, message: `${user.username} Already Has Access to Channel`});
            } else {
                if (document.lastErrorObject.n > 0) {
                    response.send({ ok: true, message: `Invited '${user.username}' to '${document.value.name}'`});
                } else {
                    response.send({ ok: true, message: `Failed to Invite '${user.username}' to '${document.value.name}'`});
                }
            }
        });
    });

    /**
     * Checks if a user has already been invited to a channel
     * @param username - The user's username
     * @param channelId - The channel to invite to
     */
    app.post('/api/user-in-channel', (request, response) => {
        database.collection('users').findOne({ username: request.body.username, active: true }).then(user => {
            database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
                if (channel.users.includes(user._id)) {
                    response.send({ ok: true, message: `'${user.username}' is Already a Member of ${channel.name}`});
                } else {
                    response.send({ ok: false, message: `'${user.username}' is not a Member of ${channel.name}`});
                }
            });
        });
    });

    /**
     * Removes a user from a channel
     * @param user - The user to remove
     * @param channelId - The channel to remove from
     */
    app.post('/api/remove-user-from-channel', (request, response) => {
        let user = request.body.user;
        const update = { $pull: { users: user._id }};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update).then(document => {
            if (!document.value.users.includes(user._id)) {
                response.send({ ok: false, message: `Failed to remove ${user.username}`})
            } else {
                if (document.lastErrorObject.n > 0) {
                    response.send({ ok: true, message: `Removed '${request.body.user.username}' from ${document.value.name}`});
                } else {
                    response.send({ ok: false, message: `Failed to Remove '${request.body.user.username}' from ${document.value.name}`});
                }
            }
        });
    });
}