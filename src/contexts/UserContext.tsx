import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import User from "../models/user/User";
import Auth from "../services/api/Auth";

export type RefreshUser = () => Promise<User | null> ;
interface UserContextProps {
    user: User | null;
    updateUser: (newUser: User | null) => void;
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

    const updateUser = (newUser: User | null) => {
        if (!newUser) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        }
        else {
            setUser(newUser);
        }
    };

    const refreshUser = async (): Promise<User | null> => {
        setLoading(true);
        const user = await Auth.me();
        setLoading(false);
        setUser(user ?? null);
        return user ?? null;
    }

    useEffect(() => {
        if (!user) {
            refreshUser();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, updateUser, refreshUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};