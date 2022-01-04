const BASE_URL = "http://localhost:3000/poi";
const MAP = L.map("map1");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const markerArray = []; // Array used to control the number of markers displayed on screen

// -----------------  REQUESTS ----------------------------------------------------

const fetchPoiByRegion = async (searchQuery) => {
  const response = await fetch(`${BASE_URL}/region/${searchQuery}`);
  const responseJson = await response.json();
  if (response.status !== 200) {
    throw new Error(`${responseJson.error}`);
  }
  return responseJson;
};

const updatePoiRecommendation = async (poiID) => {
  const response = await fetch(`${BASE_URL}/update-recommendations/${poiID}`, {
    method: "PATCH",
  });
  if (response.status !== 200) {
    throw new Error();
  }
  return response;
};

const createPoi = async (createPoiBody) => {
  const response = await fetch("http://localhost:3000/poi/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPoiBody),
  });
  const responseJson = await response.json();
  if (response.status !== 200) {
    throw new Error(`${responseJson.error}`);
  }
  return responseJson;
};

const createPoiReview = async (poiReview) => {
  const response = await fetch("http://localhost:3000/review/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(poiReview),
  });
  if (response.status !== 200) {
    const responseJson = await response.json();
    throw new Error(`${responseJson.error}`);
  }
  return response;
};

const logout = async () => {
  const response = await fetch("http://localhost:3000/user/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    throw new Error();
  }
  return await response.json();
};

const isLoggedIn = async () => {
  const response = await fetch("http://localhost:3000/user/login");
  const responseJson = await response.json();
  if (response.status !== 200) {
    throw new Error();
  }
  return responseJson;
};

// ----------------------------    MAP FUNCTIONS     ----------------------------------------------------------

/**
 * Create the map on the layer L with the default view position and add a click event on map
 */
const createMap = () => {
  const attrib =
    "Map data copyright OpenStreetMap contributors, Open Database Licence";

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: attrib,
  }).addTo(MAP);

  MAP.setView([50.908, -1.4], 14);

  MAP.on("click", (e) => {
    renderMapPopup(e);
  });
};

/**
 * Render a popup on map upon a click event and sets the listeners for the buttons within the popup
 * @param e The click event
 */
const renderMapPopup = (e) => {
  const pos = [e.latlng.lat, e.latlng.lng];
  const newPopup = createMapPopup(pos);
  const poiFormHtml = newPopup.getElement();
  const createPoiForm = poiFormHtml.querySelector("#createPoiForm");
  const cancelPoiBtn = poiFormHtml.querySelector("#cancelPoiBtn");

  createPoiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createPoiFromMapPopup(poiFormHtml);
  });

  cancelPoiBtn.addEventListener("click", () => {
    MAP.closePopup();
    return
  });
};

/**
 * Create popup on map by receiving the position captured by the click event as an argument
 * @param {number} pos The position, consisting of latitude and longitude
 * @returns Leaflet popup with content set
 */
const createMapPopup = (pos) => {
  const newPopup = L.popup();

  newPopup.setLatLng(pos).setContent(configMapPopupHTML(pos)).openOn(MAP);

  return newPopup;
};

/**
 * Attempts to create a new point of interest with the data collected from the map popup
 * @param popupForm The HTML form element with date to be completed
 */
const createPoiFromMapPopup = (popupForm) => {
  const createPoiBody = {
    name: popupForm.querySelector("#poiName").value,
    type: popupForm.querySelector("#poiType").value,
    country: popupForm.querySelector("#poiCountry").value,
    region: popupForm.querySelector("#poiRegion").value,
    lat: popupForm.querySelector("#poiLat").value,
    lon: popupForm.querySelector("#poiLon").value,
    description: popupForm.querySelector("#poiDescription").value,
  };

  createPoi(createPoiBody)
    .then((res) => {
      MAP.closePopup();
      findPoiByRegion(res.poiCreated.region, res.poiCreated);
    })
    .catch((e) => {
      renderFeedBack(e);
      console.error(e);
    });
};

/**
 * Receives a region to be searched by argument, this can be the one searched by the user using the searchbar or
 * Region of a new created point of interest which will be captured from the new poi object
 * @param {string} defaultRegionToSearch Region input value
 * @param {object} newCreatedPoi Region from recent created point of interest
 */
