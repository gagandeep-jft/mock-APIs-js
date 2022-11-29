let tbody = document.querySelector("tbody");
let api = new EmployeesAPI();

// for sorting rows
let sortKey = "id";
let isAscOrder = true;

let mapSortFunc = {
  name: (obj, obj2) => {
    return getSortKey(obj.name.toLowerCase(), obj2.name.toLowerCase());
  },
  job: (obj, obj2) => {
    return getSortKey(obj.job.toLowerCase(), obj2.job.toLowerCase());
  },
  salary: (obj, obj2) => {
    return getSortKey(parseInt(obj.salary), parseInt(obj2.salary));
  },
  id: (obj, obj2) => {
    return getSortKey(parseInt(obj.id), parseInt(obj2.id));
  }, // default
};

/*
  TODO:
- [x] GET All Employee Data
- [x] POST Employee info
- [x] GET Employee Data and Populate HTML
- [x] PUT Employee info
- [x] DELETE Employee info
- [x] Sort Rows on basis of:
  - [x] id
  - [x] name
  - [x] job
  - [x] salary
*/

class Employee {
  constructor(empName, empJob, empSalary, id) {
    this.name = empName;
    this.job = empJob;
    this.salary = empSalary;
    this.id = id;
  }
}

const getSortKey = (ele1, ele2) => {
  if (ele1 < ele2) return -1;
  else if (ele1 > ele2) return 1;
  return 0;
};

const selectedFields = (a, b) => {
  if (isAscOrder) return mapSortFunc[sortKey](a, b);
  return mapSortFunc[sortKey](b, a);
};

const populate = (newData) => {
  if (!newData) {
    newData = api.getLocalData();
  }

  $("tbody").innerHTML = "";
  // console.log(newData);

  newData.sort(selectedFields);
  // console.log(newData);

  newData.forEach((emp) => {
    // check if element already exists,
    // if not, then add
    // else, remove them
    if ($(`#${emp.id}`).length <= 1) {
      $(`#${emp.id}`).remove();
      $(`#${emp.id}`).remove();
      generateEmpTag(emp);
    } else {
      $(`#${emp.id}`).remove();
    }
  });
};

function refreshTables() {
  api.sync((result) => {
    populate(result);
  });
}

$(document).ready(() => {
  data = api.getLocalData();
  populate(data);

  refreshTables();

  setInterval(() => {
    refreshTables();
  }, 30000);
});

// ==============  Employee Record Tag Generation ==============
const generateEmpTag = (emp) => {
  // console.log(emp)
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
      refreshTables();
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
    setInputField();
    e.preventDefault();
    refreshTables();
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
    refreshTables();
  });
});

$(".btn-sort").click(function () {
  sortKey = $(this).attr("name");
  isAscOrder = $(this).val() == "asc";
  $(".btn-sort").removeClass("btn-success");
  $(this).addClass("btn-success");
  $(this).removeClass("btn-dark");
  refreshTables();
});
