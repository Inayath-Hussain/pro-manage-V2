import { Id, toast } from "react-toastify";

export const errorToast = (id: Id, errorMessage: string) => {
    toast.update(id, { type: "error", render: errorMessage, isLoading: false, autoClose: 5000 })
}