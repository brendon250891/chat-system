export interface Channel {
    name: string,
    users: Array<ChannelUser>,
    messages: Array<Message>
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