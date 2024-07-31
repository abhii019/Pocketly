
import './App.css';

import {BrowserRouter as Router, Route , Routes} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import SignupSignin from './pages/SignupSignin';
function App() {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path ="/" element = {<SignupSignin />} />
        <Route path = "/dashboard" element = {<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
