module.exports = (database, app) => {
    /**
     * Adds a new group to the group collection
     * @param groupForm - The details of the group (name, avatar etc)
     * @param channels - Any channels that should also be added
     */
    app.post('/api/add-group', (request, response) => {
        database.collection('groups').find().count().then(count => {
            let group = request.body.groupForm;
            let channels = request.body.channels;
            if (group != null && channels != null) {
                database.collection('groups').insertOne({ 
                    _id: count + 1, 
                    name: group.name, 
                    description: group.description, 
                    avatar: group.avatar,
                    users: group.users, 
                    assistants: group.assistants, 
                    active: group.active 
                }).then(group => {
                    if (group.insertedCount > 0 && channels.length > 0) {
                        database.collection('channels').find().count().then(count => {
                            channels.map((channel, index) => {
                                database.collection('channels').insertOne({ _id: count + (index + 1), groupId: group.ops[0]._id,
                                    name: channel, users: channel == 'General Chat' && group.ops[0].users.length > 0 ? group.ops[0].users : [], connectedUsers: [], messages: [], active: true }).then()
                            }); 
                        });
                        response.send({ ok: true, message: `Successfully Added Group '${group.ops[0].name}'`});
                    } else {
                        response.send({ ok: false, message: `Failed to Add Group '${group.ops[0].name}'`});
                    }
                }); 
            } else {
                response.send({ ok: false, message: `Failed to Add Group`});
            }
        });
    });

    /**
     * Gets a group given a valid group id
     * @param groupId - The id of the group to find
     */
    app.post('/api/get-group', (request, response) => {
        database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
            response.send(group);
        });
    });

    /**
     * Removes a group (soft delete)
     * @param group - The group to remove.
     */
    app.post('/api/remove-group', (request, response) => {
        if (request.body.group) {
            database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $set: { active: false }}).then(group => {
                if (group.lastErrorObject.n > 0) {
                    response.send({ ok: true, message: `Successfully Removed Group '${request.body.group.name}`});
                } else {
                    response.send({ ok: false, message: `Failed to Remove Group '${request.body.group.name}`});
                }
            });
        } else {
            response.send({ ok: false, message: `Failed to Remove Group`});
        }
    });

    /**
     * Retrieves all groups from the collection
     */
    app.get('/api/get-groups', (request, response) => {
        database.collection('groups').find().toArray().then(groups => {
            response.send(groups);
        });
    });

    /**
     * Retrieves the groups that a user has access to.
     * @param username - The user to find groups for
     */
    app.post('/api/get-user-groups', (request, response) => {
       database.collection('users').findOne({ username: request.body.username }).then(user => {
            database.collection('groups').find({ users: user._id }).toArray().then(groups => {
                response.send(groups);
            });
       });
    });

    /**
     * Checks if a user has access to a group
     * @param username - The user to check
     * @param groupId - The group id of the group to check
     */
    app.post('/api/user-in-group', (request, response) => {
        database.collection('users').findOne({ username: request.body.username }).then(user => {
            database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
                if (group.users.includes(user._id)) {
                    response.send({ ok: true, message: `User '${user.username}' is Already a Member of ${group.name}`});
                } else {
                    response.send({ ok: false, message: `User '${user.username}' is not a Member of ${group.name}`});
                }
            });
        });
    });

    /**
     * Invites (adds) a user to a group
     * @param username - The user to add
     * @param groupId - The id of the group to add the user to
     */
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

    /**
     * Gets all the users able to access a group
     * @param  groupId - The id of the group in which to get the users from
     */
    app.post('/api/get-all-group-users', (request, response) => {
        database.collection('groups').findOne({ _id: request.body.groupId }).then(group => {
            database.collection('users').find({ _id: { $in : group.users }}).toArray().then(users => {
                response.send(users);
            });
        });
    });

    /**
     * Removes a user from a group
     * @param groupId - The group to remove the user from
     * @param user - The user to remove
     */
    app.post('/api/remove-user-from-group', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.groupId }, { $pull: { users: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `'${request.body.user.username}' Has Been Removed From ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to Remove '${request.body.user.username}' From ${group.value.name}`});
            }
        })
    });

    /**
     * Promotes a user to group assistant
     * @param group - The group to promote the user to assistant in
     * @param username - The name of the user to promote
     */
    app.post('/api/promote-user-to-group-assistant', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $addToSet: { assistants: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `'${request.body.user.username}' is Now An Assistant for ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to promote '${request.body.user.username}'`});
            }
        });
    });

    /**
     * Demotes a user from group assistant
     * @param group - The group to demote the user in
     * @param user - The user to demote
     */
    app.post('/api/demote-user-from-group-assistant', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $pull: { assistants: request.body.user._id }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `User '${request.body.user.username}' is no Longer an Assistant for ${group.value.name}`});
            } else {
                response.send({ ok: false, message: `Failed to demote '${request.body.user.username}'`});
            }
        });
    });

    /**
     * Reactivates a deactivated group for use
     * @param group - The group to reactivate
     */
    app.post('/api/reactivate-group', (request, response) => {
        database.collection('groups').findOneAndUpdate({ _id: request.body.group._id }, { $set: { active: true }}).then(group => {
            if (group.lastErrorObject.n > 0) {
                response.send({ ok: true, message: `Reactivated Group '${request.body.group.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Reactivate Group '${request.body.group.name}'`});
            }
        })
    });

    /**
     * Checks if a group exists
     * @param name - The name of the group 
     * */
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