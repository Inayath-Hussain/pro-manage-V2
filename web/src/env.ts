import { cleanEnv, str } from "envalid"


export const env = cleanEnv(import.meta.env, {
    VITE_SERVER_API_BASE_URL: str()
})