interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl: string;
    hasPassword: boolean;
    hasMonobankToken: boolean;
}

export default User;