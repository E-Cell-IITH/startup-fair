import { useContext } from "react"
import { AuthContext } from "../services/AuthProvider"

const MainPage = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user } = authContext;

  return (
    <div className="App">
      <b>hi {user?.name}</b>
    </div>
  )
}

export default MainPage
