let tasks = [];
//let lastTaskId = 2;

let taskList;
let loggedIn = false;
let token;

// kui leht on brauseris laetud siis lisame esimesed taskid lehele

// let addTask = document.querySelector("#add-task");

// addTask.addEventListener("click", () => {
//   const task = createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
//   const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
//   taskList.appendChild(taskRow); // Lisame taski lehele
// });

function renderTask(task) {
  taskList = document.querySelector("#task-list");
  const taskRow = createTaskRow(task);
  taskList.appendChild(taskRow);
}

function removeTasksDOM(id) {
  console.log(id);
  try {
    let element = document.getElementById(id);
    element.remove();
  } catch (err) {
    console.log(err);
  }
}
/* function createTask() {
  lastTaskId++;
  const task = {
    id: lastTaskId,
    name: "Task " + lastTaskId,
    completed: false,
  };
  tasks.push(task);
  return task;
} */

function createTaskRow(task) {
  // tasks.forEach((task) => task.id);
  // {
  //   try {
  //     let element = document.getElementById("id");
  //     element.remove();
  //   } catch (err) {
  //     console.log("No elements to delete");
  //   }
  // }
  let taskRow = document
    .querySelector('[data-template="task-row"]')
    .cloneNode(true);
  taskRow.removeAttribute("data-template");

  taskRow.setAttribute("id", task.id);

  // Täidame vormi väljad andmetega
  const name = taskRow.querySelector("[name='name']");
  name.addEventListener("input", () => {
    console.log("text is changed");
    updateTaskTitle(task.id, name.value, task.completed);
  });
  name.innerText = "New task";

  const checkbox = taskRow.querySelector("[name='completed']");
  checkbox.checked = task.completed;
  checkbox.onclick = function () {
    checkbox.checkbox = markAsDone(task.id, task.completed, name.value);
    task.completed = !task.completed;
  };

  const deleteButton = taskRow.querySelector(".delete-task");
  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  // Valmistame checkboxi ette vajutamiseks
  hydrateAntCheckboxes(taskRow);

  return taskRow;
}

