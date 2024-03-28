import { useEffect } from 'react'

const TimerRefresh = () => {

    const timer = () => {
            let idleTimer;

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(refreshPage, 30 * 60 * 1000); // 30 minuti
    }

    function refreshPage() {
        window.location.reload();
    }

    // Inizializza il timer di inattività
    resetIdleTimer();

    // Aggiungi gli eventi per reimpostare il timer quando l'utente interagisce con la pagina
    //document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    }

    useEffect(()=>{timer();},[])
}

export default TimerRefresh
