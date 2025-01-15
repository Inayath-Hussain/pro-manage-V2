import { AxiosError, HttpStatusCode } from "axios";

import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { InvalidTaskId } from "./getTaskPublic";


export interface IUpdateTaskStatusBody {
    taskId: string
    status: string
}


export const updateTaskStatusService = async (payload: IUpdateTaskStatusBody) => {
    return new Promise(async (resolve: (value: UserOfflineError | UnauthorizedError | NetworkError | InvalidTaskId) => void) => {

        if (navigator.onLine === false) {
            const userOfflineErrorObj = new UserOfflineError();
            return resolve(userOfflineErrorObj)
        }

        try {
            const result = await axiosInstance.patch(apiUrls.updateTaskStatus, payload, { withCredentials: true })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return resolve(unauthorizedErrorObj);

                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const errorObj = new InvalidTaskId();
                        return resolve(errorObj);
                }

                console.log(ex)
                const networkError = new NetworkError();
                return resolve(networkError);
            }
        }
    })
}