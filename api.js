const delay = 2000; // 2s

function Employees() {
  this.employees = [];
  this.globalCounter = 0;

  this.post = (emp, callback) => {
    setTimeout(() => {
      emp.id = this.globalCounter++;
      this.employees.push(emp);
      callback(emp.id);
    }, delay);
  };

  this.put = (emp, callback) => {
    setTimeout(() => {
      for (let i = 0; i < this.employees.length; i++) {
        // console.log(this.employees[i].id, emp.id);
        if (this.employees[i].id == emp.id) {
          this.employees[i] = emp;
          console.log("found and replaced");
          break;
        }
      }
      callback(emp);
    }, delay);
  };

  this.delete = (id, callback) => {
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
      callback(id);
    }, delay);
  };

  this.get = (id, callback) => {
    setTimeout(() => {
      let result;

      for (let i = 0; i < this.employees.length; i++) {
        if (id == this.employees[i].id) {
          result = this.employees[i];
          break;
        }
      }

      callback(result);
    }, delay);
  };
}
