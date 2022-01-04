const createPoiForm = document.getElementById("createPoiForm");

async function createPoi(createPoiBody) {
  const response = await fetch("http://localhost:3000/poi/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPoiBody),
  });
  if (response.status !== 200) {
    const responseJson = await response.json();
    throw new Error(`${responseJson.error}`);
  }
  return response;

}

createPoiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const createPoiBody = {
    name: document.getElementById("poiName").value,
    type: document.getElementById("poiType").value,
    country: document.getElementById("poiCountry").value,
    region: document.getElementById("poiRegion").value,
    lat: document.getElementById("poiLat").value,
    lon: document.getElementById("poiLon").value,
    description: document.getElementById("poiDescription").value,
  };

  createPoi(createPoiBody)
    .then(() => {
      alert(`Point of interest ${createPoiBody.name} successfully created`);
      window.location.href = "http://localhost:3000/views/index.html";
    })
    .catch((e) => {
      alert(e);
      console.error(e);
    });
});

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

const modifyNavBarIfLoggedIn = (isLoggedInResponse) => {
  const loginDiv = document.querySelector("#loginDiv");

  if (isLoggedInResponse.user) {
    showUserLoggedIn(loginDiv, isLoggedInResponse.user.username);
  } else {
    loginDiv.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
  }
};

isLoggedIn()
    .then((r) => {
      modifyNavBarIfLoggedIn(r);
    })
    .catch((e) => {
      console.error(e);
    });

