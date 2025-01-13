import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"

import { ITaskJSON } from "@/store/slices/taskSlice"
import { InvalidTaskId } from "./getTaskPublic"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError } from "../errors"
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


export const updateTaskService = async (payload: IUpdateTaskBody, signal: GenericAbortSignal) =>
    new Promise<ITaskJSON>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.put(apiUrls.updateTask, payload, { withCredentials: true, signal })

            const taskObj = new UpdateTaskResponse(result.data.message, result.data.task);

            return resolve(taskObj.task)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const updateTaskBodyError = new UpdateTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                        return reject(updateTaskBodyError)


                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskIdObj = new InvalidTaskId();
                        return reject(invalidTaskIdObj)


                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj);


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj);
                }
            }

            console.log(ex)
            return reject("Please try again later");
        }
    })