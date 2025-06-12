## 加入購物車 API 使用說明

### 📌 API 路徑

```
POST /api/cart-items/create
```

### 1. 使用說明

加入購物車功能為登入會員限定。請在登入狀態下，將 JWT token 從 localStorage 取出，並透過 `fetch` 搭配 `JSON` 格式送出資料。

---

### 2. 基本串接步驟

```js
const handleAddToCart = async () => {
  const token = localStorage.getItem("jwtToken");

  try {
    const res = await fetch("http://localhost:3005/api/cart-items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: 109129, // 或 course_id / course_experience_id
        quantity: 1,
        color_id: 114, // 有色號才需要傳
      }),
    });

    const data = await res.json();
    console.log("加入成功：", data);
  } catch (err) {
    console.error("加入購物車失敗：", err);
  }
};
```

---

### 3. 支援參數（擇一傳入）

| 欄位名稱               | 型別 | 必填 | 說明                 |
| ---------------------- | ---- | ---- | -------------------- |
| `product_id`           | int  | ⭕️  | 加入商品時傳入       |
| `course_id`            | int  | ⭕️  | 加入一般課程時傳入   |
| `course_experience_id` | int  | ⭕️  | 加入體驗課程時傳入   |
| `quantity`             | int  | ❌   | 預設為 1             |
| `color_id`             | int  | ❌   | 商品有選色功能時傳入 |

> 三種 id（product_id / course_id / course_experience_id）請擇一傳入，不可同時存在

---

### 📌 範例按鈕綁定方式

```jsx
<button onClick={handleAddToCart}>加入購物車</button>
```

---

### 成功回應格式

```json
{
  "status": "success",
  "message": "成功加入購物車"
}
```

---

### 再次提醒

- 本 API 給商品及課程的加入購物車功能一起共用，柴跟 Abby 在串接時根據內容類型傳入對應參數(看這裡-> 2. 基本串接步驟)
- 請確保登入狀態並帶入 token 才會呼叫成功
