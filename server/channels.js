const fetch = require('node-fetch');
const url = 'http://localhost:3000/api/get-all-channels';

module.exports = {
    getChannelIds: (groupId) => {
        return fetch(url).then(response => {
            return response.json();
        }).then(data => {
            let ids = []
            data.channels.map(channel => { 
                if (channel.groupId == groupId) {
                    ids.push(channel._id);
                }
            });
            return ids;
        }).catch(error => {
            console.log(error);
        });
    }
}