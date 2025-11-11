# electron-app

An Electron application with Vue and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Create a new project
```bash
$ npm create @quick-start/electron
```
### 目录结构
![alt text](68a8bc30cc780873adf0b78cb61d7a9d.png)

### 目录说明
![alt text](a7b3a00639b53038d3bfc6eb3d1c9ca8.png)

### electron-vite
- [electron-vite](https://github.com/alex8088/electron-vite)
- [中文文档](https://cn.electron-vite.org/guide/)

举个生活中的例子去理解nextTick：
就像**"等菜炒完再尝味道"**：

你加了盐（修改数据），不能立刻尝（此时菜还没拌匀），得等锅铲翻炒完（DOM更新完成），再尝才知道最终味道（最新DOM状态）。

nextTick就是那个"等翻炒完"的动作。