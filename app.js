let tbody = document.querySelector("tbody");
let api = new Employees();
let data = []; // for storing employee data

class Employee {
  constructor(empName, empJob, empSalary, id) {
    this.name = empName;
    this.job = empJob;
    this.salary = empSalary;
    this.id = id;
  }
}

const populate = (data) => {
  $("tbody").innerHTML = "";
  data.forEach((emp) => {
    generateEmpTag(emp);
  });
};

$(document).ready(() => {
  data = localStorage.getItem("data");
  if (data) {
    // console.log(data);
    populate(JSON.parse(data));
  } else {
    // get data from the server
  }
});

function sync() {
  // TODO
}

// ==============  Employee Record Tag Generation ==============
const generateEmpTag = (emp) => {
  let tr = $(`<tr id="${emp.id}">
    <td>${emp.name}</td>
    <td>${emp.job}</td>
    <td>${emp.salary}</td>
    <td>
      <button
        class="edit-btn btn btn-primary mx-2"
        id="edit-btn-${emp.id}">
        Edit
      </button>
      
      <button
        class="delete-btn btn btn-danger"
        id="delete-btn-${emp.id}">
        Delete
      </button>
    </td>
  </tr>`);

  $("tbody").append(tr);

  // event listener for edit button
  $(`#edit-btn-${emp.id}`).click(() => {
    api.get(emp.id).then(
      (obj, empData) => {
        setInputField(obj.name, obj.job, obj.salary, obj.id, true);
        data = empData;
      },
      () => {
        alert("[Error] GET request failed!");
      }
    );
  });

  $(`#delete-btn-${emp.id}`).click(() => {
    deleteEmp(emp.id);
  });
};

// ==============  Submit Button Handler ==============
$("#add-emp").click(async () => {
  if ($("#add-emp").hasClass("d-none")) {
    $("#update-emp").click();
    return;
  }
  let [name, job, salary, ,] = getInputField();
  let emp = null;

  console.log(name, job, salary);

  if (!(name && job && salary)) {
    alert("Missing field!");
    return;
  }

  [emp, data] = await api.post(new Employee(name, job, salary));
  generateEmpTag(emp);
  setInputField();
});

// ============== get input field data ==============
function getInputField() {
  return [
    $("#name").val(),
    $("#job").val(),
    $("#salary").val(),
    $("#empID").val(),
  ];
}

// ============== set input field data ==============
function setInputField(name, job, salary, id, isUpdate) {
  $("#name").val(name ?? "");
  $("#job").val(job ?? "");
  $("#salary").val(salary ?? "");

  $("#empID").val(id ?? "");

  let submitBtn = $("#add-emp");
  let updateBtn = $("#update-emp");

  if (isUpdate) {
    submitBtn.addClass("d-none");
    updateBtn.removeClass("d-none");
  } else {
    if (submitBtn.hasClass("d-none")) {
      submitBtn.removeClass("d-none");
    }
    if (!updateBtn.hasClass("d-none")) {
      updateBtn.addClass("d-none");
    }
  }
}

function removeFromTable(id) {
  $(`#${id}`).remove();
}

// ============== Update Button Handler ==============

$("#update-emp").click(async () => {
  if ($("#update-emp").hasClass("d-none")) {
    return;
  }

  let [name, job, salary, id] = getInputField();

  if (!(name && job && salary)) {
    alert("Missing field!");
    return;
  }

  let emp = new Employee(name, job, salary, id);

  data = await api.put(emp);
  removeFromTable(id);
  setInputField();
  generateEmpTag(emp);
});

async function deleteEmp(id) {
  data = await api.delete(id);
  $(`#${id}`).remove();
}