const findPoiByRegion = (defaultRegionToSearch, newCreatedPoi) => {
  const regionSearchInput =
    defaultRegionToSearch || document.getElementById("searchInput").value;

  if (!regionSearchInput) {
    renderFeedBack("Error: Please inform a region to be searched.");
    return;
  }

  fetchPoiByRegion(regionSearchInput)
    .then((regionPoiFound) => {
      if (!newCreatedPoi) {
        updateMapView(regionPoiFound);
        renderFeedBack(
          `${
            regionPoiFound.length > 1
              ? `${regionPoiFound.length} Points`
              : `${regionPoiFound.length} Point`
          } of Interest found in ${regionSearchInput}`
        );
      } else {
        renderFeedBack("Point of interest successfully created");
        updateMapView(regionPoiFound, newCreatedPoi);
      }
    })
    .catch((e) => {
      renderFeedBack(e);
    });
};

/**
 * Updates the mapview based on the point of interest received by argument
 * @param {object} regionPoiFound The poi object containing position consisting of latitude and longitude
 * @param {object} poiSpecific The poi object containing position consisting of latitude and longitude of specific poi
 */
const updateMapView = (regionPoiFound, poiSpecific) => {
  resetMarkersPerMapUpdate();
  createMarkerAndBindPopup(regionPoiFound, poiSpecific);

  const markerGroup = new L.featureGroup(markerArray);

  regionPoiFound.forEach((poi) => {
    if (poiSpecific && poi.id === poiSpecific.id) {
      MAP.setView([poiSpecific.lat, poiSpecific.lon], 16);
    }
  });

  if (!poiSpecific) {
    MAP.fitBounds(markerGroup.getBounds());
  }
};

/**
 * Creates a marker for each point of interest found in a region and binds a popup to it, if the point  of interest
 * is and specific one it will set that popup to be already open without the need to click on the marker, also populates the marker array
 * @param {object} regionPoiFound The poi object with all properties
 * @param {object} poiSpecific The specific poi object with all properties
 */
const createMarkerAndBindPopup = (regionPoiFound, poiSpecific) => {
  regionPoiFound.forEach((poi) => {
    const marker = L.marker([poi.lat, poi.lon]).addTo(MAP);
    const markerPopup = document.createElement("html");

    markerPopup.innerHTML = createMarkerPopup(poi);
    setUpMarkerPopupListeners(poi, markerPopup);
    marker.bindPopup(markerPopup);

    if (poiSpecific && poi.id === poiSpecific.id) {
      marker.openPopup();
    }

    markerArray.push(marker);
  });
};

/**
 * Reset markers everytime the map is updated, also resets the marker array
 */
const resetMarkersPerMapUpdate = () => {
  markerArray.forEach((marker) => {
    marker.removeFrom(MAP);
  });
  markerArray.length = 0;
};

/**
 * Returns a HTML to be used as a marker popup
 * @param {object} poi The poi object with its properties to fill the html form
 */
const createMarkerPopup = (poi) => {
  return `<div>
            <span>Name: ${poi.name}</span><br>
            <div class="text-truncate">Description: ${poi.description}</div><br>
            <button type="button" class="btn btn-outline-success btn-sm" id="recommendBtn">Recommend</button>
            <i class="fa fa-heart" style="color: red"></i>
            <span>${poi.recommendations}</span> <br><br>
            <div class="form-group">
                <textarea class="form-control mb-2" id="poiReview" name="poiReview" placeholder="Write us a review" style="height: 100px"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm btn-block" id="reviewBtn">Submit Review</button>
        </div>
    `;
};

/**
 * Sets up the listener for the maker popup everytime the map is updated
 * @param {object} poi The poi object itself
 * @param popupHTML The HTML form used inside the marker
 */
const setUpMarkerPopupListeners = (poi, popupHTML) => {
  const recommendBtn = popupHTML.querySelector("#recommendBtn");
  const reviewForm = popupHTML.querySelector("#reviewBtn");

  recommendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    recommendPoi(poi);
  });

  reviewForm.addEventListener("click", (e) => {
    e.preventDefault();
    reviewPoi(poi);
  });
};

/**
 * Attempts to recommend point of interest by receiving the poi ID as argument
 * @param {object} poi The poi object itself
 */
