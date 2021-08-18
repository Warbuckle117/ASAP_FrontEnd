import Cookies from "js-cookie";

class DataHandler {
  constructor() {
    this.use_mock_data = true;
    if (process.env.REACT_APP_MOCKAPIMODE === "production") {
      this.use_mock_data = false;
    }
    this.apiBase = process.env.REACT_APP_APIURL;

    if (this.use_mock_data) {
      const rawMockData = Cookies.get("mock_data");
      if (rawMockData) {
        const mockData = JSON.parse(rawMockData);
        this.status_mock_data = mockData;
      } else {
        this.status_mock_data = this.getMockStatusData();
        this.updateMockDataCookie(this.status_mock_data);
      }
    }
  }

  async updateMockDataCookie(mockData) {
    return this.promiseInput(
      Cookies.set("mock_data", JSON.stringify(mockData), { expires: 1 })
    );
  }

  async getAircraft() {
    // returns a an array of objects containing aircraft type data
    if (this.use_mock_data) {
      return this.promiseInput(this.getMockAircraftData());
    } else {
      try {
        const response = await fetch(`${this.apiBase}/aircraft`);
        return await response.json();
      } catch (error) {
        console.log("Request failed", error);
      }
    }
  }

  async getBases() {
    // returns an array of objects containing bases data
    if (this.use_mock_data) {
      return this.promiseInput(this.getMockBaseData());
    } else {
      try {
        const response = await fetch(`${this.apiBase}/base`);
        return await response.json();
      } catch (error) {
        console.log("Request failed", error);
      }
    }
  }

  async getStatus() {
    // returns an array of objects containing status data for all loaded tail numbers
    if (this.use_mock_data) {
      return this.promiseInput(this.status_mock_data);
    } else {
      try {
        const response = await fetch(`${this.apiBase}/status`);
        return await response.json();
      } catch (error) {
        console.log("Request failed", error);
      }
    }
  }

  async postStatus(new_status_data) {
    //should create a new and unique tail number with user specified status data and add it to the status list
    // verify that the new_status_data contains valid data
    // verify that no record with a matching tail number exists in the status list

    // add the new_status_data to status list
    if (this.use_mock_data) {
      if (
        this.verifyNewStatusData(new_status_data) &&
        !this.findRecordByTail(new_status_data.status_tail_number)
      ) {
        let currentID =
          this.status_mock_data[this.status_mock_data.length - 1].status_id;
        const post_status_data = Object.assign({}, new_status_data);
        post_status_data["status_id"] = currentID++;
        this.status_mock_data.push(post_status_data);
        await this.updateMockDataCookie(this.status_mock_data);
        return this.promiseInput(post_status_data);
      } else {
        throw new Error("did not pass data validation");
      }
    } else {
      const post_status_data = Object.assign({}, new_status_data);
      try {
        const response = await fetch(`${this.apiBase}/status`, {
          method: "post",
          credentials: "omit", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          mode: "cors",
          body: JSON.stringify(post_status_data),
        });
        return await response.json();
      } catch (error) {
        console.log("Request failed", JSON.stringify(error));
      }
    }
  }

