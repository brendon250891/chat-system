export class Channel {
    private name: string = "";
    private users: Array<ChannelUser>;
    private messages: Array<Message>;

    constructor(name: string, users: Array<ChannelUser>, messages: Array<Message>) {
        this.name = name;
        this.users = users;
        this.messages = messages;
    }

    public getName(): string {
        return this.name;
    }

    public getUsers(): Array<ChannelUser> {
        return this.users;
    }

    public getMessages(): Array<Message> {
        return this.messages;
    }
}

export interface Message {
    user: string;
    message: string;
    timestamp: Date;
}

export interface ChannelUser {
    username: string,
    connected: boolean,
}