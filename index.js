let currentsong = new Audio();
let songs;
let currentFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`/${folder}/`);
  // console.log(await a.text());
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);
  let as = div.getElementsByTagName("a");
  console.log(as);
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); //this will give me array of two so take the second element after "/songs/"
    }
  }

  //show all the list in the playlist
  let songUL = document.querySelector(".songList").querySelector(".ul"); //or getElementByTagName("ul")[0] means first ul element of this tagname inside songlist
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
       <li>
       <img class="invert" src="/img/music.svg" alt="" />
       <div class="info">
         <div style="font-size: small">${song.replaceAll("%20", " ")}</div>
         <div>Shivam</div>
       </div>
       <div class="playnow">
         <span>Play Now</span>
         <img class="invert" src="/img/play.svg" alt="" />
       </div>
     </li> `;
  }
  //attach event listener to every song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  return songs;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  console.log(currentsong.src);
  console.log(track);
  currentsong.src = `/${currentFolder}/` + track;
  console.log(currentsong.src);
  if (!pause) {
    currentsong.play();
    play.src = "/img/pause.svg";
  }
  // currentsong.play();
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  // console.log(await a.text());
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);
  let cardContainer = document.querySelector(".cardContainer");
  let anchors = div.getElementsByTagName("a");
  console.log(anchors);
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    console.log(e.href);
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      console.log(e.href);
      console.log(e.href.split("/"));
      let folder = e.href.split("/").slice(4)[0];
      console.log(folder);
      //get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      console.log(a);
      let response = await a.json();
      console.log(response);
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141834"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img src="/img/cover.jpg" alt="" />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`;
    }
  }

  //load the songs from card
  //convert it array becaise getElementsByClassName gives collection and loop does not work on it
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log("hi");
      console.log(item, item.currentTarget.dataset);
      // songs = [];
      console.log(`songs/${item.currentTarget.dataset.folder}`);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`); //current target instead of target because with help of cirrenttarget if you click element inside the card be it img, h or p tag it will give you the event of card

      playMusic(songs[0]);
    });
  });
}

async function main() {
  //get the list of all the songs
  await getSongs("songs/ncs");
  console.log(songs);
  playMusic(songs[0], true);

  //display all the albums on the page
  displayAlbums();

  //attach an event listener to play,next and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      console.log(currentsong.paused);
      currentsong.play();
      play.src = "/img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "/img/play.svg";
    }
  });

  // //play the first song
  // let audio = new Audio(songs[0]);
  // // audio.play();
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    console.log("song" + percent * currentsong.duration);
    console.log("left" + (percent * currentsong.duration) / 100);
    // console.log(e.offsetX); //gives the horizontal position of event relative to element i.e seekbar which is of 488px witdh
    // console.log(e.target.getBoundingClientRect().width); //gives the width of the element and the main reason to use it was whensomone resizes the window the width of the element will change accordingly that is why I did not use e.offsetX/total width
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (percent * currentsong.duration) / 100;
  });
  //Add an event listener for hamberger
  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  //Add an event listener for closing the hamberger
  document.querySelector(".close1").addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
  });
  //Add an event listener to play previous song
  previous.addEventListener("click", () => {
    // console.log(currentsong);
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice()[4]); //split will split according to "/"  //slice will give an array //or slice(-1)[0] starting from end
    console.log(index);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } //01234
  });
  //Add an event listener to play next song
  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice()[4]);
    console.log(songs.length);
    console.log(index + 1 < songs.length);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } //01234
  });
  //add event listener to the volume tag
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e);
      console.log(typeof e.target.value);
      console.log(parseInt(e.target.value) / 100);

      currentsong.volume = parseInt(e.target.value) / 100;
    });
  //add event listener to mute the song
  document.querySelector(".mute").addEventListener("click", (e) => {
    console.log(e);

    //in if block e.target.src=="volume.svg"..this will not work because value of e.targer.src is "http://192.168.137.1:5/img/volume.svg" and not "voume.svg"

    if (e.target.src.includes("volume.svg")) {
      //e.target.src.replace("volume.svg","mute.svg") will not work because strings are immutable that is why e.target.src = e.target.src.replace
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}
main();
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
