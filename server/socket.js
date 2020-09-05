let channels = require('./channels.js');
module.exports = {
    connect: (io, PORT) => {  
        // Get all the IDs of all the channels that are active
        let channelId = channels.getChannelIds().then(response => { return response });

        io.on('connection', socket => {
            socket.on('joinChannel', channel => { 
                let roomId = roomIds[channel.channelId - 1];
                socket.join(roomId);

                socket.on(`userConnected`, user => {
                    io.emit(`userConnected`, user);
                    console.log(`${user.username} connected to ${channel.channelName}`);
                });

                socket.on('userDisconnected', user => {
                    io.emit(`${channel.channelId}-userDisconnected`, user);
                    console.log(`${user.username} disconnected from ${channel.channelName}`);                    
                });

                socket.on('message', message => {
                    console.log(message);
                    io.emit(`${channel.channelId}-message`, message);
                });

                socket.on('disconnect', reason => {
                    console.log(reason);
                });
            });
        });
    }
}
