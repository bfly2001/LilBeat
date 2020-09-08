let audioContext = new (window.AudioContext || window.webkitAudioContext)();


const bass = document.getElementById('bassdrum');
const snare = document.getElementById('snaredrum');
const hat = document.getElementById('hatdrum');
const synth = document.getElementById('synth');

bass.addEventListener('click', function() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 100;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
});

snare.addEventListener('click', function() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 300;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
});

hat.addEventListener('click', function() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 500;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
});

synth.addEventListener('click', function() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 150;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
});

//scheduling
let tempo = 60.0;
const bpmControl = document.querySelector('#bpm');
const bpmValEl = document.querySelector('#bpmval');

bpmControl.addEventListener('input', ev => {
    tempo = Number(ev.target.value);
    bpmValEl.innerText = tempo;
}, false);

const lookahead = 25.0;//how frequently to call the scheduling function in ms
const scheduleAheadTime = 0.1;// how far ahead to schedule audio in seconds

let currentNote = 0;//the note we are currently playing
let nextNoteTime = 0.0;//when the next note is due
function nextNote() {
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat;//add beat length to beat time

    //advance the beat number, wrap to 0
    currentNote++;
    if (currentNote === 4) {
        currentNote = 0;
    }
}

// Create a queue for the notes that are to be played, with the current time that we want them to play:
const notesInQueue = [];

