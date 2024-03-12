import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Navbar from "./components/navbar";
import Main from "./components/main/Main"
import CreateDocument from "./components/document/CreateDocument";

 const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<Main />} />
       <Route path="/nuovo" element={<CreateDocument />}/>
     </Routes>
   </div>
 );
};
 export default App;