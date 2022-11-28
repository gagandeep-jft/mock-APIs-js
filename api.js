const delay = 2000; // 2s

function Employees() {
  this.employees = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : [];

  this.globalCounter = this.employees.length + 1;

  this.storeData = () => {
    localStorage.setItem("data", JSON.stringify(this.employees));
  };

  this.post = (emp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        emp.id = ++this.globalCounter;
        this.employees.push(emp);
        resolve([emp, this.employees]);
        this.storeData();
      }, delay);
    });
  };

  this.put = (emp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (let i = 0; i < this.employees.length; i++) {
          // console.log(this.employees[i].id, emp.id);
          if (this.employees[i].id == emp.id) {
            this.employees[i] = emp;
            console.log("found and replaced");
            break;
          }
        }
        resolve(this.employees);
        this.storeData();
      }, delay);
    });
  };

  this.delete = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let index = -1;
        for (let i = 0; i < this.employees.length; i++) {
          if (this.employees[i].id == id) {
            index = i;
            break;
          }
        }
        if (index != -1) {
          this.employees.splice(index, 1);
          console.log("found and deleted employee");
        }
        resolve(this.employees);
        this.storeData();
      }, delay);
    });
  };

  this.get = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result;

        for (let i = 0; i < this.employees.length; i++) {
          if (id == this.employees[i].id) {
            result = this.employees[i];
            break;
          }
        }
        resolve(result, this.employees);
        this.storeData();
      }, delay);
    });
  };
}
