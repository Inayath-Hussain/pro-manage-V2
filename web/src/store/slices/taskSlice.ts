import { IUpdateDoneBody } from "@/services/api/task/updateDone";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

export const priorityEnum = ["high", "moderate", "low"] as const
export const statusEnum = ["backlog", "in-progress", "to-do", "done"] as const

export interface IChecklist {
    description: string
    done: boolean
    _id: string
}

/**
 * tasks sent to or recived from server are in this format 
 */
export interface ITaskJSON {
    _id: string
    title: string
    priority: typeof priorityEnum[number]
    status: typeof statusEnum[number]
    checklist: IChecklist[]
    createdAt: string,
    dueDate?: string
}


interface IUpdateTaskStatusPayload {
    status: ITaskJSON["status"]
    _id: string
}

// type Istate = {
// backlog: ITaskJSON[]
// progress: ITaskJSON[]
// todo: ITaskJSON[]
// done: ITaskJSON[]
// }

type IState = {
    [k in ITaskJSON["status"]]: ITaskJSON[]
}

const initialState: IState = {
    backlog: [],
    "in-progress": [],
    "to-do": [],
    done: []
}


const taskSlice = createSlice({
    initialState,
    name: "tasks",
    reducers: {
        renewTaskAction: (state, action: PayloadAction<ITaskJSON[]>) => {

            const tasks = action.payload

            statusEnum.forEach(k => {
                state[k] = tasks.filter(t => t.status === k);
            })

            //     state.backlog = tasks.filter(t => t.status === "backlog")

            //     state.progress = tasks.filter(t => t.status === "in-progress")

            // state.todo = tasks.filter(t => t.status === "to-do")


            // state.done = tasks.filter(t => t.status === "done")

            return state
        },

        addTaskAction: (state, action: PayloadAction<ITaskJSON>) => {

            const status = action.payload.status
            state[status] = [...state[status], action.payload]

            // switch(action.payload.status){
            //     case ("backlog"):
            //         state.backlog = [...state.backlog, action.payload]
            //         return state

            //     case ("in-progress"):
            //         state.progress = [...state.progress, action.payload]
            //         return state

            //     case ("to-do"):
            //         state.todo = [...state.todo, action.payload]
            //         return state

            //     case ("done"):
            //         state.done = [...state.done, action.payload]
            //         return state

            //     default:
            //         return state
            // }

        },

        updateTaskAction: (state, action: PayloadAction<{ currentStatus: ITaskJSON["status"], task: ITaskJSON }>) => {
            // status of the task in redux state
            const currentStatus = action.payload.currentStatus
            const task = action.payload.task

            state[currentStatus] = state[currentStatus].filter(s => s._id !== task._id)
            state[task.status].push(task)

            return state
        },

        updateTaskStatusAction: (state, action: PayloadAction<{ currentStatus: ITaskJSON["status"], data: IUpdateTaskStatusPayload }>) => {
            const currentStatus = action.payload.currentStatus
            const data = action.payload.data

            const task = state[currentStatus].find(s => s._id === data._id)
            if (task === undefined) return state

            task.status = data.status
            state[currentStatus] = state[currentStatus].filter(s => s._id !== data._id)
            state[data.status].push(task)

            return state
        },

        updateDoneAction: (state, action: PayloadAction<{ status: ITaskJSON["status"], data: IUpdateDoneBody }>) => {
            const { data, status } = action.payload

            const taskIndex = state[status].findIndex(s => s._id === data.taskId)
            const itemIndex = state[status][taskIndex].checklist.findIndex(c => c._id === data.checkListId)

            state[status][taskIndex].checklist[itemIndex].done = data.done
        },

        removeTaskAction: (state, action: PayloadAction<{ status: ITaskJSON["status"], _id: string }>) => {

            state[action.payload.status] = state[action.payload.status].filter(s => s._id !== action.payload._id)
            return state
        },

        removeCheckListItemAction: (state, action: PayloadAction<{ status: ITaskJSON["status"], taskId: string, itemID: string }>) => {
            const index = state[action.payload.status].findIndex(s => s._id === action.payload.taskId)

            state[action.payload.status][index].checklist = state[action.payload.status][index].checklist.filter(c => c._id !== action.payload.itemID)
        }
    }
})


export const { renewTaskAction, addTaskAction, updateTaskAction, updateTaskStatusAction, updateDoneAction, removeTaskAction, removeCheckListItemAction } = taskSlice.actions

export const taskSelector = (state: RootState) => state.tasks

export const tasks = {
    name: taskSlice.name,
    reducer: taskSlice.reducer
}