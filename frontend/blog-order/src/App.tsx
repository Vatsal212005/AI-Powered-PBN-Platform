import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { DashboardLayout } from './components/DashboardLayout';
import GenBlogs from './pages/GenBlogs';
import EditBlogs from './pages/EditBlogs';
import ViewBlogs from './pages/ViewBlogs';
import CreateDomain from './pages/CreateDomain';
import ViewDomains from './pages/ViewDomains';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bloggen-ui-theme">
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<GenBlogs />} />
            <Route path="/edit" element={<EditBlogs />} />
            <Route path="/blogs" element={<ViewBlogs />} />
            <Route path="/domains/create" element={<CreateDomain />} />
            <Route path="/domains" element={<ViewDomains />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
