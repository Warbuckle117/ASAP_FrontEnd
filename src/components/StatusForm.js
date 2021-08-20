import React, { useState, useEffect } from 'react';
import DataHandler from './DataHandler';

import { PRIORITY_LIST_NUM, PRIORITY_LIST_STR, FLYABLE_STR } from '../constants';

const StatusForm = (props) => {
  const [statusID, setStatusID] = useState();
  const [tailNumber, setTailNumber] = useState();
  const [aircraftID, setAircraftID] = useState();
  const [aircraftName, setAircraftName] = useState();
  const [baseID, setBaseID] = useState();
  const [base, setBase] = useState();
  const [flyable, setFlyable] = useState();
  const [description, setDescription] = useState();
  const [priority, setPriority] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const FLYABLE_BOOL = (isFlyable) => {
    if (isFlyable === '') return '';
    return isFlyable ? 'Flyable' : 'Non-Flyable';
  };
  const tailNumberChange = (event) => {
    const value = event.target.value;
    setTailNumber(value);
  };

  useEffect(() => {
    if (responseData !== undefined) {
    if (responseData['message'] !== undefined) {
      console.log('got to message')
        if (props.currentStatusItem < 0) {
          let decrementCurrentItem = props.currentStatusItem - 1;
          props.setItemCallback(decrementCurrentItem)
        } else {
          props.setItemCallback(-1)
        }
    }
  }
  },[responseData])

  const aircraftNameChange = (event) => {
    const value = event.target.value;
    // make sure to set aircraft id as well
    setAircraftID(parseInt(value));
    // use prop bases to update base name
    setAircraftName(() => {
      for (let i = 0; i < props.aircraftData.length; i++) {
        if (props.aircraftData[i].aircraft_id === parseInt(value)) {
          return props.aircraftData[i].aircraft_name;
        }
      }
    });
  };

  const baseChange = (event) => {
    const value = event.target.value;
    //make sure to set base id as well
    setBaseID(parseInt(value));
    setBase(() => {
      for (let i = 0; i < props.baseData.length; i++) {
        if (props.baseData[i].base_id === parseInt(value)) {
          return props.baseData[i].base_name;
        }
      }
    });
  };

  const flyableChange = (event) => {
    const value = event.target.value;
    setFlyable(FLYABLE_STR[value]);
  };

  const descriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);
  };

  const priorityChange = (event) => {
    const value = event.target.value;
    setPriority(PRIORITY_LIST_STR[value]);
  };

  const handleClearForm = () => {
    if (props.currentStatusItem < 0) {
      let decrementCurrentItem = props.currentStatusItem - 1;
      props.setItemCallback(decrementCurrentItem)
    } else {
      props.setItemCallback(-1)
    }
    setResponseData('')
  };

  const handleModifyForm = () => {
    setIsLoading(true);

    // check if it is a new or an edit, if currentItem is -1 it "should" be a new
    const formData = {
      status_id: props.currentStatusItem,
      status_tail_number: tailNumber,
      aircraft_id: aircraftID,
      aircraft_name: aircraftName,
      base_id: baseID,
      base_name: base,
      status_is_flyable: flyable,
      status_description: description,
      status_priority: priority
    };
    console.log('form data', formData)
    const dataHandler = new DataHandler();
    try {
      dataHandler.editStatus(formData, props.currentStatusItem).then((data) => setResponseData(data));
    } catch (error) {
      console.error(error);
    }
  };

  const findRecordByID = (status_id) => {
    if (status_id === 0 || status_id) {
      for (let i = 0; i < props.statusData; i++) {
        if (props.statusData[i].status_id === status_id) {
          return i;
        }
      }
    } else {
      console.log('this function has a paramter find record', status_id)
      return false;
    }
    console.log('record not found in find record by id', status_id);
    return false;
  };

  const handleDeleteForm = () => {
    const dataHandler = new DataHandler();
    try {
      dataHandler.deleteStatus(statusID).then((data) => setResponseData(data));
    } catch (error) {
      console.error(error);
    }
    props.setItemCallback(-1);
  };

  const displayResonseData = () => {
    if (responseData) {
      if (responseData['message'] !== undefined) {
        return <div className="d-grid gap-2"><button className="btn btn-success" onClick={handleClearForm}>{responseData['message']}</button></div>;
      } else
      if (responseData['error'] !== undefined) {
        return <div className="d-grid gap-2"><button className="btn bg-danger" onClick={handleClearForm}>{responseData['error']}</button></div>;
      } else
      {
        return <div>{JSON.stringify(responseData)}</div>
      }
    } else {
      return <div></div>
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // check if it is a new or an edit, if currentItem is -1 it "should" be a new
    const formData = {
      status_tail_number: tailNumber,
      aircraft_id: aircraftID,
      aircraft_name: aircraftName,
      base_id: baseID,
      base_name: base,
      status_is_flyable: flyable,
      status_description: description,
      status_priority: priority
    };
    console.log('form data', formData)
    const dataHandler = new DataHandler();
    try {
      dataHandler.postStatus(formData).then((data) => setResponseData(data));
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    if (props.currentStatusItem > -1) {
      setStatusID(props.statusData[props.currentArrayItem].status_id);
      setTailNumber(props.statusData[props.currentArrayItem].status_tail_number);
      setAircraftName(props.statusData[props.currentArrayItem].aircraft_name);
      setAircraftID(props.statusData[props.currentArrayItem].aircraft_id);
      setBase(props.statusData[props.currentArrayItem].base_name);
      setBaseID(props.statusData[props.currentArrayItem].base_id);
      setFlyable(props.statusData[props.currentArrayItem].status_is_flyable);
      setDescription(props.statusData[props.currentArrayItem].status_description);
      setPriority(props.statusData[props.currentArrayItem].status_priority);
      setIsDisabled(true)
      setResponseData('')
    } else {
      setStatusID('');
      setTailNumber('');
      setAircraftName('');
      setAircraftID('');
      setBase('');
      setBaseID('');
      setFlyable('');
      setDescription('');
      setPriority(0);
      setIsDisabled(false);
    }
  }, [props.currentStatusItem]);

  return (
    <div className="card col">
      <div className="card-header row">
        <div className="col">
          <h5>Input Form</h5>
        </div>
      </div>
      <div className="row">
        <div className="col"> {/* change to green successful/red failed banner*/}
          { displayResonseData() }
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Tail Number</label>
          <input className="form-control" type="text" name="tail-input" id="tailNumber" value={tailNumber} onChange={tailNumberChange} placeholder="Tail Number" disabled={isDisabled} />
        </div>
        <div className="col">
          <label className="form-label">Aircraft Type</label>
          <select className="form-select" name="aircraftName" id="aircraftName" value={aircraftID} onChange={aircraftNameChange} disabled={isDisabled}>
            <option value="" selected></option>
            {props.aircraftData &&
              props.aircraftData.map((aircraft) => <option value={aircraft.aircraft_id}>{`${aircraft.aircraft_name}`}</option>)}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Current Position</label>
          <select className="form-select" name="baseName" id="baseName" value={baseID} onChange={baseChange}>
            <option value="" selected></option>
            {props.baseData &&
              props.baseData.map((_base) => {
                return <option value={_base.base_id}>{`${_base.base_name}`}</option>;
              })}
          </select>

        </div>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Maintenance Status</label>
          <select className="form-select" name="flyable" id="flyable" value={FLYABLE_BOOL(flyable)} onChange={flyableChange}>
            <option value="" selected></option>
            <option className="bg-success" value="Flyable">Flyable</option>
            <option className="bg-danger" value="Non-Flyable">Non-Flyable</option>
          </select>
        </div>
        <div className="col">
          <label className="form-label">Maintenance Priority</label>
          <select className="form-select" name="priority" id="priority" value={PRIORITY_LIST_NUM[priority]} onChange={priorityChange}>
            <option value="" selected></option>
            <option className="bg-success" value="High">High</option>
            <option className="bg-warning" value="Medium">Medium</option>
            <option className="bg-danger" value="Low">Low</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Maintenance Description</label>
          <input className="form-control" type="text" name="description" id="description" value={description} onChange={descriptionChange} placeholder="Description" />
        </div>
      </div>
      <div className="row m-1">
        <div id="create-btn" id="create-btn" className="col d-grid gap-2"><button className="btn btn-primary" disabled={isDisabled} onClick={handleSubmit}>Create</button></div>
        <div id="modify-btn" className="col d-grid gap-2"><button className="btn btn-warning" disabled={!isDisabled} onClick={handleModifyForm}>Modify</button></div>
        <div id="delete-btn" className="col d-grid gap-2"><button className="btn btn-danger" disabled={!isDisabled} onClick={handleDeleteForm}>Delete</button></div>
        <div id="clear-btn" className="col d-grid gap-2"><button className="btn btn-info" onClick={handleClearForm}>Clear</button></div>
      </div>
    </div>
  )
}

export default StatusForm;