function deleteTask(id) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: null,
    redirect: "follow",
  };

  for (let i = 0; i < tasks.length; i++) {
    console.log(tasks[i]);
    if (tasks[i].id == id) {
      console.log(tasks[i]);
      removeTasksDOM(tasks[i].id);
      tasks.splice(i, 1);
      console.log(tasks);
    }
  }

  fetch("https://demo2.z-bit.ee/tasks/" + id, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function markAsDone(id, checked, title) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);
  const raw = JSON.stringify({
    title: title,
    marked_as_done: !checked,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://demo2.z-bit.ee/tasks/" + id, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

  return !checked;
}

function updateTaskTitle(id, title, checked) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);
  const raw = JSON.stringify({
    title: title,
    marked_as_done: checked,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://demo2.z-bit.ee/tasks/" + id, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// function createAntCheckbox() {
//   const checkbox = document
//     .querySelector('[data-template="ant-checkbox"]')
//     .cloneNode(true);
//   checkbox.removeAttribute("data-template");
//   hydrateAntCheckboxes(checkbox);
//   return checkbox;
// }

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
  const elements = element.querySelectorAll(".ant-checkbox-wrapper");
  for (let i = 0; i < elements.length; i++) {
    let wrapper = elements[i];

    // Kui element on juba töödeldud siis jäta vahele
    if (wrapper.__hydrated) continue;
    wrapper.__hydrated = true;

    const checkbox = wrapper.querySelector(".ant-checkbox");

    // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
    const input = wrapper.querySelector(".ant-checkbox-input");
    if (input.checked) {
      checkbox.classList.add("ant-checkbox-checked");
    }

    // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
    input.addEventListener("change", () => {
      checkbox.classList.toggle("ant-checkbox-checked");
    });
  }
}
function login() {
  var login = document.getElementById("loginlogin");
  var password = document.getElementById("loginpassword");
  // if (login.value != "" || password.value != "") {
  //   console.log("Login value is not null");
  // } else {
  //   console.log("Login value is null");
  // }
  var T = document.getElementById("logreg");
  var tasks = document.getElementById("taskdiv");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: login.value,
    password: password.value,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://demo2.z-bit.ee/users/get-token", requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if (response.access_token) {
        token = response.access_token;
        console.log("We got a token");
        console.log(token);
        T.style.display = "none";
        tasks.style.display = "block";
        getTasks(token);
      } else {
        console.log("We did not get a token");
        throw "Enter correct data";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function registration() {
  var username = document.getElementById("username");
  var firstname = document.getElementById("firstname");
  var secondname = document.getElementById("secondname");
  var password = document.getElementById("password");
  if (
    username.value != "" &&
    firstname.value != "" &&
    secondname.value != "" &&
    password.value != ""
  ) {
    console.log("Value is not null");
  } else {
    console.log("Value is null");
  }
  var T = document.getElementById("logreg");
  var tasks = document.getElementById("taskdiv");

  if (loggedIn) {
    T.style.display = "none";
    tasks.style.display = "block";
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: username.value,
    firstname: firstname.value,
    lastname: secondname.value,
    newPassword: password.value,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("https://demo2.z-bit.ee/users", requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if (response.access_token) {
        token = response.access_token;
        console.log("We got a token");
        console.log(response);
        T.style.display = "none";
        tasks.style.display = "block";
      } else {
        console.log("We did not get a token");
        throw "Enter correct data";
      }
    })
    .catch((error) => console.error(error));
  getTasks(response.access_token);
}

function getTasks(token) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  for (let i = 0; i < tasks.length; i++) {
    try {
      removeTasksDOM(tasks[i].id);
    } catch (err) {
      console.log(err);
    }
  }

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    body: null,
    redirect: "follow",
  };

  fetch("https://demo2.z-bit.ee/tasks", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      tasks = [];
      result.forEach((task) => {
        tasks.push({
          id: task.id,
          name: task.title,
          completed: task.marked_as_done,
        });
      });
      tasks.forEach((task) => renderTask(task));
      console.log(tasks);
    })
    .catch((error) => console.error(error));
}

function createTask() {
  let newTask;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const raw = JSON.stringify({
    title: "New task",
    desc: "New task",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://demo2.z-bit.ee/tasks", requestOptions)
    .then((response) => response.json())
    .then((task) => {
      newTask = {
        id: task.id,
        name: task.title,
        completed: task.marked_as_done,
      };
      console.log(newTask);
      console.log(task);
      tasks.push(newTask);
      renderTask(newTask);
    })
    .catch((error) => console.error(error));
}

//
// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");
// myHeaders.append("Authorization", "Bearer z8g19JU9i2D1qr3SB2lxwFzJAzIV_U0P");
// myHeaders.append(
//   "Cookie",
//   "PHPSESSID=30sdh83leh4d87qcvfeoiq9483; _csrf=a0b7f2842c883653331d54bce57218ec3fe20e3a5e197fae1c6c3339b0947aa7a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22773Yw080PVBOyWTD0pQikWySfi_yBUxb%22%3B%7D"
// );

// // Registration
// const userLoginReg = document.getElementById("loginlogin");
// const loginValueReg = userLoginReg.value;
// const userPasswordReg = document.getElementById("loginpassword");
// const loginPassValueReg = userPasswordReg.value;

// var rawReg = JSON.stringify({
//   username: userLogin,
//   firstname: userLogin,
//   lastname: userLogin,
//   newPassword: loginPassValueReg,
// });
// console.log(rawReg);
// var requestOptions = {
//   method: "POST",
//   headers: myHeaders,
//   body: rawReg,
//   redirect: "follow",
// };

// fetch("https://demo2.z-bit.ee/users", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));
