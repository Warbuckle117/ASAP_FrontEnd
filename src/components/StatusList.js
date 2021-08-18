import React, { useState } from 'react';
import StatusListItem from './StatusListItem';

const StatusList = (props) => {
  return (
    <div className='col mt-2'>
    {props.statusData.map((statusItem, each) => {
      return <StatusListItem key={`item-${each}`} arrayItem={each} statusItem={statusItem} setItemCallback={(item) => props.setItemCallback(item)} setArrayItemCallback={(item) => props.setArrayItemCallback(item)}/>
    })}
    </div>
  )
}

export default StatusList;