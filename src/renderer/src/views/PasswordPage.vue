<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">所有密码</h2>
      </div>

      <div><el-button type="primary" plain> 新建密码</el-button></div>
    </div>

    <el-divider content-position="left">管理和查看您存储的所有密码</el-divider>

    <div class="flex justify-between">
      <div class="flex-1 mr-1">
        <el-input v-model="searchPassword" clearable placeholder="搜索密码...">
          <template #prepend>
            <el-button icon="Search" />
          </template>
        </el-input>
      </div>
      <div>
        <el-button>
          <el-icon><Filter /></el-icon>
          筛选
        </el-button>
      </div>
    </div>

    <div>
      <el-row :gutter="20">
        <el-col v-for="item in paginatedPasswords" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="mb-4" shadow="hover">
            <template #header>
              <div class="flex items-center space-x-2">
                <el-icon :size="28" color="skyblue">
                  <component :is="item.type"></component>
                </el-icon>
                <div>
                  <p class="item_title text-sm font-bold">{{ item.name }}</p>
                  <p class="item_category text-xs text-gray-500">{{ item.category }}</p>
                </div>
              </div>

              <div @click="toggleFavorite(item.id)">
                <el-button
                  v-if="item.favorite"
                  text
                  icon="StarFilled"
                  class="is-active"
                ></el-button>
                <el-button v-else text icon="Star"></el-button>
              </div>
            </template>
            <!-- card body -->
            <div class="flex flex-col">
              <div>
                <label class="text-gray-400 text-sm">用户名</label>
                <div class="flex justify-between">
                  <p class="text-xs">{{ item.username }}</p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click="copyUsername(item.username)"
                  >
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </p>
                </div>
              </div>
              <div>
                <label class="text-gray-400 text-sm">密码</label>
                <div class="flex justify-between">
                  <p class="text-sm">
                    {{ item?.showPassword ? item.password : '********' }}
                  </p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click="togglePasswordVisibility(item)"
                  >
                    <el-icon>
                      <component :is="item?.showPassword ? 'Hide' : 'View'" />
                    </el-icon>
                  </p>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="flex justify-center">
        <Pagination
          :total="20"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '@renderer/components/Pagination.vue'
import { ElMessage } from 'element-plus'
import { shallowRef, ref, computed, onMounted } from 'vue'

const searchPassword = ref('')

// 分页相关状态
const currentPage = shallowRef(1)
const pageSize = shallowRef(10)
// 计算分页后的密码列表
const paginatedPasswords = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return passwordList.value.slice(startIndex, endIndex)
})

// const handleSizeChange = (val: number): void => {
//   pageSize.value = val
//   currentPage.value = 1 // 重置页码
// }

// 当前页码改变
const handleCurrentChange = (val: number): void => {
  currentPage.value = val
  // 滚动到顶部（可选）
  // window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 目前使用假数据
const passwordList = ref([
  {
    id: 1,
    name: 'GitHub',
    category: '个人帐号',
    username: 'john.doe',
    password: '123456789',
    url: 'https://github.com',
    strength: '强',
    favorite: false,
    type: 'User'
  },
  {
    id: 2,
    name: 'Amazon',
    category: '购物帐号',
    username: 'john.doe@example.com',
    password: '123456789',
    url: 'https://amazon.com',
    strength: '中',
    favorite: true,
    type: 'Shop'
  },
  {
    id: 3,
    name: '公司邮箱',
    category: '工作帐号',
    username: 'john.doe@company.com',
    password: '123456789',
    url: 'https://mail.company.com',
    strength: '强',
    favorite: false,
    type: 'OfficeBuilding'
  },
  {
    id: 4,
    name: 'Steam',
    category: '游戏帐号',
    username: 'doe_gamer',
    password: '123456789',
    url: 'https://store.steampowered.com',
    strength: '强',
    favorite: true,
    type: 'Box'
  },
  {
    id: 5,
    name: 'Apple ID',
    category: '应用程序',
    username: 'john.doe@icloud.com',
    password: '123456789',
    url: 'https://appleid.apple.com',
    strength: '强',
    favorite: false,
    type: 'Phone'
  },
  {
    id: 6,
    name: 'Facebook',
    category: '网站账户',
    username: 'john.doe.567',
    password: '123456789',
    url: 'https://facebook.com',
    strength: '中',
    favorite: true,
    type: 'LocationInformation'
  },
  {
    id: 7,
    name: 'Google',
    category: '网站账户',
    username: 'john.doe@gmail.com',
    password: '123456789',
    url: 'https://google.com',
    strength: '强',
    favorite: false,
    type: 'Email'
  }
])
interface PasswordItem {
  id: number
  name: string
  category: string
  username: string
  password: string
  url: string
  strength: string
  favorite: boolean
  type: string
  showPassword: boolean
}
onMounted(() => {
  passwordList.value = passwordList.value.map((item) => ({
    ...item,
    showPassword: false
  }))
})
const togglePasswordVisibility = (item: PasswordItem): void => {
  item.showPassword = !item.showPassword
}
const toggleFavorite = (id: number): void => {
  const item = passwordList.value.find((item) => item.id === id)
  if (item) {
    // 实际请求后端接口更新数据库favorite字段, 并更新本地数据
    item.favorite = !item.favorite
    ElMessage.success(`${item.name} ${item.favorite ? '已添加到收藏夹' : '已从收藏夹移除'}`)
  }
}
const copyUsername = (username: string): void => {
  navigator.clipboard
    .writeText(username)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
:deep(.el-card__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.is-active {
  color: greenyellow;
}
</style>
