import React, { useState } from 'react';
import StatusListItem from './StatusListItem';

const StatusList = (props) => {
  return (
    <div className='col mt-2'>
    {props.statusData.map((statusItem, each) => {
      return <StatusListItem shouldRender={true} id={`SLI-${statusItem.status_tail_number}`} key={`item-${each}`} arrayItem={each} statusItem={statusItem} setItemCallback={(item) => props.setItemCallback(item)} setArrayItemCallback={(item) => props.setArrayItemCallback(item)}/>
    })}
    </div>
  )
}
// {eval("statusItem." + props.targetProp + " === props.targetValue")}
export default StatusList;