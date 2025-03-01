import { InvalidCheckListItemId } from "@/services/api/task/updateDone";
import { InvalidTaskId } from "@/services/api/task/getTaskPublic";
import { ITaskJSON } from "@/store/slices/taskSlice";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast, Id } from "react-toastify";

import CheckListArror from "@/assets/icons/checkList-arrow.svg"
import { routes } from "@/routes";
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors";
import { updateDoneService } from "@/services/api/task/updateDone";
import { removeCheckListItemAction, removeTaskAction, updateDoneAction } from "@/store/slices/taskSlice";
import Options from "./Options";
import StatusButtons from "./StatusButtons";

import styles from "./Card.module.css"
import { errorToast } from "@/utilities/toast/errorToast";


interface Iprops {
    task: ITaskJSON
    collapseAll: boolean
}

const Card: React.FC<Iprops> = ({ task, collapseAll }) => {

    // state used to display or hide checkList items
    const [open, setOpen] = useState(false);

    // state to keep track of whether the api call is finished or not
    const [loading, setLoading] = useState(false);

    const toastIdRef = useRef<Id>("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // when collapse all is triggered close the card
    useEffect(() => {
        setOpen(false)
    }, [collapseAll])

    const handleOpen = () => {
        setOpen(!open)
    }

    // update done of checklist item
    const handleDoneChange = async (checkListId: string) => {
        // if loading return
        if (loading) return toast("updating task item please wait", { type: "warning" }) // updating task item please wait toast here


        // make service call
        const item = task.checklist.find(item => item.id === checkListId)
        if (item === undefined) return // dispatch to remove item

        // try {
        setLoading(true)
        toastIdRef.current = toast.loading("Updating Task...")
        const result = await updateDoneService({ taskId: task.id, checkListId, done: !item.done })

        switch (true) {
            case (result instanceof UserOfflineError):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                return


            case (result instanceof UnauthorizedError):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                return navigate(routes.user.login)

            case (result instanceof InvalidTaskId):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                dispatch(removeTaskAction({ status: task.status, _id: task.id }))
                return

            case (result instanceof InvalidCheckListItemId):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                // dispatch to remove item from checkList
                dispatch(removeCheckListItemAction({ status: task.status, taskId: task.id, itemID: checkListId }))
                return

            case (result instanceof NetworkError):
                setLoading(false)
                errorToast(toastIdRef.current, result.message)
                // Check network and try again later, toast here
                return


            default:
                toast.update(toastIdRef.current, { type: "success", render: "Updated Task Item", isLoading: false, autoClose: 5000 })
                setLoading(false)
                // dispatch action to update checkList item
                dispatch(updateDoneAction({ status: task.status, data: { taskId: task.id, checkListId, done: !item.done } }))
        }

        // if (result) {
        //     toast.update(toastIdRef.current, { type: "success", render: "Updated Task Item", isLoading: false, autoClose: 5000 })
        //     setLoading(false)
        //     // dispatch action to update checkList item
        //     dispatch(updateDoneAction({ status: task.status, data: { taskId: task._id, checkListId, done: !item.done } }))

        // }
        // }
        // catch (ex) {
        //     switch (true) {
        //         case (ex instanceof UnauthorizedError):
        //             errorToast(toastIdRef.current, "Please login again")
        //             return navigate(routes.user.login)

        //         case (ex instanceof InvalidTaskId):
        //             errorToast(toastIdRef.current, ex.message)
        //             dispatch(removeTaskAction({ status: task.status, _id: task._id }))
        //             return

        //         case (ex instanceof InvalidCheckListItemId):
        //             errorToast(toastIdRef.current, ex.message)
        //             // dispatch to remove item from checkList
        //             dispatch(removeCheckListItemAction({ status: task.status, taskId: task._id, itemID: checkListId }))
        //             return

        //         case (ex instanceof NetworkError):
        //             errorToast(toastIdRef.current, ex.message)
        //             // Check network and try again later, toast here
        //             return

        //         default:
        //             errorToast(toastIdRef.current, "Something went wrong try again later")
        //             console.log(ex)
        //     }
        // }
    }




    // get css classes for priority dot color
    const getPriorityColor = () => {
        if (task.priority === "low") return styles.priority_dot_green
        if (task.priority === "moderate") return styles.priority_dot_blue
        if (task.priority === "high") return styles.priority_dot_red
    }

    // get total checkList items whose done property is true 
    const getTotalDoneItems = () => {
        return task.checklist.reduce((prev, curr) => {
            if (curr.done) return prev + 1
            return prev
        }, 0)
    }

    const getFormattedDueDate = (date: string) => moment(date).format("MMM Do");

    // check if due date is passed
    const hasDueDatePassed = (date: string) => moment(date).isBefore(new Date(), "day")


    // returns module css class for dueDate 
    const getDueDateClass = (dueDate: string) =>
        task.status === "done" ? styles.dueDate_for_task_done :
            hasDueDatePassed(dueDate) ? styles.dueDate_passed : ""

    return (
        <div className={styles.card}>

            {/* priority and options */}
            <div className={styles.priority_and_options_container}>

                <div className={styles.priority}>
                    {/* check priority and add color */}
                    <div className={`${styles.priority_dot} ${getPriorityColor()}`} />

                    {task.priority} Priority
                </div>

                <Options task={task} />
            </div>



            {/* heading */}
            <h2 className={styles.task_title}>{task.title}</h2>



            {/* CheckList */}
            <div className={styles.checkList_container}>

                {/* checklist outer */}
                <div className={styles.checklist_outer}>
                    <p className={styles.total_done}>Checklist ({getTotalDoneItems()} / {task.checklist.length})</p>

                    <button className={styles.checklist_collapse_button} onClick={handleOpen}>
                        <img src={CheckListArror} alt="" className={`${styles.arrow} ${open ? styles.arrow_up : ""}`} />
                    </button>
                </div>

                {/* checklist_innner */}
                <div className={styles.checklist_inner}>


                    {/* items */}

                    {open && task.checklist.map(c => (
                        <div className={styles.item} key={c.id}>
                            <input type="checkbox" checked={c.done} onChange={() => handleDoneChange(c.id)} />

                            <p>{c.description}</p>
                        </div>

                    ))}

                </div>


                {/* dueDate and status */}
                <div className={styles.dueDate_and_status}>

                    {/* check if dueDate has passed and set color to red  */}
                    <div>
                        {task.dueDate &&
                            <p className={`${styles.dueDate} ${getDueDateClass(task.dueDate)}`}>
                                {getFormattedDueDate(task.dueDate)}
                            </p>
                        }
                    </div>


                    {/* status */}
                    <StatusButtons taskId={task.id} status={task.status} />

                </div>

            </div>

        </div>
    );
}

export default Card;