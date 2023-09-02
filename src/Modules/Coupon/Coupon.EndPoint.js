import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create: [roles.Admin, roles.SuperAdmin],
    update:[roles.Admin, roles.SuperAdmin],
    get:[roles.Admin, roles.SuperAdmin],
    softDelete:[roles.Admin, roles.SuperAdmin],
    forceDelete:[roles.Admin, roles.SuperAdmin],
}