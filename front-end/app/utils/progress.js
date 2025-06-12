import NProgress from 'nprogress'

// NProgress 設定選項
NProgress.configure({
  minimum: 0.3, // 最小百分比
  easing: 'ease', // CSS 動畫緩動函數
  speed: 500, // 動畫速度(毫秒)
  showSpinner: true, // 是否顯示轉圈圖示
  trickleSpeed: 200, // 自動增量速度(毫秒)
  parent: '#nprogress-container', // 可選，指定父容器
})

export default NProgress
