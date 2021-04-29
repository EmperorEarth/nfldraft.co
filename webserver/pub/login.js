function login(event) {
  event.preventDefault();
  fetch("/login", {
    body:
      encodeURIComponent("username") +
      "=" +
      encodeURIComponent(document.getElementById("username").value) +
      "&" +
      encodeURIComponent("password") +
      "=" +
      encodeURIComponent(document.getElementById("password").value),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then(function (response) {
      if (!response.ok) {
        return;
      }
      return response.text();
    })
    .then(function (text) {
      if (!text) {
        return;
      }
      localStorage.setItem("authorizationToken", text);
      window.location.replace(window.location.origin + "/admin");
    });
}
