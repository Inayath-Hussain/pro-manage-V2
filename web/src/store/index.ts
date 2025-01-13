import { configureStore } from "@reduxjs/toolkit";
import { userInfo } from "./slices/userInfoSlice";
import { tasks } from "./slices/taskSlice"
import { filter } from "./slices/filterSlice";


export const store = configureStore({
    reducer: {
        [userInfo.name]: userInfo.reducer,
        [tasks.name]: tasks.reducer,
        [filter.name]: filter.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch