const MongoClient = require('mongodb').MongoClient;
const databaseUrl = 'mongodb://localhost:27017';
const databaseName = 'chatSystem';
const client = new MongoClient(databaseUrl);

const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const timeOptions = { hour: 'numeric', minute: 'numeric' };
const date = new Date();
const formattedDate = `${new Intl.DateTimeFormat('en-AU', dateOptions).format(date)} ${new Intl.DateTimeFormat('en-AU', timeOptions).format(date)}`;

client.connect(async function(error) {
    console.log(error ? error.message : "Connected to Database");
    const db = client.db(databaseName);
    await seed(db).then(result => {
        console.log(result ? "\nSuccessfully Seeded Database" : "Failed to Seed Database");
    });
    client.close();
});

async function seed(db) {
    // Clear database
    try {            
        await db.collection('users')?.drop().then(result => {
            if (result) {
                console.log("Dropped Collection: users");
            }
        });

        await db.collection('passwords')?.drop().then(result => {
            if (result) {
                console.log("Dropped Collection: passwords");
            }
        });

        await db.collection('groups')?.drop().then(result => {
            if (result) {
                console.log("Dropped Collection: groups");
            }
        });

        await db.collection('channels')?.drop().then(result => {
            if (result) {
                console.log("Dropped Collection: channels");
            }
        }).then(() => {
            console.log("Cleared All Collections From Database\n");
        })
    } catch (e) {
        console.log(e);
    }

    try {
        // Seed users
        await db.collection('users').insertMany([
            { _id: 1, username: "super", email: "super@chat-sytem.com", avatar: "placeholder.jpg", role: "super", active: true },
            { _id: 2, username: "brendon", email: "brendon@chat-sytem.com", avatar: "placeholder.jpg", role: "", active: true },
            { _id: 3, username: "mel", email: "jane@chat-sytem.com", avatar: "mel.jpg", role: "", active: true },
            { _id: 4, username: "steve", email: "john@chat-sytem.com", avatar: "steve.jpg", role: "", active: true },
            { _id: 5, username: "wayne", email: "wayne@chat-sytem.com", avatar: "headshot.jpg", role: "", active: true },
            { _id: 6, username: "jose", email: "jose@chat-sytem.com", avatar: "headshot.jpg", role: "", active: true },
        ]).then(result => {
            console.log(result.insertedCount > 0 ? "Seeded Collection: users" : "Failed to Seed Collection: users");
        });

        // Seed passwords
        await db.collection('passwords').insertMany([
            { user: 1, password: '123' },
            { user: 2, password: '123' },
            { user: 3, password: '123' },
            { user: 4, password: '123' },
            { user: 5, password: '123' },
            { user: 6, password: '123' },
        ]).then(result => {
            console.log(result.insertedCount > 0 ? "Seeded Collection: passwords" : "Faile to Seed Collection: passwords");
        });

        // Seed groups
        await db.collection('groups').insertMany([
            { 
                _id: 1, 
                name: "NRL", 
                description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", 
                avatar: "nrl.png",
                users: [ 2, 3, 5 ],
                assistants: [ 5 ],
                active: true,
            },
            { 
                _id: 2, 
                name: "EPL", 
                description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", 
                avatar: "epl.png",
                users: [ 3 ], 
                assistants: [ 6 ],
                active: true
            },
        ]).then(result => {
            console.log(result.insertedCount > 0 ? "Seeded Collection: groups" : "Failed to Seed Collection: groups");
        });

        await db.collection('channels').insertMany([
            { 
                _id: 1,
                groupId: 1,
                name: "General Chat",
                users: 
                [
                    { 
                        user: 2, 
                        connected: false
                    }, 
                    { 
                        user: 3,
                        connected: false
                    },
                    {
                        user: 5, 
                        connected: false
                    }
                ],
                messages: 
                [
                    { 
                        user: 2,
                        username: "brendon",
                        avatar: "placeholder.jpg",
                        message: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
                        sent_at: formattedDate,
                    },
                ],
                active: true
            },
            {
                _id: 2,
                groupId: 1,
                name: "Newcastle Knights",
                users: 
                [
                    { user: 3, connected: false },
                ],
                messages:
                [
                    { 
                        user: 3,
                        username: "mel",
                        avatar: "mel.jpg",
                        message: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
                        sent_at: formattedDate,
                    },
                ],
                active: true
            },
            { 
                _id: 3,
                groupId: 2,
                name: "General Chat",
                users: 
                [
                    { 
                        user: 3, 
                        connected: false 
                    }
                ],
                messages: 
                [
                    { 
                        user: 3,
                        name: "mel",
                        avatar: "mel.jpg",
                        message: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
                        sent_at: formattedDate,
                    },
                ],
                active: true
            }
        ]).then(result => {
            console.log(result.insertedCount > 0 ? "Seeded Collection: channels" : "Failed to Seed Collection: channels");
        });
        return true;
    } catch (e) {
        console.log(e);
    }
}