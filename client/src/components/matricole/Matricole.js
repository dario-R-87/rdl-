import  { useState, useEffect } from 'react';


const Matricole = ({serial, onLoadMat}) => {
    const [matricole, setMatricole] = useState([]);
    const [seriale, setSeriale] = useState("");

    const getMatricole = async () => {
        if(serial!==""){
            try {
                const response = await fetch(`http://192.168.1.29:5000/matricole/${serial.trim()}`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                let records = await response.json();
                console.log("records "+records.length)
                setMatricole(records);
                onLoadMat(records)
            } catch (error) {
                alert(error.message);
            }
        }   
    };

    useEffect(() => {
        setSeriale(serial);
        getMatricole();
    }, [serial]);
    console.log("componente matricole: "+matricole.length)
    console.log(seriale)

    // const test= ()=>{
    //     console.log(articoli.length)
    //     console.log(matricole.length)
    //     articoli.forEach((art)=>{
    //         const filter=matricole.filter((item) => {
    //             return (item.AMCODART.includes(art.CACODART))
    //             });
            
    //         console.log(art.CACODART+" "+filter.length)
    //     })


    // }

    return null;
}

export default Matricole
