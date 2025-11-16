# 经过isUnauthorizedError 条件判断后，为什么要使originalRequest._retry = true?

好的，这个问题的核心，其实是**如何防止在并发请求下，重复执行“刷新 Token”这个昂贵的操作**。

给 `originalRequest._retry = true` 赋值，是实现这个目标的关键一步。

### 核心目的：防止重复刷新 Token

我们来想象一个场景：

1.  用户打开了一个页面，这个页面需要同时发起两个 API 请求：`/api/user-info` 和 `/api/notifications`。
2.  此时，用户的 `accessToken` 已经过期了。
3.  两个请求几乎同时到达后端，后端都返回了 `401 Unauthorized` 错误。
4.  这两个失败的请求几乎同时进入了你的响应拦截器。

**如果没有 `_retry` 标记，会发生什么？**

*   **请求A** 进入拦截器，判断 `isUnauthorizedError` 为 `true`（因为 `_retry` 是 `undefined`，即 `!undefined` 为 `true`）。
*   **请求A** 看到 `authStore.isRefreshing` 是 `false`，于是它开始调用 `authStore.refreshAccessToken()` 来刷新 Token。同时，它会把 `authStore.isRefreshing` 设为 `true`。
*   就在 **请求A** 的刷新操作还在进行中时，**请求B** 也进入了拦截器。
*   **请求B** 也判断 `isUnauthorizedError` 为 `true`（因为它自己的 `_retry` 也是 `undefined`）。
*   **请求B** 也会检查 `authStore.isRefreshing`，发现它已经是 `true`了。所以，**请求B** 会乖乖地把自己加入到 `failedQueues` 队列中，等待新 Token 刷新完毕后再重试。

**到目前为止，一切似乎都很正常。** 虽然两个请求都进入了拦截器，但只有一个请求触发了刷新操作，另一个被加入了队列。

但是，**当 `authStore.refreshAccessToken()` 成功后，会发生什么？**

*   刷新成功后，`authStore.isRefreshing` 会被设回 `false`。
*   然后，代码会调用 `processQueue` 函数，用新的 Token 去重试队列里等待的所有请求，这其中就包括 **请求B**。

**问题就在这里：**

当 **请求B** 被重试时，它会再次发起一个新的 HTTP 请求。这个新的请求同样会经过响应拦截器。如果这个重试请求再次因为某种原因（虽然概率很小，但并非不可能）失败并返回 `401`，它会再次进入 `isUnauthorizedError` 的判断逻辑。

**如果 `_retry` 没有被设置为 `true`，那么：**

*   这个重试的 **请求B** 的 `_retry` 依然是 `undefined`。
*   `isUnauthorizedError` 会再次返回 `true`。
*   它会再次检查 `authStore.isRefreshing`，发现是 `false`。
*   于是，它会**再次**触发 `authStore.refreshAccessToken()`，进行一次完全不必要的、重复的 Token 刷新。

这就是一个典型的**竞态条件（Race Condition）**问题。

### `_retry = true` 是如何解决这个问题的？

现在，我们来看加上 `originalRequest._retry = true` 之后的流程：

1.  **请求A** 进入拦截器，`isUnauthorizedError` 判断为 `true`。
2.  在调用 `authStore.refreshAccessToken()` **之前**，代码执行了 `originalRequest._retry = true`。
3.  然后 **请求A** 开始刷新 Token。
4.  **请求B** 进入拦截器，发现 `authStore.isRefreshing` 是 `true`，于是把自己加入队列。
5.  Token 刷新成功，`processQueue` 开始重试队列中的 **请求B**。
6.  **请求B** 被重试，它带着新的 Token 发起了请求。
7.  **关键点**：如果这个重试的 **请求B** 再次失败并进入拦截器：
    *   `isUnauthorizedError` 判断时，会检查 `!originalRequest._retry`。
    *   但此时，**请求B** 的 `_retry` 属性已经被设置为 `true` 了。
    *   所以 `!originalRequest._retry` 这个条件就变成了 `!true`，也就是 `false`。
    *   整个 `isUnauthorizedError` 的判断结果为 `false`，**请求B** 不会再进入 Token 刷新的逻辑，而是直接将错误 `reject` 出去。

**简单来说：**

`originalRequest._retry = true` 是给**每一个因为 Token 过期而失败的原始请求**打上一个“已处理”或“正在处理”的标记。

这个标记向拦截器表明：“我这个请求已经因为 Token 过期而触发过一次刷新流程了，请不要再为我触发第二次。如果我再次失败，那很可能是新的 Token 也有问题，或者是其他原因，应该直接报错。”

### 总结

`originalRequest._retry = true` 的作用是：

**防止同一个请求在重试的过程中，因为再次失败而重复触发 Token 刷新逻辑，从而避免不必要的网络请求和潜在的无限循环。**

它和 `authStore.isRefreshing` 配合工作：
*   `authStore.isRefreshing`：是一个**全局锁**，防止在同一时间有多个不同的请求触发刷新。
*   `originalRequest._retry`：是一个**请求级别的标记**，防止同一个请求在重试时被重复处理。

两者结合，构成了一个健壮、高效的 Token 刷新机制。