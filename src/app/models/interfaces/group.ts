import { Channel } from '../interfaces/channel';

export interface Group {
    _id: number;
    avatar: string;
    name: string;
    description: string;
    users: Array<number>;
    assistants: number[];
    channels: Array<Channel>
}
  