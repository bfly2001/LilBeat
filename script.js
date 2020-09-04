let audioContext = new (window.AudioContext || window.webkitAudioContext)();


const bass = document.querySelector('bassdrum');
const snare = document.querySelector('snaredrum');
const hat = document.querySelector('hatdrum');
const synth = document.getElementById('synth');
const oscillator = audioContext.createOscillator();
oscillator.type = 'triangle';

synth.addEventListener('click', function() {
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.25);
});

/*
const bass = new Audio();
const snare = new Audio();
const hat = new Audio();

bass.src = "/sounds/ZenithD.wav";
snare.src = "/sounds/WildSnare.wav";
hat.src = "/sounds/Valkyr.wav";*/  