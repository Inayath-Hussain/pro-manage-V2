import { AxiosError, HttpStatusCode } from "axios";

import { apiUrls } from "../URLs";
import { axiosInstance } from "../instance";
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors";
import { ITaskJSON } from "@/store/slices/taskSlice";
import { toastIds } from "@/utilities/toast/toastIds";
import { toast } from "react-toastify";


type IFilter = "day" | "week" | "month"


export const getTaskService = async (filter: IFilter) => {
    if (navigator.onLine === false)
        return new Promise<UserOfflineError>((resolve) => {
            toast(new UserOfflineError().message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.userOffline })
            return resolve(new UserOfflineError());
        })
    else
        return new Promise(async (resolve: (value: ITaskJSON[] | UnauthorizedError | NetworkError) => void) => {
            try {
                const result = await axiosInstance.get(apiUrls.getTask + "?filter=" + filter, { withCredentials: true })

                resolve(result.data.data)
            }
            catch (ex) {
                if (ex instanceof AxiosError) {
                    switch (true) {
                        // if user is not authenticated then false value is returned(to navigate user to login page)
                        case (ex.response?.status === HttpStatusCode.Unauthorized):
                            const unauthorizedErrorObj = new UnauthorizedError();
                            toast(unauthorizedErrorObj.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.unauthorized })
                            return resolve(unauthorizedErrorObj);
                    }
                }

                console.log(ex)
                const networkErrorObj = new NetworkError();
                toast(networkErrorObj.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.network })
                return resolve(networkErrorObj);
            }
        })
}