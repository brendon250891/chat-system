export class Group {
    private id: number;
    private name: string;
    private description: string;
    private avatar: string;
    private users: Array<number>;
    private assistants: Array<number>;
    private channel: Array<Channel>
    private active: boolean;

    public getName(): string {
        return this.name;
    }
}

export class Channel {
    id: number;
    name: string;
    users: Array<ChannelUser>;
    messages: Array<Message>;
}

export class ChannelUser {
    id: number;
    connected: boolean;
}

export class Message {
    user: number;
    message: string;
    sent_at: Date;
}