import { ITaskJSON } from "@/store/slices/taskSlice";
import TaskFormModal from "@/components/modal/contents/TaskForm";
import useModal from "@/hooks/useModal";

interface Iprops {
    task: ITaskJSON
    closeOption: () => void
}

const EditTask: React.FC<Iprops> = ({ task, closeOption }) => {

    const { showModal, hideModal, ModalPortal } = useModal();

    const close = () => {
        closeOption();
        hideModal();
    }

    return (
        <>
            <option onClick={showModal} title="Edit task">
                Edit
            </option>

            {ModalPortal(<TaskFormModal closeModal={close} task={task} />)}
        </>
    );
}

export default EditTask;