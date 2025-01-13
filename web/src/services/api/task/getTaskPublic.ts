import { AxiosError, HttpStatusCode } from "axios"

import { ITaskJSON } from "@/store/slices/taskSlice";
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"
import { NetworkError } from "../errors"


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
    new Promise<ITaskJSON>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get(apiUrls.getPublicTask(taskId))
            return resolve(result.data.task)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const middlewareError = new PublicTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                        return reject(middlewareError)


                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskId = new InvalidTaskId();
                        return reject(invalidTaskId)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj)
                }
            }

            console.log(ex)
            return reject("Please try again later")
        }
    })