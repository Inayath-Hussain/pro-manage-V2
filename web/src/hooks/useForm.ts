import { useEffect, useState } from "react";
import { useOnline } from "./useOnline";

interface Iprops {
    initialValues: any
}

const useForm = ({ initialValues }: Iprops) => {

    type IForm = typeof initialValues

    // form input values
    const [formValues, setFormValues] = useState<IForm>(initialValues);

    // form input errors
    const [formErrors, setFormErrors] = useState<IForm>(initialValues);

    // form's main error
    const [submitionError, setSubmitionError] = useState("");

    const [loading, setLoading] = useState(false);

    const { isOnline } = useOnline();


    useEffect(() => {
        if (!isOnline) setSubmitionError("You are offline")
        else setSubmitionError("")
    }, [isOnline])



    /**
     * updates {@link formValues} values
     * @param property one of the property name(or key) of {@link formState}
     */
    const handleChange = (property: keyof IForm, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [property]: e.target.value })
    }



    return {
        formValues,
        setFormValues,

        formErrors,
        setFormErrors,

        submitionError,
        setSubmitionError,

        loading,
        setLoading,

        handleChange
    }

}

export default useForm;