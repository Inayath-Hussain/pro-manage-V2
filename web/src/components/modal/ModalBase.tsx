import { useEffect, useRef } from "react"
import { getAllFocusableElements } from "@web/utilities/modal/modal";

import styles from "./ModalBase.module.css";


interface Iprops {
    close: () => void
}

const ModalBase = ({ children, close }: React.PropsWithChildren<Iprops>) => {

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        // storing the element which had focus before opening the modal
        const activeElementBeforeModal = document.activeElement as HTMLElement;
        if (activeElementBeforeModal === null) throw Error("active element before opening modal is null");

        // when modal is open, access to elements which are not in modal is not ideal so the focus from stored element is removed.
        activeElementBeforeModal.blur()

        if (modalRef.current === null) throw Error("modalRef is null");

        const focusableElements = getAllFocusableElements(modalRef.current);

        // first visible focusable element in modal
        const firstElement = focusableElements[0];
        // last visible focusable element in modal
        const lastElement = focusableElements[focusableElements.length - 1];


        /**
         * close modal using "ESC" key
         */
        const escKeyHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        }


        /**
         * traps focus within modal when "Shift" and "Tab" are used to navigate through elements in reverse order.
         * 
         * when focus is on first element and user tries to navigate further in reverse order of DOM tree then last element in modal will receive focus 
         */
        const firstElementFocusHandler = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                lastElement.focus();
            }
        }


        /**
         * traps focus within modal when "Tab" is used to navigate through elements.
         * 
         * when focus is on the last element and "Tab" is pressed the first element in modal will receive focus.
         */
        const lastElementFocusHandler = (e: KeyboardEvent) => {
            if (e.key === "Tab" && !e.shiftKey) {
                e.preventDefault()
                firstElement.focus()
            }
        }

        /**
         * when modal is open and user tries to navigate for first time and used "Shift" and "Tab"(reverse order of dom tree) then the last element in modal receives focus.
         * 
         * If this handler isn't present then focus will shift to element before the stored active element and hence provides access to other elements which are not in modal.
         */
        const handleReverseOrderFocus = (e: KeyboardEvent) => {
            if (e.key === "Tab" && e.shiftKey) {
                if (!modalRef.current?.contains(e.target as Node)) {
                    e.preventDefault();
                    lastElement.focus()
                }
            }
        }

        document.addEventListener("keydown", escKeyHandler);
        firstElement.addEventListener("keydown", firstElementFocusHandler);
        lastElement.addEventListener("keydown", lastElementFocusHandler);
        document.addEventListener("keydown", handleReverseOrderFocus);

        return () => {
            document.removeEventListener("keydown", escKeyHandler);
            firstElement.removeEventListener("keydown", firstElementFocusHandler);
            lastElement.removeEventListener("keydown", lastElementFocusHandler);
            document.removeEventListener("keydown", handleReverseOrderFocus);

            // when modal is closed, focus is returned to the element which was active before opening the modal.
            activeElementBeforeModal.focus()
        }
    }, [])


    return (
        <div ref={modalRef} role="dialog" aria-modal="true" className={styles.modal_layout} onClick={close}>
            {children}
        </div>
    );
}

export default ModalBase;