const recommendPoi = (poi) => {
  updatePoiRecommendation(poi.id)
    .then(() => {
      renderFeedBack("Thank you for recommending us!");
      MAP.closePopup();
      fetchPoiByRegion(poi.region).then((poiArray) => {
        updateMapView(poiArray, poi);
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

/**
 * Attempts to create a review using the info captured from the textarea inside the marker popup
 * @param {object} poi The poi object itself
 */
const reviewPoi = (poi) => {
  const reviewText = document.getElementById("poiReview").value;
  const reviewTextDiv = document.getElementById("poiReview");
  const reviewBody = {
    poi_id: poi.id,
    reviewText: reviewText,
  };

  createPoiReview(reviewBody)
    .then((r) => {
      reviewTextDiv.value = "";
      renderFeedBack(`Thank you for writing us a review!`);
    })
    .catch((e) => {
      renderFeedBack(e);
    });
};

// -------------------------------------- Essential initialize listeners -------------------------------------

searchBtn.addEventListener("click", () => {
  findPoiByRegion();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    findPoiByRegion();
  }
});

// --------------------------------- DOM HELPER METHODS ---------------------------------------------------------
/**
 * Modify navbar to display username if logged in
 * @param divToModify The HTML element to be modified
 * @param {String} username The username of the user logged in
 */
const showUserLoggedIn = (divToModify, username) => {
  divToModify.innerHTML = `<Strong class="nav-link"> Logged in as ${username} | <input type='button' class="btn btn-outline-danger btn-sm" value='Logout' id='logout' />`;

  const logoutBtn = document.getElementById("logout");

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout()
      .then(() => {
        alert("You have been logged out");
        window.location.href = "http://localhost:3000/views/index.html";
      })
      .catch((e) => {
        console.error(e);
      });
  });
};

/**
 * Check if the user is logged in, gets the HTML element to be altered and call the function responsible for changing it
 * @param isLoggedInResponse The response object from session user
 */
const modifyNavBarIfLoggedIn = (isLoggedInResponse) => {
  const loginDiv = document.querySelector("#loginDiv");

  if (isLoggedInResponse.user) {
    showUserLoggedIn(loginDiv, isLoggedInResponse.user.username);
  } else {
    loginDiv.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
  }
};

/**
 * Receives a String alias response to be displayed in a Div as form of feedback to the user
 * @param {String} response The message to be displayed as feedback to the user
 */
const renderFeedBack = (response) => {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  alertPlaceholder.innerHTML = `<div class="alert ${
    !response.toString().includes("Error") ? "alert-success" : "alert-danger"
  } alert-dismissible fade show" role="alert">
                    <strong>${response}</strong>
                   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
               </div>`;
};

/**
 * return the HTML content used to create the map popup, also set the field lat and long by the pos with received valued as argument to read only
 * @param {number}pos The position of the clicked place with latitude and longitude
 */
const configMapPopupHTML = (pos) => {
  return `<div class="card-body">
                    <form id="createPoiForm">
                        <h6>Please fill in the form below</h6><br>
                        <div class="">
                            <label for="poiName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="poiName" required>
                        </div>
                        <div class="">
                            <label for="poiType" class="form-label">Type</label>
                            <input type="text" class="form-control" id="poiType" required>
                        </div>
                        <div class="">
                            <label for="poiCountry" class="form-label">Country</label>
                            <input type="text" class="form-control" id="poiCountry" required>
                        </div>
                        <div class="">
                            <label for="poiRegion" class="form-label">Region</label>
                            <input type="text" class="form-control" id="poiRegion" required>
                        </div>
                        <div class="">
                            <label for="poiLat" class="form-label">Latitude</label>
                            <input type="number" value="${pos[0]}" class="form-control" id="poiLat" readonly>
                        </div>
                        <div class="">
                            <label for="poiLon" class="form-label">Longitude</label>
                            <input type="number" value="${pos[1]}" class="form-control" id="poiLon" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="poiDescription" class="form-label">Description</label>
                            <input type="text" class="form-control" id="poiDescription" required>
                        </div>
                        <button type="submit" id="createPoiBtn" class="btn btn-primary btn-sm col-md-12 mb-1">Create Point of Interest</button>
                        <button type="button" id="cancelPoiBtn" class="btn btn-danger btn-sm col-md-12">Cancel</button>
                    </form>
                </div>`;
};

// --------------------- NECESSARY FUNCTIONS CALL WHENEVER PAGE UPDATE ----------------------------------

createMap();

isLoggedIn()
  .then((r) => {
    modifyNavBarIfLoggedIn(r);
  })
  .catch((e) => {
    console.error(e);
  });
