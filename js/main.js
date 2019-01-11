if (localStorage.getItem("issues") === null) {
  localStorage.setItem("issues", JSON.stringify([]));
}
var APIDataFetched = false;
if (localStorage.getItem("users") === null) {
  let usersList = [];
  let request = new XMLHttpRequest();
  request.open("GET", "https://jsonplaceholder.typicode.com/users", true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      APIDataFetched = true;
      var username = JSON.parse(this.response);
      username.forEach(user => {
        usersList.push({ name: user.name });
      });
    } else {
      console.log("API Error");
    }
  };
  request.send();
  console.log("Completed");
  setTimeout(() => {
    if (APIDataFetched) {
      localStorage.setItem("users", JSON.stringify(usersList));
    }
  }, 1000);
} else {
  APIDataFetched = true;
}

if (localStorage.getItem("authentication") === null) {
  localStorage.setItem("authentication", JSON.stringify([]));
}

var issues = fetchIssue();
var users = fetchUsers();

//--------------------------------------------------------------------------------
document
  .getElementById("submit")
  .addEventListener("click", event => createIssue(event));
document
  .getElementById("addUserSubmit")
  .addEventListener("click", event => createUser(event));

//------------------------------------------------------------------------------------

function createUser(e) {
  let user = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let authenticationObject = { name: user, password: password };
  let userObject = { name: user };
  if (user !== "" || password !== "") {
    saveAuthentication(authenticationObject);
    saveUser(userObject);
  } else {
    alert("Enter a valid user name.");
  }
}

function createIssue(e) {
  let issueTitle = document.getElementById("title").value;
  let issueDescription = document.getElementById("description").value;
  let assignee = document.getElementById("assignee").innerHTML;
  let severity = document.getElementById("severity").innerHTML;
  let priority = document.getElementById("priority").innerHTML;

  document.getElementById("myform").reset();

  let issueObject = {
    title: issueTitle,
    description: issueDescription,
    assignee: assignee,
    severity: severity,
    priority: priority,
    isResolved: false
  };

  if (
    issueTitle == "" ||
    issueDescription == "" ||
    assignee == "Assignee" ||
    severity == "Severity" ||
    priority == "Priority"
  ) {
    deliverFailureAlert("Insufficient Data to log an issue");
  } else {
    saveIssue(issueObject);
  }
}
//-------------------------------------------------------------------------------------

function saveUser(userObject) {
  let flag = true;
  let userList = fetchUsers();
  userList.forEach(user => {
    if (userObject.name == user.name) {
      deliverFailureAlert("Username already exists");
      flag = false;
    }
  });
  if (flag) {
    userList.push(userObject);
    storeUsers(userList);
  }

  location.reload();
}

function saveIssue(issue) {
  let issueData = fetchIssue();
  issueData.push(issue);
  storeIssue(issueData);
  deliverSuccessAlert();
}

function saveAuthentication(auth) {
  let authentication = fetchAuth();
  authentication.push(auth);
  storeAuth(authentication);
}

//-----------------------------------------------------------------------------------
function fetchIssue() {
  let issue = localStorage.getItem("issues");
  return JSON.parse(issue);
}

function storeIssue(issue) {
  let issueToStore = JSON.stringify(issue);
  localStorage.setItem("issues", issueToStore);
}

function fetchUsers() {
  let users = localStorage.getItem("users");
  return JSON.parse(users);
}

function storeUsers(users) {
  let usersToStore = JSON.stringify(users);
  localStorage.setItem("users", usersToStore);
}

function fetchAuth() {
  let authentication = localStorage.getItem("authentication");
  return JSON.parse(authentication);
}

function storeAuth(authentication) {
  let auth = JSON.stringify(authentication);
  localStorage.setItem("authentication", auth);
}
//--------------------------------------------------------------------------------------

var assigneeList = "";
setTimeout(() => {
  users = fetchUsers();
  if (APIDataFetched) {
    users.forEach(user => {
      assigneeList += `<li class='dropdown-header'><a href='#'>${
        user.name
      }</a></li>`;
    });

    document.getElementById("dropdown-assignee").innerHTML = assigneeList;
  }
}, 1100);

