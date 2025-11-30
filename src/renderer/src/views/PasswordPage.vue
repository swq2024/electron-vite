<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">所有密码</h2>
      </div>

      <div><el-button type="primary" plain @click="openDrawer(false)"> 新建密码</el-button></div>
      <el-drawer
        v-model="drawerVisible"
        :title="isEditMode ? '编辑密码' : '新建密码'"
        direction="rtl"
        size="40%"
        :destroy-on-close="true"
        :resizable="true"
      >
        <el-form
          ref="drawerFormEl"
          :model="drawerForm"
          :rules="rules"
          label-position="top"
          label-width="auto"
          :show-message="false"
        >
          <el-form-item label="分类">
            <el-select v-model="currentCategoryId" placeholder="默认分类" clearable>
              <el-option
                v-for="category in categoryStore.categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="名称" prop="title">
            <el-input v-model="drawerForm.title" />
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input v-model="drawerForm.username" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="drawerForm.password" show-password> </el-input>
          </el-form-item>

          <el-form-item label="URL" prop="url">
            <el-input v-model="drawerForm.url" />
          </el-form-item>

          <el-form-item label="备注" prop="notes">
            <el-input v-model="drawerForm.notes" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="drawer-footer">
            <el-button @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit(drawerFormEl)">
              {{ isEditMode ? '更新' : '提交' }}
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>

    <el-divider content-position="left">管理和查看您存储的所有密码</el-divider>

    <div class="flex justify-between">
      <div class="flex-1 mr-1">
        <el-input
          v-model="searchPassword"
          clearable
          placeholder="搜索密码..."
          @change="handleSearch"
        >
          <template #prepend>
            <el-button icon="Search" @click="handleSearch(searchPassword)" />
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
        <el-col
          v-for="item in pwdStore.passwordList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="mb-4" shadow="never">
            <template #header>
              <div class="flex items-center space-x-2">
                <el-icon :size="28" color="skyblue">
                  <component :is="item.category.icon"></component>
                </el-icon>
                <div>
                  <p class="text-sm font-bold truncate w-18">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ item.category.name }}</p>
                </div>
              </div>

              <div class="flex">
                <div @click="debounceToggleFavorite(item)">
                  <el-button
                    v-if="item.isFavorite"
                    text
                    icon="StarFilled"
                    class="is-active"
                    size="small"
                  ></el-button>
                  <el-button v-else text icon="Star" size="small"></el-button>
                </div>
                <div>
                  <el-button text icon="Edit" size="small" @click="openDrawer(item)"></el-button>
                </div>
                <div>
                  <el-button
                    text
                    icon="Delete"
                    size="small"
                    @click="deletePassword(item.id)"
                  ></el-button>
                </div>
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
          :total="pwdStore.total"
          :current-page="pwdStore.currentPage"
          :page-size="pwdStore.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '@renderer/components/Pagination.vue'
import { useCategoryStore } from '@renderer/stores/category'
import { usePwdStore } from '@renderer/stores/password'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { ref, onMounted, useTemplateRef, reactive } from 'vue'

const pwdStore = usePwdStore()
const categoryStore = useCategoryStore()

const searchPassword = ref('')

const handleCurrentChange = async (val: number): Promise<void> => {
  pwdStore.currentPage = val
  await pwdStore.getPasswordList()
}

onMounted(async () => {
  await pwdStore.getPasswordList()
  await categoryStore.fetchCategories()
})
const togglePasswordVisibility = (item): void => {
  item.showPassword = !item.showPassword
}
const toggleFavorite = async (item): Promise<void> => {
  if (item) {
    await pwdStore.toggleFavorite(item.id)
    ElMessage.success(`${item.title} ${item.isFavorite ? '取消收藏' : '已添加到收藏夹'}`)
  }
}
const debounceToggleFavorite = useDebounceFn(toggleFavorite, 200)

const handleSearch = async (keyword: string): Promise<void> => {
  await pwdStore.getPasswordList({
    search: keyword
  })
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

const drawerVisible = ref(false)
const isEditMode = ref(false)
const drawerFormEl = useTemplateRef<FormInstance | null>('drawerFormEl')
const drawerForm = ref({
  id: '',
  title: '',
  username: '',
  password: '',
  url: '',
  notes: ''
})
const currentCategoryId = ref('')
const rules = reactive<FormRules<PasswordForm>>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  url: [{ required: false }],
  notes: [{ required: false }]
})
const openDrawer = async (passwordItem): Promise<void> => {
  if (passwordItem) {
    isEditMode.value = true
    drawerForm.value = { ...passwordItem }
    currentCategoryId.value = passwordItem.category.id
  } else {
    isEditMode.value = false
    drawerForm.value = {
      id: '',
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    }
    currentCategoryId.value = ''
  }
  drawerVisible.value = true
}
const handleSubmit = (formEl: FormInstance | null): void => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await pwdStore.updatePassword(drawerForm.value.id, {
            ...drawerForm.value,
            categoryId: currentCategoryId.value
          })
          ElMessage.success('更新成功')
        } else {
          await pwdStore.createPassword(drawerForm.value)
          ElMessage.success('创建成功')
        }
      } catch (error) {
        ElMessage.error('保存失败')
        console.error(error)
      } finally {
        drawerVisible.value = false
      }
    }
  })
}

const deletePassword = async (id: string): Promise<void> => {
  try {
    await pwdStore.deletePassword(id)
    ElMessage.success('已移入回收站')
  } catch (error) {
    ElMessage.error('移入回收站失败')
    console.error(error)
  }
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
  padding: 20px 12px 20px;
}
.is-active {
  color: gold;
}
</style>
