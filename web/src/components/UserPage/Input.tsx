import { useMemo, useState } from "react";
import NameLogo from "@/assets/icons/profile.svg";
import EmailLogo from "@/assets/icons/email.svg";
import PasswordLogo from '@/assets/icons/password.svg';
import HideLogo from "@/assets/icons/hide.svg";
import styles from "./Input.module.css"

export interface IFormInputProps {
    inputType: "name" | "email" | "password"
    value: string
    placeHolderProp?: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    required: boolean
    containerclassName?: string
    defaultValue?: string
}

const FormInput: React.FC<IFormInputProps> = ({ inputType, value, placeHolderProp = "", onChange, required, containerclassName = "" }) => {

    let placeholder = "";
    let type: React.HTMLInputTypeAttribute = "text";
    let logoSrc = "";

    const [showPassword, setShowPassword] = useState(false);

    if (inputType === "name") {
        placeholder = placeHolderProp || "Name"
        type = "text"
        logoSrc = NameLogo
    }

    if (inputType === "email") {
        placeholder = placeHolderProp || "Email"
        type = "email"
        logoSrc = EmailLogo
    }


    if (inputType === "password") {
        placeholder = placeHolderProp || "Password"
        type = useMemo(() => showPassword ? "text" : "password", [showPassword])
        logoSrc = PasswordLogo
    }

    const togglePasswordDisplay = () => {
        setShowPassword(!showPassword)
    }

    return (

        <div className={`${styles.input_container} ${containerclassName}`}>

            <img src={logoSrc} alt="" className={styles.input_logo} />

            <input className={`${styles.input}`}
                placeholder={placeholder} type={type} required={required} value={value}
                onChange={onChange} />

            {/* password hide button */}
            {inputType === "password" && <img src={HideLogo} alt="" className={styles.hide_logo} onClick={togglePasswordDisplay}
                title={type === "password" ? "show password" : "hide password"} />}
        </div>
    );
}

export default FormInput;