# Chat System Documentation
Here you can view all the documentation that was done before / during development of the Chat System.
<br><br>

## Testing

To run test suites do the following:
- integration testing use the CLI command `npm run-script integrationTest`
- e2e testing `ng e2e`.

# Git Repository

## Structure
The structure of this git repository is:
- All frontend(client side) code is located in the `src` folder
- All backend(server side) code is located in the `server` folder

## Version Control Approach
The version control approach that i took in development was that each feature that i worked on
was on a separate branch from the master.
<br><br>
When i was done working on each branch i pushed to that branch and then made any notes / provided images for what work was done.
`myname/developing-feature` was the naming convention used for each of my branches. e.g. `brendon/feature-implementation`.
<br><br>
All branches are still there to be viewed if you wish.

# Data Structures
- `User` - Represent a user of the application.
  - `_id: number` - unique id of the user.
  - `username: string` - unique username chosen by the user.
  - `email: string` - the users email address.
  - `avatar: string` - avatar to use for the user.
  - `role: string` - the role of the user across the application - none is a standard user.
- `Channel` - Represents a channel.
  - `_id: number` - id of the channel.
  - `groupId: number` - id of the group in which the channel belongs.
  - `name: string` - name of the channel.
  - `users: number[]` - id's of users that can access the channel.
  - `connectedUsers: number[]` - id's of currently connected users.
  - `messages: Message[]` - all messages that have been sent to the channel.
  - `active: boolean` - flag indicating if the channel is active or not.

- `Message` - Represents a message sent to a channel.
  - `user: number` - id of the user that sent the message.
  - `username: string` - name of the user that sent the message.
  - `avatar: string` - avatar of the user that sent the message.
  - `message: string` - the message body.
  - `sent_at: string` - user friendly representation of the time and date that the message was sent.

- `Group` - Represents a group
  - `_id: number` - id of the group.
  - `avatar: string` - avatar of the group.
  - `name: string` - name of the group.
  - `description: string` - description of the group.
  - `users: number[]` - ids of users that have access to the group.
  - `assistants: number[]` - ids of users that have group assistant role within the group.
  - `channels: Channel[]` - the channels that exist within the group.
  - `active: boolean` - flag indicating whether the group is active or not.


# Rest API

## `api-channels`

- `/api/get-all-channels` - retrieves all the active channels.
  - params: none.
  - returns: `Channel[]`.

- `/api/get-channels` - retrieves the channels of a single group.
  - params: `groupId: number`.
  - returns: `Channel[]`.

- `/api/get-removed-channels` - gets inactive channels of a group.
  - params: `groupId: number`.
  - returns: `Channel[]`.

- `/api/can-access-channel` - checks if a user has access to a channel.
  - params: `channelId: number`, `userId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/join-channel` - used to join a user to a channel.
  - params: `userId: number`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/leave-channel` - used to disconnect a user from a channel.
  - params: `userId: number`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-messages` - gets all the messages for a channel.
  - params: `channelId: number`.
  - returns: `Messages[]`.

- `/api/save-message` - saves a  message for a channel.
  - params: `message: Message`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/add-channel` - adds a new channel.
  - params: `groupId: number`, ` name: string`, `users? number[]`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/remove-channel` - removes(set inactive) a channel.
  - params: `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/reactivate-channel` - reactivates a channel for use.
  - params: `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/invite-user-to-channel` - invites a user to a channel.
  - params: `user: User`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/user-in-channel` - checks if a user has access to a channel.
  - params: `username: string`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/remove-user-from-channel` - removes a user from a channel.
  - params: `userId: number`, `channelId: number`.
  - returns: `{ ok: boolean, message: string }`.

## `api-groups`

- `/api/add-group` - adds a new group, with optional channels included.
  - params: `group: Group`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-group` - gets a group.
  - params: `groupId: number`.
  - returns: `group: Group`.

- `/api/remove-group` - removes a group.
  - params: `groupId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-groups` - gets all groups.
  - params: none.
  - returns: `groups: Group[]`.

- `/api/get-user-groups` - gets the groups of a single user.
  - params: `username: string`.
  - returns: `groups: Group[]`.

- `/api/user-in-group` - checks if a user is already a member of a group.
  - params: `username: string`, `groupId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/invite-user-to-group` - adds a user to a group.
  - params: `username: string`, `groupId: number`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-all-group-users` - gets all the users for a group.
  - params: `groupId: number`.
  - returns: `users: User[]`.

- `/api/remove-user-from-group` - removes a user from a group.
  - params: `groupId: number`, `user: User`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/promote-user-to-group-assistant` - promotes a user to group assistant.
  - params: `group: Group`, `user: User`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/demote-user-from-group-assistant` - demotes a user from group assistant.
  - params: `group: Group`, `user: User`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/reactivate-group` - reactivates a group for use.
  - params: `group: Group`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/group-exists` - checks if a group exists.
  - params: `group: string`.
  - returns: `{ ok: boolean, message: string }`.

