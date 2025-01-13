import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";

import { InvalidTaskId } from "./getTaskPublic";

import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError, UnauthorizedError } from "../errors";

export interface IUpdateDoneBody {
    taskId: string
    checkListId: string
    done: boolean
}

// used to create object when checkList item with provided id doesn't exist 
export class InvalidCheckListItemId {
    message: string;
    invalidCheckListId: boolean;

    constructor() {
        this.message = "CheckList item doesn't exist"
        this.invalidCheckListId = true
    }
}

export const updateDoneService = (payload: IUpdateDoneBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.patch(apiUrls.updateDone, payload, { signal, withCredentials: true })
            return resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {

                    // if invalid auth tokens or auth tokens are missing
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError()
                        return reject(unauthorizedErrorObj)


                    // if check list item doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidCheckListId):
                        const invalidCheckListIdObj = new InvalidCheckListItemId()
                        return reject(invalidCheckListIdObj)


                    // if task doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidTaskId):
                        const invalidTaskIdObj = new InvalidTaskId()
                        return reject(invalidTaskIdObj)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError()
                        return reject(networkErrorObj)
                }
            }
            // default
            console.log(ex)
            return reject(ex)
        }
    })
}