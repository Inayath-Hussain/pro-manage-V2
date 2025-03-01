
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";

import DotsIcon from "@/assets/icons/dots.svg"
import ConfirmModalComponent from "@/components/modal/contents/Confirm";
import useModal from "@/hooks/useModal";
import { useOnline } from "@/hooks/useOnline";
import { routes } from "@/routes";
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors";
import { deleteTaskService } from "@/services/api/task/deleteTask";
import { InvalidTaskId } from "@/services/api/task/getTaskPublic";
import { removeTaskAction, ITaskJSON } from "@/store/slices/taskSlice";
import EditTask from "./EditTask";
import { errorToast } from "@/utilities/toast/errorToast";

import styles from "./Options.module.css"


interface Iprops {
    task: ITaskJSON
}

const Options: React.FC<Iprops> = ({ task }) => {

    const [open, setOpen] = useState(false);
    // used to keep track of whether the request is still pending
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const toastIdRef = useRef<Id>("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { showModal, hideModal, ModalPortal, showModalState } = useModal();
    const { isOnline } = useOnline();


    // close options when clicked outside of it
    useEffect(() => {
        const closeOptions = (e: MouseEvent) => {
            // if user clicks outside of options container then closes the options
            if (containerRef.current && !e.composedPath().includes(containerRef.current)) setOpen(false)
        }
        document.addEventListener("click", closeOptions)
        return () => {
            document.removeEventListener("click", closeOptions)
        }
    }, [])


    // trigger abort when modal is closed
    useEffect(() => {
        if (showModalState === false) {
            setLoading(false);
        }
    }, [showModalState])


    const handleOpen = () => {
        setOpen(!open)
    }


    const handleDelete = async () => {

        if (!isOnline) return toast("Connect to network and try again", { type: "error", autoClose: 5000 })

        // prevent from making request when a previous delete request is still pending
        if (loading) return toast("Deleting toast Please wait", { type: "warning", autoClose: 5000 })

        // try {
        toastIdRef.current = toast.loading("Deleting toast...")
        const result = await deleteTaskService(task.id)

        switch (true) {
            case (result instanceof UserOfflineError):
                toast.update(toastIdRef.current, { render: result.message, autoClose: 5000, isLoading: false, type: "error" })
                break;

            case (result instanceof UnauthorizedError):
                errorToast(toastIdRef.current, result.message)
                navigate(routes.user.login);
                hideModal();
                break;

            case (result instanceof NetworkError):
                errorToast(toastIdRef.current, result.message)
                hideModal();
                break;

            case (result instanceof InvalidTaskId):
                errorToast(toastIdRef.current, result.message)
                hideModal();
                dispatch(removeTaskAction({ status: task.status, _id: task.id }))
                break;

            default:
                toast.update(toastIdRef.current, { render: "Toast Deleted", autoClose: 5000, isLoading: false, type: "success" })
                hideModal();
                dispatch(removeTaskAction({ status: task.status, _id: task.id }))

        }

        if (result) {
            toast.update(toastIdRef.current, { render: "Deleted Toast", autoClose: 5000, isLoading: false, type: "success" })
            hideModal();
            dispatch(removeTaskAction({ status: task.status, _id: task.id }))
        }
        // }
        // catch (ex) {
        //     switch (true) {
        //         case (ex instanceof UnauthorizedError):
        //             errorToast(toastIdRef.current, ex.message)
        //             navigate(routes.user.login);
        //             hideModal();
        //             break;


        //         case (ex instanceof InvalidTaskId):
        //             errorToast(toastIdRef.current, ex.message)
        //             hideModal();
        //             dispatch(removeTaskAction({ status: task.status, _id: task._id }))
        //             break;

        //         case (ex instanceof NetworkError):
        //             errorToast(toastIdRef.current, ex.message)
        //             hideModal();
        //             break;

        //         default:
        //             errorToast(toastIdRef.current, "Something went wrong")
        //     }

        // }
        setOpen(false)
    }


    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.origin + routes.public + task.id)

        toast("Copied to clipboard", { type: 'success', autoClose: 5000 })
        setOpen(false)

    }


    return (
        <>
            <div className={styles.options_container} ref={containerRef}>
                <button className={styles.options_button} onClick={handleOpen}>
                    <img src={DotsIcon} alt="" />
                </button>

                {/* options */}
                {open && <div className={styles.options}>

                    <EditTask task={task} closeOption={() => setOpen(false)} />

                    <option onClick={handleShare}>
                        Share
                    </option>

                    <option onClick={showModal} title="Delete task">
                        Delete
                    </option>


                </div>}


            </div>
            {ModalPortal(<ConfirmModalComponent action="Delete" handleConfirm={handleDelete} disabled={loading} />)}
        </>
    );
}

export default Options;