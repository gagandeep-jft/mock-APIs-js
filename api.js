const API_URL = "http://localhost:3000/data";

function EmployeesAPI() {
  this.saveLocalData = (data) => {
    if (data) localStorage.setItem("data", JSON.stringify(data));
  };

  this.getLocalData = () => {
    return localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : [];
  };

  this.post = (emp, callback) => {
    $.post(
      API_URL,
      emp,
      (emp) => {
        console.log(emp);
        callback(emp);
        this.sync();
      },
      "json"
    );
  };

  this.put = (emp, callback) => {
    $.ajax({
      url: `${API_URL}/${emp.id}`,
      type: "PUT",
      data: emp,
      success: (response) => {
        callback(response);
        this.sync();
      },
    });
  };

  this.delete = (id, callback) => {
    console.log(id);
    $.ajax({
      url: `${API_URL}/${id}`,
      type: "DELETE",
      success: (result) => {
        callback();
        this.sync();
      },
      error: () => {
        callback();
        this.sync();
      },
    });
  };

  this.get = (id, callback) => {
    $.getJSON(`${API_URL}/${id}`, (result) => {
      callback(result);
      this.sync();
    });
  };
  this.sync = (callback) => {
    $.getJSON(API_URL, {}, (result) => {
      if (callback) callback(result);
      this.saveLocalData(result);
    });
  };
}
