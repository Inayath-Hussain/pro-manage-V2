import { useState } from "react";
import { createPortal } from "react-dom";
import ModalBase from "@web/components/modal/ModalBase";


/**
 * hook to handle display status of new group form modal.
 */
const useModal = () => {

    const [showModalState, setShowModalState] = useState(false);


    const showModal = () => {
        setShowModalState(true)
    }

    const hideModal = () => {
        setShowModalState(false)
    }


    /**
     * this function should be called inside render lifecycle of component.
     */
    const ModalPortal = (ModalComponent: JSX.Element): React.ReactPortal | null => {

        const modalDiv = document.getElementById("modal");

        if (modalDiv === null) throw Error("element with id 'modal' not found")

        if (showModalState) return createPortal(<ModalBase close={hideModal}> {ModalComponent} </ModalBase>, modalDiv)

        return null
    }

    return {
        showModalState,
        showModal,
        hideModal,
        ModalPortal
    }
}

export default useModal;