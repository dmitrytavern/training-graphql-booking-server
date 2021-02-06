import { AuthContext } from "./contexts/auth.context"
import useAuth from "./hooks/auth.hook"

import Router from "./pages/Router"

const App = () => {
  const {
    autoAuth,
    isAuth,
    login,
    logout
  } = useAuth()

  return (
    <AuthContext.Provider value={{autoAuth, isAuth, login, logout}}>
      <Router />
    </AuthContext.Provider>
  )
}

export default App;