## `api-users`

- `/api/user-exists` - checks if a user exists.
  - params: `username: string`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-user` - retrieves a user.
  - params: `userId?: number`, `username?: string`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/update-user` - updates a users information.
  - params: `user: User`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/update-password` - updates a users password.
  - params: `userId: number`, `password: string`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/get-online-users` - gets all online users of a group
  - params: `groupId: number`.
  - returns: `allOnlineUsers: Users[][]`

- `/api/add-user` - adds a new user.
  - params: `user: User`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/deactivate-user` - deactivates a user account.
  - params: `username: string`.
  - returns: `{ ok: boolean, message: string }`.
  
- `/api/activate-user` - activates a users account.
  - params: `username: string`.
  - returns: `{ ok: boolean, message: string }`.


## `authentication`

- `/api/login` - checks if provided user credentials are correct.
  - params: `username: string`, `password: string`.
  - returns: `{ ok: boolean, message: string }`.

- `/api/register` - register a new user account.
  - params: `user: User`
  - returns: `{ ok: boolean, message: string }`.


# Angular Architecture

## Overview
This shows the general component structure of the application
```
app
  chat
    chat-dashboard
    main-panel
      account-settings
      add-group
      chat-window
      group-search
      user-management
        add-user
        update-user
    side-panel
      group
      options
      user-groups
    users
      admin
        controls
    home
    login
    logout
    message
    register
```

## Components
- `app-component.component` - contains what remains consistent accross the application such as navigation and footer.
- `app-home.component` - Display an overview of what the site is and what users can do, with examples of group chat and search.
- `login.component` - Users go here to login to the site and be directed to the dashboard.
- `logout.component` - When a user logs out they are notified and redirected back to the home page.
- `message.component` - Used across the application to provide feedback on errors and successes when various operations are executed e.g. Joined a channel, Added a user.
- `register.component` - If a user doesn't have an account they can create one here.

## chat-dashboard components
- `chat-dashboard.component` - Used to display the main panel and side panel components
### main-panel
- `account-settings.component` - Where users can change their account information, such as email, avatar and password.
- `add-group.component` - Admins use this to add additional groups.
- `chat-window.component` - Displays the chat and allows users to send messages to a channel. 
- `group-search.component` - User can search for groups to request an invite too.
- `user-management.component` - Allows Super and Group admins to add users and Super admins to remove / reactivate user accounts.
### side-panel
- `group.component` - Displays all the group information, such as channels and connected users.
- `options.component` - This was a test to see if i could make dropdown menu for group and channel functionality.
- `user-groups.component` - Displays all the groups that a user is a member of.
### users/admin
- `controls.component` - Displays all the group and channel controls for Super/Group admins and Group assistants.


## Services

### `Authentication Service`
Provides authentication functions and adding / remvoing a user.

### `Database Service`
This service is used to interact with the mongodb database in the backend.

### `Group Service`
Provides services that are required to by groups.

### `Message Service`
Used to provide messaging right across the application

### `Room Service`
Keeps track of what windows the user is displaying and when certain windows should be displayed.

## Models

### Classes
- `FormError` - Used with forms to keep track of any errors that present themselves when a user fills out a form.
- `Validator` - Used to validate forms and currently handles `required`, `email` and `password` fields

### Interfaces
- `User` - Represent a user of the application.
  - `_id: number` - unique id of the user.
  - `username: string` - unique username chosen by the user.
  - `email: string` - the users email address.
  - `avatar: string` - avatar to use for the user.
  - `role: string` - the role of the user across the application - none is a standard user.
- `Channel` - Represents a channel.
  - `_id: number` - id of the channel.
  - `groupId: number` - id of the group in which the channel belongs.
  - `name: string` - name of the channel.
  - `users: number[]` - id's of users that can access the channel.
  - `connectedUsers: number[]` - id's of currently connected users.
  - `messages: Message[]` - all messages that have been sent to the channel.
  - `active: boolean` - flag indicating if the channel is active or not.

- `Message` - Represents a message sent to a channel.
  - `user: number` - id of the user that sent the message.
  - `username: string` - name of the user that sent the message.
  - `avatar: string` - avatar of the user that sent the message.
  - `message: string` - the message body.
  - `sent_at: string` - user friendly representation of the time and date that the message was sent.

- `Group` - Represents a group
  - `_id: number` - id of the group.
  - `avatar: string` - avatar of the group.
  - `name: string` - name of the group.
  - `description: string` - description of the group.
  - `users: number[]` - ids of users that have access to the group.
  - `assistants: number[]` - ids of users that have group assistant role within the group.
  - `channels: Channel[]` - the channels that exist within the group.
  - `active: boolean` - flag indicating whether the group is active or not.

- `ValidationRule` - Represent a validation rule use in form validation.
  - `property: string` - name of the form field.
  - `rules: string[]` - what rule the property must adhere too.

