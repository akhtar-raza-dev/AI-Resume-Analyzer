
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedLogin = localStorage.getItem("isLogin");
        const storedUser = localStorage.getItem("userInfo");

        if (storedLogin === "true") {
            setLogin(true);
        }

        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, setLogin, userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;