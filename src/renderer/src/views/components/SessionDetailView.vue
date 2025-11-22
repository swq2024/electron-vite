<template>
  <BreadcrumbItem />
  <div>Session ID: {{ sessionId }}</div>
</template>

<script setup lang="ts">
import BreadcrumbItem from './BreadcrumbItem.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const sessionId = computed(() => route.params.id)
</script>

<style scoped></style>
