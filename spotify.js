console.log('Java Script');
let songs;
let currFolder;
let currSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00/00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1]);   //************* 
        }
    }
    // console.log(songs)
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
            <path
                d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
        </svg>
        <div class="info">
            <div class="name">${song.replaceAll("%20", " ")}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512">
            <path fill="black"
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />

    </li>`
    }
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio=new Audio(""+track); 
    currSong.src = `${currFolder}` + track;        //****************
    if (!pause) {
        currSong.play()
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div)
    let anchors = div.getElementsByTagName("a");
    // console.log(anchors)
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if (e.href.includes("/songs") && (!e.href.includes(".htaccess"))) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response);
        let cardContainer=document.querySelector(".cards");
        cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
        <div class="play"> <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                viewBox="0 0 384 512">
                <path fill="white"
                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="">
        <div class="title flex">
            <h4>${response.title}</h4>
            <p>${response.description}</p>
        </div>
    </div>`
        }
        let card = document.querySelectorAll(".card");
    // console.log(card)
    let cardArr = Array.from(card);
    for (let i = 0; i < cardArr.length; i++) {
        cardArr[i].addEventListener("mouseover", () => {
            cardArr[i].firstElementChild.style.opacity = 1;
            cardArr[i].firstElementChild.style.bottom = "100px";
        })
        cardArr[i].addEventListener("mouseout", () => {
            cardArr[i].firstElementChild.style.opacity = 0;
            cardArr[i].firstElementChild.style.bottom = "61px";
        })
    }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}/`);
            playMusic(songs[0])

        })
    })
}

async function main() {
    await getSongs("/songs/testSongs/");
    playMusic(songs[0], true)

    await displayAlbums()

    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    let wrongBtn = document.querySelector("#wrong-svg");
    wrongBtn.addEventListener("click", () => {
        document.querySelector('.left').style.left = "-110%";
    })
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            play.src = "pause.svg";
        }
        else {
            currSong.pause();
            play.src = "play.svg";
        }
    })
    currSong.addEventListener("timeupdate", () => {
        let currTime = currSong.currentTime;
        let duration = currSong.duration;
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currTime).split(".")[0]}/${secondsToMinutesSeconds(duration).split(".")[0]}`
        document.querySelector(".circle").style.left = (currTime / duration) * 100 + "%";
    })
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = ((currSong.duration) * percent) / 100;

    })
    previous.addEventListener("click", () => {
        currSong.pause()
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currSong.pause()
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    document.querySelector(".seekbar2").addEventListener("change", (e) => {
        currSong.volume = parseInt(e.target.value) / 100;
    })
    document.querySelector("#volume").addEventListener("click",(e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currSong.volume= 0;
            document.querySelector(".seekbar2").value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currSong.volume=.10;
            document.querySelector(".seekbar2").value=10;
        }
    }))
}
main()