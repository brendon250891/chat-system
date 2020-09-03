module.exports = {
    connect: (io, PORT) => {
        io.on('connection', socket => {

            socket.on('joinChannel', channel => { 
                socket.join(channel.channelId);

                socket.on(`userConnected`, user => {
                    io.emit(`${channel.channelId}-userConnected`, user);
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
    },
}