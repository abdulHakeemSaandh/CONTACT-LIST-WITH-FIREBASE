// Add New Data
async function addNewTodo() {
  let username = document.getElementById("username");
  let email = document.getElementById("email");

  if (!username.value || !email.value) return alert("Please fill in both fields");

  var userObject = {
    username: username.value,
    email: email.value
  };

  await firebase.database().ref("users").push(userObject);
  alert("Data added successfully");
  username.value = "";
  email.value = "";
}

// View / Display All Data in Cards
function displayAllData() {
  const container = document.getElementById("cardContainer");

  firebase.database().ref("users").on("value", (snapshot) => {
    container.innerHTML = "";
    const data = snapshot.val();

    if (data) {
      Object.keys(data).forEach((id) => {
        const user = data[id];
        const initial = user.username ? user.username.charAt(0).toUpperCase() : "?";
        container.innerHTML += `
          <div class="user-card">
            <div class="user-info">
              <div class="avatar">${initial}</div>
              <div>
                <h3>${user.username}</h3>
                <p>${user.email}</p>
              </div>
            </div>
            <div class="actions">
              <button class="edit-btn" onclick="editUser('${id}', '${user.username}', '${user.email}')">Edit</button>
              <button class="delete-btn" onclick="deleteUser('${id}')">Delete</button>
            </div>
          </div>
        `;
      });
    } else {
      container.innerHTML = "<p class='empty-state'>No contacts yet — add your first one above 👆</p>";
    }
  });
}

// Delete Data
async function deleteUser(id) {
  await firebase.database().ref("users/" + id).remove();
  alert("User deleted");
}

// Edit Data
async function editUser(id, currentUsername, currentEmail) {
  const newUsername = prompt("Enter new username:", currentUsername);
  const newEmail = prompt("Enter new email:", currentEmail);

  if (newUsername && newEmail) {
    await firebase.database().ref("users/" + id).update({
      username: newUsername,
      email: newEmail
    });
    alert("Data updated successfully");
  }
}

// Call display function on load
displayAllData();