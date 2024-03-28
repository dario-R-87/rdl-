import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Navbar from "./components/navbar";
import CreateDocument from "./components/document/CreateDocument";
import Homepage from "./components/pages/Homepage";
import Login from "./components/pages/Login"
import ErrorPage from "./components/pages/ErrorPage";
import Footer from "./components/Footer";
import Documents from "./components/document/Documents";
import Details from "./components/pages/Details";

 const App = () => {
 return (
   <div>
     <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/nuovo" element={<CreateDocument />} />
        <Route path='/documenti' element={<Documents />} />
        <Route path='/docdett/:serial' element={<Details />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
     <Footer />
   </div>
 );
};
 export default App;