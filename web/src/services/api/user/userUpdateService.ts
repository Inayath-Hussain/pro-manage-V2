import { AxiosError, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors"
import { errorToast } from "@/utilities/toast/errorToast"
import { toastIds } from "@/utilities/toast/toastIds"



export interface IUpdateBody {
    name?: string
    oldPassword?: string
    newPassword?: string
}


export interface IUpdateMiddlewareError {
    message: string
    errors: Partial<IUpdateBody>
}


export class UserUpdateMiddlewareError implements IUpdateMiddlewareError {
    errors: Partial<IUpdateBody>;
    message: string;

    constructor(message = "Invalid body", errors: IUpdateMiddlewareError["errors"] = {}) {
        this.errors = errors
        this.message = message
    }

    // // add any input field errors
    // addFieldError = (key: keyof typeof this.errors, errorMsg: string) => {
    //     this.errors[key] = errorMsg
    // }

    // addErrorMessage = (message: string) => {
    //     this.message = message
    // }

}



export const userUpdateService = async (payload: IUpdateBody) => {
    return new Promise(async (resolve: (values: UserOfflineError | string | UnauthorizedError | UserUpdateMiddlewareError | NetworkError) => void) => {

        if (navigator.onLine === false) {
            errorToast(toastIds.apiError.userOffline, new UserOfflineError().message);
            return resolve(new UserOfflineError());
        }


        try {
            const result = await axiosInstance.patch(apiUrls.userUpdate, payload, { withCredentials: true })

            resolve(result.data)
        } catch (ex) {
            if (ex instanceof AxiosError) {
                const status = ex.response?.status

                switch (status) {
                    case HttpStatusCode.BadRequest:
                        return resolve(ex.response?.data.error as string)

                    case HttpStatusCode.Unauthorized:
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return resolve(unauthorizedErrorObj)

                    case HttpStatusCode.UnprocessableEntity:
                        const { errors } = ex.response?.data as IUpdateMiddlewareError

                        return resolve(new UserUpdateMiddlewareError(ex.response?.data, errors))
                }
            }

            console.log(ex)
            const networkErrorObj = new NetworkError();
            return resolve(networkErrorObj)
        }
    })

}