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

  <button @click="getIndexData">getIndexData</button>

  <hr />

  <div v-for="article in articleList" :key="article.id">
    <span>{{ article.content }}</span>
  </div>

  <TestError />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import servers from '@renderer/utils/request'
import TestError from './TestError.vue'

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
interface IArticle {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
const articleList = ref<IArticle[]>([])
const getArticleData = async (): Promise<void> => {
  try {
    const res = await servers.get('/article')
    articleList.value = res.data.data.articles
      .map((item: IArticle) => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          createdAt: new Date(item.createdAt).toLocaleString(),
          updatedAt: new Date(item.updatedAt).toLocaleString()
        }
      })
      .filter((item: IArticle) => item.title.includes('98'))
  } catch (error) {
    console.error(error)
  }
}
getArticleData()
const getIndexData = async (): Promise<void> => {
  try {
    const res = await servers.get('/')
    console.log(res.data.message)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
hr {
  margin: 20px;
  border: 2px solid #ccc;
  width: 50vw;
}
</style>
