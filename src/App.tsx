

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Pages/Home/Home'
import Profile from './Components/Pages/Profile/Profile'
import Register from './Components/Pages/Register/Register'
import Login from './Components/Pages/Login/Login'
import Notfound from './Components/Pages/Notfound/Notfound';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthcontextProvider from './Context/AuthContext';import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import GuestRoute from './Components/ProtectedRoute/GuestRoute'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import PostDetails from './Components/Pages/PostDetalis/PostDetails'
import Notifications from './Components/Pages/Notifications/Notifications'
import UserProfile from './Components/Pages/Userprofile/UserProfile'
import ChangePassword from './Components/Pages/changepassword/ChangePassword'
import About from './Components/about&service/About'
import Service from './Components/about&service/Service'
const query = new QueryClient()

export const routers = createBrowserRouter([
{
 path: "" ,
  element : <Layout/> ,
  children: [
{index : true , element : <ProtectedRoute> <Home/></ProtectedRoute> } ,
{path : "home" , element : <ProtectedRoute><Home/> </ProtectedRoute> } ,
{path : "profile" , element : <ProtectedRoute><Profile/> </ProtectedRoute>  } ,
{path : "postdetails/:id" , element : <ProtectedRoute><PostDetails/> </ProtectedRoute>  } ,
{path : "notifications" , element : <ProtectedRoute><Notifications/> </ProtectedRoute>  } ,
{path: "profile/:id",element: <ProtectedRoute>  <UserProfile /> </ProtectedRoute>},
{path: "/change-password",element: <ProtectedRoute>  <ChangePassword/></ProtectedRoute>},
{path : "Register" , element : <GuestRoute><Register/></GuestRoute> } ,
{path : "login" , element : <GuestRoute><Login/></GuestRoute> } ,
{path : "about" , element : <About/> } ,
{path : "service" , element : <Service/> } ,
{path : "*" , element : <Notfound/> } ,

  ],

},

]);

export default function App() {
  return (
    <>
    <QueryClientProvider client={query}>
    <AuthcontextProvider >
  
       <RouterProvider router = {routers}></RouterProvider>
    <ToastContainer position="bottom-center" autoClose={3000} />
   
   </AuthcontextProvider>
</QueryClientProvider>
      </>
    
  )
}
