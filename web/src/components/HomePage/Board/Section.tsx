import { ITaskJSON } from "@/store/slices/taskSlice";

import { useState } from "react";
import CollapseAll from "@/assets/icons/collapse-all.svg";
import AddTask from "./AddTask";
import Card from "./Card";

import styles from "./Section.module.css";

export interface ISectionprops {
    title: string
    tasks: ITaskJSON[]
}



const Section: React.FC<ISectionprops> = ({ title, tasks }) => {

    // this state is passed to all cards and whenever this state changes card collapse function is run
    const [collapseAll, setCollapseAll] = useState(false);

    const handleCollapseAll = () => {
        setCollapseAll(!collapseAll)
    }


    return (
        <section className={styles.section}>

            <div className={styles.section_header}>
                <p>{title}</p>

                <div className={styles.buttons_container}>

                    {/* Add Task */}
                    {title === "To do" && <AddTask />}


                    {/* Collapse All */}
                    <button className={styles.collapse_all_buttton} aria-label="collapse all" title="collapse all"
                        onClick={handleCollapseAll}>
                        <img src={CollapseAll} alt="" />
                    </button>

                </div>

            </div>


            <div className={styles.cards_container}>

                {tasks.map(t => (
                    <Card task={t} key={t.title} collapseAll={collapseAll} />
                ))}

            </div>

        </section>
    );
}

export default Section;