const fetch = require('node-fetch');
const url = 'http://localhost:3000/api/get-all-channels';
module.exports = {
    getRooms: () => {
        return fetch(url).then(response => {
            return response.json();
        }).then(data => {
            return data.channels.map(channel => {
                return channel._id;
            });
        }).catch(error => {
            console.log(error);
        });
    }
}