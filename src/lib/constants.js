const is_development_mode = true;
module.exports = Object.freeze({
  BE_URL: is_development_mode
    ? "http://localhost:8080/"
    : "https://bulletapp-be.azurewebsites.net/",
  TEXT_MESSAGE: 1,
  USER_JOINED: 2,
  USER_LEFT: 3,
});
