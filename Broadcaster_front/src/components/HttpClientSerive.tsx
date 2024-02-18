import axios from "axios";
import React, { useEffect } from "react";
import { Video } from "../models/Video";

export interface Props {
    baseUrl: string;
    videos: Video[];
    setVideos: (rows:any[]) => void;
    popToast: (text: string, type: 'success' | 'error') => void;
  }

const HttpClientServie = ({baseUrl, videos, setVideos, popToast}: Props) => {

    const getVideos = () => {
        console.log('getVideos called');
      
        axios.get(`${baseUrl}/broadcaster/v1/videos`)
        .then(res => {
          setVideos(res.data);
          console.log("res.data:",res.data);
          console.log("getVideos:",videos);
          
        }).catch((error) => {
          console.log(error);
          popToast("error getting videos ["+error.message+"]", "error")
        });
      }
    
      useEffect(() => {
        getVideos()
        const interval = setInterval(() => getVideos(), 4000)
        return () => {
          clearInterval(interval);
        }
      }, [])

    return <></>

}

export default HttpClientServie;