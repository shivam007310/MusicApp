let currentsong = new Audio();
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
async function getSongs() {
  let a = await fetch("http://192.168.51.249:5500/songs/");
  // console.log(await a.text());
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(div);
  let as = div.getElementsByTagName("a");
  console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]); //this will give me array of two so take the second element after "/songs/"
    }
  }
  return songs;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "/img/pause.svg";
  }
  // currentsong.play();
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
async function main() {
  //get the list of all the songs
  let songs = await getSongs();
  console.log(songs);
  playMusic(songs[0], true);

  let songUL = document.querySelector(".songList").querySelector(".ul"); //or getElementByTagName("ul")[0] means first ul element of this tagname inside songlist classname
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
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
}
main();
