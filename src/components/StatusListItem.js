import React, { useState, useEffect } from 'react';
import { PRIORITY_LIST } from '../constants';

const StatusListItem = (props) => {

  const handleItemClick = () => {
    props.setItemCallback(props.statusItem.status_id);
    props.setArrayItemCallback(props.arrayItem);
    console.log('clicked item',props.statusItem.status_id)
  }

  useEffect(() => {

  }, [props.statusItem]);

  return (
    <article onClick={handleItemClick} >
      <ul>
        <li>{"Tail Number: " + props.statusItem.status_tail_number}</li>
        <li>{"Acft: " + props.statusItem.aircraft_name}</li>
        <li>{"Base: " + props.statusItem.base_name}</li>
        <li>{"Flyable: " + props.statusItem.status_is_flyable}</li>
        <li>{"Description: " + props.statusItem.status_description}</li>
        <li>{"Priority: " + PRIORITY_LIST[props.statusItem.status_priority]}</li>
      </ul>
    </article>
  )
}

export default StatusListItem;


// {"status_id":0,"status_tail_number":15000000,"aircraft_id":0,"aircraft_name":"A-10","base_id":0,"base_name":"Davis–Monthan AFB","status_is_flyable":true,"status_description":"BRRRT","status_priority":3,"status_last_updated":"2021-07-29"}