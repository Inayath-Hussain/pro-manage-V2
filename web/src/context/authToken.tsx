import { PropsWithChildren, createContext } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";

import { clearUserInfoAction } from "@/store/slices/userInfoSlice";
import { AppDispatch } from "@/store";
// import { updateUserProfile } from "@src/store/slices/userProfile";
// import { defaultUserStoriesQueryString, resetUserStoriesApiSlice } from "@src/store/apiSlice/userStoriesApi";
// import { resetUserLikedStoriesApi } from "@src/store/apiSlice/userLikedStoriesApi";




export const authTokenContext = createContext({
    accessToken: "", refreshToken: "", isLoggedIn: false,
    logout: () => { }
});



export const AuthTokenProvider: React.FC<PropsWithChildren> = ({ children }) => {

    // stateVariable is an array containing state variable, setter for state variable and function to remove the cookie
    const stateVariables = useCookies(["accessToken", "refreshToken"]);

    const { accessToken, refreshToken } = stateVariables[0];
    const removeCookie = stateVariables[2]

    const dispatch = useDispatch<AppDispatch>();

    const logout = () => {
        removeCookie("accessToken")
        removeCookie("refreshToken")

        // clear user info
        dispatch(clearUserInfoAction());
    }

    const isLoggedIn = Boolean(accessToken || refreshToken)

    return (
        <authTokenContext.Provider value={{ accessToken: accessToken || "", refreshToken: refreshToken || "", isLoggedIn, logout }}>
            {children}
        </authTokenContext.Provider>
    );
}