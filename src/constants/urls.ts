export const urls = {
    // Auth
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    confirmEmail: '/auth/confirm-email',
    refresh: '/auth/refresh-token',
    googleAuth: '/auth/google',

    // User
    me: '/users/me',
    changeEmail: '/users/change-email'
} as const; 