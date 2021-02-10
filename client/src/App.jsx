import Router from "./pages/Router"
import { useAuth } from "./contexts/auth.context";

const App = () => {
  const { loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return (
    <Router />
  )
}

export default App
