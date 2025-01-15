import { AxiosError, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError, UserOfflineError } from "../errors";
import { errorToast } from "@/utilities/toast/errorToast";
import { toastIds } from "@/utilities/toast/toastIds";


export interface IRegisterBody {
    name: string
    email: string
    password: string
}

type IRegisterBodyError = {
    message: string
    errors: {
        [key in keyof Partial<IRegisterBody>]: string
    }
}

export class RegisterBodyError implements IRegisterBodyError {
    message: string;
    errors: IRegisterBodyError["errors"];

    constructor(message: string, errors: RegisterBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }


    addFieldErrors(key: keyof RegisterBodyError["errors"], errorMessage: string) {
        this.errors[key] = errorMessage
    }
}



/**
 * api call to register new user
 */
export const registerService = async (payload: IRegisterBody) => {

    return new Promise(async (resolve: (values: RegisterBodyError | NetworkError | UserOfflineError | string) => void) => {

        if (navigator.onLine === false) {
            errorToast(toastIds.apiError.userOffline, new UserOfflineError().message);
            return resolve(new UserOfflineError());
        }

        try {
            const result = await axiosInstance.post(apiUrls.registerURL, payload, { withCredentials: true })
            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const registerBodyError = new RegisterBodyError(ex.response.data.message, ex.response.data.errors)
                        return resolve(registerBodyError)

                    case (ex.response?.status === HttpStatusCode.Conflict ||
                        ex.response?.status === HttpStatusCode.InternalServerError):
                        const { message } = ex.response?.data
                        return resolve(message as string)
                }
            }

            console.log(ex)
            const networkErrorObj = new NetworkError();
            return resolve(networkErrorObj)
        }

    })


}