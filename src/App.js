import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import StatusForm from './components/StatusForm';
import StatusList from './components/StatusList';
import DataHandler from './components/DataHandler';
import asap from './asap.png';
import './App.css';

const App = () => {
  const [statusData, setStatusData] = useState([])
  const [aircraftData, setAircraftData] = useState([])
  const [baseData, setBaseData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  //-1 on current status item means no data is loaded to edit form
  const [currentStatusItem, setCurrentStatusItem] = useState(-1)
  const [currentArrayItem, setCurrentArrayItem] = useState(-1)

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
    <main className='container'>
      <section className='row justify-content-center'>
        <div className='col-8 text-center'>
          <img src={asap} className="img-fluid" alt='ASAP'/>
          <h1>Aircraft Status And Position</h1>
        </div>
      </section>
      <section className='row'>
          <StatusForm currentStatusItem={currentStatusItem} currentArrayItem={currentArrayItem} statusData={statusData} aircraftData={aircraftData} baseData={baseData} setItemCallback={(item) => setCurrentStatusItem(item)} />
      </section>
      <section className='row'>
        <Switch >
          <Route exact path='/' >
            <StatusList statusData={statusData} aircraftData={aircraftData} baseData={baseData} setItemCallback={(item) => setCurrentStatusItem(item)} setArrayItemCallback={(item) => setCurrentArrayItem(item)}/>
          </Route>
        </Switch>
      </section>


    </main>
  );
};

export default App;
