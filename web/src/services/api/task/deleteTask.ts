import { InvalidTaskId } from "./getTaskPublic";

import { AxiosError, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { NetworkError, UnauthorizedError, UserOfflineError } from "../errors";
import { apiUrls } from "../URLs";

export const deleteTaskService = async (id: string) =>
    new Promise(async (resolve) => {
        if (navigator.onLine === false) {
            resolve(new UserOfflineError())
            return
        }
        else {
            try {
                const result = await axiosInstance.delete(apiUrls.deleteTask(id), { withCredentials: true })
                resolve(result)
            }
            catch (ex) {
                if (ex instanceof AxiosError) {
                    switch (true) {
                        case (ex.response?.status === HttpStatusCode.Unauthorized):
                            const unauthorizedErrorObj = new UnauthorizedError();
                            return resolve(unauthorizedErrorObj)

                        case (ex.response?.status === HttpStatusCode.NotFound):
                            const invalidTaskIdObj = new InvalidTaskId();
                            return resolve(invalidTaskIdObj)
                    }
                }

                console.log(ex)
                const networkErrorObj = new NetworkError();
                return resolve(networkErrorObj)
            }
        }
    })