  async editStatus(new_status_data, status_id) {
    // should modify the status data for a specified tail number and update the status list entry
    // verify that the new_status_data object contains valid data
    // verify that there is a record in the status list with a matching tail number
    if (this.use_mock_data) {
      //mock
      if (
        this.verifyNewStatusData(new_status_data) &&
        status_id !== undefined &&
        (this.findRecordByID(status_id) === 0 || this.findRecordByID(status_id))
      ) {
        const edit_status_data = Object.assign({}, new_status_data);
        edit_status_data["status_id"] = status_id;
        let recordID = this.findRecordByID(status_id);
        this.status_mock_data[recordID] = edit_status_data;
        await this.updateMockDataCookie(this.status_mock_data);
        return this.promiseInput(
          this.status_mock_data[this.findRecordByID(status_id)]
        );
      } else {
        throw new Error("Failed to edit record or record not found");
      }
    } else {
      //real
      const edit_status_data = Object.assign({}, new_status_data);
      try {
        const response = await fetch(`${this.apiBase}/status/${status_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(edit_status_data),
        });
        return await response.json();
      } catch (error) {
        console.log("Request failed", JSON.stringify(error));
      }
    }
  }

  async deleteStatus(status_id) {
    // should remove a tail number and it's corresponding status data from the status list
    // verify that status_data_to_delete exists within the status list
    console.log("inside delete status1", status_id);

    console.log("inside delete status2", status_id);
    // remove status_data_to_delete's matching record from the status list
    if (this.use_mock_data) {
      if (
        this.findRecordByID(status_id) === 0 ||
        this.findRecordByID(status_id)
      ) {
        let recordID = this.findRecordByID(status_id);
        const delete_status_data = Object.assign(
          {},
          this.status_mock_data[recordID]
        );
        this.status_mock_data.splice(recordID, 1);
        await this.updateMockDataCookie(this.status_mock_data);
        return this.promiseInput(delete_status_data);
      } else {
        return new Error("Failed to delete record or record not found");
      }
    } else {
      try {
        const response = await fetch(`${this.apiBase}/status/${status_id}`, {
          method: "delete",
          credentials: "omit", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          mode: "cors",
        });
        return await response.json();
      } catch (error) {
        console.log("Request failed", JSON.stringify(error));
      }
    }
  }

  //this function should be used on mocks only
  findRecordByID(status_id) {
    if (status_id === 0 || status_id) {
      for (let i = 0; i < this.status_mock_data.length; i++) {
        if (this.status_mock_data[i].status_id === status_id) {
          return i;
        }
      }
    } else {
      console.log("this function has a paramter find record", status_id);
      return false;
    }
    console.log("record not found in find record by id", status_id);
    return false;
  }

  findRecordByTail(tail_number) {
    // search status list and return a boolean indicating if a record is in the status list
    if (tail_number) {
      for (let i = 0; i < this.status_mock_data.length; i++) {
        if (this.status_mock_data[i].status_tail_number === tail_number) {
          return true;
        }
      }
    } else {
      console.log("this function has a paramter check for record");
      return false;
    }
    return false;
  }

  // aircraft_id: 2
  // base_id: 1
  // status_description: "A nice airshow jet"
  // status_id: 2
  // status_is_flyable: false
  // status_priority: 1
  // status_tail_number: 15000202

  verifyNewStatusData(new_status_data) {
    console.log(
      new_status_data["status_tail_number"] !== undefined,
      typeof new_status_data["status_tail_number"] === "string",

      new_status_data["aircraft_id"] !== undefined,
      typeof new_status_data["aircraft_id"] === "number",

      new_status_data["base_id"] !== undefined,
      typeof new_status_data["base_id"] === "number",

      new_status_data["status_is_flyable"] !== undefined,
      typeof new_status_data["status_is_flyable"] === "boolean",

      new_status_data["status_description"] !== undefined,
      typeof new_status_data["status_description"] === "string",

      new_status_data["status_priority"] !== undefined,
      typeof new_status_data["status_priority"] === "number"
    );
    return (
      true &&
      new_status_data["status_tail_number"] !== undefined &&
      typeof new_status_data["status_tail_number"] === "string" &&
      new_status_data["aircraft_id"] !== undefined &&
      typeof new_status_data["aircraft_id"] === "number" &&
      new_status_data["base_id"] !== undefined &&
      typeof new_status_data["base_id"] === "number" &&
      new_status_data["status_is_flyable"] !== undefined &&
      typeof new_status_data["status_is_flyable"] === "boolean" &&
      new_status_data["status_description"] !== undefined &&
      typeof new_status_data["status_description"] === "string" &&
      new_status_data["status_priority"] !== undefined &&
      typeof new_status_data["status_priority"] === "number"
    );
  }

  //utility function
  promiseInput(input) {
    //the input parameter is in scope to the below promise now
    return new Promise(function (resolve, reject) {
      resolve(input);
    });
  }

  getMockAircraftData() {
    return [
      {
        aircraft_id: 1,
        aircraft_name: "c-17",
      },
      {
        aircraft_id: 2,
        aircraft_name: "f-16",
      },
      {
        aircraft_id: 3,
        aircraft_name: "kc-135",
      },
      {
        aircraft_id: 4,
        aircraft_name: "b-52",
      },
    ];
  }

  getMockBaseData() {
    return [
      {
        base_id: 1,
        base_name: "Pope AFB",
      },
      {
        base_id: 2,
        base_name: "JB Charleston",
      },
      {
        base_id: 3,
        base_name: "Travis AFB",
      },
      {
        base_id: 4,
        base_name: "Dover AFB",
      },
    ];
  }

  getMockStatusData() {
    return [
      {
        status_id: 1,
        status_tail_number: "15000101",
        aircraft_id: 1,
        aircraft_name: "c-17",
        base_id: 2,
        base_name: "JB Charleston",
        status_is_flyable: true,
        status_description: "I move lots of shit",
        status_priority: 1,
        updated_at: "2021-08-17T21:20:51.486Z",
      },
      {
        status_id: 2,
        status_tail_number: "15000202",
        aircraft_id: 2,
        aircraft_name: "f-16",
        base_id: 1,
        base_name: "Pope AFB",
        status_is_flyable: false,
        status_description: "A nice airshow jet",
        status_priority: 1,
        updated_at: "2021-08-17T21:20:51.486Z",
      },
      {
        status_id: 3,
        status_tail_number: "15000303",
        aircraft_id: 4,
        aircraft_name: "b-52",
        base_id: 4,
        base_name: "Dover AFB",
        status_is_flyable: true,
        status_description: "Da boom boom dropper",
        status_priority: 2,
        updated_at: "2021-08-17T21:20:51.486Z",
      },
      {
        status_id: 4,
        status_tail_number: "15000404",
        aircraft_id: 3,
        aircraft_name: "kc-135",
        base_id: 3,
        base_name: "Travis AFB",
        status_is_flyable: false,
        status_description: "We got the gas",
        status_priority: 3,
        updated_at: "2021-08-17T21:20:51.486Z",
      },
      {
        status_id: 6,
        status_tail_number: "117",
        aircraft_id: 1,
        aircraft_name: "c-17",
        base_id: 1,
        base_name: "Pope AFB",
        status_is_flyable: true,
        status_description: "I'm heavy",
        status_priority: 1,
        updated_at: "2021-08-17T21:51:30.899Z",
      },
    ];
  }
}

export default DataHandler;
