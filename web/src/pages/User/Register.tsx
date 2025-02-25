import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import styles from "./common.module.css"
import FormButton from "@/components/UserPage/Button";
import FormError from "@/components/UserPage/ErrorMsg";
import FormInput, { IFormInputProps } from "@/components/UserPage/Input";
import { routes } from "@/routes";
import { registerService } from "@/services/api/user/registerService";
import { useOnline } from "@/hooks/useOnline";
import useForm from "@/hooks/useForm";
import { RegisterBodyError } from "@/services/api/user/registerService";
import { NetworkError, UserOfflineError } from "@/services/api/errors";
import { toast } from "react-toastify";
import { toastIds } from "@/utilities/toast/toastIds";



const RegisterPage = () => {

    const navigate = useNavigate();
    const { isOnline } = useOnline();

    // password validation schema
    const passwordSchema = (fieldName: string) => z.string({ required_error: `${fieldName} is required` }).trim().min(8, "should have atleast 8 characters")

    // schema to validate form values
    const formSchema = z.object({
        name: z.string({ required_error: "name is required" }).trim().min(1, "name is required"),
        email: z.string({ required_error: "email is required" }).email({ message: "Invalid email" }),
        password: passwordSchema("password"),
        confirmPassword: passwordSchema("confirmPassword"),
    }).refine(({ confirmPassword, password }) => confirmPassword === password, { path: ["confirmPassword"], message: "doesn't match with password" })

    // interface for form
    type IForm = z.infer<typeof formSchema>

    const initialValues: IForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const {
        formValues,
        formErrors, setFormErrors,
        submitionError, setSubmitionError,
        loading, setLoading,
        handleChange
    } = useForm({ initialValues })



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            // validate form values
            await formSchema.parseAsync(formValues)

            // remove if any form input errors from previous submition attempt are present
            setFormErrors(initialValues)

            setLoading(true)

            // register api
            const result = await registerService({ email: formValues.email, name: formValues.name, password: formValues.password })

            switch (true) {
                case (result instanceof UserOfflineError):
                    setLoading(false)
                    toast(result.message, { toastId: toastIds.apiError.userOffline, type: 'error' });
                    setSubmitionError(result.message)
                    break;

                case (result instanceof NetworkError):
                    setLoading(false)
                    toast(result.message, { toastId: toastIds.apiError.network, type: 'error' });
                    setSubmitionError(result.message)
                    break;

                case (result instanceof RegisterBodyError):
                    setLoading(false)
                    setFormErrors(result.errors);
                    break;

                case (typeof result === 'string'):
                    setLoading(false)
                    setSubmitionError(result);
                    break;

                default:
                    setLoading(false)
                    // remove if any form submition errors from previous attempt are present
                    setSubmitionError('')

                    // on successful registration navigate to home page
                    navigate(routes.home)

            }

        }
        catch (ex) {
            setLoading(false)

            switch (true) {
                case (ex instanceof z.ZodError):
                    const { name, email, password, confirmPassword } = ex.formErrors.fieldErrors

                    // remove if any form submition errors from previous attempt are present
                    setSubmitionError('')

                    return setFormErrors({
                        name: name ? name[0] : "",
                        email: email ? email[0] : "",
                        password: password ? password[0] : "",
                        confirmPassword: confirmPassword ? confirmPassword[0] : ""
                    })


                // case (ex instanceof RegisterBodyError):
                //     return setFormErrors(ex.errors)

                // case (ex instanceof NetworkError):
                //     setFormErrors(initialValues)
                //     setSubmitionError(ex.message)
                //     return

                default:
                    setFormErrors(initialValues)
                    setSubmitionError(ex as string)

            }
            setLoading(false)
        }
    }


    interface IinputsArray {
        inputKey: keyof IForm
        inputType: IFormInputProps["inputType"]
        placeHolderProp: IFormInputProps["placeHolderProp"]
        required: IFormInputProps["required"]
        value: string
    }

    // form inputs
    const inputs: IinputsArray[] = [
        { inputKey: "name", value: formValues.name, inputType: "name", placeHolderProp: "Name", required: true },
        { inputKey: "email", value: formValues.email, inputType: "email", placeHolderProp: "Email", required: true },
        { inputKey: "password", value: formValues.password, inputType: "password", placeHolderProp: "Password", required: true },
        { inputKey: "confirmPassword", value: formValues.confirmPassword, inputType: "password", placeHolderProp: "Confirm Password", required: true },
    ]


    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            {/* form header */}
            <h1 className={styles.form_header}>Register</h1>

            <FormError message={submitionError} />


            {inputs.map(inp => (

                <div className={styles.form_input_container} key={inp.inputKey}>
                    <FormInput value={inp.value} inputType={inp.inputType} onChange={e => handleChange(inp.inputKey, e)} required={inp.required}
                        containerclassName={styles.form_input} placeHolderProp={inp.placeHolderProp} />

                    <FormError message={formErrors[inp.inputKey]} />
                </div>

            ))}



            {/* submit button */}
            <FormButton text="Register" variant="filled" type="submit"
                className={`${styles.first_button} ${styles.button}`} disabled={!isOnline} loading={loading} />


            <p className={styles.text}>Have an account ?</p>


            {/* login link */}
            <Link to={routes.user.login} className={styles.link}>
                <FormButton text="Log in" variant="outline" type="button"
                    className={`${styles.button} ${styles.second_button}`} disabled={false} />
            </Link>

        </form>
    );
}

export default RegisterPage;