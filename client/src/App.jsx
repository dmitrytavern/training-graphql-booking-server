import Apollo from "./providers/ApolloProvider"
import AuthProvider from "./providers/AuthProvider"
import Router from "./pages/Router"

const App = () => {
  return (
    <Apollo>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Apollo>
  )
}

export default App
