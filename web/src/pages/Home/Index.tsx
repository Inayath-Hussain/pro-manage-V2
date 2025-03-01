import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import NavBar from "@/components/HomePage/NavBar";
import { routes } from "@/routes";
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors";
import { getTaskService } from "@/services/api/task/getTask";
import { AppDispatch } from "@/store";
import { getUserInfo, userInfoSelector } from "@/store/slices/userInfoSlice";
import { renewTaskAction } from "@/store/slices/taskSlice"


import styles from "./Index.module.css";


const HomePage = () => {

    const navigate = useNavigate();
    // retrieve user info
    const userInfo = useSelector(userInfoSelector)
    const dispatch = useDispatch<AppDispatch>();

    // for userInfo
    useEffect(() => {
        const call = async () => {
            if (userInfo.status === "idle" || userInfo.status === "error") {
                // get user info
                dispatch(getUserInfo()).unwrap().catch((reason) => {
                    switch (true) {
                        case (reason instanceof UnauthorizedError):
                            return navigate(routes.user.login);

                        case (reason instanceof NetworkError):
                            return

                        case (reason instanceof UserOfflineError):
                            return
                    }
                })
            }
        }

        call()
    }, [])


    // get all user's tasks
    useEffect(() => {
        const call = async () => {
            const result = await getTaskService("week");
            console.log(result)

            switch (true) {
                case (result instanceof UserOfflineError):
                    break;

                case (result instanceof UnauthorizedError):
                    return navigate(routes.user.login);

                case (result instanceof NetworkError):
                    break;

                default:
                    // and then change selectedFilter
                    dispatch(renewTaskAction(result))
            }

        }

        call()
    }, [])

    return (
        <main className={styles.home_layout}>
            <NavBar />
            <Outlet />
        </main>
    );
}

export default HomePage;