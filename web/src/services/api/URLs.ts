export const apiUrls = {
    loginURL: "/api/user/login/",
    registerURL: "/api/user/register/",
    userUpdate: "/api/user/update/",
    userInfo: "/api/user/info/",

    // tasks
    getTask: "/api/tasks/",
    updateTaskStatus: (id: string) => "/api/tasks/" + id + "/status/",
    updateDone: (task_id: string, checklist_id: string) => `/api/tasks/${task_id}/checklist/${checklist_id}/`,
    deleteTask: (id: string) => "/api/tasks/" + id + "/",
    addTask: "/api/tasks/new/",
    updateTask: (id: string) => "/api/tasks/" + id + "/",
    getPublicTask: (id: string) => "/api/tasks/" + id + "/public/",
    analytics: "/api/tasks/analytics/"
}