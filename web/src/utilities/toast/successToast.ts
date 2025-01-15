import { Id, toast } from "react-toastify";

export const successToast = (id: Id, message: string) => {
    toast.update(id, { type: "success", render: message, isLoading: false, autoClose: 5000 })
}