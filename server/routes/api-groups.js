const { consoleTestResultHandler } = require("tslint/lib/test");

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
                if (channel._id == request.body.channelId) {
                    channel.users.forEach(user => {
                       if (user.active) {
                           database.users.findOne({ _id: user._id }).then(user => {
                               onlineUsers.push(user);
                           });
                       } 
                    });
                }
            });
            response.send(onlineUsers);
        });
    });
}