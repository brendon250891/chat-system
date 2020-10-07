const app = require('../server/server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { errorComparator } = require('tslint/lib/verify/lintError');
const should = chai.should();
const assert = chai.assert;
chai.use(chaiHttp);

let brendon = { _id: 2, username: 'brendon', email: 'brendon@chat-system.com', avatar: 'placeholder.jpg', role: '', active: true };
let registerUser = { username: 'register', email: 'register@chat-system.com', avatar: 'placeholder.jpg', role: '', active: true };
let testUser = { username: 'test', email: 'test@chat-system.com', avatar: 'placeholder.jpg', role: '', active: true, password: 123 };

let testGroup = { 
    name: "Test Group", 
    description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", 
    avatar: "nrl.png",
    users: [ ],
    assistants: [  ],
    active: true,
}

let testChannel = {
    groupId: 3,
    name: "Test Channel",
    users: []
}


describe('/api/authentication testing', () => {
    describe('/api/login tests', () => {
        it('should return a success message when the correct details are used', done => {
            chai.request(app).post('/api/login').send({ username: brendon.username, password: 123}).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('user');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.user._id, brendon._id);
                assert.strictEqual(response.body.user.username, brendon.username);
                assert.strictEqual(response.body.user.email, brendon.email);
                assert.strictEqual(response.body.user.avatar, brendon.avatar);
                assert.strictEqual(response.body.user.username, brendon.username);
                assert.isTrue(response.body.user.active);
                
                done();
            });
        }); 

        it('should fail if the details are for an deactivated account', done => {
            chai.request(app).post('/api/login').send({ username: 'inactive', password: 123 }).end((error, response) => {
                if (error) throw error;

                response.should.have.status(403);

                assert.strictEqual(response.error.text, "Account has been disabled.");
                
                done();
            });
        });

        it('should fail if the details provided are incorrect', done => {
            chai.request(app).post('/api/login').send({ username: brendon.username, password: 'hello' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, "Invalid user credentials given");
                
                done();
            });
        });
    });

    describe('/api/register tests', () => {
        it('should add a new user to the collection', done => {
            chai.request(app).post('/api/register').send({ username: 'register', email: 'register@chat-system.com', avatar: 'placeholder.jpg', role: '', active: true }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully created account 'register'`);

                done();
            });
        });
    });
});


describe('/api/users integration testing', () => {
    describe('/api/user-exists tests', () => {
        it("should return the message 'User 'sam' Does Not Exist', when sam is passed as the username", done => {
            chai.request(app).post('/api/user-exists').send({ username: 'sam' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, false);
                assert.strictEqual(response.body.message, "User 'sam' Does Not Exist");
                
                done();
            });
        });

        it("should return the message 'brendon' is Already in Use, when brendon is passed as the username", done => {
            chai.request(app).post('/api/user-exists').send({ username: 'brendon' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, true);
                assert.strictEqual(response.body.message, "'brendon' is Already in Use");

                done();
            });
        });

        it("should return the message 'inactive' is in Use (Deactivated), when inactive is passed as the username", done => {
            chai.request(app).post('/api/user-exists').send({ username: 'inactive' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, true);
                assert.strictEqual(response.body.message, "'inactive' is in Use (Deactivated)");

                done();
            });
        });
    });

    describe('/api/get-user tests', () => {
        it('should return the user "brendon" when the username "brendon" is passed', done => {
            chai.request(app).post('/api/get-user').send({ username: 'brendon' }).end((error, response) => {
                if (error) throw error;
                
                response.body.should.have.property('ok');
                response.body.should.have.property('user');
                response.body.user.should.have.property('_id');
                response.body.user.should.have.property('username');
                response.body.user.should.have.property('email');
                response.body.user.should.have.property('avatar');
                response.body.user.should.have.property('role');
                response.body.user.should.have.property('active');

                assert.strictEqual(response.body.user._id, 2);
                assert.strictEqual(response.body.user.username, 'brendon');
                assert.strictEqual(response.body.user.email, 'brendon@chat-system.com');
                assert.strictEqual(response.body.user.avatar, 'placeholder.jpg');
                assert.strictEqual(response.body.user.role, '');
                assert.strictEqual(response.body.user.active, true);

                done();
            });
        });

        it('should return the user "brendon" when the _id: 2 is passed', done => {
            chai.request(app).post('/api/get-user').send({ userId: 2 }).end((error, response) => {
                if (error) throw error;
                
                response.body.should.have.property('ok');
                response.body.should.have.property('user');
                response.body.user.should.have.property('_id');
                response.body.user.should.have.property('username');
                response.body.user.should.have.property('email');
                response.body.user.should.have.property('avatar');
                response.body.user.should.have.property('role');
                response.body.user.should.have.property('active');

                assert.strictEqual(response.body.user._id, 2);
                assert.strictEqual(response.body.user.username, 'brendon');
                assert.strictEqual(response.body.user.email, 'brendon@chat-system.com');
                assert.strictEqual(response.body.user.avatar, 'placeholder.jpg');
                assert.strictEqual(response.body.user.role, '');
                assert.strictEqual(response.body.user.active, true);

                done();
            });
        });

        it('should return the message "Failed to Find User sam" when the username sam is passed', done => {
            chai.request(app).post('/api/get-user').send({ username: 'sam' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, false);
                assert.strictEqual(response.body.message, "Failed to Find User 'sam'");

                done();
            });
        });

        it('should return the message "Failed to Find User" when the _id: 199 is passed', done => {
            chai.request(app).post('/api/get-user').send({ userId: 199 }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, false);
                assert.strictEqual(response.body.message, "Failed to Find User");

                done();
            });
        });
    });

    describe('/api/update-user tests', () => {
        after(() => {
            brendon._id = 2;
        });

        it('should update the user document for brendon to email: brendon.willoughby@gmail.com', done => {
            brendon.email = 'brendon.willoughby@gmail.com';
            chai.request(app).post('/api/update-user').send({ user: brendon }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, true);
                assert.strictEqual(response.body.message, 'Successfully Updated Your Account Details');

                done();
            });
        });

        it('should fail to update an unkown user', done => {
            brendon._id = 24
            chai.request(app).post('/api/update-user').send({ user: brendon }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, false);
                assert.strictEqual(response.body.message, 'An Error Occurred While Updating Your Account Details.');

                done();
            });
        });
    });

    describe('/api/update-password tests', () => {
        after(() => {
            brendon._id = 2;
        });

        it('should update user "brendon" with the password testPassword', done => {
            chai.request(app).post('/api/update-password').send({ userId: brendon._id, newPassword: 'testPassword'}).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, true);
                assert.strictEqual(response.body.message, 'Successfully Changed Your Password');

                done();
            });
        });

        it('should fail to update password if invalid id is given', done => {
            brendon._id = 40;
            chai.request(app).post('/api/update-password').send({ userId: brendon._id, newPassword: 'testPassword'}).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.strictEqual(response.body.ok, false);
                assert.strictEqual(response.body.message, 'An Error Occurred While Updating Changing Your Password');

                done();
            });
        });
    });

    describe('/api/get-all-users tests', () => {
        it('should return an empty array when trying to get online users of group 1 as there are no online users.', done => {
            chai.request(app).post('/api/get-all-users').send({ groupId: 1 }).end((error, response) => {
                if (error) throw error;

                assert.isEmpty(response.body);

                done();
            });
        });
    });

    describe('/api/add-user tests', () => {        
        it('should add the test user to the users collection', done => {
            chai.request(app).post('/api/add-user').send({ user: testUser }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Created Account '${testUser.username}'`);

                done();
            });
        });

        it('should fail to add a user if a password is not given', done => {
            testUser.password = null;
            chai.request(app).post('/api/add-user').send({ user: testUser }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Create Account '${testUser.username}'`);

                done();
            });
        });
    });

    describe('/api/deactivate-user tests', () => {
        it('should deactivate the account with username "brendon"', done => {
            chai.request(app).post('/api/deactivate-user').send({ username: brendon.username }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Deactivated Account '${brendon.username}'`);

                done();
            });
        });

        it('should fail to when given the invalid username "sam"', done => {
            chai.request(app).post('/api/deactivate-user').send({ username: 'sam' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Deactivate Account 'sam'`);

                done();
            })
        });
    });

    describe('/api/activate-user tests', () => {
        it('should activate an account given a username of a deactivated account', done => {
            chai.request(app).post('/api/activate-user').send({ username: brendon.username }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Activated Account '${brendon.username}'`);

                done();
            });
        });

        it('should fail to activate an account given a username of an invalid account', done => {
            chai.request(app).post('/api/activate-user').send({ username: 'sam' }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Activate Account 'sam'`);

                done();
            });
        });
    });
}); 

describe('/api/groups testing', () => {
    describe('/api/add-group tests', () => {
        it('should add a new group when given correct group details', done => {
            chai.request(app).post('/api/add-group').send({ groupForm: testGroup, channels: ['General Chat'] }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Added Group '${testGroup.name}'`);

                done();
            });
        });

        it('should faile to add a group if no group information is provided', done => {
            chai.request(app).post('/api/add-group').send({ groupForm: null, channels: [] }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Add Group`);

                done();
            });
        });
    });

    describe('/api/get-group', () => {
        it('should get a group given a valid id', done => {
            chai.request(app).post('/api/get-group').send({ groupId: 1 }).end((error, response) => {
                if (error) throw error;
                
                response.body.should.have.property('_id');
                response.body.should.have.property('name');
                response.body.should.have.property('description');
                response.body.should.have.property('avatar');
                response.body.should.have.property('users');
                response.body.should.have.property('assistants');
                response.body.should.have.property('active');

                done();
            });
        });

        it('should not get any group when given an invalid groupId', done => {
            chai.request(app).post('/api/get-group').send({ groupId: 111 }).end((error, response) => {
                if (error) throw error;

                should.not.exist(response.body._id);
                should.not.exist(response.body.name);
                should.not.exist(response.body.description);
                should.not.exist(response.body.avatar);
                should.not.exist(response.body.users);
                should.not.exist(response.body.assistants);
                should.not.exist(response.body.active);

                done();
            });
        });
    });

    describe('/api/remove-group', () => {
        it('should remove a group given a valid group', done => {
            testGroup._id = 3;
            chai.request(app).post('/api/remove-group').send({ group: testGroup }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Removed Group '${testGroup.name}`);

                done();
            });
        });

        it('should fail if an invalid group is provided', done => {
            chai.request(app).post('/api/remove-group').send({ }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Remove Group`);

                done();
            });
        });
    });

    describe('/api/get-groups tests', () => {
        it('should return all the groups from the collection', done => {
            chai.request(app).get('/api/get-groups').end((error, response) => {
                if (error) throw error;

                assert.strictEqual(response.body.length, 3);

                done();
            });
        });
    });

    describe('/api/get-user-groups tests', () => {
        it('should return all the groups that a user belongs to', done => {
            chai.request(app).post('/api/get-user-groups').send({ username: brendon.username }).end((error, response) => {
                if (error) throw error;

                assert.strictEqual(response.body.length, 1);

                done();
            });
        });

        it('should return nothing when a user has no groups', done => {
            chai.request(app).post('/api/get-user-groups').send({ username: registerUser.username }).end((error, response) => {
                if (error) throw error;

                assert.strictEqual(response.body.length, 0);

                done();
            });
        });
    });

    describe('/api/user-in-group tests', () => {
        it('should return true if the user has access to a group', done => {
            chai.request(app).post('/api/user-in-group').send({ username: brendon.username, groupId: 1 }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `User '${brendon.username}' is Already a Member of NRL`);

                done();
            });
        });

        it('should return false if the user is not able to access the group', done => {
            chai.request(app).post('/api/user-in-group').send({ username: testUser.username, groupId: 3 }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `User '${testUser.username}' is not a Member of ${testGroup.name}`);

                done();
            });
        });
    });

    describe('/api/invite-user-to-group tests', () => {
        it('should return true if the user was added to the group', done => {
            chai.request(app).post('/api/invite-user-to-group').send({ username: testUser.username, groupId: 1 }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `'${testUser.username}' Has Been Invited To 'NRL'`);

                done();
            });
        });
    });

    describe('/api/get-all-group-users tests', () => {
        it('shoudl return all the users associated with a group', done => {
            chai.request(app).post('/api/get-all-group-users').send({ groupId: 1 }).end((error, response) => {
                if (error) throw error;

                assert.strictEqual(response.body.length, 3);

                done();
            });
        });
        
        it('should return nothing if there are no users in a group', done => {
            chai.request(app).post('/api/get-all-group-users').send({ groupId: 3 }).end((error, response) => {
                if (error) throw error;

                assert.strictEqual(response.body.length, 0);

                done();
            });
        });
    });

    describe('/api/remove-user-from-group tests', () => {
        it('should return true if the user was removed from the group', done => {
            chai.request(app).post('/api/remove-user-from-group').send({ groupId: 1, user: brendon }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `'${brendon.username}' Has Been Removed From NRL`);

                done();
            });
        });
    });

    describe('/api/promote-user-to-group-assistant tests', () => {
        it('should promote a user of a group to assistant', done => {
            chai.request(app).post('/api/promote-user-to-group-assistant').send({ group: { _id: 1 }, user: {_id: 5, username: 'wayne'} }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `'wayne' is Now An Assistant for NRL`);

                done();
            }); 
        });
    });

    describe('/api/demote-user-from-group-assistant tests', () => {
        it('should demote a user of a group from assistant', done => {
            chai.request(app).post('/api/demote-user-from-group-assistant').send({ group: { _id: 1 }, user: {_id: 5, username: 'wayne'} }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `User 'wayne' is no Longer an Assistant for NRL`);

                done();
            }); 
        });
    });

    describe('/api/reactivate-group tests', () => {
        it('should return true when a group is reactivated', done => {
            chai.request(app).post('/api/reactivate-group').send({ group: testGroup }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Reactivated Group '${testGroup.name}'`);

                done();
            });
        });
    });
    
    describe('/api/group-exists tests', () => {
        it('should return true if the group exists', done => {
            chai.request(app).post('/api/group-exists').send({ group: testGroup.name }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Group '${testGroup.name}' Already Exists`);
    
                done();
            });
        });

        it('should return false if the group does not exists', done => {
            chai.request(app).post('/api/group-exists').send({ group: "Cheese" }).end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Group 'Cheese' Does Not Exist`);
    
                done();
            });
        });
    });
});

