import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create: [roles.User],
    update:[roles.Admin, roles.SuperAdmin],
    get:[roles.Admin, roles.SuperAdmin],
    delete:[roles.Admin, roles.SuperAdmin],
}