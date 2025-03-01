let audioContext = new (window.AudioContext || window.webkitAudioContext)();


const bass = document.querySelectorAll('.bassDrum');
const snare = document.querySelectorAll('.snareDrum');
const hat = document.querySelectorAll('.hatDrum');
const synth = document.querySelectorAll('.synthDrum');
const drums = document.querySelectorAll('.drums');
const allDrums = document.querySelectorAll('.drum');

console.log(drums);

bass.forEach(el => {
    el.addEventListener('click', () => {
        playBass();
    })
})

snare.forEach(el => {
    el.addEventListener('click', () => {
        playSnare();
    })
})

hat.forEach(el => {
    el.addEventListener('click', () => {
        playHat();
    })
})

synth.forEach(el => {
    el.addEventListener('click', () => {
        playSynth();
    })
})

allDrums.forEach(el => {
    el.addEventListener('click', () => {
        if (el.getAttribute('aria-checked') === 'false') {
            el.setAttribute('aria-checked', 'true');
        } else {
            el.setAttribute('aria-checked', 'false');
        }
    }, false)
})

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

async function getFile(audioContext, filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

function playSample(AudioContext, audioBuffer) {
    const sampleSource = audioContext.createBuffer();
    sampleSource.buffer = AudioBuffer;
    sampleSource.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
    sampleSource.connect(AudioContext.destination)
    sampleSource.start();
    return sampleSource;
}

async function setupSample() {
    const filePath = 'Valkyr.wav';
    const sample = await getFile(audioContext, filePath);
    return sample;
}

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
let dtmf;

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({note: beatNumber, time: time});

    if (drums[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playBass();
    }
    if (drums[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playSnare();
    }
    if (drums[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playHat();
    }
    if (drums[3].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true') {
        playSynth();
    }
}

let timerID;
    function scheduler() {
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentNote, nextNoteTime);
            nextNote();
        }
        timerID = window.setTimeout(scheduler, lookahead);
    }

    let lastNoteDrawn = 3;
    function draw() {
        let drawNote = lastNoteDrawn;
        const currentTime = audioContext.currentTime;

        while (notesInQueue.length && notesInQueue[0].time < currentTime) {
            drawNote = notesInQueue[0].note;
            notesInQueue.splice(0,1);
        }

        if (lastNoteDrawn !== drawNote) {
            drums.forEach(el => {
                el.children[lastNoteDrawn].style.borderColor = 'hsla(0,0%,10%,1)';
                el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
            });

            lastNoteDrawn = drawNote;
        }
        requestAnimationFrame(draw);
    }

    const loadingEl = document.querySelector('.loading');
    const playbutton = document.querySelector('[data-playing]');
    let isPlaying = false;
    setupSample()
        .then((sample) => {
            loadingEl.style.display = 'none';

            dtmf = sample;

            playbutton.addEventListener('click', ev => {
                isPlaying = !isPlaying;

                if (isPlaying) {

                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }

                    currentNote = 0;
                    nextNoteTime = audioContext.currentTime;
                    scheduler();
                    requestAnimationFrame(draw);
                    ev.target.dataset.playing = 'true'; 
                } else {
                    window.clearTimeout(timerID);
                    ev.target.dataset.playing = 'false';
                }
            })
        });

