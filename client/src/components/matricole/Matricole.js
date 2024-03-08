import React, { useState, useEffect } from 'react';


const Matricole = () => {
    const [matricole, setMatricole] = useState([]);
    const [loading, setLoading] = useState(false);

    const getMatricole = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://192.168.1.29:5000/matricole");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();

            setMatricole(records);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getMatricole();
    }, []);


    const [articoli, setArticoli] = useState([]);


    const getArticoli = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://192.168.1.29:5000/articoli");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            let records = await response.json();
            setArticoli(records);
            setLoading(false);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        getArticoli();

    }, []);

    const test= ()=>{
        console.log(articoli.length)
        console.log(matricole.length)
        articoli.forEach((art)=>{
            const filter=matricole.filter((item) => {
                return (item.AMCODART.includes(art.CACODART))
                });
            
            console.log(art.CACODART+" "+filter.length)
        })


    }

    return (
        <div>
                <button onClick={test}>test</button>
        </div>
    )
}

export default Matricole
