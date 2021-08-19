import React, { useState } from 'react';
import StatusListItem from './StatusListItem';

const StatusList = (props) => {
  return (
    <div className='col mt-2'>
    {props.statusData.map((statusItem, each) => {
      console.log(`SLI-${statusItem.status_tail_number}`);
      return <StatusListItem id={`SLI-${statusItem.status_tail_number}`} key={`item-${each}`} arrayItem={each} statusItem={statusItem} setItemCallback={(item) => props.setItemCallback(item)} setArrayItemCallback={(item) => props.setArrayItemCallback(item)}/>
    })}
    </div>
  )
}

export default StatusList;