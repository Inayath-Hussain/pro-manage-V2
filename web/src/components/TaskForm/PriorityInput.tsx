import { priorityEnum } from "@/store/slices/taskSlice";


import styles from "./PriorityInput.module.css"


type IPriority = typeof priorityEnum[number]

interface Iprops {
    selectedPriority: IPriority
    onChange: (value: IPriority) => void
}

const PriorityInput: React.FC<Iprops> = ({ selectedPriority, onChange }) => {

    interface IpriorityOptions {
        dotColor: string
        displayText: string
        value: IPriority
    }

    const priorityOptions: IpriorityOptions[] = [
        { displayText: "HIGH", dotColor: styles.priority_dot_high, value: "high" },
        { displayText: "MODERATE", dotColor: styles.priority_dot_moderate, value: "moderate" },
        { displayText: "LOW", dotColor: styles.priority_dot_low, value: "low" }
    ]

    const isSelectedPriority = (value: IPriority) => value === selectedPriority

    return (
        <fieldset role="radiogroup" className={styles.priority_container}>

            <legend className={styles.priority_legend}>Select Priority <span>*</span></legend>

            <div className={styles.priority_options_container}>
                {priorityOptions.map(p => (

                    // priority options
                    <label className={`${styles.priority_label} ${isSelectedPriority(p.value) ? styles.selected_priority_label : ""}`}
                        key={p.value}>
                        <div className={`${styles.priority_dot} ${p.dotColor}`} />

                        {p.displayText} PRIORITY

                        <input type="radio" name="priority" value={p.value} className={styles.priority_input}
                            checked={isSelectedPriority(p.value)} onChange={() => onChange(p.value)} />
                    </label>

                ))}
            </div>

        </fieldset>
    );
}

export default PriorityInput;