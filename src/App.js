import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import store from './redux/store';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/Routes/Private';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* These become a protected (nested) route. it will first check the condition in Private & then we will display the dashboard component. */}
        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='' element={<Dashboard />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/*' element={<PageNotFound />} />
        {/* '/*' is used when none of other paths are not found */}
      </Routes>
    </Provider>
  );
}

export default App;
