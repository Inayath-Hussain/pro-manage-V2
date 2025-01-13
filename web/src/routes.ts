export const routes = {
    home: "/",
    user: {
        index: "/user",

        get login() { return this.index + "/login" },

        get register() { return this.index + "/register" },

    },
    settings: "/settings",
    analytics: "/analytics",
    public: "/public/"
}