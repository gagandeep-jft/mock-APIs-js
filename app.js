let tbody = document.querySelector("tbody");
let api = new EmployeesAPI();

// for sorting rows
let sortKey = "id";
let isAscOrder = true;

// for search
let searchResult = [];

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

class Employee {
  constructor(empName, empJob, empSalary, id) {
    this.name = empName;
    this.job = empJob;
    this.salary = empSalary;
    this.id = id;
    this.equals = (other) => {
      console.log(this, other);
      for (let key in this) {
        if (["id", "equals", "toObj"].includes(key)) {
          continue;
        }
        if (this[key] != other[key]) {
          // console.log(this[key])
          // console.log(other[key]);
          return false;
        }
      }
      return true;
    };
    this.toObj = () => {
      return JSON.parse(JSON.stringify(this));
    };
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

  // console.log(newData);
  $("tbody").empty();
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

async function refreshTables() {
  try {
    populate(await api.sync());
  } catch (e) {
    if (e.status === 401 || e.status == 403) {
      window.location.href = "/login.html";
      return;
    }
    // alert(JSON.stringify(e));
    populate(api.getLocalData());
  }
}

$(document).ready(() => {
  if (
    window.location.pathname == "/" ||
    window.location.pathname == "/index.html"
  ) {
    data = api.getLocalData();
    populate(data);
    refreshTables();
  }
  // setInterval(() => {
  //   refreshTables();
  // }, 30000);
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
  $(`#edit-btn-${emp.id}`).click(async () => {
    let obj = await api.get(emp.id);
    setInputField(obj.name, obj.job, obj.salary, obj.id, true);
  });

  $(`#delete-btn-${emp.id}`).click(async () => {
    await api.delete(emp.id);
    $(`#${emp.id}`).remove();
    refreshTables();
  });
};

// ==============  Submit Button Handler ==============
$("#add-emp").click(async function () {
  if ($(this).attr("id") != "add-emp") {
    $(this).attr("id").click();
    return;
  }
  let [isEmpty, emp] = getEmpData();
  if (isEmpty) {
    return;
  }

  emp = await api.post(emp.toObj());
  setInputField();
  refreshTables();
});

// ============== get input field data ==============
function getInputField() {
  return [
    $("#name").val().trim(),
    $("#job").val().trim(),
    $("#salary").val().trim(),
    $("#empID").val().trim(),
  ];
}

function getEmpData() {
  let emp = new Employee(...getInputField());

  if (!(emp.name && emp.job && emp.salary)) {
    alert("Missing field!");
    return [true, emp];
  }
  return [false, emp];
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

$("#update-emp").click(async function () {
  if ($(this).attr("id") != "update-emp") {
    $(this).attr("id").click();
    return;
  }

  let [isEmpty, emp] = getEmpData();
  if (isEmpty) {
    return;
  }
  emp = await api.put(emp.toObj());
  // console.log(emp.id, "is removed!");
  $(`#${emp.id}`).remove();
  setInputField();
  refreshTables();
});

// ============== Sort Buttons Handler ==============
$(".btn-sort").click(function () {
  if ($(this).hasClass("btn-success")) {
    $(this).removeClass("btn-success");
    $(this).addClass("btn-dark");
    sortKey = "id";
    isAscOrder = "asc";
    if (searchResult.length > 0) {
      populate(searchResult);
    } else {
      refreshTables();
    }
    return;
  }
  sortKey = $(this).attr("name");
  isAscOrder = $(this).val() == "asc";
  $(".btn-sort").removeClass("btn-success");
  $(".btn-sort").addClass("btn-dark");
  $(this).addClass("btn-success");
  $(this).removeClass("btn-dark");
  if (searchResult.length > 0) {
    populate(searchResult);
    return;
  }
  refreshTables();
});

// ============== Search Button Handler ==============

$("#search-emp").click(async () => {
  $("#clear-emp").toggleClass("d-none");
  let [isEmpty, emp] = getEmpData();
  if (isEmpty) {
    return;
  }
  let data;
  searchResult = [];

  try {
    data = await api.sync();
  } catch (e) {
    data = api.getLocalData();
  }
  for (let i = 0; i < data.length; i++) {
    if (emp.equals(data[i])) {
      searchResult.push(data[i]);
    }
  }
  if (!searchResult) {
    alert("[Error] Can't find the Employee");
    return;
  }
  populate(searchResult);
});

// ============== Clear Button Handler ==============

$("#clear-emp").click(async function () {
  setTimeout(setInputField, 300);
  searchResult = [];
  refreshTables();
  $(this).toggleClass("d-none");
});

// ============== Login Handler ==============

$("#login-btn").click(async function () {
  let email = $("#email").val();
  let password = $("#password").val();
  let rememberMe = $("#rememberMe").is(":checked");
  try {
    await api.auth(email, password, rememberMe);
    console.log(api.getAccessToken());
    location.replace("/");
    $("#form-error-message").addClass("d-none");
  } catch (e) {
    if (e.status === 401) {
      $("#form-error-message").removeClass("d-none");
    } else {
      $("#form-error-message").html(
        "Something went wrong, please try again later"
      );
      $("#form-error-message").removeClass("d-none");
    }
  }
});

// ============== Logout Button Handler =================

$("#logout-btn").click(async () => {
  await api.unAuth();
  location.replace("/");
});

// ============== Submission Handler =================

$("#emp-form").submit(async (e) => {
  e.preventDefault();
});
