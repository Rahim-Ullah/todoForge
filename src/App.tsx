
import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./Context/theme-provider"
import LoginPage from "./pages/Loginpage"
import SignupPage from "./pages/Signuppage"
import HomePage from "./pages/HomePage"
import Dashboard  from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicRoute from "./routes/PublicRoute"



const App = () => {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <Routes>
        
        <Route path='/' element={<PublicRoute />} >
          <Route index element={<HomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/dashboard" element=
            {<ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>}
          />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
    
    </>
  )
}

export default App
