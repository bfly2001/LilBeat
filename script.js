let audioContext = new (window.AudioContext || window.webkitAudioContext)();


const bass = document.getElementById('bassdrum');
const snare = document.getElementById('snaredrum');
const hat = document.getElementById('hatdrum');
const synth = document.getElementById('synth');
const drums = document.querySelectorAll('.drum');

function playBass() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 100;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
}

function playSnare() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 300;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
}

function playHat() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 500;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
}

function playSynth() {
    let audioContext = new AudioContext();
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 150;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(0.1);
    audioContext.resume();
}

bass.addEventListener('click', function() {
    playBass();
});

snare.addEventListener('click', function() {
    playSnare();
});

hat.addEventListener('click', function() {
    playHat();
});

synth.addEventListener('click', function() {
    playSynth();
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

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({note: beatNumber, time: time});

    if (pads[0].querySelectorAll('button)[currentNote].getAttribute('aria-checked') === 'true') {
        playBass();
    }
    if (pads[1].querySelectorAll('button)[currentNote].getAttribute('aria-checked') === 'true') {
        playSnare();
    }
    if (pads[2].querySelectorAll('button)[currentNote].getAttribute('aria-checked') === 'true') {
        playHat();
    }
    if (pads[3].querySelectorAll('button)[currentNote].getAttribute('aria-checked') === 'true') {
        playSynth();
    }
}

