import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import BoardPage from './pages/BoardPage.jsx'
import Progress from './pages/Progress.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
