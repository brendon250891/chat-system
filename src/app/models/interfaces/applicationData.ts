import { User } from '../classes/user';
import { Group } from './group';
import { Role } from './role';

export interface ApplicationData {
    users: Array<User>;
    groups: Array<Group>
    roles: Array<Role>
}