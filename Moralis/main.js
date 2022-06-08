/* Moralis init code */
const serverUrl = "https://wtjf6rurajha.usemoralis.com:2053/server";
const appId = "SJ3XaPUatEHsLW1txCV6tnVnz84hdAA96sV3FQqA";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Welcome gamer!",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
        document.getElementById("welcome-page").style.display = "none";
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    document.getElementById("welcome-page").style.display = "none";
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  document.getElementById("welcome-page").style.display = "flex";
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

document.getElementById("command-page").style.display = "none";

function goToComand() {
  document.getElementById("welcome-page").style.display = "none";
  document.getElementById("modalEl").style.display = "none";
  document.getElementById("command-page").style.display = "flex";
}

function backToWelcome() {
  document.getElementById("command-page").style.display = "none";
  document.getElementById("welcome-page").style.display = "flex";
}
document.getElementById("back-to-welcome").onclick = backToWelcome;

document.getElementById("btn-command").onclick = goToComand;
