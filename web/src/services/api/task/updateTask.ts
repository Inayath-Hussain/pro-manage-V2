import { AxiosError, HttpStatusCode } from "axios"

import { ITaskJSON } from "@/store/slices/taskSlice"
import { InvalidTaskId } from "./getTaskPublic"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors"
import { IAddTaskBody } from "./addTask"


export interface IUpdateTaskBody extends IAddTaskBody {
    taskId: string
}

type IUpdateTaskBodyError = {
    message: string
    errors: {
        [p in keyof Partial<IUpdateTaskBody>]: string
    }
}


export class UpdateTaskMiddlewareError implements IUpdateTaskBodyError {

    errors: IUpdateTaskBodyError["errors"];
    message: string;

    constructor(message: string, errors: IUpdateTaskBodyError["errors"] = {}) {
        this.message = message
        this.errors = errors
    }

    addFieldError(key: keyof IUpdateTaskBodyError["errors"], message: string) {
        this.errors[key] = message
    }

}


export class UpdateTaskResponse {
    message: string;
    task: ITaskJSON;

    constructor(message: string, task: ITaskJSON) {
        this.message = message;
        this.task = task
    }
}


export const updateTaskService = async (payload: IUpdateTaskBody) =>
    new Promise(async (resolve: (values: ITaskJSON | UpdateTaskMiddlewareError | InvalidTaskId | UserOfflineError | UnauthorizedError | NetworkError) => void) => {

        if (navigator.onLine === false) {
            const userOfflineErrorObj = new UserOfflineError();
            return resolve(userOfflineErrorObj)
        }

        try {
            const result = await axiosInstance.put(apiUrls.updateTask(payload.taskId), payload, { withCredentials: true })

            const taskObj = new UpdateTaskResponse("success", result.data.data);

            return resolve(taskObj.task)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const updateTaskBodyError = new UpdateTaskMiddlewareError("Invalid data", {})
                        const keys = Object.keys(ex.response.data)
                        keys.forEach(k => {
                            updateTaskBodyError.addFieldError(k as keyof IUpdateTaskBody, ex.response?.data[k][0])
                        })
                        return resolve(updateTaskBodyError)


                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskIdObj = new InvalidTaskId();
                        return resolve(invalidTaskIdObj)


                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return resolve(unauthorizedErrorObj);
                }
            }

            console.log(ex)
            const networkErrorObj = new NetworkError();
            return resolve(networkErrorObj);
        }
    })