import { AxiosError, HttpStatusCode } from "axios"

import { ITaskJSON } from "@/store/slices/taskSlice";
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"
import { NetworkError, UserOfflineError } from "../errors"
import { toast } from "react-toastify";
import { toastIds } from "@/utilities/toast/toastIds";


interface IPublicTaskParam {
    taskId: string
}

export class PublicTaskMiddlewareError {
    message: string;
    errors: Partial<IPublicTaskParam>;

    constructor(message: string, errors: PublicTaskMiddlewareError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }

    addFieldError(key: keyof PublicTaskMiddlewareError["errors"], message: string) {
        this.errors[key] = message
    }
}



export class InvalidTaskId {
    message: string;
    invalidTaskId: boolean;

    constructor() {
        this.message = "Task doesn't exist"
        this.invalidTaskId = true
    }
}


export const getTaskPublicService = (taskId: string) =>
    new Promise(async (resolve: (values: ITaskJSON | PublicTaskMiddlewareError | InvalidTaskId | UserOfflineError | NetworkError) => void) => {

        if (navigator.onLine === false) {
            const userOfflineError = new UserOfflineError();
            toast(userOfflineError.message, { autoClose: 5000, type: 'error', toastId: toastIds.apiError.userOffline })
            return resolve(userOfflineError);
        }

        try {
            const result = await axiosInstance.get(apiUrls.getPublicTask(taskId))
            return resolve(result.data.task);
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const middlewareError = new PublicTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                        return resolve(middlewareError)


                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskId = new InvalidTaskId();
                        toast(invalidTaskId.message, { autoClose: 5000, type: 'error' })
                        return resolve(invalidTaskId)
                }
            }

            console.log(ex)
            const networkErrorObj = new NetworkError();
            toast(networkErrorObj.message, { autoClose: 5000, type: 'error', toastId: toastIds.apiError.network })
            return resolve(networkErrorObj)
        }
    })