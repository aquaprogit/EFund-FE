export const urls = {
    // Auth
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    confirmEmail: '/auth/confirm-email',
    refresh: '/auth/refresh-token',
    googleAuth: '/auth/google',

    // User
    me: '/users/me',
    changeEmail: '/users/change-email',
    userAvatar: '/users/avatar',
    userInfo: '/users/me',
    addPassword: '/users/add-password',
    changePassword: '/users/change-password',
    searchUsers: '/users/search',
    makeAdmin: '/users/make-admin',
    userAction: '/users/action',
    inviteAdmin: '/users/invite-admin'
} as const; 