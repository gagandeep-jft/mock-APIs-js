let tbody = document.querySelector("tbody");
let api = new EmployeesAPI();
/*
  TODO:

- [x] GET All Employee Data
- [ ] POST Employee info
- [ ] GET Employee Data and Populate HTML
- [ ] PUT Employee info
- [ ] DELETE Employee info
*/

class Employee {
  constructor(empName, empJob, empSalary, id) {
    this.name = empName;
    this.job = empJob;
    this.salary = empSalary;
    this.id = id;
  }
}

const populate = (newData) => {
  $("tbody").innerHTML = "";
  console.log(newData);
  newData.forEach((emp) => {
    // check if element already exists,
    // if not, then add
    // else, remove them
    if ($(`#${emp.id}`).length === 0) {
      generateEmpTag(emp);
    } else if ($(`#${emp.id}`).length === 1) {
      return;
    } else {
      $(`#${emp.id}`).remove();
    }
  });
};

$(document).ready(() => {
  data =  api.getLocalData();
  populate(data);

  api.sync((result) => {
    populate(result);
  });

  // setInterval(() => {
  //   api.sync((result) => {
  //     populate(result, data);
  //   });
  // }, 30000);
});

// ==============  Employee Record Tag Generation ==============
const generateEmpTag = (emp) => {
  console.log(emp)
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
    console.log(emp);
    api.get(emp.id, (obj) => {
      setInputField(obj.name, obj.job, obj.salary, obj.id, true);
    });
  });

  $(`#delete-btn-${emp.id}`).click(() => {
    console.log(emp.id);
    api.delete(emp.id, () => {
      $(`#${emp.id}`).remove();
    });
  });
};

// ==============  Submit Button Handler ==============
$("#add-emp").click((e) => {
  if ($("#add-emp").hasClass("d-none")) {
    $("#update-emp").click();
    return;
  }
  let emp = new Employee(...getInputField());

  console.log(emp.name, emp.job, emp.salary);

  if (!(emp.name && emp.job && emp.salary)) {
    alert("Missing field!");
    return;
  }

  api.post(emp, (emp) => {
    // console.log(emp);
    generateEmpTag(emp);
    setInputField();
    e.preventDefault();
  });
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

// ============== Update Button Handler ==============

$("#update-emp").click(() => {
  if ($("#update-emp").hasClass("d-none")) {
    return;
  }

  let emp = new Employee(...getInputField());

  if (!(emp.name && emp.job && emp.salary)) {
    alert("Missing field!");
    return;
  }

  api.put(emp, (emp) => {
    // console.log(emp.id, "is removed!");
    $(`#${emp.id}`).remove();
    setInputField();
    generateEmpTag(emp);
  });
});
