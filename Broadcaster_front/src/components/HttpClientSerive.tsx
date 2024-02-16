import axios from "axios";
import React, { useEffect } from "react";
import { Video } from "../models/Video";

export interface Props {
    baseUrl: string;
    videos: Video[];
    setVideos: (rows:any[]) => void;
  }

const HttpClientServie = ({baseUrl, videos, setVideos}: Props) => {

    const getVideos = () => {
        console.log('getVideos called');
      
        axios.get(`${baseUrl}/broadcaster/v1/videos`)
        .then(res => {
          setVideos(res.data);
          console.log("res.data:",res.data);
          console.log("getVideos:",videos);
          
        }).catch((error) => {
          console.log(error);
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