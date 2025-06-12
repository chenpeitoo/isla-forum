// hooks/useRatingSummary.js
import { useMemo } from 'react'

export default function useRatingSummary(reviews = []) {
  const avgStar = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, cur) => acc + Number(cur.star || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews])

  const starCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((r) => {
      const star = Math.round(r.star || 0)
      if (counts[star] !== undefined) counts[star] += 1
    })
    return counts
  }, [reviews])

  return { avgStar, starCounts, total: reviews.length }
}
