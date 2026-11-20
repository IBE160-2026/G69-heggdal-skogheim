// Kjøres i <head> før første tegning, så siden ikke blinker hvit når maskinen står
// i mørk modus. Skriptet leser bare maskinens innstilling og lagrer ingenting (NFR-1).
// Uten JavaScript blir temaet lyst. Egen fil uten "use client", så layout kan bruke strengen.
export const TEMA_SKRIPT =
  'try{if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}';
