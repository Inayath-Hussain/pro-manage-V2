import { UserInfo } from "@/store/slices/userInfoSlice"

import { AxiosError, HttpStatusCode } from "axios"
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors"
import { errorToast } from "@/utilities/toast/errorToast"
import { toastIds } from "@/utilities/toast/toastIds"

export const getUserInfoService = async () => {
    return new Promise(async (resolve: (value: UserInfo | UserOfflineError | UnauthorizedError | NetworkError) => void) => {

        if (navigator.onLine === false) {
            errorToast(toastIds.apiError.userOffline, new UserOfflineError().message);
            return resolve(new UserOfflineError());
        }
        else
            try {
                const result = await axiosInstance.get<UserInfo>(apiUrls.userInfo, { withCredentials: true })

                return resolve(result.data)
            }
            catch (ex) {
                if (ex instanceof AxiosError) {
                    switch (true) {
                        case (ex.response?.status === HttpStatusCode.Unauthorized):
                            const unauthorizedErrorObj = new UnauthorizedError();
                            errorToast(toastIds.apiError.unauthorized, unauthorizedErrorObj.message)
                            return resolve(unauthorizedErrorObj);
                    }
                }

                console.log(ex)
                const networkErrorObj = new NetworkError();
                errorToast(toastIds.apiError.network, networkErrorObj.message)
                return resolve(networkErrorObj);
            }
    })
}