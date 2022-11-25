const delay = 2000; // 2s

function Employees() {
  this.employees = [];
  this.globalCounter = 0;

  this.post = (emp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        emp.id = this.globalCounter++;
        this.employees.push(emp);
        resolve(emp.id);
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
        resolve();
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
        resolve(id);
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
        resolve(result);
      }, delay);
    });
  };
}
