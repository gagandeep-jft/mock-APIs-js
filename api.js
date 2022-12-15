const API_URL = "http://localhost:6969/data";
const AUTH_URL = "http://localhost:6969/auth";
const UNAUTH_URL = "http://localhost:6969/unauth";

function EmployeesAPI() {
  this.saveLocalData = (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  this.getLocalData = () => {
    return localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : [];
  };

  this.getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  this.post = async (emp) => {
    return $.ajax({
      url: API_URL,
      data: JSON.stringify(emp),
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      success: () => this.sync(),
      error: (error) => {
        throw error;
      },
    });
  };

  this.put = async (emp) => {
    return $.ajax({
      url: `${API_URL}/${emp.id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(emp),
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      success: () => this.sync(),
    });
  };

  this.delete = async (id) => {
    return await $.ajax({
      url: `${API_URL}/${id}`,
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      type: "DELETE",
      success: () => this.sync(),
      error: () => this.sync(),
    });
  };

  this.get = async (id) => {
    return $.ajax({
      url: `${API_URL}/${id}`,
      type: "GET",
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      contentType: "application/json",
      success: () => this.sync(),
      error: (err) => {
        throw err;
      },
    });
  };

  this.sync = async () => {
    return $.ajax({
      url: API_URL,
      type: "GET",
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      success: (result) => {
        this.saveLocalData(result);
      },
      error: async (err) => {
        console.log(JSON.stringify(err));
        throw err;
      },
    });
  };

  this.auth = async (email, password, remeberMe) => {
    let result = await $.ajax({
      url: AUTH_URL,
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({ email, password, remeberMe }),
    });
    console.log(result);
    sessionStorage.setItem("accessToken", result.accessToken);
  };

  this.unAuth = async () => {
    await $.ajax({
      url: UNAUTH_URL,
      contentType: "application/json",
      type: "POST",
      headers: {
        Authorization: "Bearer " + this.getAccessToken(),
      },
      data: JSON.stringify({ accessToken: this.getAccessToken() }),
      success: () => sessionStorage.removeItem("accessToken"),
      error: (err) => console.log(JSON.stringify(err)),
    });
  };
}
