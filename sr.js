let row = null;

//Form Submission
function Submit() {
  let Sdata = StudentData();
  if (Sdata == false) {
    msg.innerHTML = "Please fill the missing details!";
    return;
  }
  if (!validateForm(Sdata[0], Sdata[1], Sdata[2], Sdata[3])) {
    return;
  }
  if (row == null) {
    let storedata = StudentDataLS(Sdata);
    sinsert(storedata);
    msg.innerHTML = "Data Inserted!";
  } else {
    update();
    msg.innerHTML = "Data Updated!";
  }

  adjustTableHeight();
}

//Getting student data from form
function StudentData() {
  let sname = document.getElementById("name").value;
  let sid = document.getElementById("studentid").value;
  let semail = document.getElementById("email").value;
  let snum = document.getElementById("contact").value;
  let arr = [sname, sid, semail, snum];
  if (arr.includes("")) {
    return false;
  } else return arr;
}

//Storing and retrieving data from local storage
function StudentDataLS(Sdata) {
  let formData = JSON.parse(localStorage.getItem("formData")) || [];
  formData.push({
    sname: Sdata[0],
    sid: Sdata[1],
    semail: Sdata[2],
    snum: Sdata[3],
  });

  localStorage.setItem("formData", JSON.stringify(formData));
  return Sdata;
}

//Inserting data into the table
function sinsert(storedata) {
  let stable = document.getElementById("table_body");
  let row = document.createElement("tr");
  row.innerHTML = `<td class="border border-gray-500 px-4 py-2 w-[10em]">${storedata[0]}</td>
                   <td class="border border-gray-500 px-4 py-2 w-[10em]">${storedata[1]}</td>
                   <td class="border border-gray-500 px-4 py-2 w-[10em]">${storedata[2]}</td>
                   <td class="border border-gray-500 px-4 py-2 w-[10em]">${storedata[3]}</td>
                   <td class="border border-gray-500 px-4 py-2 w-[10em]">
                      <button onClick=editRow(this)><i class="fa-solid fa-pen-to-square"></i></button>
                      <button onClick=deletion(this)><i class="fa-solid fa-trash-can"></i></button>
                   </td>`;

  stable.appendChild(row);
  document.getElementById("ST").classList.remove("hidden");
  document.getElementById("Form").reset();

  adjustTableHeight();
}

//Edit function inside sinsert
function editRow(value) {
  row = value.parentElement.parentElement;

  document.getElementById("name").value = row.cells[0].innerHTML;
  document.getElementById("studentid").value = row.cells[1].innerHTML;
  document.getElementById("email").value = row.cells[2].innerHTML;
  document.getElementById("contact").value = row.cells[3].innerHTML;
}

//Update function to update existing row on pressing edit button
function update() {
  let Sdata = StudentData();
  if (Sdata == false) {
    msg.innerHTML = "Please fill the missing details!";
    return;
  }

  if (!validateForm(Sdata[0], Sdata[1], Sdata[2], Sdata[3])) {
    return;
  }

  row.cells[0].innerHTML = Sdata[0];
  row.cells[1].innerHTML = Sdata[1];
  row.cells[2].innerHTML = Sdata[2];
  row.cells[3].innerHTML = Sdata[3];

  let index = row.rowIndex - 1;
  let formData = JSON.parse(localStorage.getItem("formData")) || [];
  formData[index] = {
    sname: Sdata[0],
    sid: Sdata[1],
    semail: Sdata[2],
    snum: Sdata[3],
  };
  localStorage.setItem("formData", JSON.stringify(formData));

  row = null;
  document.getElementById("Form").reset();

  adjustTableHeight();
}

//Deleting the row
function deletion(value) {
  let ans = confirm("Confirm deletion of student Record?");
  if (ans == true) {
    let rowToDelete = value.parentElement.parentElement;

    let index = rowToDelete.rowIndex - 1;
    let formData = JSON.parse(localStorage.getItem("formData")) || [];
    formData.splice(index, 1);
    localStorage.setItem("formData", JSON.stringify(formData));

    document.getElementById("studentTable").deleteRow(rowToDelete.rowIndex);
    msg.innerHTML = "Data Deleted!";
    row = null;

    let tbody = document.getElementById("table_body");
    if (tbody.rows.length === 0) {
      document.getElementById("ST").classList.add("hidden");
    }

    adjustTableHeight();
  }
}

//Validating Form
function validateForm(Sname, sid, smail, sno) {
  let nameRegex = /^[A-Za-z ]+$/;
  let idRegex = /^[0-9]+$/;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let contactRegex = /^[0-9]{10,}$/;

  if (!nameRegex.test(Sname)) {
    msg.innerHTML = "Name must only contain characters!";
    return false;
  }
  if (!idRegex.test(sid)) {
    msg.innerHTML = "Id must only contain numbers!";
    return false;
  }
  if (!emailRegex.test(smail)) {
    msg.innerHTML = "Email must be in proper format!";
    return false;
  }
  if (!contactRegex.test(sno)) {
    msg.innerHTML =
      "Contact must only contain numbers and must be atleast 10 digits!";
    return false;
  }
  return true;
}

//Function to load existing data on reload
function loadTableFromLocalStorage() {
  let formData = JSON.parse(localStorage.getItem("formData")) || [];
  let stable = document.getElementById("table_body");
  stable.innerHTML = "";

  formData.forEach((item) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="border border-gray-500 px-4 py-2 w-[10em]">${item.sname}</td>
      <td class="border border-gray-500 px-4 py-2 w-[10em]">${item.sid}</td>
      <td class="border border-gray-500 px-4 py-2 w-[10em]">${item.semail}</td>
      <td class="border border-gray-500 px-4 py-2 w-[10em]">${item.snum}</td>
      <td class="border border-gray-500 px-4 py-2 w-[10em]">
        <button onClick=editRow(this)><i class="fa-solid fa-pen-to-square "></i></button>
        <button onClick=deletion(this)><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    stable.appendChild(row);
  });

  if (formData.length > 0) {
    document.getElementById("ST").classList.remove("hidden");
  } else {
    document.getElementById("ST").classList.add("hidden");
  }

  adjustTableHeight();
}

window.onload = loadTableFromLocalStorage;

// dynamically add vertical scrollbar
function adjustTableHeight() {
  const tbody = document.getElementById("table_body");
  const container = document.getElementById("ST");

  const rowCount = tbody.rows.length;

  if (rowCount > 2) {
    container.style.maxHeight = "300px";
    container.style.overflowY = "auto";
  } else {
    container.style.maxHeight = "none";
    container.style.overflowY = "visible";
  }
}