function deliverSuccessAlert() {
  let successAlert =
    "<div style='margin-top: 25px' class='alert alert-success' role='alert'>\
    <button type='button' class='close' data-dismiss='alert' aria-label='Close' id='closeAlert'>\
    <span>&times;</span>\
    </button><strong>Success!</strong> Issues has been logged successfully</div>";

  document.getElementById("success").innerHTML = successAlert;

  document.getElementById("closeAlert").addEventListener("click", () => {
    document.getElementById("success").style.display = "none";
    location.reload();
  });
}

function deliverFailureAlert(msg) {
  let failureAlert =
    "<div style='margin-top: 25px' class='alert alert-danger' role='alert'>\
    <button type='button' class='close' data-dismiss='alert' aria-label='Close' id='closeAlert'>\
    <span>&times;</span></button><strong>Failure!</strong>" +
    msg +
    "</div>";

  document.getElementById("success").innerHTML = failureAlert;

  document.getElementById("closeAlert").addEventListener("click", () => {
    document.getElementById("success").style.display = "none";
  });
}
//---------------------------------------------------------------------------------
document.querySelectorAll("#dropdown-severity a").forEach(severity => {
  severity.addEventListener("click", () => {
    document.getElementById("severity").innerHTML = severity.innerHTML;
  });
});
document.querySelectorAll("#dropdown-priority a").forEach(priority => {
  priority.addEventListener("click", () => {
    document.getElementById("priority").innerHTML = priority.innerHTML;
  });
});
setTimeout(() => {
  document.querySelectorAll("#dropdown-assignee a").forEach(assignee => {
    assignee.addEventListener("click", () => {
      document.getElementById("assignee").innerHTML = assignee.innerHTML;
    });
  });
}, 1100);

//---------------------------Issues Display-----------------------------------------------------------------
resolvedIssuesListDOM = "";
unresolvedIssuesListDOM = "";

issues.forEach((issue, index) => {
  if (!issue.isResolved) {
    unresolvedIssuesListDOM +=
      "<div class='media text-muted pt-3' id='unresolveStatus'>\
    <p class='media-body pb-3 mb-0 medium lh-125 border-bottom border-gray'>\
    <strong class='d-block text-gray-dark'>@" +
      issue.assignee +
      "</strong>" +
      issue.description +
      "</p>";
    unresolvedIssuesListDOM +=
      "<button id='resolve" +
      index +
      "' type='button' class='btn btn-outline-success'>Resolve</button></div>";
  } else {
    resolvedIssuesListDOM +=
      "<div class='media text-muted pt-3' id='resolveStatus'>\
    <p class='media-body pb-3 mb-0 medium lh-125 border-bottom border-gray'>\
    <strong class='d-block text-gray-dark'>@" +
      issue.assignee +
      "</strong>" +
      issue.description +
      "</p>";
    resolvedIssuesListDOM +=
      "<button id='resolved" +
      index +
      "' type='button' class='btn btn-success' style='margin-right:10px;'>Resolved</button>\
      <button id='revert" +
      index +
      "' type='button' class='btn btn-success'>Mark Issue</button></div>";
  }
});

document.getElementById("issuesList").innerHTML =
  unresolvedIssuesListDOM + resolvedIssuesListDOM;
document.querySelectorAll("#unresolveStatus button").forEach(resolve => {
  resolve.addEventListener("click", () => {
    let resolvedIssueIndex = resolve.id[resolve.id.length - 1];
    issueList = fetchIssue();
    issueList[resolvedIssueIndex].isResolved = true;
    storeIssue(issueList);
    location.reload();
  });
});

document.querySelectorAll("#resolveStatus button").forEach(revert => {
  if (revert.id.startsWith("revert")) {
    revert.addEventListener("click", () => {
      let revertIssueIndex = revert.id[revert.id.length - 1];
      issueList = fetchIssue();
      issueList[revertIssueIndex].isResolved = false;
      storeIssue(issueList);
      location.reload();
    });
  }
});
