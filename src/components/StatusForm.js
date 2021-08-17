import React, { useState, useEffect } from 'react';
import DataHandler from './DataHandler';

const StatusForm = (props) => {
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

  const tailNumberChange = (event) => {
    const value = event.target.value;
    setTailNumber(value);
  };

  const aircraftNameChange = (event) => {
    const value = event.target.value;
    //make sure to set aircraft id as well
    setAircraftName(value);
  };

  const baseChange = (event) => {
    const value = event.target.value;
    //make sure to set base id as well
    setBase(value);
  };

  const flyableChange = (event) => {
    const value = event.target.value;
    setFlyable(value);
  };

  const descriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);
  };

  const priorityChange = (event) => {
    const value = event.target.value;
    setPriority(value);
  };

  const handleClearForm = () => {
    props.setItemCallback(-1)
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

      props.dataHandler.postStatus(formData).then((data) => setResponseData(data));
    props.setItemCallback(-1)
  }

  useEffect(() => {
    if (props.currentStatusItem !== -1) {
      setTailNumber(props.statusData[props.currentStatusItem].status_tail_number)
      setAircraftName(props.statusData[props.currentStatusItem].aircraft_name)
      setAircraftID(props.statusData[props.currentStatusItem].aircraft_id)
      setBase(props.statusData[props.currentStatusItem].base_name)
      setBaseID(props.statusData[props.currentStatusItem].base_id)
      setFlyable(props.statusData[props.currentStatusItem].status_is_flyable)
      setDescription(props.statusData[props.currentStatusItem].status_description)
      setPriority(props.statusData[props.currentStatusItem].status_repair_priority)
    } else {
      setTailNumber('')
      setAircraftName('')
      setAircraftID(0)
      setBase('')
      setBaseID(0)
      setFlyable('')
      setDescription('')
      setPriority('')
    }
  }, [props.currentStatusItem])

  return (
    <div>
      <form onSubmit={handleSubmit}>
	      <input  type="text"
                name="tailNumber"
                id="tailNumber"
                value={tailNumber}
                onChange={tailNumberChange}
                placeholder="Tail Number"
        />
        <input  type="text"
                name="aircraftName"
                id="aircraftName"
                value={aircraftName}
                onChange={aircraftNameChange}
                placeholder="Aircraft Name"
        />
        <input  type="text"
                name="base"
                id="base"
                value={base}
                onChange={baseChange}
                placeholder="Base"
        />
        <input  type="text"
                name="flyable"
                id="flyable"
                value={flyable}
                onChange={flyableChange}
                placeholder="Flyable"
        />
        <input  type="text"
                name="description"
                id="description"
                value={description}
                onChange={descriptionChange}
                placeholder="Description"/>
        <input  type="text"
                name="priority"
                id="priority"
                value={priority}
                onChange={priorityChange}
                placeholder="Priority"
        />
	      <input  type="submit"
                name="submit"
                id="submit"
        />
      </form>
      <button onClick={handleClearForm}>
        Clear
      </button>
    </div>
  )
}

export default StatusForm;