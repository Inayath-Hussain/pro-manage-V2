export const apiUrls = {
    loginURL: "/api/user/login/",
    registerURL: "/api/user/register/",
    userUpdate: "/api/user/update/",
    userInfo: "/api/user/info/",

    // tasks
    getTask: "/api/tasks/",
    updateTaskStatus: (id: string) => "/api/tasks/" + id + "/status/",
    updateDone: "/api/task/checkList",
    deleteTask: (id: string) => "/api/tasks/" + id,
    addTask: "/api/tasks/new/",
    updateTask: (id: string) => "/api/tasks/" + id + "/",
    getPublicTask: (id: string) => "/api/task/public/" + id,
    analytics: "/api/task/analytics"
}