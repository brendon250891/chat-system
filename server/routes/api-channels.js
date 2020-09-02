const { response } = require("express");

module.exports = (database, app) => {
    app.post('/api/get-channels', (request, response) => {
        database.collection('channels').find({ groupId: request.body.groupId }).toArray().then(channels => {
            response.send(channels);
        });
    });

    app.post('/api/can-access-channel', (request, response) => {
        database.collection('channels').findOne({ _id: request.body.channelId }).then(channel => {
            let hasAccess = false;
            channel.users.forEach(user => {
                if (user.user == request.body.userId) {
                    hasAccess = true;
                }
            });
            response.send({ ok: hasAccess, message: hasAccess ? '' : `You don't have access to channel '${channel.name}'`});
        });
    });

    app.post('/api/join-channel', (request, response) => {
        const update = { $set: {"users.$[elem].connected" : true }};
        const filter = { arrayFilters: [ { "elem.user": request.body.userId }]};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, filter, (error, result) => {
            if (result.lastErrorObject.updatedExisting) {
                response.send({ ok: true, message: `Connected to Channel '${result.value.name}'`});
            } else {
                response.send({ ok: false, message: `Failed to Connect to Channel '${result.value.name}'`});
            }
        });
    });

    app.post('/api/leave-channel', (request, response) => {
        const update = { $set: {'users.$[elem].connected' : false }};
        const filter = { arrayFilters: [ { 'elem.user': request.body.userId }]};
        database.collection('channels').findOneAndUpdate({ _id: request.body.channelId }, update, filter, (error, result) => {
            console.log(result);
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
}