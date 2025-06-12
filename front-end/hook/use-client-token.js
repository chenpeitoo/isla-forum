import { useEffect, useState } from 'react'

export function useClientToken() {
    const [token, setToken] = useState(null)

    useEffect(() => {
        // 只在客戶端執行
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('jwtToken')
            setToken(storedToken)
        }
    }, [])

    return token // 如果沒登入會是 null
}
