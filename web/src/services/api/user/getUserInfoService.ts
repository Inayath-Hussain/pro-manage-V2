import { UserInfo } from "@/store/slices/userInfoSlice"

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"
import { NetworkError, UnauthorizedError } from "../errors"

export const getUserInfoService = async (signal: GenericAbortSignal) => {
    return new Promise<UserInfo>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get<UserInfo>(apiUrls.userInfo, { signal, withCredentials: true })

            return resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj);


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj);
                }
            }

            console.log(ex)
            reject("Please try again later");
        }
    })
}