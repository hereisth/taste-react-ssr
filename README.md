# React SSR Counter Demo

一个简单的 React 服务器端渲染（SSR）示例，实现了 Counter 组件的 SSR 和客户端水合。

## 项目结构

```
├── src/
│   ├── Counter.jsx          # Counter 组件
│   ├── client.jsx           # 客户端水合入口
│   └── server.jsx           # 服务器端渲染入口
├── server/
│   └── index.js             # Express 服务器
├── template.html            # HTML 模板
├── vite.config.js           # Vite 构建配置
├── package.json
└── README.md
```

## React SSR 工作原理

### 整体架构

```
客户端请求 → Express服务器 → 服务器端渲染 → 返回HTML → 客户端水合 → 交互功能激活
```

### SSR 工作流程

#### 1. 服务器接收请求
```javascript
// server/index.js
app.get('/', (req, res) => {
  // SSR 处理逻辑
});
```

#### 2. 服务器端渲染
```javascript
// src/server.jsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Counter from './Counter';

export default function render() {
  return ReactDOMServer.renderToString(<Counter />);
}
```

`renderToString` 的作用：
- 将 React 组件转换为 HTML 字符串
- 生成静态的初始 HTML
- 包含组件的初始状态（count: 0）

#### 3. HTML 模板填充
```javascript
// server/index.js
const ssrContent = render();
const template = fs.readFileSync(path.join(__dirname, '../template.html'), 'utf-8');
const html = template.replace('{{SSR_CONTENT}}', ssrContent);
res.send(html);
```

生成的 HTML 结构：
```html
<div id="root">
  <div>
    <h1>Counter</h1>
    <p>Count: 0</p>
    <button>-1</button>
    <button>+1</button>
  </div>
</div>
<script type="module" src="/dist/client.js"></script>
```

#### 4. 浏览器接收并渲染
- 浏览器接收完整的 HTML 文档
- 快速显示静态内容（首屏渲染快）
- 开始加载客户端 JavaScript

#### 5. 客户端水合
```javascript
// src/client.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from './Counter';

ReactDOM.hydrateRoot(document.getElementById('root'), React.createElement(Counter));
```

`hydrateRoot` 的作用：
- 复用服务器端生成的 DOM 节点
- 为现有的 DOM 添加事件监听器
- 激活 React 的响应式系统
- 使组件变得可交互

### 水合过程详解

#### 水合前的状态
```html
<!-- 静态 HTML -->
<div id="root">
  <div>
    <h1>Counter</h1>
    <p>Count: 0</p>
    <button>-1</button>  <!-- 没有点击事件 -->
    <button>+1</button>  <!-- 没有点击事件 -->
  </div>
</div>
```

#### 水合后的状态
```javascript
// React 内部结构
{
  type: 'div',
  props: {
    children: [
      { type: 'h1', props: { children: 'Counter' } },
      { type: 'p', props: { children: 'Count: 0' } },
      { type: 'button', props: { onClick: decrement, children: '-1' } },
      { type: 'button', props: { onClick: increment, children: '+1' } }
    ]
  }
}
```

## 关键技术要点

### SSR 的优势
1. **首屏加载快**：用户立即看到内容
2. **SEO 友好**：搜索引擎可以抓取完整的 HTML
3. **社交分享优化**：分享链接时显示完整内容

### 水合的要求
1. **DOM 结构一致性**：服务器端和客户端必须生成相同的 DOM 结构
2. **组件定义一致性**：服务器端和客户端使用相同的组件定义
3. **初始状态一致性**：确保水合时的状态与服务器端渲染时一致

### 常见问题和解决方案

#### 1. 水合失败
**问题**：服务器端和客户端渲染不匹配
**解决方案**：确保组件定义和渲染逻辑完全一致

#### 2. 组件重命名问题
**问题**：构建工具优化导致组件名称变化
**解决方案**：使用 `React.createElement()` 而不是 JSX 语法

#### 3. 事件处理
**问题**：静态 HTML 缺少事件监听器
**解决方案**：通过水合过程添加事件监听器

## 完整的工作时序

1. 用户发起请求
2. Express 服务器接收请求
3. 服务器端执行 `ReactDOMServer.renderToString()`
4. 生成静态 HTML 字符串
5. 填充 HTML 模板
6. 返回完整 HTML 文档给客户端
7. 浏览器渲染静态 HTML（用户看到内容）
8. 加载客户端 JavaScript
9. 执行 `ReactDOM.hydrateRoot()`
10. 激活事件监听器和响应式系统
11. 组件变得可交互

## 与传统 CSR 的对比

### CSR (Client-Side Rendering)
```
请求 → 加载空 HTML → 加载 JS → React 渲染 → 显示内容
```

### SSR (Server-Side Rendering)
```
请求 → 加载完整 HTML → 立即显示 → 水合 → 激活交互
```

## 安装和运行

### 安装依赖
```bash
npm install
```

### 构建客户端代码
```bash
npm run build:client
```

### 启动开发服务器
```bash
npm start
```

### 访问应用
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 技术栈

- **React 18** - 用于构建用户界面
- **Express** - Node.js Web 服务器框架
- **Vite** - 构建工具和开发服务器
- **ReactDOMServer** - 服务器端渲染
- **ReactDOM** - 客户端渲染和水合
