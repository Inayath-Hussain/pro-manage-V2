import { ITaskJSON, priorityEnum } from "@/store/slices/taskSlice";

import { useSelector } from "react-redux";
import moment from "moment"

import Filter from "@/components/HomePage/Board/Filter";
import { userInfoSelector } from "@/store/slices/userInfoSlice";

import commonStyle from "./Index.module.css";
import styles from "./Board.module.css"
import Section, { ISectionprops } from "@/components/HomePage/Board/Section";
import { taskSelector } from "@/store/slices/taskSlice";
import { useEffect, useState } from "react";

type IpriorityOrder = {
    [k in typeof priorityEnum[number]]: number
}

const BoardPage = () => {

    const [backLogTasks, setBacklogTasks] = useState<ITaskJSON[]>([]);
    const [todoTasks, setToDoTasks] = useState<ITaskJSON[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<ITaskJSON[]>([]);
    const [doneTasks, setDoneTasks] = useState<ITaskJSON[]>([]);


    const { name } = useSelector(userInfoSelector)
    const tasks = useSelector(taskSelector);


    // "backlog", "in-progress", "to-do", "done"
    const sections: Required<ISectionprops>[] = [
        { title: "Backlog", tasks: backLogTasks },
        { title: "To do", tasks: todoTasks },
        { title: "In progress", tasks: inProgressTasks },
        { title: "Done", tasks: doneTasks }
    ]

    useEffect(() => {
        // priority order values used to sort them from high to low
        const priorityOrder: IpriorityOrder = {
            high: 1,
            moderate: 2,
            low: 3
        }

        // sort arrays based on 
        const backlog = [...tasks.backlog]
        backlog.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        setBacklogTasks(backlog)


        const inProgress = [...tasks["in-progress"]]
        inProgress.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        setInProgressTasks(inProgress)


        const todo = [...tasks["to-do"]]
        todo.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        setToDoTasks(todo)

        const done = [...tasks.done]
        done.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        setDoneTasks(done)

    }, [tasks])


    const todayDate = moment().format("Do MMM, YYYY")

    return (
        <section className={`${commonStyle.page_container} ${styles.board_page_container}`} >

            <div>

                {/* welcome text */}
                <h1 className={`${commonStyle.page_header} ${styles.welcome_text}`}>Welcome {name}</h1>

                {/* todays date */}
                <p className={styles.today_date}>{todayDate}</p>

                <div className={styles.header_and_filter_container}>
                    <p className={styles.board_page_header}>Board</p>

                    <Filter />
                </div>

            </div>


            {/* section container */}
            <div className={styles.tasks_sections_container_scroll}>

                <div className={styles.task_sections_container}>

                    {sections.map(s => (
                        <Section title={s.title} tasks={s.tasks} key={s.title} />
                    ))}

                </div>
            </div>

        </section>
    );
}

export default BoardPage;