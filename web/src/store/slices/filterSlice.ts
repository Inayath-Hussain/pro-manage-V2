import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";


export const getTasksFilterValues = ["day", "week", "month"] as const

export interface IGetTaskQuery {
    filter: typeof getTasksFilterValues[number]
}


const initialState: IGetTaskQuery["filter"] = "week"

const filterSlice = createSlice({
    initialState: initialState as IGetTaskQuery["filter"],
    name: "filter",
    reducers: {
        updateFilter: (state, action: PayloadAction<IGetTaskQuery["filter"]>) => {
            state = action.payload
            return state
        }
    }
})


export const { updateFilter } = filterSlice.actions

export const filterSelector = (state: RootState) => state.filter

export const filter = {
    name: filterSlice.name,
    reducer: filterSlice.reducer
}