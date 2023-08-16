// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from 'src/store/apps/currentUser'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import { API } from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)
const storageTokenKeyName = 'accessToken'

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(storageTokenKeyName)
      if (storedToken) {
        try {
          setLoading(true)

          const response = await API.get('/user', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })

          const handledResponse = {
            id: response.data.id,
            role: 'admin',
            password: response.data.password,
            fullName: response.data.name,
            username: response.data.username,
            email: response.data.email
          }
          if (response) {
            setLoading(false)
            setUser({ ...handledResponse })
          }
        } catch (error) {
          ;(function () {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })()
        }
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    try {
      const response = await API.post('/login', params)

      if (params.rememberMe) {
        window.localStorage.setItem(storageTokenKeyName, response.data.token)
        window.localStorage.setItem('userData', JSON.stringify(response.data.user))
      }

      const returnUrl = router.query.returnUrl

      const handledResponse = {
        id: response.data.id,
        role: 'admin',
        password: response.data.password,
        fullName: response.data.name,
        username: response.data.username,
        email: response.data.email
      }
      setUser({ ...handledResponse })
      dispatch(setCurrentUser(response.data))

      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

      router.replace(redirectURL)
    } catch (err) {
      if (errorCallback) errorCallback(err)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
