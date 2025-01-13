import useModal from "@web/hooks/useModal";

import styles from "./Confirm.module.css"

interface Iprops {
    action: string,
    handleConfirm: () => void
    disabled?: boolean
}

const ConfirmModalComponent: React.FC<Iprops> = ({ action, handleConfirm, disabled = false }) => {

    const { hideModal } = useModal();

    const preventClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    return (
        <div className={styles.confirm_container} onClick={preventClose}>
            <p className={styles.confirm_text}>Are you sure you want to {action}?</p>

            <button className={`${styles.button} ${styles.confirm_button}`}
                disabled={disabled} onClick={handleConfirm}>Yes, {action}</button>

            <button className={`${styles.button} ${styles.cancel_button}`} onClick={hideModal}>Cancel</button>
        </div>
    );
}

export default ConfirmModalComponent;