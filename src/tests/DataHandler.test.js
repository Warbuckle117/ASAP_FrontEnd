import DataHandler from '../components/DataHandler';

describe('The DataHandler Utility Class', () => {

//  beforeEach (() => {
//    //setup
//    const dataHandler = new DataHandler();
//  });

  it('Has a verifyNewStatusData function that returns true for valid data and false for invalid data', async () => {

      //setup
      const dataHandler = new DataHandler();

      const good_test_data = {"aircraft_id": 0, "base_id": 0, "status_description": "x", "status_id": 1, "status_priority": 1, "status_is_flyable": true, "status_tail_number": "1"};
      const bad_test_data = {"aircraft_id": "4", "base_id": 0, "status_description": 24, "status_id": 1, "status_priority": 1, "status_is_flyable": 4, "status_tail_number": false};
      const ugly_test_data = {"plane_id": 0, "bays_id": 0, "status_info": "x", "status_id": 1, "status_priority": 1, "status-is-flyable": true, "status_tale_number": "1"};

      expect(dataHandler.verifyNewStatusData(good_test_data)).toEqual(true);
      expect(dataHandler.verifyNewStatusData(bad_test_data)).toEqual(false);
      expect(dataHandler.verifyNewStatusData(ugly_test_data)).toEqual(false);
  });

  it('Provides Mock Data From getAircraft EndPoint', async () => {

    //setup
    const dataHandler = new DataHandler();

    //execute
    const results = await dataHandler.getAircraft();

    expect(results).toHaveLength(5);
  });

  it('Provides Mock Data From getBases EndPoint', async () => {

    //setup
    const dataHandler = new DataHandler();

    //execute
    const results = await dataHandler.getBases();

    expect(results).toHaveLength(5);
  });

  it('Provides Mock Data From getStatus EndPoint', async () => {

    //setup
    const dataHandler = new DataHandler();

    //execute
    const results = await dataHandler.getStatus();

    expect(results).toHaveLength(5);
  });

  it('Provides Mock Capability For postStatus EndPoint', async () => {

    //setup
    const dataHandler = new DataHandler();

    //execute
    const results = await dataHandler.getStatus();

    expect(results).toHaveLength(5);

    const postData = {status_tail_number: '87-1502', aircraft_id: 5, base_id: 6, status_is_flyable: true, status_description: 'engine needs repair', status_priority: 1};

    const results2 = await dataHandler.postStatus(postData);
    expect(results2.status_id).toBeDefined();

    const results3 = await dataHandler.getStatus();
    expect(results3).toHaveLength(6);
  });

  it('Provides Mock Capability For patchStatus EndPoint', async () => {

     const dataHandler = new DataHandler();
    const results = await dataHandler.getStatus();
    expect(results[0].base_id).toEqual(0);

    const patchData = {status_tail_number: '15000000', aircraft_id: 0, base_id: 1, status_is_flyable: false, status_description: 'good to go', status_priority: 3};

    await dataHandler.editStatus(patchData, 0)
    .then((res1) => {
      expect(res1.status_id).toEqual(0)
    })
    .then(() => dataHandler.getStatus())
    .then((res2) => {
      expect(res2[0].base_id).toEqual(1)
    })
  });

  it('Provides Mock Capability For deleteStatus EndPoint', async () => {

    const dataHandler = new DataHandler();
    const results = await dataHandler.getStatus();
    expect(results).toHaveLength(5);

    await dataHandler.deleteStatus(0)
    .then((res1) => {
      expect(res1.status_id).toEqual(0)
    })
    .then(() => dataHandler.getStatus())
    .then((res2) => {
      expect(res2).toHaveLength(4);
    })
    .then(() => dataHandler.deleteStatus(1))
    .then((res3) => {
      expect(res3.status_id).toEqual(1)
    })
    .then(() => dataHandler.getStatus())
    .then((res4) => {
      expect(res4).toHaveLength(3);
    })
 });
})
