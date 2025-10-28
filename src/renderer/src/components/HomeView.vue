<template>
  <button @click="createUser">createUser</button>
  <br />
  <button @click="findAllUser">findAllUser</button>
  <br />
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/notfound">404</RouterLink>
</template>

<script setup lang="ts">
const createUser = async (): Promise<void> => {
  const res = await window.db.createUser({
    name: 'Alice',
    age: 0,
    hobby: 'Reading'
  })
  console.log('createUser:', res)
}
const findAllUser = async (): Promise<void> => {
  const res = await window.db.findAllUsers()
  const div = document.createElement('div')
  div.className = 'user-list'
  res.forEach((item) => {
    div.innerHTML += `<p>${JSON.stringify(item)}</p>`
  })
  if (!document.querySelector('.user-list')) {
    document.body.appendChild(div)
    console.log('不存在 user-list 元素，创建了一个新的 div 并添加到 body 中')
    return
  } else {
    console.log('存在 user-list 元素，不再创建新的 div')
  }
  console.log('111', import.meta.env.RENDERER_VITE_KEY) // 打印渲染进程环境变量
}
</script>

<style scoped></style>
