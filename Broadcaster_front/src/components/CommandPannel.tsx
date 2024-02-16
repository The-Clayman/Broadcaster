import axios from "axios";
import React, { useEffect } from "react";
import FileChooser from "./FileChooser";

export interface Props {
    baseUrl: string;
    selectedRows: any[];
    popToast: (text: string, type: 'success' | 'error') => void;
  }

const CommandPannel = ({baseUrl, selectedRows, popToast}: Props) => {

    const playVideo = (selectedRows: any[]) => {
        if (selectedRows.length > 0) {
            selectedRows.forEach(videoName => {
                axios.post(`${baseUrl}/broadcaster/v1/player/${videoName}/play`)
                .then(res => {
                if (res.status === 200){
                let toasterMessage = res.data.message != null ? res.data.message : "sent play successufly";
                popToast(toasterMessage, "success");
                } else {
                let toasterMessage = res.data.message != null ? res.data.message : "send play failed";
                popToast(toasterMessage, "error");
                } 
            })
            .catch((error) => {
                console.log(error);
                let errorMessage = error.response.data.message != null ? error.response.data.message : "failed to send play";
                popToast(errorMessage, "error");
            });`d`
            });;
        } else {
            popToast("no video were selected", "error");
        }
    }

    const stopVideo = (selectedRows: any[]) => {
        if (selectedRows.length > 0) {
            selectedRows.forEach(videoName => {
                axios.post(`${baseUrl}/broadcaster/v1/player/${videoName}/stop`)
                .then(res => {
                if (res.status === 200){
                let toasterMessage = res.data.message != null ? res.data.message : "sent stop successufly";
                popToast(toasterMessage, "success");
                } else {
                let toasterMessage = res.data.message != null ? res.data.message : "send stop failed";
                popToast(toasterMessage, "error");
                } 
            })
            .catch((error) => {
                console.log(error);
                let errorMessage = error.response.data.message != null ? error.response.data.message : "failed to send stop";
                popToast(errorMessage, "error");
            });
            });;
        } else {
            popToast("no video were selected", "error");
        }
    }

    const deleteVideo = (selectedRows: any[]) => {
        if (selectedRows.length > 0) {
            selectedRows.forEach(videoName => {
                axios.delete(`${baseUrl}/broadcaster/v1/videos/${videoName}`)
                .then(res => {
                if (res.status === 200){
                let toasterMessage = res.data.message != null ? res.data.message : "sent stop successufly";
                popToast(toasterMessage, "success");
                } else {
                let toasterMessage = res.data.message != null ? res.data.message : "send stop failed";
                popToast(toasterMessage, "error");
                } 
            })
            .catch((error) => {
                console.log(error);
                let errorMessage = error.response.data.message != null ? error.response.data.message : "failed to send stop";
                popToast(errorMessage, "error");
            });
            });;
        } else {
            popToast("no video were selected", "error");
        }
    }
        

    

    return <div style={{ width: '40%', justifyContent: 'space-between', display: 'flex', padding: "1em 0em"}}>
        
        <button className={'btn btn-success'} onClick={() => playVideo(selectedRows)}>Play Video</button>
        <button className={'btn btn-warning'} onClick={() => stopVideo(selectedRows)}>Stop Video</button>
        <button className={'btn btn-danger'} onClick={() => deleteVideo(selectedRows)}>Delete Video</button>
        <FileChooser toasterFunc={popToast}></FileChooser>
    </div>;

};

export default CommandPannel;