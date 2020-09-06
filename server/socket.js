let channels = require('./channels.js');
module.exports = {
    connect: (io, PORT) => {  
        // Get all the IDs of all the channels that are active
        let channelIds = [];
        channels.getChannelIds().then(response => {
            channelIds = response
            
            io.on('connection', socket => {

                // Listen out for 'joinChannel' event
                socket.on('joinChannel', (channel, user)=> { 

                    // Join the channel(room) provided.
                    socket.join(channel);
                
                    // Inform - might not need this
                    io.to(channel).emit('joinedChannel', [channel, user]);

                    // Listen out for 'userConnected' even
                    socket.on(`userConnected`, user => {
                        // Inform people in the channel(room) that someone has joined. (update user list)
                        io.to(channel).emit(`userConnected`, user);
                    });

                    // Listen out for 'userDisconnected' event
                    socket.on('userDisconnected', user => {
                        // Inform people in the channel(room) that someone disconnected (update user list)
                        io.to(channel).emit(`${channel.channelId}-userDisconnected`, user);
                    });

                    // Listen out for 'message' event
                    socket.on('message', message => {
                        // Inform people in the channel(room) that a new message has been sent and return the message
                        io.to(channel).emit('message', message);
                    });

                    socket.on('disconnect', reason => {
                        console.log(reason);
                    });
                });

            });
        });
    }
}