import { toast } from "react-toastify";
import { AxiosError, HttpStatusCode } from "axios";

import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors";
import { IChecklist, ITaskJSON } from "@/store/slices/taskSlice";
import { toastIds } from "@/utilities/toast/toastIds";


export interface IAddTaskBody {
    title: string
    priority: string
    dueDate?: string
    checkList: IChecklist[]
}

type IAddTaskBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IAddTaskBody>]: string
    }
}


class AddTaskResponse {
    message: string;
    task: ITaskJSON

    constructor(message: string, task: ITaskJSON) {
        this.message = message || "success"
        this.task = task
    }
}

export class AddTaskMiddlewareError implements IAddTaskBodyError {

    errors: IAddTaskBodyError["errors"];
    message: string;

    constructor(message: string, errors: IAddTaskBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }

    addFieldError(key: keyof IAddTaskBodyError["errors"], message: string) {
        this.errors[key] = message
    }
}


export const addTaskService = async (payload: IAddTaskBody) =>
    new Promise(async (resolve: (value: ITaskJSON | UnauthorizedError | UserOfflineError | NetworkError | AddTaskMiddlewareError) => void) => {
        if (navigator.onLine === false) {
            toast(new UserOfflineError().message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.userOffline })
            resolve(new UserOfflineError());
        }
        else
            try {
                const result = await axiosInstance.post(apiUrls.addTask, payload, { withCredentials: true })
                const taskObj = new AddTaskResponse(result.data.message, result.data.task)
                resolve(taskObj.task)
            }
            catch (ex) {
                if (ex instanceof AxiosError) {
                    switch (true) {
                        case (ex.response?.status === HttpStatusCode.Unauthorized):
                            const unauthorizedErrorObj = new UnauthorizedError();
                            toast(unauthorizedErrorObj.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.unauthorized })
                            return resolve(unauthorizedErrorObj);


                        case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                            const bodyErrorObj = new AddTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                            return resolve(bodyErrorObj)
                    }
                }

                console.log(ex)
                const networkErrorObj = new NetworkError();
                toast(networkErrorObj.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.network })
                return resolve(networkErrorObj)
            }
    })