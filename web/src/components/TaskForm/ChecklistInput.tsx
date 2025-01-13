import { IChecklist } from "@/store/slices/taskSlice";

import DeleteLogo from "@web/assets/icons/delete-logo.svg";
import { HandleChecklistItemChange } from "../modal/contents/TaskForm.interface";
import styles from "./ChecklistInput.module.css"
import AddLogo from "../Icons/Add";
import FormError from "../UserPage/ErrorMsg";


interface Iprops {
    checkList: IChecklist[]
    handleChecklistItemChange: HandleChecklistItemChange
    addNewCheckList: () => void
    removeCheckList: (itemId: string) => void
    errorMsg: string
}


const ChecklistInput: React.FC<Iprops> = ({ checkList, handleChecklistItemChange, addNewCheckList, removeCheckList, errorMsg }) => {

    const totalCheckListItems = checkList.length
    const totalDoneChecklistItems = checkList.reduce((prev, curr) => curr.done === true ? prev + 1 : prev, 0)

    return (
        <fieldset className={styles.checkList_fieldset}>
            <legend className={styles.checkList_legend}>
                <p>Checklist ({totalDoneChecklistItems}/{totalCheckListItems}) <span>*</span></p>
                <FormError className={styles.error_message} message={errorMsg} />
            </legend>

            {/* check list item */}
            <div className={styles.checkList_items_container}>

                {checkList.map(c => (

                    <div className={styles.checkList_input_container} key={c._id}>


                        {/* checkbox for done property */}
                        <input className={styles.checkList_done} type="checkbox"
                            checked={c.done} onChange={() => handleChecklistItemChange(c._id, { key: "done", value: !c.done })} />


                        {/* text for description property */}
                        <input type="text" placeholder="Add a task" className={styles.checkList_input} defaultValue={c.description}
                            onChange={(e) => handleChecklistItemChange(c._id, { key: "description", value: e.target.value })} required />


                        {/* delete button */}
                        <button type="button" aria-label="delete check list item" title="Delete check list item"
                            className={styles.delete_checkList_item_button} onClick={() => removeCheckList(c._id)}>
                            <img src={DeleteLogo} alt="" width={20} />
                        </button>
                    </div>
                )
                )}

            </div>



            {/* Add new checklist item */}
            <button type="button" className={styles.add_checkList_item_button} title="Add new checklist item"
                onClick={addNewCheckList}>
                <AddLogo stroke="#767575" />
                Add New
            </button>

        </fieldset>
    );
}

export default ChecklistInput;