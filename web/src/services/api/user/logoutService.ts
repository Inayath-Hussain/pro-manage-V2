import { AxiosError, GenericAbortSignal } from "axios";
import { apiUrls } from "../URLs";
import { axiosInstance } from "../instance";
import { NetworkError } from "../errors";

export const logoutService = async (signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.post(apiUrls.logoutURL, {}, { withCredentials: true, signal })
            resolve(result);
        }
        catch (ex) {
            if (ex instanceof AxiosError && ex.code === AxiosError.ERR_NETWORK) {
                const networkErrorObj = new NetworkError();
                return reject(networkErrorObj)
            }

            console.log(ex)
            return reject("Please try again later")
        }

    })
}