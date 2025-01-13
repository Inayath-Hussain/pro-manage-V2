import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import NavBar from "@/components/HomePage/NavBar";
import { useAbortController } from "@/hooks/useAbortContoller";
import { routes } from "@/routes";
import { NetworkError, UnauthorizedError } from "@/services/api/errors";
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

    const { signalRef } = useAbortController();

    // for userInfo
    useEffect(() => {
        const call = async () => {
            if (userInfo.status === "idle" || userInfo.status === "error") {
                // get user info
                dispatch(getUserInfo(signalRef.current.signal)).unwrap().catch((reason) => {
                    switch (true) {
                        case (reason instanceof UnauthorizedError):
                            toast(reason.message, { type: "error", autoClose: 5000 })
                            return navigate(routes.user.login);

                        case (reason instanceof NetworkError):
                            toast(reason.message, { type: "error", autoClose: 5000 })
                            return

                        default:
                            toast("Something went wrong. Please try again later", { type: "error", autoClose: 5000 })

                    }
                })
            }
        }

        call()
    }, [])


    // get all user's tasks
    useEffect(() => {
        const call = async () => {
            try {
                const result = await getTaskService("week", signalRef.current.signal)

                dispatch(renewTaskAction(result))
            }
            catch (ex) {
                console.log(ex)

                switch (true) {
                    case (ex instanceof UnauthorizedError):
                        toast(ex.message, { type: "error", autoClose: 5000 })
                        return navigate(routes.user.login);

                    case (ex instanceof NetworkError):
                        return toast(ex.message, { type: "error", autoClose: 5000 })
                }
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