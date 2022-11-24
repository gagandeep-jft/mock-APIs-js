let tbody = document.querySelector("tbody");
let api = new Employees();

class Employee {
  constructor(empName, empJob, empSalary, id) {
    this.name = empName;
    this.job = empJob;
    this.salary = empSalary;
    this.id = id;
  }
}

// ==============  Employee Record Tag Generation ==============
const generateEmpTag = (empName, empJob, empSalary, id) => {
  let tr = document.createElement("tr");
  tr.id = id;
  let name = document.createElement("td");
  name.innerHTML = empName;

  let job = document.createElement("td");
  job.innerHTML = empJob;

  let salary = document.createElement("td");
  salary.innerHTML = empSalary;

  tr.appendChild(name);
  tr.appendChild(job);
  tr.appendChild(salary);

  let buttons = document.createElement("td");
  let editBtn = document.createElement("button");
  editBtn.className = "edit-btn btn btn-primary mx-2";
  editBtn.innerHTML = "Edit";
  editBtn.id = `edit-btn-${id}`;

  // event listener for edit button
  editBtn.addEventListener("click", () => {
    api.get(id, (obj) =>
      setInputField(obj.name, obj.job, obj.salary, obj.id, true)
    );
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn btn btn-danger";
  deleteBtn.innerHTML = "Delete";
  deleteBtn.id = `delete-btn-${id}`;

  deleteBtn.addEventListener("click", () => {
    deleteEmp(id);
  });

  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  tr.appendChild(buttons);

  return tr;
};

//  ============== Render Employee ==============
function addToTable(tag) {
  tbody.appendChild(tag);
}

// ==============  Submit Button Handler ==============
document.getElementById("add-emp").addEventListener("click", () => {
  if (document.getElementById("add-emp").classList.contains("d-none")) {
    return;
  }
  let [name, job, salary, ,] = getInputField();

  console.log(name, job, salary);

  if (!(name && job && salary)) {
    alert("Missing field!");
    return;
  }

  let emp = new Employee(name, job, salary);

  api.post(emp, (id) => {
    addToTable(generateEmpTag(name, job, salary, id));
    setInputField();
  });
});

// ============== get input field data ==============
function getInputField() {
  let name = document.getElementById("name").value;
  let job = document.getElementById("job").value;
  let salary = document.getElementById("salary").value;
  let id = document.getElementById("empID").value;
  return [name, job, salary, id];
}

// ============== set input field data ==============
function setInputField(name, job, salary, id, updateEmp) {
  document.getElementById("name").value = name ?? "";
  document.getElementById("job").value = job ?? "";
  document.getElementById("salary").value = salary ?? "";

  document.getElementById("empID").value = id ?? "";
  //   console.log(id);

  let submitBtn = document.getElementById("add-emp");
  let updateBtn = document.getElementById("update-emp");

  if (updateEmp) {
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
  } else {
    if (submitBtn.classList.contains("d-none")) {
      submitBtn.classList.remove("d-none");
    }
    if (!updateBtn.classList.contains("d-none")) {
      updateBtn.classList.add("d-none");
    }
  }
}

function removeFromTable(id) {
  let tags = [...tbody.children];
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].id == id) {
      console.log("found and removed");
      tbody.removeChild(tags[i]);
      break;
    }
  }
}

// ============== Update Button Handler ==============

document.getElementById("update-emp").addEventListener("click", () => {
  if (document.getElementById("update-emp").classList.contains("d-none")) {
    return;
  }

  let [name, job, salary, id] = getInputField();

  if (!(name && job && salary)) {
    alert("Missing field!");
    return;
  }

  let emp = new Employee(name, job, salary, id);

  api.put(emp, () => {
    removeFromTable(id);
    setInputField();
    tbody.appendChild(generateEmpTag(name, job, salary, id));
  });
});

function deleteEmp(id) {
  api.delete(id, () => {
    let tr = document.getElementById(id);
    tbody.removeChild(tr);
  });
}

// let emp = new Employee("Gagan", "SWE Trainee", "5LPA");
// emp.add();

// let emp2 = new Employee("Vishal", "SWE Trainee", "5LPA");
// emp2.add();

// let emp3 = new Employee("Khusboo", "SWE Trainee", "5LPA");
// emp3.add();

// let emp4 = new Employee("Haren", "SWE Trainee", "5LPA");
// emp4.add();
