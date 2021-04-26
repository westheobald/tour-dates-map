"use strict";

class App {
  map;

  constructor(artist) {
    this.artist = artist;
    this.upcomingShows = [];
    this._getClientPostion();
  }

  _getClientPostion() {
    navigator.geolocation.getCurrentPosition(this._renderMap.bind(this));
    artistForm.classList.add("invisible");
    document.getElementById("mapid").classList.remove("hidden");
  }
  _renderMap(pos) {
    const { latitude, longitude } = pos.coords;
    this.map = L.map("mapid").setView([latitude, longitude], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this._getTourDates();
  }

  _getTourDates() {
    // ENTER YOUR OWN API KEY AND REMOVE OTHER URL DECLARATION
    // const apiKey = "yOUrSuP3r3ven7aPp-id";
    // const url = `https://rest.bandsintown.com/v4/artists/${this.artist}/events/?app_id=${apiKey}`;
    const url = `https://wesleytheobald.com:3000/bands/${this.artist}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (let concert of data) {
          this.upcomingShows.push(concert);
          this._renderMarker(concert);
        }
      });
  }
  _renderMarker(data) {
    const coords = [data.venue.latitude, data.venue.longitude];
    const date = new Date(data.datetime);
    const month = date.toLocaleString("default", { month: "long" });
    const marker = L.marker(coords).addTo(this.map).bindPopup(
      `${data.lineup[0]} at ${data.venue.name}<br>
        ${month} ${date.getDate()}, ${date.getFullYear()} - <a href="${
        data.url
      }">Get Tickets</a>`
    );
    marker.on("click", (e) =>
      this.map.setView([e.latlng.lat, e.latlng.lng], 15)
    );
  }
}

const artistForm = document.getElementById("artist__form");
artistForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let artist = document.getElementById("artist").value;
  const app = new App(artist);
});
