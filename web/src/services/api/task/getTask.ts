import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { apiUrls } from "../URLs";
import { axiosInstance } from "../instance";
import { NetworkError, UnauthorizedError } from "../errors";
import { ITaskJSON } from "@/store/slices/taskSlice";


type IFilter = "day" | "week" | "month"

export const getTaskService = async (filter: IFilter, signal: GenericAbortSignal) => {
    return new Promise<ITaskJSON[]>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get(apiUrls.getTask + "?filter=" + filter, { signal, withCredentials: true })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    // if user is not authenticated then false value is returned( to navigate user to login page)
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj);

                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj);
                }
            }

            console.log(ex)
            reject("Please try again later")
        }
    })
}