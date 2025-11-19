<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <div class="cursor-pointer" @click="appStore.changeAsideWidth">
          <el-icon v-if="appStore.asideWidth === '180px'" :size="24"><Fold /></el-icon>
          <el-icon v-else :size="24"><Expand /></el-icon>
        </div>
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
        <el-col v-for="item in passwordList" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card>
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
            <div class="">
              <div class="field">
                <label>用户名</label>
                <p>{{ item.username }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const appStore = useAppStore()
const searchPassword = ref('')

const passwordList = ref([
  {
    id: 1,
    name: 'GitHub',
    category: '个人帐号',
    username: 'john.doe',
    password: '********',
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
    password: '********',
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
    password: '********',
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
    password: '********',
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
    password: '********',
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
    password: '********',
    url: 'https://facebook.com',
    strength: '中',
    favorite: true,
    type: 'LocationInformation'
  }
])

const toggleFavorite = (id: number): void => {
  console.log(id)
  ElMessage(`toggle ${id}`)
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
