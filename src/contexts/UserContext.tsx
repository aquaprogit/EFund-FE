import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import User from "../features/users/models/User";
import { useAuth } from "../features/auth/store/auth.store";
import { userRepository } from "../features/users/api/userRepository";

export type RefreshUser = () => Promise<User | null>;

interface UserContextProps {
    user: User | null;
    updateUser: (user: User | null) => void;
    refreshUser: RefreshUser;
    loading: boolean;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { accessToken, refreshToken, signOut } = useAuth();

    const updateUser = (newUser: User | null) => {
        if (!newUser) {
            signOut();
            setUser(null);
        }
        else {
            setUser(newUser);
        }
    };

    const refreshUser = async (): Promise<User | null> => {
        setLoading(true);
        const response = await userRepository.me();
        setLoading(false);

        if (response.isSuccess && response.data) {
            setUser(response.data);
            return response.data;
        }

        signOut();
        setUser(null);
        return null;
    }

    useEffect(() => {
        if (!user && accessToken && refreshToken) {
            refreshUser();
        }
    }, [user, accessToken, refreshToken]);

    return (
        <UserContext.Provider value={{ user, updateUser, refreshUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};