import { Channel } from '../classes/channel';

export interface Group {
    avatar: string;
    name: string;
    description: string;
    administrators: Array<string>;
    channels: Array<Channel>
}
  