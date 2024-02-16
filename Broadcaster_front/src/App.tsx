import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import VideoTable from './components/VideoTable';
import { useState } from 'react';
import { Video } from './models/Video';
import HttpClientServie from './components/HttpClientSerive';
import CommandPannel from './components/CommandPannel';


const baseUrl = 'http://127.0.0.1:5000';


export default function App() {

  const [videos, setVideos]  = useState<Video[]>([]);
  const [selectedRows, setselectedRows]  = useState([]);


  return (
    <div style={{ height: 400, width: '95%', margin: 'auto'}}>     
      <CommandPannel baseUrl={baseUrl} selectedRows={selectedRows}></CommandPannel>
      <VideoTable 
        videos={videos} 
        setVideos={setVideos}
        selectedRows={selectedRows}
        setSelectedRows={setselectedRows}
      ></VideoTable>
      <HttpClientServie baseUrl={baseUrl} videos={videos} setVideos={setVideos} />
    </div>
  );
}
/*

export default function App() {
  return (
    <div style={{ height: 400, width: '100%' }}>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      
      <VideoTable></VideoTable>
    </div>
  );
}
*/