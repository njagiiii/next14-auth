// public routes not require authentication.

export const publicRoutes = [
    "/",
    "/new-verification"
]

// routes for authentication will redirect users to /settings

export const authRoutes = [
    "/login",
    "/register",
    "/error",
    "/reset",
    "/new-password",
]

export const apiAuthPrefix = "/api/auth"

// this is where we are going to redirect the user after loggin unless other specifics

export const DEFAULT_LOGIN_REDIRECT="/settings";