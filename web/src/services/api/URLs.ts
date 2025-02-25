export const apiUrls = {
    loginURL: "/api/user/login/",
    registerURL: "/api/user/register/",
    userUpdate: "/api/user/update/",
    userInfo: "/api/user/info/",

    // tasks
    getTask: "/api/tasks/",
    updateTaskStatus: "/api/tasks",
    updateDone: "/api/task/checkList",
    deleteTask: (id: string) => "/api/tasks/" + id,
    addTask: "/api/tasks/new/",
    updateTask: "/api/tasks",
    getPublicTask: (id: string) => "/api/task/public/" + id,
    analytics: "/api/task/analytics"
}