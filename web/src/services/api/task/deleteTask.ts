import { InvalidTaskId } from "./getTaskPublic";

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { NetworkError, UnauthorizedError } from "../errors";
import { apiUrls } from "../URLs";


export const deleteTaskService = async (id: string, signal: GenericAbortSignal) =>
    new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.delete(apiUrls.deleteTask(id), { withCredentials: true, signal })

            resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj)

                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskIdObj = new InvalidTaskId();
                        return reject(invalidTaskIdObj)

                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj)
                }
            }

            console.log(ex)
            return reject(ex)
        }
    })