<template>
  <div class="flex flex-col space-y-3">
    <BreadcrumbItem />
    <h4 class="text-xl font-bold">当前登录设备列表（共 5 个）</h4>
    <div>
      <el-table :data="sessionData">
        <el-table-column prop="info" label="设备信息" width="180" align="center"></el-table-column>
        <el-table-column
          prop="ipAddress"
          label="IP地址"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column
          prop="lastLoginTime"
          label="最后登录时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="action" label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="info" text size="small" @click="handleDetail(row)"> 详情 </el-button>
            <el-button type="danger" text size="small" @click="handleLogout(row)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#e76666"
                  d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                />
              </svg>
              注销
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbItem from './components/BreadcrumbItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const sessionData = [
  {
    id: 1,
    info: '设备1',
    ipAddress: '192.168.1.1',
    status: 'Active',
    lastLoginTime: '2022-01-01 12:00:00'
  },
  {
    id: 2,
    info: '设备2',
    ipAddress: '192.168.1.2',
    status: 'Stale',
    lastLoginTime: '2022-01-02 12:00:00'
  },
  {
    id: 3,
    info: '设备3',
    ipAddress: '192.168.1.3',
    status: 'Active',
    lastLoginTime: '2022-01-03 12:00:00'
  },
  {
    id: 4,
    info: '设备4',
    ipAddress: '192.168.1.4',
    status: 'Inactive',
    lastLoginTime: '2022-01-04 12:00:00'
  },
  {
    id: 5,
    info: '设备5',
    ipAddress: '192.168.1.5',
    status: 'Active',
    lastLoginTime: '2022-01-05 12:00:00'
  }
]

const handleDetail = (row: any): void => {
  router.push({ path: `/settings/session/${row.id}` })
}
const handleLogout = (row: any): void => {
  console.log('注销', row)
}
</script>

<style scoped></style>
