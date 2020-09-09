export interface Channel {
    _id: number;
    groupId: number;
    name: string;
    users: Array<any>;
    connectedUsers: number[];
    messages: Array<Message>;
    active: boolean;
}

export interface Message {
    user: number;
    username: string;
    avatar: string;
    message: string;
    sent_at: string;
}

export interface ChannelUser {
    username: string,
    connected: boolean,
}