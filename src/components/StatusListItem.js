import React, { useState, useEffect } from 'react';
import { PRIORITY_LIST_NUM } from '../constants.js';

const StatusListItem = (props) => {

  const handleItemClick = () => {
    props.setItemCallback(props.statusItem.status_id);
    props.setArrayItemCallback(props.arrayItem);
    console.log('clicked item',props.statusItem.status_id)
  }

  const FLYABLE_BOOL = (isFlyable) => {
    if (isFlyable === '')
        return '';
    return isFlyable ? 'Flyable' : 'Non-Flyable';
  }

  const displayPriorityCol = () => {

    switch (props.statusItem.status_priority) {
      case 1:
      return (
        <div className="col bg-danger">
          {PRIORITY_LIST_NUM[props.statusItem.status_priority] + " Priority"}
        </div>)
      case 2:
        return (
          <div className="col bg-warning">
            {PRIORITY_LIST_NUM[props.statusItem.status_priority] + " Priority"}
          </div>)
          case 3:
          return (
            <div className="col bg-success">
              {PRIORITY_LIST_NUM[props.statusItem.status_priority] + " Priority"}
            </div>)
            default:
              return (
                <div className="col">
                  {PRIORITY_LIST_NUM[props.statusItem.status_priority] + " Priority"}
                </div>)
    }
  }

  const displayStatusCol = () => {
    switch (props.statusItem.status_is_flyable) {
      case true:
    return (
      <div className="col bg-success">
        {FLYABLE_BOOL(props.statusItem.status_is_flyable) + " Status"}
      </div>
    )
      case false:
        return (
          <div className="col bg-danger">
            {FLYABLE_BOOL(props.statusItem.status_is_flyable) + " Status"}
          </div>
        )
        default:
        return (
          <div className="col">
            {FLYABLE_BOOL(props.statusItem.status_is_flyable) + " Status"}
          </div>
        )
    }
  }



  useEffect(() => {

  }, [props.statusItem]);

  return props.shouldRender ?
  (
    <article id={props.id} className="row mt-1" onClick={handleItemClick}>
      <div className="card col">
        <div className="card-header row">
          <div className="col">
            <h5>{props.statusItem.status_tail_number}</h5>
          </div>
          <div className="col text-center">{props.statusItem.aircraft_name}</div>
          <div className="col text-end">{props.statusItem.base_name}</div>
        </div>
        <div className="row">
          <div className="col-8">
            <span>Description: <em>{props.statusItem.status_description}</em></span><br/>
            <span>Last Updated: {props.statusItem.updated_at.slice(0,10)}</span>
          </div>
          <div className="col-4">
            <div className="row">
            {displayPriorityCol()}
            </div>
            <div className="row">
            {displayStatusCol()}
            </div>
          </div>
        </div>
      </div>
    </article>
  ) :
  null;
}

export default StatusListItem;


{/* <div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */}

{/* <div class="card-header">
    Featured
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">An item</li>
    <li class="list-group-item">A second item</li>
    <li class="list-group-item">A third item</li>
  </ul> */}

// {"status_id":0,"status_tail_number":15000000,"aircraft_id":0,"aircraft_name":"A-10","base_id":0,"base_name":"Davis–Monthan AFB","status_is_flyable":true,"status_description":"BRRRT","status_priority":3,"status_last_updated":"2021-07-29"}