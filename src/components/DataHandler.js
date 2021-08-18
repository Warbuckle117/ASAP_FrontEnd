/*DataHandler.js
mock?=false
getAircraft()
getBases()
getStatus()
postStatus()
editStatus()
deleteStatus()*/
import Cookies from 'js-cookie'

class DataHandler {
  constructor(use_mock_data = true) {
    this.use_mock_data = use_mock_data;
    if (use_mock_data) {
      const rawMockData = Cookies.get('mock_data')
      if (rawMockData) {
        const mockData = JSON.parse(rawMockData)
        this.status_mock_data = mockData;
      } else {
        this.status_mock_data = this.getMockStatusData();
        this.updateMockDataCookie(this.status_mock_data)
      }
    }
  }

  async updateMockDataCookie(mockData) {
    return this.promiseInput(Cookies.set('mock_data', JSON.stringify(mockData), {expires: 1}))
  }

  async getAircraft() { // returns a an array of objects containing aircraft type data
    return this.use_mock_data
      ? this.promiseInput(this.getMockAircraftData())
      : "real fetch aircraft call";
  }

  async getBases() { // returns an array of objects containing bases data
    return this.use_mock_data
      ? this.promiseInput(this.getMockBaseData())
      : "real fetch bases call";
  }

  async getStatus() { // returns an array of objects containing status data for all loaded tail numbers
    return this.use_mock_data
      ? this.promiseInput(this.status_mock_data)
      : "real fetch status call";
  }

  async postStatus (new_status_data) { //should create a new and unique tail number with user specified status data and add it to the status list
    // verify that the new_status_data contains valid data
    // verify that no record with a matching tail number exists in the status list
    console.log('inside postStatus 1')
    if(this.verifyNewStatusData(new_status_data) && !this.findRecordByTail(new_status_data.status_tail_number)) {
      console.log('inside postStatus 2')
        // add the new_status_data to status list
        if(this.use_mock_data){
            let currentID = this.status_mock_data[this.status_mock_data.length-1].status_id
            const post_status_data = Object.assign({}, new_status_data);
            post_status_data['status_id'] = currentID++;
            this.status_mock_data.push(post_status_data);
            await this.updateMockDataCookie(this.status_mock_data)
            return this.promiseInput(post_status_data);
        } else {
            return "REAL POST REQUEST";
        }

    } else {
      throw new Error('did not pass datavalidation');
    }
    return new Error('Failed to post record or record already exists');
  }

  async editStatus (new_status_data, status_id) { // should modify the status data for a specified tail number and update the status list entry
    // verify that the new_status_data object contains valid data
    // verify that there is a record in the status list with a matching tail number
    if(this.verifyNewStatusData(new_status_data)
        && status_id !== undefined
        && (this.findRecordByID(status_id) === 0
        || this.findRecordByID(status_id)))
    {
        // update the record in status list
        if(this.use_mock_data){
            const edit_status_data = Object.assign({}, new_status_data);
            edit_status_data['status_id'] = status_id;
            let recordID = this.findRecordByID(status_id)
            this.status_mock_data[recordID] = edit_status_data;
            await this.updateMockDataCookie(this.status_mock_data)
            return this.promiseInput(this.status_mock_data[this.findRecordByID(status_id)]);
        } else {
            return "REAL EDIT REQUEST";
            //patch /status/:statusid
        }
    }
    return new Error('Failed to edit record or record not found');
  }

  async deleteStatus (status_id) { // should remove a tail number and it's corresponding status data from the status list
    // verify that status_data_to_delete exists within the status list
    if((this.findRecordByID(status_id) === 0
    || this.findRecordByID(status_id)))
    {
        // remove status_data_to_delete's matching record from the status list
        if(this.use_mock_data){
          let recordID = this.findRecordByID(status_id);
          const delete_status_data = Object.assign({}, this.status_mock_data[recordID]);
          this.status_mock_data.splice(recordID, 1);
          await this.updateMockDataCookie(this.status_mock_data)
          return this.promiseInput(delete_status_data);
        } else {
            return "REAL DELETE REQUEST";
        }
    }
    return new Error('Failed to delete record or record not found');
  }

