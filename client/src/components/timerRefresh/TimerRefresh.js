import { useEffect } from 'react'

const TimerRefresh = () => {

    const timer = () => {
            let idleTimer;

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(refreshPage, 60 * 60 * 1000); // 60 minuti
        // console.log("timer resettato: ")
        localStorage.setItem("loginTime",new Date().getTime());
    }

    function refreshPage() {
        window.location.reload();
    }

    // Inizializza il timer di inattività
    resetIdleTimer();

    // Aggiungi gli eventi per reimpostare il timer quando l'utente interagisce con la pagina
    document.addEventListener('click', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    }

    useEffect(()=>{timer();},[])
}

export default TimerRefresh
