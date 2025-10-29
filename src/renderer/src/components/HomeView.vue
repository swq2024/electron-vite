<template>
  <button @click="ipcSend1">ipcSend1</button>
  <br />
  <button @click="ipcSend2">ipcSend2</button>
  <br />
  <label for="setTitle">Title:</label>
  <input id="setTitle" v-model="title" @input="ipcSetTitle(title)" />
  <p>输入标题的时候，会发现渲染进程的标题随之改变。</p>
  <br />
  <button @click="ipcInvoke">ipcInvoke</button>
  <br />
  <p>
    <span>Current Value: </span>
    <em>{{ counterValue }}</em>
  </p>
  <hr />
  <button @click="createUser">createUser</button>
  <br />
  <button @click="findAllUser">findAllUser</button>
  <br />
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/notfound">404</RouterLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// No args to send
const ipcSend1 = (): void => window.electron.ipcRenderer.send('ping1')
// Send a message to the main process with no response
const ipcSend2 = (): void => window.electron.ipcRenderer.send('electron:say', 'Hello from renderer')

// Send a message to the main process with the response asynchronously
const ipcInvoke = async (): Promise<void> => {
  const res = await window.electron.ipcRenderer.invoke('electron:doAThing', 'Say something')
  console.log(res)
}
const title = ref<string>('')
const ipcSetTitle = (title: string): void => window.api.setTitle(title)
const counterValue = ref<number>(0)
window.api.onUpdateCounter((val) => {
  counterValue.value += val
  console.log('current val:', counterValue.value)

  window.api.outCounterValue(counterValue.value)
})

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

<style scoped>
hr {
  margin: 20px;
  border: 2px solid #ccc;
  width: 50vw;
}
</style>
