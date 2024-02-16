import { Box } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";
import HttpClientServie from "./HttpClientSerive";
import { Video } from "../models/Video";


const dummyRows = [
    { video_name: 'Norway', status: 'PLAYING', rtsp_url: 'rtsp://192.168.1.100:5', file_name: 'Norway.mp4'},
    { video_name: 'France', status: 'READY', rtsp_url: null, file_name: 'France.mp4'}, 
    { video_name: 'England', status: 'FAILED_TRANSCODING', file_name: 'England.mp4'},
];

const columns: GridColDef[] = [
    { field: 'video_name', headerName: 'Video name', width: 400 },
    { field: 'status',headerName: 'Status', width: 400},
    { field: 'file_name', headerName: 'File Name', width: 400},
    { field: 'rtsp', headerName: 'Rtsp url', width: 400}
];

export interface Props {
    videos: Video[];
    setVideos: (rows:Video[]) => void;
}

export default function VideoTable({videos, setVideos}: Props) {    

    return (
        <Box sx={{
            height: 600,
            width: '100%',
            '& .green-text': {
              color: 'green',
            },
            '& .orange-text': {
              color: 'orange',
            },
            '& .red-text': {
              color: 'red',
            },
            '& . purple-text': {
              color: 'purple',
            },
          }}>
            <div>VideoTable element
                <DataGrid
                    rows={videos}
                    columns={columns}
                    getRowId={(row) => row.video_name}

                    getCellClassName={(params: GridCellParams<any, any, string>) => {
                        let res = '';

                        switch(params.value) { 
                            case 'READY': { 
                               res = 'green-text'; 
                               break; 
                            } 
                            case 'PLAYING': { 
                                res = 'orange-text'
                               break; 
                            }
                            case 'FAILED_TRANSCODING': { 
                                res = 'red-text'
                               break; 
                            }  
                            default: { 
                                res = ''
                               break; 
                            }
                        } 

                        return res;
                    }}


                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}

                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector

                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
                <HttpClientServie videos={videos} setVideos={setVideos} />
            </div>
        </Box>
    );
}

