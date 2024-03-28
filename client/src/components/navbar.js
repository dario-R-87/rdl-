import React from "react";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 // We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 // Here, we display our Navbar
import "./navbar.css";

export default function Navbar() {
 return (

     <nav className="navbar navbar-expand-lg navbar-light bg-primary fixed-top mb-5">
       <NavLink className="navbar-brand" to="/">
         <img style={{"width" : 25 + '%'}} src="/zutec_logo.png" alt="logo"></img>
       </NavLink>
     </nav>

 );
}