describe('/api/channels testing', () => {
    describe('/api/get-all-channels tests', () => {
        it('should return an array of all channels', done => {
            chai.request(app).get('/api/get-all-channels').end((error, response) => {
                if (error) throw error;

                response.body.should.have.property('ok');
                response.body.should.have.property('channels');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.channels.length, 4);
                
                done();
            });
        });
    });

    describe('/api/get-channels tests', () => {
        it('should return an array of channels for a single group', done => {
            chai.request(app).post('/api/get-channels').send({ groupId: testGroup._id }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 1);
                
                done();
            });
        });

        it('should return an empty array if no channels are found', done => {
            chai.request(app).post('/api/get-channels').send({ groupId: 111 }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 0);
                
                done();
            });
        });
    });

    describe('/api/remove-channel tests', () => {
        it('should remove a channel if a valid channel id is given', done => {
            chai.request(app).post('/api/remove-channel').send({ channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Removed Channel 'Newcastle Knights'`);
                
                done();
            });
        });

        it('should fail an invalid channel id is given', done => {
            chai.request(app).post('/api/remove-channel').send({ channelId: 21 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Remove Channel`);
                
                done();
            });
        });
    });

    describe('/api/get-removed-channels tests', () => {
        it('should return an array of all the removed channels for a group', done => {
            chai.request(app).post('/api/get-removed-channels').send({ groupId: 1 }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 1);
                assert.strictEqual(response.body[0].name, "Newcastle Knights");
                
                done();
            });
        });

        it('should return an empty array if the group has no removed groups', done => {
            chai.request(app).post('/api/get-removed-channels').send({ groupId: testGroup._id }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 0);
                
                done();
            });
        });
    });

    describe('/api/can-access-channels tests', () => {
        it('should return true if the user can access the channel', done => {
            chai.request(app).post('/api/can-access-channel').send({ channelId: 2, userId: 5 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, '');
                
                done();
            });
        });

        it('should return false if the user can not access the channel', done => {
            chai.request(app).post('/api/can-access-channel').send({ channelId: 2, userId: testUser._id }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `You don't have access to channel 'Newcastle Knights'`);
                
                done();
            });
        });
    });

    describe('/api/join-channel', () => {
        it('should add the given user to the connected channel array', done => {
            chai.request(app).post('/api/join-channel').send({ channelId: 1, userId: testUser._id }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Joined Channel 'General Chat'`);
                
                done();
            });
        });

        it('should fail to add the user given an invalid channel', done => {
            chai.request(app).post('/api/join-channel').send({ channelId: 111, userId: testUser._id }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to Join Channel`);
                
                done();
            });
        });
    });

    describe('/api/leave-channel tests', () => {
        it('should return true when a user leaves a channel', done => {
            chai.request(app).post('/api/leave-channel').send({}).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Left Channel`);
                
                done();
            });
        });
    });

    describe('/api/get-messages', () => {
        it('should return an array of all the message that have been sent in the channel', done => {
            chai.request(app).post('/api/get-messages').send({ channelId: 1 }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 1);
                
                done();
            });
        });

        it('should return an empty array if the channel has no messages', done => {
            chai.request(app).post('/api/get-messages').send({ channelId: 4 }).end((error, response) => {
                if (error) throw error;
    
                assert.strictEqual(response.body.length, 0);
                
                done();
            });
        });
    });
    
    describe('/api/save-message', () => {
        it('should return true if the message was saved', done => {
            chai.request(app).post('/api/save-message').send({ channelId: 1, message: {} }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Saved Message`);
                
                
                done();
            });
        });
    });

    describe('/api/add-channel tests', () => {
        it('should return true when a new channel is added', done => {
            chai.request(app).post('/api/add-channel').send({ groupId: testChannel.groupId, channel: testChannel.name, users: testChannel.users }).end((error, response) => {
                if (error) throw error;
                
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Created Channel '${testChannel.name}'.`);
                
                done();
            });
        });

        it('should return false if invalid channel data is provided', done => {
            chai.request(app).post('/api/add-channel').send({}).end((error, response) => {
                if (error) throw error;
                
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, 'Failed to Create Channel');
                
                done();
            });
        });
    });

    describe('/api/reactivate-channel tests', () => {
        it('it should return true if the channel was reactivated', done => {
            chai.request(app).post('/api/reactivate-channel').send({ channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Successfully Reactivated Channel 'Newcastle Knights'`);
                
                done();
            });
        });

        it('it should return false if the channel is already active', done => {
            chai.request(app).post('/api/reactivate-channel').send({ channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, "Channel 'Newcastle Knights' is Already Active");
                
                done();
            });
        });
    });

    describe('/api/invite-user-to-channel tests', () => {
        testUser._id = 9;
        it('should return true when a user that has not previously been invited is invited', done => {
            chai.request(app).post('/api/invite-user-to-channel').send({ user: testUser, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message,`Invited '${testUser.username}' to 'Newcastle Knights'`);
                
                done();
            });
        });

        it('should return false when a user that already has access is invited', done => {
            chai.request(app).post('/api/invite-user-to-channel').send({ user: testUser, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message,`${testUser.username} Already Has Access to Channel`);
                
                done();
            });
        });
    });

    describe('/api/user-in-channel tests', () => {
        it('should return true if the user has already been invited to a channel', done => {
            chai.request(app).post('/api/user-in-channel').send({ username: testUser.username, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message,`'${testUser.username}' is Already a Member of Newcastle Knights`);
                
                done();
            });
        });

        it('should false if the user has not been added to the channel', done => {
            chai.request(app).post('/api/user-in-channel').send({ username: brendon.username, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message,`'${brendon.username}' is not a Member of Newcastle Knights`);
                
                done();
            });
        });
    });

    describe('/api/remove-user-from-channel', () => {
        it('should return true when a user is removed from a group', done => {
            chai.request(app).post('/api/remove-user-from-channel').send({ user: testUser, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isTrue(response.body.ok);
                assert.strictEqual(response.body.message, `Removed '${testUser.username}' from Newcastle Knights`);
                
                done();
            });
        });

        it('should return false if a user not in the channel tries to be removed', done => {
            chai.request(app).post('/api/remove-user-from-channel').send({ user: testUser, channelId: 2 }).end((error, response) => {
                if (error) throw error;
    
                response.body.should.have.property('ok');
                response.body.should.have.property('message');

                assert.isFalse(response.body.ok);
                assert.strictEqual(response.body.message, `Failed to remove ${testUser.username}`);
                
                done();
            });
        });
    });
});

// describe('', () => {
//     it('', done => {
//         chai.request(app).post('').send({}).end((error, response) => {
//             if (error) throw error;


            
//             done();
//         });
//     });
// });