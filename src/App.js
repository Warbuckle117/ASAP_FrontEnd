import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import StatusForm from './components/StatusForm';
import StatusList from './components/StatusList';
import DataHandler from './components/DataHandler';
import './App.css';

const App = () => {
  const [statusData, setStatusData] = useState([])
  const [aircraftData, setAircraftData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  //-1 on current status item means no data is loaded to edit form
  const [currentStatusItem, setCurrentStatusItem] = useState(-1)

  //useEffect for aircraft and bases
  useEffect(() => {
    setIsLoading(true);
    const dataHandler = new DataHandler();
    dataHandler.getAircraft().then((data) => setAircraftData(data)).then(() => setIsLoading(false));
    dataHandler.getBases().then((data) => setBaseData(data)).then(() => setIsLoading(false));
  }, [])

  //useEffect for status list depends on currentStatusItem
  useEffect(() => {
    setIsLoading(true);
    const dataHandler = new DataHandler();
    dataHandler.getStatus().then((data) => setStatusData(data)).then(() => setIsLoading(false));
  }, [currentStatusItem])


  return (
    <div className='App'>
      App Space holder
      <StatusForm statusData={statusData} aircraftData={aircraftData} baseData={baseData} />
      <Switch >
        <Route exact path='/' >
          <StatusList statusData={statusData} aircraftData={aircraftData} baseData={baseData}/>
        </Route>
      </Switch>

    </div>
  );
};

export default App;
