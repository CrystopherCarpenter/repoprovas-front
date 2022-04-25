import { createContext, useState } from 'react';

interface contextInterface {
    token: string;
}

const AuthContext = createContext<contextInterface | any>(null);

export function AuthProvider({ children }: any) {
    // @ts-ignore
    const persistedAuth: any = JSON.parse(localStorage.getItem('auth'));
    const [auth, setAuth] = useState(persistedAuth);

    function setAuthData(authData: any) {
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    }

    return (
        // @ts-ignore
        <AuthContext.Provider value={{ auth, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