  //this function should be used on mocks only
  findRecordByID (status_id) {
    if (status_id === 0 || status_id) {
      for (let i = 0; i < this.status_mock_data.length; i++) {
        if (this.status_mock_data[i].status_id === status_id) {
          return i;
        }
      }
    } else {
      console.log('this function has a paramter find record')
      return false;
    }
    return false;
  }

  findRecordByTail (tail_number) { // search status list and return a boolean indicating if a record is in the status list
    if (tail_number) {
      for (let i = 0; i < this.status_mock_data.length; i++) {
        if (this.status_mock_data[i].status_tail_number === tail_number) {
          return true
        }
      }
    } else {
      console.log('this function has a paramter check for record')
      return false;
    }
    return false;
  }

  // {‘status_tail_number’: ‘87-1502’, ‘aircraft_id’: 5, ‘base_id’: 6, ‘status_is_flyable’: true, ‘status_description’: ‘engine needs repair’, ‘status_priority’: 1}
//   {
//     "status_tail_number": "asdfasdf",
//     "aircraft_id": 0,
//     "base_id": 0,
//     "status_is_flyable": "1",
//     "status_description": "It Works!",
//     "status_priority": "1"
// }

  verifyNewStatusData (new_status_data) {
    return ( true
        && new_status_data['status_tail_number'] !== undefined
        && typeof new_status_data['status_tail_number'] === 'string'

        && new_status_data['aircraft_id'] !== undefined
        && typeof new_status_data['aircraft_id'] === 'number'

        && new_status_data['base_id'] !== undefined
        && typeof new_status_data['base_id'] === 'number'

        && new_status_data['status_is_flyable'] !== undefined
        && typeof new_status_data['status_is_flyable'] === 'boolean'

        && new_status_data['status_description'] !== undefined
        && typeof new_status_data['status_description'] === 'string'

        && new_status_data['status_priority'] !== undefined
        && typeof new_status_data['status_priority'] === 'number'
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
        aircraft_id: 0,
        aircraft_type: "A-10",
      },
      {
        aircraft_id: 1,
        aircraft_type: "C-17",
      },
      {
        aircraft_id: 2,
        aircraft_type: "F-16",
      },
      {
        aircraft_id: 3,
        aircraft_type: "KC-135",
      },
      {
        aircraft_id: 4,
        aircraft_type: "B-52",
      },
    ];
  }

  getMockBaseData() {
    return [
      {
        base_id: 0,
        base_name: "Davis–Monthan AFB",
      },
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
        status_id: 0,
        status_tail_number: 15000000,
        aircraft_id: 0,
        aircraft_name: "A-10",
        base_id: 0,
        base_name: "Davis–Monthan AFB",
        status_is_flyable: true,
        status_description: "BRRRT",
        status_repair_priority: 3,
        status_last_updated: "2021-07-29",
      },
      {
        status_id: 1,
        status_tail_number: 15000101,
        aircraft_id: 1,
          aircraft_name: "C-17",
        base_id: 2,
    	  base_name: "JB Charleston",
        status_is_flyable: true,
        status_description: "I move lots of shit",
        status_repair_priority: 1,
        status_last_updated: "2021-08-12",
      },
      {
        status_id: 2,
        status_tail_number: 15000202,
        aircraft_id: 2,
          aircraft_name: "F-16",
        base_id: 1,
          base_name: "Pope AFB",
        status_is_flyable: false,
        status_description: "A nice airshow jet",
        status_repair_priority: 1,
        status_last_updated: "2021-08-15",
      },
      {
        status_id: 3,
        status_tail_number: 15000303,
        aircraft_id: 4,
          aircraft_name: "B-52",
        base_id: 4,
          base_name: "Dover AFB",
        status_is_flyable: true,
        status_description: "Da boom boom dropper",
        status_repair_priority: 2,
        status_last_updated: "2021-08-11",
      },
      {
        status_id: 4,
        status_tail_number: 15000404,
        aircraft_id: 3,
          aircraft_name: "KC-135",
        base_id: 3,
          base_name: "Travis AFB",
        status_is_flyable: false,
        status_description: "We got the gas",
        status_repair_priority: 3,
        status_last_updated: "2021-08-14",
      },
    ];
  }
}

export default DataHandler;
