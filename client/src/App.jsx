import { AuthContext } from "./contexts/auth.context"
import useAuth from "./hooks/auth.hook"

import Router from "./pages/Router"

const App = ({ apolloSetterToken }) => {
  const {
    user,
    autoAuth,
    isAuth,
    login,
    logout
  } = useAuth(apolloSetterToken)

  return (
    <AuthContext.Provider value={{user, autoAuth, isAuth, login, logout}}>
      <Router />
    </AuthContext.Provider>
  )
}

export default App;
