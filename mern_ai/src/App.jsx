// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import SideBar from './component/SideBar/SideBar'
// import {Routes,Route} from 'react-router-dom';
// import Dashboard from './component/Dashboard/Dashboard'
// import History from './component/History/History'
// import Admin from './component/Admin/Admin'
// import Login from './component/Login/Login'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <div className='App'>
//       <SideBar />
//       <Routes>
//         <Route path='/' element={<Login />}/>
//         <Route path='/dashboard' element={<Dashboard/>} />
//         <Route path='/history' element={<History />} />
//         <Route path='/admin' element={<Admin />} />
//
//       </Routes>
//     </div>
//   )
// }
//
// export default App

import './App.css'
import SideBar from './component/SideBar/SideBar'
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'

function App() {
    const location = useLocation();
    const showSidebar = location.pathname !== '/';

    return (
        <div className='App'>
            {showSidebar && <SideBar />}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/history' element={<History />} />
                <Route path='/admin' element={<Admin />} />
            </Routes>
        </div>
    )
}

export default App