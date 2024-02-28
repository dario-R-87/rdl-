import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


const Record = (props) => (
 <tr>
   <td>{props.record.DataInizio}</td>
   <td>{props.record.DataFine}</td>
 </tr>
);



export default function RecordList() {
 const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch("http://localhost:5000/record");
       //const response = await fetch(`http://localhost:3001/api`);
      if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
      const records = await response.json();
     setRecords(records);
   }
    getRecords();
    return;
 }, [records.length]);

  // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:5000/${id}`, {
     method: "DELETE"
   });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
    /*recordList();
    //navigate("/");
// eslint-disable-next-line no-restricted-globals
location.reload();*/

 }

  // This method will map out the records on the table
 function recordList() {
   return records.map((record) => {
     return (
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record.LottoId}
       />
     );
   });
 }

  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3 className="p-1">Elenco Lotti</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Data Inizio</th>
           <th>Data Fine</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}