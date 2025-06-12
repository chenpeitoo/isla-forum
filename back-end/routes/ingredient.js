import express from 'express'
import db from '../config/mysql.js'

const router = express.Router()

router.get('/search', async (req, res) => {
  const query = req.query.q?.trim() || ''
  if (query.length < 1) {
    return res.json([])
  }

  try {
    const sqlQuery = `
      SELECT 
        ingredient_id, 
        name 
      FROM 
        ingredients 
      WHERE 
        LOWER(name) LIKE LOWER(?) 
      LIMIT 20;
    `
    const queryParam = `%${query}%`
    const [ingredients] = await db.query(sqlQuery, [queryParam])

    const formattedIngredients = ingredients.map((ingredient) => ({
      value: ingredient.ingredient_id,
      label: ingredient.name,
    }))
    res.json(formattedIngredients)
  } catch (error) {
    console.error('[API_INGREDIENTS_SEARCH_ERROR]', error)
    res.status(500).json({ message: '搜尋成分時發生伺服器錯誤' })
  }
})

export default router
