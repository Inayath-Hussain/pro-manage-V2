import { AxiosError, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UserOfflineError } from "../errors"
import { errorToast } from "@/utilities/toast/errorToast"
import { toastIds } from "@/utilities/toast/toastIds"


export interface ILoginBody {
    email: string
    password: string
}


export type ILoginMiddlewareError = {
    message: string
    errors: {
        [key in keyof Partial<ILoginBody>]: string
    }
}



export class LoginBodyError implements ILoginMiddlewareError {
    message: string;
    errors: ILoginMiddlewareError["errors"];

    constructor(message: string, errors: LoginBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }


    addFieldErrors(key: keyof LoginBodyError["errors"], errorMessage: string) {
        this.errors[key] = errorMessage
    }
}


/**
 * api call to authenticate(or login) user
 */
export const loginService = async (payload: ILoginBody) => {
    return new Promise(async (resolve: (values: LoginBodyError | UserOfflineError | string | NetworkError) => void) => {

        if (navigator.onLine === false) {
            errorToast(toastIds.apiError.userOffline, new UserOfflineError().message);
            return resolve(new UserOfflineError());
        }

        try {
            const result = await axiosInstance.post(apiUrls.loginURL, payload, { withCredentials: true })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {

                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const loginBodyError = new LoginBodyError("Invalid data", {});
                        const keys = Object.keys(ex.response.data);
                        keys.forEach(k => loginBodyError.addFieldErrors(k as keyof ILoginBody, k[0]))
                        return resolve(loginBodyError)

                    // if email already exists or any error occurred in server
                    case (ex.response?.status === HttpStatusCode.BadRequest ||
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