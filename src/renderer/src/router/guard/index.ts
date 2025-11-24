import { Router } from 'vue-router'
import { createPermissionGuard } from './permissionGuard'

export const setupRouterGuard = (router: Router): void => {
  createPermissionGuard(router)
}
