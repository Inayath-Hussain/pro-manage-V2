import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError } from "../errors"


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
export const loginService = async (payload: ILoginBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.post(apiUrls.loginURL, payload, { signal, withCredentials: true })

            resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {

                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const loginBodyError = new LoginBodyError(ex.response.data.message, ex.response.data.errors);
                        return reject(loginBodyError)

                    // if email already exists or any error occurred in server
                    case (ex.response?.status === HttpStatusCode.BadRequest ||
                        ex.response?.status === HttpStatusCode.InternalServerError):
                        const { message } = ex.response?.data

                        return reject(message as string)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj)
                }
            }

            console.log(ex)
            reject("Please try again later")

        }
    })
}