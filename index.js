async function getSongs() {
  let a = await fetch("http://192.168.20.249:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]); //this will give me array of two so take the second element after "/songs/"
    }
  }
  return songs;
}
async function main() {
  //get the list of all the songs
  let songs = await getSongs();
  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0]; //ul ka 1st child i.e li
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
  //play the first song
  let audio = new Audio(songs[0]);
  // audio.play();
}
main();
