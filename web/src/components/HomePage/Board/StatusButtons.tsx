import { statusEnum } from "@/store/slices/taskSlice"
import { InvalidTaskId } from "@/services/api/task/getTaskPublic"

import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Id, toast } from "react-toastify"

import { routes } from "@/routes"
import { updateTaskStatusService } from "@/services/api/task/updateTaskStatus"
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors"
import { updateTaskStatusAction } from "@/store/slices/taskSlice"
import { errorToast } from "@/utilities/toast/errorToast"

import styles from "./StatusButtons.module.css"

interface Iprops {
    taskId: string
    status: typeof statusEnum[number]
}

const StatusButtons: React.FC<Iprops> = ({ status, taskId }) => {

    const toastIdRef = useRef<Id>("");

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // used to track if a request is in progress
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (localStatus: Iprops['status']) => {

        if (loading === true) return toast("Updating task please wait...", { type: 'warning', autoClose: 5000 }) //toast here

        // make service call to update status
        // try {

        setLoading(true)
        toastIdRef.current = toast.loading("Updating Task")
        const result = await updateTaskStatusService({ status: localStatus, taskId })

        switch (true) {
            case (result instanceof UserOfflineError):
                setLoading(false)
                errorToast(toastIdRef.current, result.message);
                break;

            case (result instanceof NetworkError):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                break;

            case (result instanceof InvalidTaskId):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                break;

            case (result instanceof UnauthorizedError):
                setLoading(false)
                navigate(routes.user.login)
                errorToast(toastIdRef.current, "Please login again")
                return;

            default:
                setLoading(false)
                toast.update(toastIdRef.current, { render: "Task Updated", autoClose: 5000, type: "success", isLoading: false })
                dispatch(updateTaskStatusAction({ currentStatus: status, data: { id: taskId, status: localStatus } }))

        }

        // if (result) {
        //     setLoading(false)
        //     toast.update(toastIdRef.current, { render: "Task Updated", autoClose: 5000, type: "success", isLoading: false })
        //     dispatch(updateTaskStatusAction({ currentStatus: status, data: { _id: taskId, status: localStatus } }))
        //     // on success dispatch action to update task
        // }
        // }
        // catch (ex) {
        // setLoading(false)
        //     switch (true) {
        //         case (ex instanceof NetworkError):
        //             errorToast(toastIdRef.current, ex.message)
        //             break;

        //         case (ex instanceof InvalidTaskId):
        //             errorToast(toastIdRef.current, ex.message)
        //             break;

        //         case (ex instanceof UnauthorizedError):
        //             navigate(routes.user.login)
        //             errorToast(toastIdRef.current, "Please login again")
        //             return

        //         default:
        //             errorToast(toastIdRef.current, "Something went wrong try again later")
        //             console.log(ex)
        //     }
        // }
    }




    interface IStatusTexts {
        displayText: string
        status: Iprops["status"]
    }

    const buttonsData: IStatusTexts[] = [
        { displayText: "BACKLOG", status: "backlog" },
        { displayText: "TO DO", status: "to-do" },
        { displayText: "PROGRESS", status: "in-progress" },
        { displayText: 'DONE', status: "done" }
    ]


    switch (status) {
        case ("backlog"):
            buttonsData.splice(0, 1)
            break;

        case ("to-do"):
            buttonsData.splice(1, 1)
            break;

        case ("in-progress"):
            buttonsData.splice(2, 1)
            break;

        case ("done"):
            buttonsData.splice(3, 1)
            break;
    }


    return (
        <div className={styles.status_button_container}>

            {buttonsData.map(b => (

                <button className={styles.status_button} onClick={() => handleChangeStatus(b.status)} key={b.status}>
                    {b.displayText}
                </button>

            ))}

        </div>
    );
}

export default StatusButtons;