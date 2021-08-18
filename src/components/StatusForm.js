import React, { useState, useEffect } from 'react';
import DataHandler from './DataHandler';

import { PRIORITY_LIST_NUM } from '../constants';
import { PRIORITY_LIST_STR } from '../constants';
import { FLYABLE_STR } from '../constants';

const StatusForm = (props) => {
  const [statusID, setStatusID] = useState()
  const [tailNumber, setTailNumber] = useState()
  const [aircraftID, setAircraftID] = useState()
  const [aircraftName, setAircraftName] = useState()
  const [baseID, setBaseID] = useState()
  const [base, setBase] = useState()
  const [flyable, setFlyable] = useState()
  const [description, setDescription] = useState()
  const [priority, setPriority] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [responseData, setResponseData] = useState('')

  const FLYABLE_BOOL = (isFlyable) => {
    if (isFlyable === '')
        return '';
    return isFlyable ? 'Flyable' : 'Non-Flyable';
  }

  const tailNumberChange = (event) => {
    const value = event.target.value;
    setTailNumber(value);
  };

  const aircraftNameChange = (event) => {
    const value = event.target.value;
    //make sure to set aircraft id as well
    setAircraftID(parseInt(value));
  };

  const baseChange = (event) => {
    const value = event.target.value;
    //make sure to set base id as well
    setBaseID(parseInt(value));
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
    props.setItemCallback(-1)
  };

  const handleModifyForm = () => {
    setIsLoading(true);

    //check if it is a new or an edit, if currentItem is -1 it "should" be a new
    const formData = {
      status_id: statusID,
      status_tail_number: tailNumber,
      aircraft_id: aircraftID,
      aircraft_name: aircraftName,
      base_id: baseID,
      base_name: base,
      status_is_flyable: flyable,
      status_description: description,
      status_priority: priority};
      console.log('form data', formData)
      const dataHandler = new DataHandler();
      try {
        dataHandler.editStatus(formData, statusID).then((data) => setResponseData(data));
      } catch (error) {
        console.error(error);
      }
      if (props.currentStatusItem < 0) {
        let decrementCurrentItem = props.currentStatusItem-1;
        props.setItemCallback(decrementCurrentItem)
      } else {
        props.setItemCallback(-1)
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

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    //check if it is a new or an edit, if currentItem is -1 it "should" be a new
    const formData = {
      status_tail_number: tailNumber,
      aircraft_id: aircraftID,
      base_id: baseID,
      status_is_flyable: flyable,
      status_description: description,
      status_priority: priority};
      console.log('form data', formData)
      const dataHandler = new DataHandler();
      try {
        dataHandler.postStatus(formData).then((data) => setResponseData(data));
      } catch (error) {
        console.error(error);
      }
      if (props.currentStatusItem < 0) {
        let decrementCurrentItem = props.currentStatusItem-1;
        props.setItemCallback(decrementCurrentItem)
      } else {
        props.setItemCallback(-1)
      }
  }

  useEffect(() => {
    if (props.currentStatusItem > -1) {


      setStatusID(props.statusData[props.currentArrayItem].status_id)
      setTailNumber(props.statusData[props.currentArrayItem].status_tail_number)
      setAircraftName(props.statusData[props.currentArrayItem].aircraft_name)
      setAircraftID(props.statusData[props.currentArrayItem].aircraft_id)
      setBase(props.statusData[props.currentArrayItem].base_name)
      setBaseID(props.statusData[props.currentArrayItem].base_id)
      setFlyable(props.statusData[props.currentArrayItem].status_is_flyable)
      setDescription(props.statusData[props.currentArrayItem].status_description)
      setPriority(props.statusData[props.currentArrayItem].status_priority)
    } else {
      setStatusID('')
      setTailNumber('')
      setAircraftName('')
      setAircraftID('')
      setBase('')
      setBaseID('')
      setFlyable('')
      setDescription('')
      setPriority(0)
    }
  }, [props.currentStatusItem])

  return (

    <div>
      {responseData ? <div>{JSON.stringify(responseData)}</div> : <div></div>}
      <form onSubmit={handleSubmit}>
	      <input  type="text"
                name="tailNumber"
                id="tailNumber"
                value={tailNumber}
                onChange={tailNumberChange}
                placeholder="Tail Number"
        />
        <select name = "aircraftName"
                value={aircraftID}
                onChange={aircraftNameChange}>
            <option value = "" selected></option>
            {props.aircraftData && props.aircraftData.map((aircraft) => {
              return <option value={aircraft.aircraft_id}>{`${aircraft.aircraft_type}`}</option>
            })}
         </select>
        <select name = "baseName"
                value={baseID}
                onChange={baseChange}>
            <option value = "" selected></option>
            {props.baseData && props.baseData.map((_base) => {
              return <option value={_base.base_id}>{`${_base.base_name}`}</option>
            })}
         </select>
        <select name = "flyable"
                value={FLYABLE_BOOL(flyable)}
                onChange={flyableChange}>
            <option value = "" selected></option>
            <option value = "Flyable">Flyable</option>
            <option value = "Non-Flyable">Non-Flyable</option>
         </select>
        <input  type="text"
                name="description"
                id="description"
                value={description}
                onChange={descriptionChange}
                placeholder="Description"
        />
        <select name = "priority"
                value={PRIORITY_LIST_NUM[priority]}
                onChange={priorityChange}>
            <option value = "" selected></option>
            <option value = "High">High</option>
            <option value = "Medium">Medium</option>
            <option value = "Low">Low</option>
         </select>
	      <input  type="submit"
                name="submit"
                id="submit"
        />
      </form>
      <button onClick={handleModifyForm}>
        Modify
      </button>
      <button onClick={handleDeleteForm}>
        Delete
      </button>
      <button onClick={handleClearForm}>
        Clear
      </button>
    </div>
  )
}

export default StatusForm;