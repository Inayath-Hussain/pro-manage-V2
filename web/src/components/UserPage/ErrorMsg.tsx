import styles from "./ErrorMsg.module.css"

interface IFormErrorprops {
    message: string
    className?: string
}

const FormError: React.FC<IFormErrorprops> = ({ message, className = "" }) => {
    return (
        <p className={`${styles.error_message} ${className}`}>{message}</p>
    );
}

export default FormError;