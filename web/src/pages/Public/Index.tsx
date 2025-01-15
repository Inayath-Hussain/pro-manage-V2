import { PublicTaskMiddlewareError } from "@/services/api/task/getTaskPublic";
import { InvalidTaskId } from "@/services/api/task/getTaskPublic";
import { ITaskJSON } from "@/store/slices/taskSlice";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Logo from "@/assets/icons/pro-manage-logo.svg"
import { NetworkError, UserOfflineError } from "@/services/api/errors";
import { getTaskPublicService } from "@/services/api/task/getTaskPublic";

import styles from "./Index.module.css";

const PublicTaskPage = () => {
    const { id } = useParams();

    const [task, setTask] = useState<ITaskJSON | null>(null);

    const [donotExist, setDonotExist] = useState("");
    const [networkError, setNetworkError] = useState("");
    const [tryAgainLater, setTryAgainLater] = useState("");

    useEffect(() => {
        const call = async () => {
            // try {
            const result = await getTaskPublicService(id as string)

            switch (true) {
                case (result instanceof PublicTaskMiddlewareError || result instanceof InvalidTaskId):
                    setDonotExist("Task donot exist");
                    break;

                case (result instanceof NetworkError):
                    setNetworkError("Check your network and try again");
                    break;

                case (result instanceof UserOfflineError):
                    setNetworkError("You are offline.")
                    break;

                default:
                    setTask(result)

                    setDonotExist("")
                    setNetworkError("")
                    setTryAgainLater("")
            }

            // }
            // catch (ex) {
            //     switch (true) {
            //         case (ex instanceof PublicTaskMiddlewareError || ex instanceof InvalidTaskId):
            //             setDonotExist("Task donot exist");
            //             break;


            //         case (ex instanceof NetworkError):
            //             toast(ex.message, { type: "error", autoClose: 5000 })
            //             setNetworkError("Check your network and try again");
            //             break;


            //         default:
            //             toast("Something went wrong try again later", { type: "error", autoClose: 5000 })
            //             setTryAgainLater("Something went wrong try again later")
            //             break
            //     }
            // }
        }

        call();

    }, [id])



    let dotColor = ""

    switch (task?.priority) {
        case ("high"):
            dotColor = styles.priority_dot_high
            break;

        case ("moderate"):
            dotColor = styles.priority_dot_moderate
            break;

        case ("low"):
            dotColor = styles.priority_dot_low
    }

    const totalChecklistItems = task?.checklist.length
    const completedChecklistItems = task?.checklist.reduce((prev, curr) => curr.done === true ? prev + 1 : prev, 0)


    const formattedDate = (date: string) => moment(date).format("MMM Do");


    if (donotExist || networkError || tryAgainLater) return (
        <main className={styles.error_layout}>
            <h1>{donotExist || networkError || tryAgainLater}</h1>
        </main>
    )



    if (task)
        return (
            <main className={styles.page_layout}>
                <div className={styles.logo_container}>
                    <img src={Logo} alt="" />

                    <p>Pro Manage</p>
                </div>

                <section className={styles.task_container}>

                    {/* task priority */}
                    <div className={styles.priority_container}>

                        <div className={`${styles.priority_dot} ${dotColor}`} />

                        <p>{task?.priority} priority</p>
                    </div>


                    {/* task title */}
                    <h2 className={styles.title}>{task?.title}</h2>


                    <div className={styles.checklist_container}>
                        <p className={styles.checklist_header}>Checklist ({completedChecklistItems}/{totalChecklistItems})</p>

                        <div className={styles.items_container}>

                            {task?.checklist.map(c => (

                                <div className={styles.item} key={c._id} >
                                    <input type="checkbox" checked={c.done} readOnly />

                                    <p>{c.description}</p>
                                </div>

                            ))}

                        </div>

                    </div>



                    {task?.dueDate && <div className={styles.due_date_container}>
                        <p>Due Date</p>

                        <p className={styles.due_date}>
                            {formattedDate(task.dueDate)}
                        </p>
                    </div>}

                </section>

            </main>
        );
}

export default PublicTaskPage;