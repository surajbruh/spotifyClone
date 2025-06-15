let currentPlaylist = [];
let currentIndex = 0;

function searchBarClose() {
    const input = document.getElementById(`searchInput`);
    const closeIcon = document.getElementById(`close`);

    input.addEventListener('click', () => {

        setInterval(() => {
            if (input.value != '') {
                closeIcon.style.opacity = 1;
            }
            else {
                closeIcon.style.opacity = 0;
            }

        }, 250);
    })

    closeIcon.addEventListener('click', () => {
        input.value = '';
        closeIcon.style.opacity = 0;
    })

}
searchBarClose()

function mySwiper() {
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
mySwiper()

let flag = 0;

function PlayBar() {
    let playPause = document.querySelector('.playPause')

    let playButton = document.getElementById(`playButton`);
    let pauseButton = document.getElementById(`pauseButton`);


    playPause.addEventListener('click', () => {
        if (flag == 0) {
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
            flag = 1;
        }
        else {
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            flag = 0;

        }
    })
}
PlayBar()


function addToPlaylist() {
    let addToPlaylist = document.querySelector('.addToPlaylist')

    let add_circle = document.getElementById(`add_circle`);
    let check_small = document.getElementById(`check_small`);

    let flag = 0;

    addToPlaylist.addEventListener('click', () => {
        if (flag == 0) {
            add_circle.style.display = 'none';
            check_small.style.display = 'block';
            addToPlaylist.style.backgroundColor = 'green';
            flag = 1;
        }
        else {
            add_circle.style.display = 'block';
            check_small.style.display = 'none';
            addToPlaylist.style.backgroundColor = 'transparent';

            flag = 0;
        }
    })
}
addToPlaylist()

let targetData = 'http://192.168.0.102:3000/songs/';

function generateSongList(array) {
    let songList = []

    for (const aElement of array) {
        if (aElement.href.endsWith('mp3')) {
            songList.push(aElement.href)
        }
    }
    return songList
}

function cleanSongUrl(info) {
    const extractSongInfo = (url) => {
        try {
            const decoded = decodeURIComponent(url);
            const fileName = decoded.split('/').pop(); // Get file name
            const cleaned = fileName
                .replace(/\.(mp3|mp4)$/i, '') // Remove extension
                .replace(/\[.*?\]|\(.*?\)/g, '') // Remove [Official Video] etc.
                .replace(/_/g, ' ') // Replace underscores with spaces
                .trim();

            const [artist, song] = cleaned.split(' - ').map(str => str.trim());

            return { artist: artist || 'Unknown', song: song || 'Unknown' };
        } catch (err) {
            return { artist: 'Unknown', song: 'Unknown' };
        }
    };
    const results = info.map(extractSongInfo);
    return results;
}

function getData(folderName) {
    const songNames = {
        'Beats': ['JAIZ (1).mp3', 'DENYm.mp3'],
        'playlist1': ['Don Toliver - No Pole [Official Music Video].mp3', 'Metro Boomin, Don Toliver, Future - Too Many Nights (Official Video).mp3'],
        'playlist2': ['relax1.mp3', 'relax2.mp3']
    };

    const basePath = `playlists/${folderName}/`;
    return songNames[folderName].map(name => basePath + name);
}
main('Beats');

let currentTrack = new Audio();

async function main(folder) {
    let info = await (getData(folder))

    currentPlaylist = info;
    let results = cleanSongUrl(info)

    let counter = 0;

    results.forEach((songInfo) => {
        let artistName = songInfo['artist']
        let songName = songInfo['song']

        let trackDiv = document.createElement('div')
        trackDiv.className = 'track';
        trackDiv.setAttribute('data-songURL', `${info[counter]}`)
        trackDiv.innerHTML = `<div class="trackCover">
                                    <img src="trackCover.svg" alt="">
                                </div>
                                <div class="trackInfo">
                                    <h3 class="songName" >${songName}</h3>
                                    <h3 class="artistName">${artistName}</h3>
                                </div>`
        document.querySelector(`.library`).prepend(trackDiv)
        counter++
    })

    // ✅ Now the tracks are added, we can safely read attributes
    const tracks = document.querySelectorAll('.track');
    // console.log(tracks)

    tracks.forEach(track => {
        track.addEventListener('click', () => {
            let trackUrl = track.getAttribute('data-songURL');
            currentIndex = currentPlaylist.indexOf(trackUrl);
            playTrack(trackUrl);

            document.querySelector('#trackName').innerHTML = track.querySelector('.songName').innerHTML;
            document.querySelector('#trackArtist').innerHTML = track.querySelector('.artistName').innerHTML;
        });

    });

}
main()



function playTrack(track) {
    currentTrack.src = track;
    currentTrack.play();

    document.getElementById('playButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block';
    flag = 1;

    // Optional: update UI if currentPlaylist is active
    if (currentPlaylist.length) {
        const info = cleanSongUrl([track])[0];
        document.getElementById('trackName').innerText = info.song;
        document.getElementById('trackArtist').innerText = info.artist;
    }
}



function playPause() {
    document.querySelector('.playPause').addEventListener('click', () => {
        if (currentTrack.paused) {
            currentTrack.play()
        }
        else {
            currentTrack.pause()
        }

    })
}
playPause()

function volumeControl() {
    const volumeBar = document.getElementById("volumeBar");
    currentTrack.volume = volumeBar.value / 100;

    volumeBar.addEventListener('input', () => {
        currentTrack.volume = volumeBar.value / 100;
    })
}
volumeControl()


function formatTime(secondsFloat) {
    const minutes = Math.floor(secondsFloat / 60);
    const seconds = Math.floor(secondsFloat % 60);
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
}

let durationBar = document.getElementById('durationBar');

// Update track time when slider is used (based on %)
durationBar.addEventListener('input', (e) => {
    let percent = e.target.value;
    if (currentTrack.duration) {
        let newTime = (percent / 100) * currentTrack.duration;
        currentTrack.currentTime = newTime;
    }
});

currentTrack.addEventListener('timeupdate', () => {
    let percent = (currentTrack.currentTime / currentTrack.duration) * 100;

    document.getElementById('currentTime').innerHTML = formatTime(currentTrack.currentTime);
    document.getElementById('totalDuration').innerHTML = formatTime(currentTrack.duration);

    document.getElementById('durationBar').value = percent;
});

let clickFlag = 0; // initial state

const trackInfos = document.getElementsByClassName('trackInfo');
const library = document.querySelector('.library');

if (document.body.clientWidth > 1200) {
    for (const element of trackInfos) {
        element.style.display = 'block';
    }
    library.style.position = ''; // or restore original value
    library.style.width = '';    // or restore original value
}
else {

    
    document.querySelector('.topbar-library > span').addEventListener('click', () => {
        let libraryContainer = document.querySelector('.library-container')
        
        if (clickFlag === 0) {
            libraryContainer.style.zIndex = 98;
            for (const element of trackInfos) {
                element.style.display = 'none';
            }
            library.style.position = 'relative';
            library.style.width = '100%';
            clickFlag = 1;
        } else {
            libraryContainer.style.zIndex = '';
            for (const element of trackInfos) {
                element.style.display = 'block';
            }
            library.style.position = ''; // or restore original value
            library.style.width = '';    // or restore original value
            clickFlag = 0;
        }
    });


}
