import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";


const dummyRows = [
    { video_name: 'Norway', status: 'RUNNING', rtsp_url: 'rtsp://192.168.1.100:5'},
    { video_name: 'France', status: 'RAEDY', rtsp_url: null},
    { video_name: 'England', status: 'FAILED_TRANSCODING'},
];

const columns: GridColDef[] = [
    { field: 'video_name', headerName: 'Video name', width: 600 },
    { field: 'status',headerName: 'Status', width: 600},
    { field: 'rtsp_url', headerName: 'Rtsp', width: 600}
  ];


export default function VideoTable() {
    return <div>VideoTable element
        <DataGrid
            rows={dummyRows}
            columns={columns}
            getRowId={(row) => row.video_name}
        />
    </div>;
}

