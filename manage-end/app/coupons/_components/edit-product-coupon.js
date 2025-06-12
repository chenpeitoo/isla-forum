'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import dayjs from 'dayjs'
import {
  Checkbox,
  CheckboxGroup,
  CheckboxField,
  Description,
} from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function EditProductCoupon({
  coupon,
  onChange,
  onCancel,
  onSave,
  brands = [],
  categories = [],
  types = [],
}) {
  return (
    <div className="space-y-4">
      {/* 名稱 */}
      <div>
        <label className="block mb-1">名稱</label>
        <Input
          value={coupon.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </div>

      {/* 優惠券類型 */}
      <div>
        <label className="block mb-1">優惠券類型</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={coupon.type_id ?? ''}
          onChange={(e) =>
            onChange(
              'type_id',
              e.target.value ? parseInt(e.target.value) : null
            )
          }
        >
          <option value="" disabled>
            請選擇
          </option>
          {types?.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* 說明 */}
      <div>
        <label className="block mb-1">說明</label>
        <Input
          value={coupon.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>

      {/* 品牌 */}
      <div>
        <label className="block mb-1">品牌</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={
            coupon.brand_id !== null && coupon.brand_id !== undefined
              ? String(coupon.brand_id)
              : '0'
          }
          onChange={(e) =>
            onChange(
              'brand_id',
              e.target.value === '' ? 0 : parseInt(e.target.value)
            )
          }
        >
          <option value="">無限制</option>
          {brands?.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* 種類 */}
      <div>
        <label className="block mb-1">種類</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={
            coupon.category_id !== 0 && coupon.category_id !== undefined
              ? String(coupon.category_id)
              : '0'
          }
          onChange={(e) =>
            onChange(
              'category_id',
              e.target.value === '' ? null : parseInt(e.target.value)
            )
          }
        >
          <option value="">無限制</option>
          {categories?.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 根據 type_id 顯示不同欄位 */}
      {coupon.type_id === 1 && (
        // 滿額券: 顯示折扣金額
        <div>
          <label className="block mb-1">折扣金額</label>
          <Input
            type="number"
            value={coupon.amount ?? ''}
            onChange={(e) =>
              onChange(
                'amount',
                e.target.value === '' ? '' : parseInt(e.target.value)
              )
            }
          />
        </div>
      )}

      {coupon.type_id === 2 && (
        // 折扣券: 顯示折扣率
        <div>
          <label className="block mb-1">折扣率 (0 ~ 1)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={coupon.discount_rate ?? ''}
            onChange={(e) =>
              onChange(
                'discount_rate',
                e.target.value === '' ? '' : parseFloat(e.target.value)
              )
            }
          />
        </div>
      )}

      {coupon.type_id === 3 && (
        // 免運券: 顯示勾選選項
        <CheckboxGroup>
          <CheckboxField>
            <div className="flex items-start gap-3">
              <Checkbox
                className="mt-[2px]"
                checked={coupon.free === 1}
                onCheckedChange={(checked) => onChange('free', checked ? 1 : 0)}
              />
              <div className="leading-tight">
                <Label className="text-sm font-medium">免運</Label>
              </div>
            </div>
            <Description className="text-muted-foreground text-sm">
              使用此優惠券可享免運服務
            </Description>
          </CheckboxField>
        </CheckboxGroup>
      )}

      {/* 最低金額 */}
      <div>
        <label className="block mb-1">最低金額</label>
        <Input
          type="number"
          value={coupon.min_amount ?? ''}
          onChange={(e) =>
            onChange(
              'min_amount',
              e.target.value === '' ? '' : parseInt(e.target.value)
            )
          }
        />
      </div>

      {/* 最低數量 */}
      <div>
        <label className="block mb-1">最低數量</label>
        <Input
          type="number"
          value={coupon.min_quantity ?? ''}
          onChange={(e) =>
            onChange(
              'min_quantity',
              e.target.value === '' ? '' : parseInt(e.target.value)
            )
          }
        />
      </div>

      {/* 到期日 */}
      <div>
        <label className="block mb-1">到期日</label>
        <Input
          type="date"
          value={
            coupon.valid_to ? dayjs(coupon.valid_to).format('YYYY-MM-DD') : ''
          }
          onChange={(e) => onChange('valid_to', e.target.value)}
        />
      </div>

      {/* 儲存 / 取消 按鈕 */}
      <DialogFooter className="sticky bottom-0 bg-white pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={onSave}>儲存變更</Button>
      </DialogFooter>
    </div>
  )
}
