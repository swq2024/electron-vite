<template>
  <el-tabs
    v-model="activeTab"
    type="border-card"
    class="settings-tabs"
    @tab-change="handleTabChange"
  >
    <el-tab-pane name="profile">
      <template #label>
        <span class="custom-tabs-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"
            />
          </svg>

          <span>基础资料</span>
        </span>
      </template>
      <ProfileView />
    </el-tab-pane>
    <el-tab-pane name="security"
      ><template #label>
        <span class="custom-tabs-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21 11c0 5.55-3.84 10.74-9 12c-5.16-1.26-9-6.45-9-12V5l9-4l9 4zm-9 10c3.75-1 7-5.46 7-9.78V6.3l-7-3.12z"
            />
          </svg>

          <span>安全设置</span>
        </span>
      </template>
      <SecurityView />
    </el-tab-pane>
    <el-tab-pane name="appearance"
      ><template #label>
        <span class="custom-tabs-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5A1.5 1.5 0 0 1 14.5 5A1.5 1.5 0 0 1 16 6.5A1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5A1.5 1.5 0 0 1 9.5 5A1.5 1.5 0 0 1 11 6.5A1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5A1.5 1.5 0 0 1 6.5 9A1.5 1.5 0 0 1 8 10.5A1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9a9 9 0 0 0 9 9a1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1c-.23-.27-.38-.62-.38-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8"
            />
          </svg>

          <span>外观主题</span>
        </span>
      </template>

      <AppearanceView />
    </el-tab-pane>
    <el-tab-pane name="options">
      <template #label>
        <span class="custom-tabs-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 6H4V4h16zm-1 6c-1.91 0-3.63.76-4.89 2H14v.11c-1.24 1.26-2 2.98-2 4.89c0 .34.03.67.08 1H4v-6H3v-2l1-5h16l1 5v.3c-.63-.19-1.3-.3-2-.3m-7 2H6v4h6zm11.8 6.4c.1 0 .1.1 0 .2l-1 1.7c-.1.1-.2.1-.3.1l-1.2-.4c-.3.2-.5.3-.8.5l-.2 1.3c0 .1-.1.2-.2.2h-2c-.1 0-.2-.1-.3-.2l-.2-1.3c-.3-.1-.6-.3-.8-.5l-1.2.5c-.1 0-.2 0-.3-.1l-1-1.7c-.1-.1 0-.2.1-.3l1.1-.8v-1l-1.1-.8c-.1-.1-.1-.2-.1-.3l1-1.7c.1-.1.2-.1.3-.1l1.2.5c.3-.2.5-.3.8-.5l.2-1.3c0-.1.1-.2.3-.2h2c.1 0 .2.1.2.2l.2 1.3c.3.1.6.3.9.5l1.2-.5c.1 0 .3 0 .3.1l1 1.7c.1.1 0 .2-.1.3l-1.1.8v1zM20.5 19c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5"
            />
          </svg>

          <span>高级选项</span>
        </span>
      </template>
      <OptionsView />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileView from './components/ProfileView.vue'
import SecurityView from './components/SecurityView.vue'
import AppearanceView from './components/AppearanceView.vue'
import OptionsView from './components/OptionsView.vue'

const activeTab = ref(localStorage.getItem('settingsActiveTab') || 'profile')

const handleTabChange = (tabName: string): void => {
  localStorage.setItem('settingsActiveTab', tabName)
}
</script>

<style scoped>
.settings-tabs .custom-tabs-label svg {
  vertical-align: middle;
}
.settings-tabs .custom-tabs-label span {
  vertical-align: middle;
}
</style>
