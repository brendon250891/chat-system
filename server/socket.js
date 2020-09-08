let channels = require('./channels.js');
module.exports = {
    connect: (io, PORT) => {

        io.on('connection', socket => {
            // Ids of all the channels in a group.
            let groupChannelIds = [];
            
            // Current channel Id
            let channelId;

            // Current channel name
            let channelName;

            // Username of the connected person
            let username;

            // Listen out for 'joinChannel' event
            socket.on('joinChannel', async (channel, user)=> { 

                channelId = channel._id; 
                channelName = channel.name;
                username = user.username;
                await channels.getChannelIds(channel.groupId).then(results => {
                    groupChannelIds = results;            
                });

                // Join the channel(room) provided.
                socket.join(channelId);
            
                // Inform - might not need this
                console.log(`${username} joined channel ${channelName}`)

                // Inform all channels(rooms) in the group that someone has connected
                groupChannelIds.forEach(id => {
                    io.to(id).emit('joinChannel', [channel, user]);
                });
            });

            socket.on('message', message => {
                // Inform people in the channel(room) that a new message has been sent and return the message
                console.log(`${channelName} got message ${message.message}`);
                io.to(channelId).emit('message', message);
            });

            socket.on('leaveChannel', (channel, user) => {
                // Inform all channels(rooms) in the group that someone has disconnected.
                groupChannelIds.forEach(id => {
                    io.to(id).emit('leaveChannel', [channelName, username]);
                });
                console.log(`${username} left channel ${channelName}`);
                socket.leave(channelId);
            });
        });
    }
}