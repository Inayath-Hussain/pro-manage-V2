import { GenericAbortSignal } from "axios"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { getUserInfoService } from "@/services/api/user/getUserInfoService"
import { RootState } from "../index"
import { NetworkError, UnauthorizedError } from "@/services/api/errors"


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
export const getUserInfo = createAsyncThunk("getUserInfo", async (signal: GenericAbortSignal, thunkAPI) => {
    try {
        const data = await getUserInfoService(signal)

        return thunkAPI.fulfillWithValue(data)
    }
    catch (ex) {
        switch (true) {
            case (ex instanceof UnauthorizedError):
                return thunkAPI.rejectWithValue(ex)


            case (ex instanceof NetworkError):
                return thunkAPI.rejectWithValue(ex)


            default:
                return thunkAPI.rejectWithValue(500)
        }
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