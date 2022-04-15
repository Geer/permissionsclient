import PermissionList from './components/Permissions/PermissionsList.vue'
import CreatePermission from './components/Permissions/CreatePermission.vue'

export default [
  { name:'List', path: '/', component: PermissionList },
  { name:'New', path: '/new', component: CreatePermission },
  { name:'Edit', path: '/edit/:id', component: CreatePermission },
]