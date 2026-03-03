import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import ProblemList from './pages/ProblemList';
import AssessmentRoom from './pages/AssessmentRoom';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<SeekerDashboard />} />
          <Route path="/topic/:topicId" element={<ProblemList />} />
          <Route path="/assessment/:problemId/:levelNumber" element={<AssessmentRoom />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
