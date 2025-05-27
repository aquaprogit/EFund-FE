interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    avatarUrl: string;
    hasPassword: boolean;
    hasMonobankToken: boolean;
    isBlocked: boolean;
}

export default User;