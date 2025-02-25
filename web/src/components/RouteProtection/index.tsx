import { authTokenContext } from "@/context/authToken";
import { routes } from "@/routes";
import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";




const RouteProtection: React.FC<PropsWithChildren> = ({ children }) => {

    const { accessToken, refreshToken } = useContext(authTokenContext);

    if (!accessToken && !refreshToken) return (
        <Navigate to={routes.user.login} replace />
    )

    return (
        children
    );
}

export default RouteProtection;