export class User {
    _id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    role: string = "";
    groups: Array<string> = [];

    constructor(username: string, email: string, password: string, avatar: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = avatar == "" ?  "placeholder.jpg" : avatar;
    }
}