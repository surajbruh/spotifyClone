async function getPlaylistData() {
    let x = await fetch(`http://192.168.0.102:3000/playlists/`);
    let playlistData = await (x.text());
    return playlistData;
}

async function playlistDataMain() {
    let data = await (getPlaylistData());

    let dummyDIv = document.createElement('div');
    dummyDIv.innerHTML = data;

    let hrefList = []
    for (const element of dummyDIv.getElementsByTagName('a')) {
        if ((element.href).includes('playlist')) {
            hrefList.push(element.href)

        }
    }

    let songFolderList = []
    hrefList.forEach(async (e) => {
        songFolderList.push(e.split('/playlists/')[1])

    })


    async function addPlaylist(params) {


        for (let index = 0; index < songFolderList.length; index++) {
            const songPlaylist = songFolderList[index];

            let x = await fetch(`http://192.168.0.102:3000/playlists/${songPlaylist}/info.json`)
            let response = await (x.json())

            let cardDiv = document.createElement('div')
            cardDiv.className = 'swiper-slide'
            cardDiv.setAttribute('data-playlistInfo', `${songPlaylist}`)
            cardDiv.innerHTML = `<div class="slide-cover">
                                    <img src="http://192.168.0.102:3000/playlists/${songPlaylist}/cover.jpg"
                                        alt="">
                                </div>
                                <div class="slideInfo">
                                    <h3 class="title">${response.title}</h3>
                                    <p class="description">${response.description}</p>
                                </div>`
            document.querySelector('.swiper-wrapper').prepend(cardDiv)
        }

        // console.log(document.querySelectorAll('.swiper-slide'))
        document.querySelectorAll('.swiper-slide').forEach((e) => {
            // console.log(e.getAttribute('data-playlistInfo'))
            e.addEventListener('click', () => {
                document.querySelector(`.library`).innerHTML = ''
                let playlistInfo = e.getAttribute('data-playlistInfo')
                main(playlistInfo)
                openPlaylist()
            })
        })
    }
    addPlaylist()
}
playlistDataMain()

let menuFlag = 0;

function openPlaylist() {

    if (document.body.clientWidth <= 1200) {
        let libraryCon = document.querySelector('.library');
        if (menuFlag === 0) {
            libraryCon.style.left = '0';
            menuFlag = 1;
        } else {
            libraryCon.style.left = '-500px';
            menuFlag = 0;
        }
    }
}

let menuIcon = document.getElementById('menu');
menuIcon.addEventListener('click', () => {
    openPlaylist()
});

// let con = document.querySelector('.container')
// con.addEventListener('click', ()=>{
//     if((document.body.clientWidth <= 600 && menuFlag === 1)){
//         openPlaylist()
//     }
// })

function mute() {
    let volumeIcon = document.getElementById('volume_up');
    let volume = document.getElementById('volumeBar')
    let click = 0;
    volumeIcon.addEventListener('click', () => {
        if (click == 0) {
            currentTrack.volume = 0;
            volume.setAttribute('value', 0);
            click = 1;
        }
        else {
            currentTrack.volume = 0.5;
            volume.setAttribute('value', 50);
            click = 0;
        }

    })
}
mute()

function skipNextPrevious() {
    document.getElementById('skipNextButton').addEventListener('click', () => {
        if (currentIndex + 1 < currentPlaylist.length) {
            currentIndex++;
            playTrack(currentPlaylist[currentIndex]);
        }
    });

    document.getElementById('skipPreviousButton').addEventListener('click', () => {
        if (currentIndex - 1 >= 0) {
            currentIndex--;
            playTrack(currentPlaylist[currentIndex]);
        }
    });
}
skipNextPrevious();
