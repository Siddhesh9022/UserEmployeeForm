import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' ;
import './App.css'
import Home from './components/Home';
import UserForm from './components/UserForm';
import EmployeeForm from './components/EmployeeForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  

  return (
    <>
    <ToastContainer/>

    <Router>
      <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/userForm" element={<UserForm/>} />
         <Route path="/employeeForm" element={<EmployeeForm/>} />
         

      </Routes>



    </Router>

</>

  )
}

export default App
