
import AddIcon from "@web/assets/icons/add_logo.svg";
import useModal from "@web/hooks/useModal";
import TaskFormModal from "@web/components/modal/contents/TaskForm";


import styles from "./AddTask.module.css"

const AddTask = () => {
    const { showModal, hideModal, ModalPortal } = useModal();


    return (
        <>
            <button className={styles.add_task_button} aria-label="Add Task" title="Add Task"
                onClick={showModal}>
                <img src={AddIcon} alt="" />
            </button>

            {/* appends modal to dom */}
            {ModalPortal(<TaskFormModal closeModal={hideModal} />)}
        </>
    );
}

export default AddTask;