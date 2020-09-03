let audioContext = new (window.AudioContext || window.webkitAudioContext)();


const bass = document.querySelector('bassdrum');
const snare = document.querySelector('snaredrum');
const hat = document.querySelector('hatdrum');
const oscillator = audioContext.createOscillator();

bass.addEventListener('click', function() {
    
})

/*
const bass = new Audio();
const snare = new Audio();
const hat = new Audio();

bass.src = "/sounds/ZenithD.wav";
snare.src = "/sounds/WildSnare.wav";
hat.src = "/sounds/Valkyr.wav";