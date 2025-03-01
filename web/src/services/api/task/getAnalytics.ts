import { AxiosError, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors"
import { toast } from "react-toastify"
import { toastIds } from "@/utilities/toast/toastIds"


export interface IAnalytics {
    backlog: number
    progress: number
    todo: number
    done: number
    high: number
    low: number
    moderate: number
    dueDate: number
}


export const getAnalyticsService = () =>
    new Promise(async (resolve: (values: IAnalytics | UserOfflineError | UnauthorizedError | NetworkError) => void) => {

        if (navigator.onLine === false) {
            const userOfflineErrorObj = new UserOfflineError()
            resolve(userOfflineErrorObj);
            toast(userOfflineErrorObj.message, { autoClose: 5000, type: "error", toastId: toastIds.apiError.userOffline })
            return
        }
        try {
            const result = await axiosInstance.get(apiUrls.analytics, { withCredentials: true })

            resolve({ ...result.data.status, ...result.data.priority, todo: result.data.status['to-do'] || 0, progress: result.data.status['in-progress'] || 0, dueDate: result.data.due_date })
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        toast(unauthorizedErrorObj.message, { autoClose: 5000, type: "error", toastId: toastIds.apiError.unauthorized })
                        return resolve(unauthorizedErrorObj)
                }
            }

            console.log(ex)
            const networkError = new NetworkError();
            toast(networkError.message, { autoClose: 5000, type: "error", toastId: toastIds.apiError.unauthorized })
            return resolve(networkError)
        }
    })