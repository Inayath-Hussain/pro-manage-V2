import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";

import { NetworkError, UnauthorizedError } from "../errors";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { InvalidTaskId } from "./getTaskPublic";


export interface IUpdateTaskStatusBody {
    taskId: string
    status: string
}


export const updateTaskStatusService = async (payload: IUpdateTaskStatusBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.patch(apiUrls.updateTaskStatus, payload, { withCredentials: true, signal })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {

                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj);

                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const errorObj = new InvalidTaskId();
                        return reject(errorObj);


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkError = new NetworkError();
                        return reject(networkError);
                }

                console.log(ex)
                return reject("Please try again later")
            }
        }
    })
}