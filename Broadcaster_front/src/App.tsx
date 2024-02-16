import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import VideoTable from './components/VideoTable';
import { useState } from 'react';
import { Video } from './models/Video';


export default function App() {

  const [videos, setVideos]  = useState<Video[]>([]);


  return (
    <div style={{ height: 400, width: '95%', margin: 'auto'}}>     
      <VideoTable videos={videos} setVideos={setVideos}></VideoTable>
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