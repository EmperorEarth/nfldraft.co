var timeouts = [];

function cleanup() {
  timeouts.forEach(function (timeout) {
    timeout();
  });
}

function clearStatuses(event) {
  document.getElementById("current-pick-form-status").innerHTML = "";
  document.getElementById("fix-form-status").innerHTML = "";
}

function currentPickPlayerSubmit(event) {
  event.preventDefault();
  fetch("/admin", {
    body:
      encodeURIComponent("current-pick-player") +
      "=" +
      encodeURIComponent(document.getElementById("current-pick-player").value),
    headers: {
      Authorization: localStorage.getItem("authorizationToken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  }).then(function (response) {
    if (response.status === 401) {
      window.location.replace(window.location.origin + "/login");
      return;
    }
    var statusNode = document.getElementById("current-pick-form-status");
    statusNode.innerHTML = "";
    if (!response.ok) {
      response.text().then(function (text) {
        statusNode.innerHTML = '<img src="../red-x.svg" />&nbsp;' + text;
      });
      return;
    }
    statusNode.innerHTML = '<img src="../green-checkmark.svg" />';
    document.getElementById("current-pick-player").value = "";
    cleanup();
    keepCurrentPickUpdated();
  });
}

function fixCurrentPickSubmit(event) {
  event.preventDefault();
  var currentPick = parseInt(
    document.getElementById("current-pick-number").innerText
  );
  var newCurrentPick = parseInt(
    document.getElementById("fix-current-pick-number").value
  );
  if (currentPick === newCurrentPick) {
    return;
  }
  var reallyDoThis = confirm(
    "Are you sure you want to change the current pick from #" +
      currentPick +
      " to #" +
      newCurrentPick +
      "? " +
      (newCurrentPick < currentPick
        ? "Going back to pick #" +
          newCurrentPick +
          " means deleting every submitted pick between #" +
          newCurrentPick +
          " (inclusive) and #" +
          currentPick +
          " (exclusive)."
        : "Skipping ahead to pick #" +
          newCurrentPick +
          " means leaving gaps for picks #" +
          currentPick +
          " (inclusive) to #" +
          newCurrentPick +
          " (exclusive).")
  );
  if (!reallyDoThis) {
    return;
  }
  fetch("/admin", {
    body:
      encodeURIComponent("fix-current-pick-number") +
      "=" +
      encodeURIComponent(newCurrentPick),
    headers: {
      Authorization: localStorage.getItem("authorizationToken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  }).then(function (response) {
    if (response.status === 401) {
      window.location.replace(window.location.origin + "/login");
      return;
    }
    var statusNode = document.getElementById("fix-form-status");
    statusNode.innerHTML = "";
    if (!response.ok) {
      response.text().then(function (text) {
        statusNode.innerHTML = '<img src="../red-x.svg" />&nbsp;' + text;
      });
      return;
    }
    statusNode.innerHTML = '<img src="../green-checkmark.svg" />';
    document.getElementById("fix-current-pick-number").value = "";
    cleanup();
    keepCurrentPickUpdated();
  });
}

function fixDueAddFiveSeconds(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setSeconds(fixDueTimeStateValue.getSeconds() + 5);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixDueAddMinute(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setMinutes(fixDueTimeStateValue.getMinutes() + 1);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixDueAddSecond(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setSeconds(fixDueTimeStateValue.getSeconds() + 1);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixDueSubmit(event) {
  event.preventDefault();
  fetch("/admin", {
    body:
      encodeURIComponent("fix-due-time") +
      "=" +
      encodeURIComponent(
        new Date(
          document.getElementById("fix-due-time-state").value
        ).toISOString()
      ),
    headers: {
      Authorization: localStorage.getItem("authorizationToken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  }).then(function (response) {
    if (response.status === 401) {
      window.location.replace(window.location.origin + "/login");
      return;
    }
    var statusNode = document.getElementById("fix-form-status");
    statusNode.innerHTML = "";
    if (!response.ok) {
      response.text().then(function (text) {
        statusNode.innerHTML = '<img src="../red-x.svg" />&nbsp;' + text;
      });
      return;
    }
    statusNode.innerHTML = '<img src="../green-checkmark.svg" />';
    cleanup();
    keepCurrentPickUpdated();
  });
}

function fixDueSubtractFiveSeconds(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setSeconds(fixDueTimeStateValue.getSeconds() - 5);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixDueSubtractMinute(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setMinutes(fixDueTimeStateValue.getMinutes() - 1);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixDueSubtractSecond(event) {
  event.preventDefault();
  clearStatuses(event);
  var fixDueTimeStateNode = document.getElementById("fix-due-time-state");
  var fixDueTimeStateValue = new Date(fixDueTimeStateNode.value);
  fixDueTimeStateValue.setSeconds(fixDueTimeStateValue.getSeconds() - 1);
  fixDueTimeStateNode.value = fixDueTimeStateValue;
  document.getElementById("fix-due-time").value =
    ("0" + fixDueTimeStateValue.getHours()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getMinutes()).slice(-2) +
    ":" +
    ("0" + fixDueTimeStateValue.getSeconds()).slice(-2);
}

function fixPlayerSubmit(event) {
  event.preventDefault();
  fetch("/admin", {
    body:
      encodeURIComponent("fix-player-number") +
      "=" +
      encodeURIComponent(document.getElementById("fix-player-number").value) +
      "&" +
      encodeURIComponent("fix-player-player") +
      "=" +
      encodeURIComponent(document.getElementById("fix-player-player").value),
    headers: {
      Authorization: localStorage.getItem("authorizationToken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  }).then(function (response) {
    if (response.status === 401) {
      window.location.replace(window.location.origin + "/login");
      return;
    }
    var statusNode = document.getElementById("fix-form-status");
    statusNode.innerHTML = "";
    if (!response.ok) {
      response.text().then(function (text) {
        statusNode.innerHTML = '<img src="../red-x.svg" />&nbsp;' + text;
      });
      return;
    }
    statusNode.innerHTML = '<img src="../green-checkmark.svg" />';
    document.getElementById("fix-player-number").value = "";
    document.getElementById("fix-player-player").value = "";
  });
}

function fixTeamSubmit(event) {
  event.preventDefault();
  fetch("/admin", {
    body:
      encodeURIComponent("fix-team-number") +
      "=" +
      encodeURIComponent(document.getElementById("fix-team-number").value) +
      "&" +
      encodeURIComponent("fix-team-team") +
      "=" +
      encodeURIComponent(document.getElementById("fix-team-team").value),
    headers: {
      Authorization: localStorage.getItem("authorizationToken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  }).then(function (response) {
    if (response.status === 401) {
      window.location.replace(window.location.origin + "/login");
      return;
    }
    var statusNode = document.getElementById("fix-form-status");
    statusNode.innerHTML = "";
    if (!response.ok) {
      response.text().then(function (text) {
        statusNode.innerHTML = '<img src="../red-x.svg" />&nbsp;' + text;
      });
      return;
    }
    statusNode.innerHTML = '<img src="../green-checkmark.svg" />';
    document.getElementById("fix-team-number").value = "";
    document.getElementById("fix-team-team").value = "";
  });
}

function keepCurrentPickUpdated() {
  fetch("/current", {
    method: "POST",
  }).then(function (response) {
    if (!response.ok) {
      return;
    }
    response.text().then(function (text) {
      data = JSON.parse(text);
      var due = new Date(data.due);
      if (
        data.number !==
        parseInt(document.getElementById("current-pick-number").innerText)
      ) {
        document.getElementById("fix-due-time-state").value = data.due;
        if (document.getElementById("fix-due-time") !== null) {
          document.getElementById("fix-due-time").value =
            due.getHours() + ":" + due.getMinutes() + ":" + due.getSeconds();
        }
      }
      document.getElementById("current-pick-number").innerText = data.number;
      document.getElementById("current-pick-due").value = data.due;
      document.getElementById(
        "current-pick-submit-button"
      ).disabled = undefined;
      document.getElementById("fix-type-select").disabled = undefined;
    });
  });
  var timeout = setTimeout(
    keepCurrentPickUpdated,
    2500 + Math.floor(Math.random() * 5000)
  );
  timeouts.push(function () {
    clearTimeout(timeout);
  });
}

function onbeforeunload(event) {
  console.log(JSON.parse(JSON.stringify(event)));
}

function onchangeFixType(event) {
  clearStatuses(event);
  var fixFormNode = document.getElementById("fix-form");
  fixFormNode.innerHTML = "";
  switch (event.target.value) {
    case "fixDue":
      fixFormNode.innerHTML =
        '<button onclick="fixDueSubtractMinute(event)">-1 minute</button><button onclick="fixDueSubtractFiveSeconds(event)">-5 seconds</button><button onclick="fixDueSubtractSecond(event)">-1 second</button><button onclick="fixDueAddSecond(event)">+1 second</button><button onclick="fixDueAddFiveSeconds(event)">+5 seconds</button><button onclick="fixDueAddMinute(event)">+1 minute</button><br /><input id="fix-due-time" onchange="clearStatuses(event)" readonly required step="1" type="time" /><button id="fix-due-submit-button" onclick="fixDueSubmit(event)">Submit Current Pick Due</button>';
      if (document.getElementById("fix-due-time").value === "") {
        var due = new Date(document.getElementById("fix-due-time-state").value);
        document.getElementById("fix-due-time").value =
          ("0" + due.getHours()).slice(-2) +
          ":" +
          ("0" + due.getMinutes()).slice(-2) +
          ":" +
          ("0" + due.getSeconds()).slice(-2);
      }
      break;
    case "fixNumber":
      fixFormNode.innerHTML =
        '<input id="fix-current-pick-number" min="1" max="259" oninput="clearStatuses(event)" placeholder="Pick #" required type="number" /><button id="fix-current-pick-submit-button" onclick="fixCurrentPickSubmit(event)">Submit Current Pick Number</button>';
      break;
    case "fixPlayer":
      fixFormNode.innerHTML =
        '<input id="fix-player-number" min="1" max="259" oninput="clearStatuses(event)" placeholder="Pick #" required type="number" /><input id="fix-player-player" list="fix-player-players" oninput="clearStatuses(event)" placeholder="Player" required /><datalist id="fix-player-players" placeholder="Player"></datalist><button id="fix-player-submit-button" onclick="fixPlayerSubmit(event)">Submit Pick</button>';
      document.getElementById("fix-player-players").innerHTML = Object.keys(
        players
      ).reduce(function (acc, player) {
        return acc + "<option>" + player + "</option>";
      }, "");
      break;
    case "fixTeam":
      fixFormNode.innerHTML =
        '<input id="fix-team-number" min="1" max="259" oninput="clearStatuses(event)" placeholder="Pick #" required type="number" /><input id="fix-team-team" list="fix-team-teams" oninput="clearStatuses(event)" placeholder="Team" required /><datalist id="fix-team-teams" placeholder="Player"><option>49ers</option><option>Bears</option><option>Bengals</option><option>Bills</option><option>Broncos</option><option>Browns</option><option>Buccaneers</option><option>Cardinals</option><option>Chargers</option><option>Chiefs</option><option>Colts</option><option>Cowboys</option><option>Dolphins</option><option>Eagles</option><option>Falcons</option><option>Football Team</option><option>Giants</option><option>Jaguars</option><option>Jets</option><option>Lions</option><option>Packers</option><option>Panthers</option><option>Patriots</option><option>Raiders</option><option>Rams</option><option>Ravens</option><option>Saints</option><option>Seahawks</option><option>Steelers</option><option>Texans</option><option>Titans</option><option>Vikings</option></datalist><button id="fix-team-submit-button" onclick="fixTeamSubmit(event)">Submit Pick</button>';
      break;
  }
}

function onloadBody() {
  keepCurrentPickUpdated();
  setInterval(tick, 1000);
  document.getElementById("current-pick-players").innerHTML = Object.keys(
    players
  ).reduce(function (acc, player) {
    return acc + "<option>" + player + "</option>";
  }, "");
}

function tick() {
  if (document.getElementById("current-pick-due").value === "") {
    return;
  }
  var due = new Date(document.getElementById("current-pick-due").value);
  var now = new Date();
  document.getElementById("time-left").innerText =
    Math.floor((due - now) / 3600000) +
    ":" +
    ("0" + Math.floor(((due - now) / 60000) % 60)).slice(-2) +
    ":" +
    ("0" + Math.floor(((due - now) / 1000) % 60)).slice(-2);
}

window.addEventListener("beforeunload", cleanup);
