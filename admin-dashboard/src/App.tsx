import { useNavigate } from 'react-router'

function App() {
  let navigate = useNavigate();
  
  setTimeout(() => {navigate('/login')}, 2500)

  return <div>
    <h1>Redirecting...</h1>
  </div>
}

export default App
