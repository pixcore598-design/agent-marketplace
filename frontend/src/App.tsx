import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AgentMarketPage from './pages/AgentMarketPage';
import AgentDetailPage from './pages/AgentDetailPage';
import TaskListPage from './pages/TaskListPage';
import TaskCreatePage from './pages/TaskCreatePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agents" element={<AgentMarketPage />} />
            <Route path="/agents/:id" element={<AgentDetailPage />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/create" element={<TaskCreatePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;