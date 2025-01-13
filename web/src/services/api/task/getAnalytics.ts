import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError } from "../errors"


export interface IAnalytics {
    backlog: number
    progress: number
    todo: number
    done: number
    high: number
    low: number
    moderate: number
    dueDate: number
}


export const getAnalyticsService = (signal: GenericAbortSignal) =>
    new Promise<IAnalytics>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get(apiUrls.analytics, { withCredentials: true, signal })

            resolve(result.data.analytics)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkError = new NetworkError();
                        return reject(networkError)
                }
            }

            console.log(ex)
            return reject("Please try again later")
        }
    })