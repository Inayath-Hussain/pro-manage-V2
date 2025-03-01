import { AxiosError, HttpStatusCode } from "axios";

import { InvalidTaskId } from "./getTaskPublic";

import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors";

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

export const updateDoneService = (payload: IUpdateDoneBody) => {
    return new Promise(async (resolve) => {
        if (navigator.onLine === false) {
            const userOfflineError = new UserOfflineError();
            return resolve(userOfflineError);
        }

        try {
            const result = await axiosInstance.patch(apiUrls.updateDone(payload.taskId, payload.checkListId), payload, { withCredentials: true })
            console.log(result)
            return resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {

                    // if invalid auth tokens or auth tokens are missing
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError()
                        return resolve(unauthorizedErrorObj)


                    // if check list item doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidCheckListId):
                        const invalidCheckListIdObj = new InvalidCheckListItemId()
                        return resolve(invalidCheckListIdObj)


                    // if task doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidTaskId):
                        const invalidTaskIdObj = new InvalidTaskId()
                        return resolve(invalidTaskIdObj)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError()
                        return resolve(networkErrorObj)
                }
            }
            // default
            console.log(ex)
            return resolve(ex)
        }
    })
}