const loginForm = document.getElementById("loginForm");

const loginUser = async (loginBody) => {
  const response = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginBody),
  });
  const responseJson = await response.json();

  if (response.status !== 200) {
    throw new Error(responseJson.message);
  }
  return responseJson;
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginBody = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  loginUser(loginBody)
    .then((r) => {
      alert(r);
      window.location.href = "http://localhost:3000/views/index.html";
    })
    .catch((e) => {
      alert(e);
      console.error(e);
    });
});
