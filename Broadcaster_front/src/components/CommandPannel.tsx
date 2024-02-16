import React, { useEffect } from "react";

export interface Props {
    baseUrl: string;
    selectedRows: any[];
  }

const CommandPannel = ({baseUrl, selectedRows}: Props) => {

    const playVideo = (selectedRows: any[]) => {
        console.log("playVideo called, selectedRow", selectedRows);
        
    }

    return <div>
        <button className={'btn btn-success'} onClick={() => playVideo(selectedRows)}>Play Video</button>
        <button className={'btn btn-warning'}>Stop Video</button>
        <button className={'btn btn-danger'}>Delete Video</button>
    </div>;

};

export default CommandPannel;