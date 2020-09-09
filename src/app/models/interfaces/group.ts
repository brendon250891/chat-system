import { Channel } from '../interfaces/channel';

export interface Group {
    _id: number;
    avatar: string;
    name: string;
    description: string;
    users: number[];
    assistants: number[];
    channels: Channel[];
    active: boolean;
}
  