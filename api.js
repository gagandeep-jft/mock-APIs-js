const API_URL = "http://localhost:6969/data";

function EmployeesAPI() {
  this.saveLocalData = (data) => {
    if (data) localStorage.setItem("data", JSON.stringify(data));
  };

  this.getLocalData = () => {
    return localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : [];
  };

  this.post = (emp) => {
    return $.post(
      API_URL,
      JSON.stringify(emp),
      (emp) => {
        this.sync();
      },
      "json"
    );
  };

  this.put = (emp) => {
    return $.ajax({
      url: `${API_URL}/${emp.id}`,
      type: "PUT",
      data: JSON.stringify(emp),
      success: this.sync,
    });
  };

  this.delete = (id) => {
    return $.ajax({
      url: `${API_URL}/${id}`,
      type: "DELETE",
      success: this.sync,
      error: this.sync,
    });
  };

  this.get = (id) => {
    return $.getJSON(`${API_URL}/${id}`, {}, this.sync);
  };
  
  this.sync = () => {
    return $.getJSON(API_URL, {}, (result) => {
      if (result);
      // console.log("updated")
      this.saveLocalData(result);
    });
  };
}
