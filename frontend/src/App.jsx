import './App.css';
import Router from './Router';

const VIEWS = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin'
};

function App() {
  return <Router />;
}

export default App;
