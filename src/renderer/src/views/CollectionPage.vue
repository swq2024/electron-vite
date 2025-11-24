<template>
  <div class="collection-page">
    <!-- 顶部标题区 -->
    <div class="page-header">
      <div>
        <h2>我的收藏</h2>
      </div>
      <div>
        <el-button type="primary" plain @click="handleManageCollection">整理收藏</el-button>
      </div>
    </div>
    <el-divider content-position="left">查看您平时使用频次较高的密码</el-divider>

    <!-- 密码卡片区 -->
    <div v-if="collectedPasswords.length > 0" class="password-cards">
      <el-card
        v-for="item in collectedPasswords"
        :key="item.id"
        class="password-card"
        shadow="hover"
        :class="{ collected: true }"
      >
        <div class="card-header">
          <!-- 图标 -->
          <el-icon class="card-icon"><component :is="item.icon" /></el-icon>
          <!-- 名称 + 分类 -->
          <div>
            <h3>{{ item.name }}</h3>
            <el-tag size="small">{{ item.category }}</el-tag>
          </div>
          <!-- 收藏星标（已收藏，绿色） -->
          <el-icon
            class="star-icon"
            style="color: #52c41a; cursor: pointer"
            @click="handleToggleCollect(item)"
            ><StarFilled
          /></el-icon>
        </div>
        <div class="card-body">
          <!-- 用户名 -->
          <div class="field">
            <label>用户名</label>
            <span>{{ item.username }}</span>
          </div>
          <!-- 密码（隐藏+查看） -->
          <div class="field">
            <label>密码</label>
            <el-input type="password" :value="item.password" show-password disabled />
          </div>
          <!-- 复制操作 -->
          <div class="card-actions">
            <el-icon class="action-icon" style="cursor: pointer" @click="handleCopy(item.password)"
              ><DocumentCopy
            /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><Collection /></el-icon>
      <p>暂无收藏密码</p>
      <p>可在「所有密码」中点击星标添加收藏</p>
      <el-button type="text" @click="goToAllPasswords">前往所有密码</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StarFilled, DocumentCopy, Collection } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模拟收藏的密码数据
const collectedPasswords = ref([
  {
    id: 1,
    name: 'Amazon',
    category: '购物帐号',
    icon: 'ShoppingBag',
    username: 'john.doe@example.com',
    password: '********'
  },
  {
    id: 2,
    name: 'Steam',
    category: '游戏帐号',
    icon: 'Box',
    username: 'doe_gamer',
    password: '********'
  },
  {
    id: 3,
    name: 'Facebook',
    category: '网站账户',
    icon: 'Location',
    username: 'john.doe.567',
    password: '********'
  }
])

// 整理收藏操作
const handleManageCollection = () => {
  ElMessage.info('可批量取消收藏、排序等（实际项目中实现对应逻辑）')
}

// 切换收藏状态
const handleToggleCollect = (item) => {
  // 实际项目中调用接口取消收藏，这里模拟移除
  const index = collectedPasswords.value.findIndex((i) => i.id === item.id)
  if (index > -1) {
    collectedPasswords.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  }
}

// 复制密码
const handleCopy = async (password) => {
  await navigator.clipboard.writeText(password)
  ElMessage.success('密码已复制到剪贴板')
}

// 前往所有密码页
const goToAllPasswords = () => {
  ElMessage.info('跳转到「所有密码」页面（实际项目中通过路由跳转）')
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header h2 {
  font-weight: 600;
}
.page-header p {
  color: #666;
  margin-bottom: 16px;
}

.password-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 24px;
}
.password-card {
  border-radius: 8px;
  overflow: hidden;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.card-icon {
  font-size: 24px;
  color: #409eff;
  margin-right: 8px;
}
.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}
.star-icon {
  font-size: 18px;
}
.card-body {
  padding: 16px;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}
.field span {
  display: block;
}
.card-actions {
  text-align: right;
  margin-top: 12px;
}
.action-icon {
  font-size: 18px;
  color: #666;
}
.action-icon:hover {
  color: #409eff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #999;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.empty-state p {
  margin: 4px 0;
}
</style>
