/*
    =================================================
     Timer - contador de tempo
 =================================================
    */
function countdown(startDateString, endDateString) {
  const output = document.querySelector(".contador");

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const now = new Date().getTime();

  if (now < startDate.getTime()) {
    const distance = startDate.getTime() - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    output.innerText = `O evento começa em
${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (now < endDate.getTime()) {
    const distance = endDate.getTime() - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    output.innerText = `O evento termina em
${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    output.innerText = "Evento finalizado";
  }
}