import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { nanoid } from 'nanoid';


const Record = (props) => (
 <tr>
   <td>{props.record.SERIAL}</td>
   <td>{props.record.TIPDOC}</td>
 </tr>
);



export default function RecordList() {
 const [records, setRecords] = useState([]);
 const [added, setAdded] = useState(false);
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
 }, [records.length,added]);

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
         key={nanoid()}
       />
     );
   });
 }

  async function addRecord() {
    // const record = {
    //   serial:'1234567892',
    //   tipdoc:'INVEN',
    //   datadoc:'2021-11-02 00:00:00.000',
    //   codart:'00024497            ',
    //   unimis:'n. ',
    //   quanti:1.000,
    //   codmat:'TRASF00003                              ',
    //   magpar:'1026 ',
    //   insuser:'690a10eb6bd3636a    ',
    //   rownum:3
    // };
    const record = {
      serial:'1234567893',
      tipdoc:'TEST1',
      datadoc:'2021-11-02',
      codart:'00024497',
      unimis:'n.',
      quanti:1,
      codmat:'TRASF00003',
      magpar:'1026',
      insuser:'690a10eb6bd3636a',
      rownum:3
    };
    try {
      await fetch("http://localhost:5000/record/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });
      setAdded(!added)
    } catch (error) {
      console.error("Errore nella richiesta post:", error);
      window.alert(error);
      return;
    };
  }

  // This following section will display the table with the records of individuals.
 return (
   <div>
    <button onClick={addRecord}>AGGIUNGI RECORD</button>
     <h3 className="p-1">HRI__ZUAPPAHR</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>serial</th>
           <th>tipdoc</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}