import {
  LayoutGrid,
  WalletCards,
  Warehouse,
  MessageCircleHeart,
  Users,
  MonitorPlay,
} from 'lucide-react'

export function getMenuList(pathname) {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: '主頁',
          icon: LayoutGrid,
        },
      ],
    },
    {
      groupLabel: '管理',
      menus: [
        {
          href: '/products',
          label: '商品管理',
          icon: Warehouse,
          submenus: [
            {
              href: '/products',
              label: '商品列表',
            },
            {
              href: '/products/add',
              label: '新增商品',
            },
          ],
        },
        {
          href: '/courses',
          label: '課程管理',
          icon: MonitorPlay,
        },
        {
          href: '/coupons',
          label: '優惠卷管理',
          icon: WalletCards,
          submenus: [
            {
              href: '/coupons/products',
              label: '商品優惠券',
            },
            {
              href: '/coupons/courses',
              label: '課程優惠券',
            },
            {
              href: '/coupons/add',
              label: '新增優惠券',
            },
          ],
        },
      ],
    },
  ]
}
