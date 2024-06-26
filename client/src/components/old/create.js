import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {

 const [form, setForm] = useState({
   name: "",
   surname: "",
   _id: "",
 });

 const navigate = useNavigate();

  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

  // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();   
    // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
   try{ console.log("eccomi prima fetch");
     await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
    });console.log("eccomi dopo fetch");

    setForm({name:"", surname:""});
    navigate("/");
   } catch (error) {console.log("sono dentro catch");
     console.error("Errore nella richiesta post:" ,error );
     window.alert(error);
     return;
   };

 }

  // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="surname">Surname</label>
         <input
           type="text"
           className="form-control"
           id="surname"
           value={form.surname}
           onChange={(e) => updateForm({ surname: e.target.value })}
         />
       </div>

       <div className="form-group">
         <input
           type="submit"
           value="Create person"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}