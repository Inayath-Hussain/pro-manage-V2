import { IChecklist, ITaskJSON } from "@/store/slices/taskSlice";

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError, UnauthorizedError } from "../errors";


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


export const addTaskService = async (payload: IAddTaskBody, signal: GenericAbortSignal) =>
    new Promise<ITaskJSON>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.post(apiUrls.addTask, payload, { withCredentials: true, signal })

            const taskObj = new AddTaskResponse(result.data.message, result.data.task)
            resolve(taskObj.task)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj);


                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const bodyErrorObj = new AddTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                        return reject(bodyErrorObj)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj)
                }
            }

            console.log(ex)
            reject("Please try again later")
        }
    })