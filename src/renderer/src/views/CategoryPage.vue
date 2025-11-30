<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">我的分类</h2>
      </div>

      <div><el-button type="primary" plain @click="openDrawer(false)"> 新建分类</el-button></div>
      <el-drawer
        ref="drawerRef"
        v-model="drawerVisible"
        :title="isEditMode ? '编辑分类' : '新建分类'"
        direction="rtl"
        size="35%"
        :destroy-on-close="true"
      >
        <el-form
          ref="drawerFormEl"
          :model="drawerForm"
          :rules="rules"
          label-position="top"
          :show-message="false"
          label-width="auto"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="drawerForm.name" placeholder="请输入分类名称" />
          </el-form-item>

          <el-form-item label="图标">
            <el-select v-model="drawerForm.icon" placeholder="请选择图标">
              <el-option
                v-for="iconName in COMMON_CATEGORY_ICONS"
                :key="iconName"
                :label="iconName"
                :value="iconName"
              >
                <div class="flex items-center space-x-2">
                  <el-icon :size="16" class="mr-2">
                    <component :is="iconName" />
                  </el-icon>
                  <span>{{ iconName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="颜色">
            <div class="flex items-center space-x-2">
              <el-color-picker
                v-model="drawerForm.color"
                size="small"
                show-alpha
                :predefine="predefineColors"
              />
              <span>{{ drawerForm.color }}</span>
            </div>
          </el-form-item>

          <el-form-item label="默认分类">
            <el-switch v-model="drawerForm.isDefault" disabled />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="flex: auto">
            <el-button @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit(drawerFormEl)">
              {{ isEditMode ? '保存修改' : '新建分类' }}
            </el-button>
          </div>
        </template>
      </el-drawer>
      <el-drawer></el-drawer>
    </div>
    <el-divider content-position="left">分类和管理您的密码</el-divider>

    <div>
      <el-table :data="categoryStore.categoryList" style="width: 100%">
        <el-table-column prop="name" label="分类名称" align="center" width="200">
          <template #default="{ row }">
            <div class="flex justify-start items-center space-x-2 ml-8">
              <el-icon :color="row.color">
                <component :is="row.icon"></component>
              </el-icon>
              <p class="truncate w-20">{{ row.name }}</p>
              <el-tag v-if="row.isDefault" class="ml-1">默认</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="" align="center" />
        <el-table-column prop="" label="" align="center" />
        <el-table-column label="操作" align="center" width="200">
          <template #default="{ row }">
            <el-tooltip
              :content="row.isDefault ? '已设置为默认分类' : '设置为默认分类'"
              effect="light"
            >
              <el-button
                :disabled="row.isDefault"
                type="warning"
                text
                icon="WindPower"
                @click="setDefault(row.id)"
              ></el-button>
            </el-tooltip>
            <el-button type="primary" text icon="Edit" @click="openDrawer(row)"></el-button>
            <el-button
              type="danger"
              text
              icon="Delete"
              :disabled="row.isDefault"
              @click="handleDelete(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@renderer/stores/category'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { COMMON_CATEGORY_ICONS } from '@renderer/constants/commonIcons'

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
const categoryStore = useCategoryStore()

const drawerVisible = ref(false)
const isEditMode = ref(false)
const drawerFormEl = useTemplateRef<FormInstance | null>('drawerFormEl')

const drawerForm = ref({
  id: '',
  name: '',
  icon: 'Folder', // 默认图标
  color: 'rgba(255, 69, 0, 0.68)', // 默认颜色
  isDefault: false // 默认为非默认分类
})

const rules = reactive<FormRules<CategoryForm>>({
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  icon: [{ required: false }],
  color: [{ required: false }],
  isDefault: [{ required: false }]
})

const openDrawer = (categoryItem): void => {
  if (categoryItem) {
    isEditMode.value = true
    drawerForm.value = { ...categoryItem }
  } else {
    isEditMode.value = false
    drawerForm.value = {
      id: '',
      name: '',
      icon: 'Folder',
      color: 'rgba(170, 163, 161, 0.68)',
      isDefault: false
    }
  }
  drawerVisible.value = true
}

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleSubmit = (formEl: FormInstance | null): void => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const payload = { ...drawerForm.value }

        if (isEditMode.value) {
          await categoryStore.updateCategory(payload.id, payload)
          ElMessage.success('编辑成功')
        } else {
          await categoryStore.createCategory(payload)
          ElMessage.success('新建成功')
        }

        drawerVisible.value = false
        // 刷新列表
        await categoryStore.fetchCategories()
      } catch (error) {
        ElMessage.error('操作失败')
        console.error(error)
      }
    }
  })
}

const handleDelete = (id: string): void => {
  ElMessageBox.confirm('确定删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await categoryStore.deleteCategory(id)
      ElMessage.success('删除成功')
    })
    .catch((error) => {
      if (error === 'cancel') {
        ElMessage('已取消删除')
      } else {
        ElMessage.error('删除失败')
        console.error(error)
      }
    })
}

const setDefault = (id: string): void => {
  ElMessageBox.confirm('确定设置该分类为默认分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await categoryStore.setDefaultCategory(id)
      ElMessage.success('设置成功')
    })
    .catch((error) => {
      if (error === 'cancel') {
        ElMessage('已取消设置')
      } else {
        ElMessage.error('设置失败')
        console.error(error)
      }
    })
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
