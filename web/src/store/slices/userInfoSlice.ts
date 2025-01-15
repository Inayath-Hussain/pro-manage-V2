import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { getUserInfoService } from "@/services/api/user/getUserInfoService"
import { RootState } from "../index"
import { NetworkError, UnauthorizedError, UserOfflineError } from "@/services/api/errors"
import { toast } from "react-toastify"
import { toastIds } from "@/utilities/toast/toastIds"


interface IuserInfo {
    name: string
    email: string
}

export class UserInfo implements IuserInfo {
    email: string;
    name: string;

    constructor(payload: IuserInfo) {
        this.email = payload.email
        this.name = payload.name
    }
}


interface Ivalues extends UserInfo {
    status: "idle" | "loading" | "success" | "error"
}

const initialState: Ivalues = { ...new UserInfo({ email: "", name: "" }), status: "idle" }

/**
 * used to make api call to retrieve user info and store it in redux
 */
export const getUserInfo = createAsyncThunk("getUserInfo", async (_, thunkAPI) => {

    const data = await getUserInfoService()

    // 1. success
    // 2. UnauthorizedError
    // 3. NetworkError
    // 4. UserOfflineError

    switch (true) {
        case (data instanceof UnauthorizedError):
            toast(data.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.unauthorized })
            return thunkAPI.rejectWithValue(data)

        case (data instanceof UserOfflineError):
            toast(data.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.userOffline })
            return thunkAPI.rejectWithValue(data)

        case (data instanceof NetworkError):
            toast(data.message, { type: "error", autoClose: 5000, toastId: toastIds.apiError.network })
            return thunkAPI.rejectWithValue(data)

        default:
            return thunkAPI.fulfillWithValue(data)
    }

})


const userInfoSlice = createSlice({
    initialState: initialState,
    name: "userInfo",
    reducers: {
        clearUserInfoAction: () => {
            return initialState
        },

        updateNameAction: (state, action: PayloadAction<{ name: string }>) => {
            state.name = action.payload.name
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getUserInfo.pending, (state) => {
            state.status = "loading"
        }),

            builder.addCase(getUserInfo.fulfilled, (state, action) => {
                state.status = "success"
                state.email = action.payload.email
                state.name = action.payload.name
            }),

            builder.addCase(getUserInfo.rejected, (state) => {
                state.status = "error"
            })
    }
})




export const { clearUserInfoAction, updateNameAction } = userInfoSlice.actions

export const userInfoSelector = (state: RootState) => state.userInfo

export const userInfo = {
    name: userInfoSlice.name,
    reducer: userInfoSlice.reducer
}