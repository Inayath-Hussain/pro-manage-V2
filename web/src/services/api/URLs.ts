export const apiUrls = {
    loginURL: "/api/user/login",
    registerURL: "/api/user/register",
    logoutURL: "/api/user/logout",
    userUpdate: "/api/user/update",
    userInfo: "/api/user/info",

    // tasks
    getTask: "/api/task",
    updateTaskStatus: "/api/task",
    updateDone: "/api/task/checkList",
    deleteTask: (id: string) => "/api/task/" + id,
    addTask: "/api/task",
    updateTask: "/api/task",
    getPublicTask: (id: string) => "/api/task/public/" + id,
    analytics: "/api/task/analytics"
}