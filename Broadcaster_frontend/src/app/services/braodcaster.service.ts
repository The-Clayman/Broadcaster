import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BraodcasterService {

  private baseUrl = 'http://127.0.0.1:5000/broadcaster/v1'

  constructor(private httpClient: HttpClient) { }

  getVideos() {
    const url = this.baseUrl + "/videos";
    return this.httpClient.get(url);
  }

  playVideo(video: any) {
    const url = this.baseUrl+"/player/"+video.video_name+"/play"
    return this.httpClient.post(url, null);
  }

  stopVideo(video: any) {
    const url = this.baseUrl+"/player/"+video.video_name+"/stop";
    return this.httpClient.post(url, null);
  }

  deleteVideo(video: any) {
  let headers = new HttpHeaders();
  //headers = headers.set('Content-Type', 'application/json');

    const url = this.baseUrl+"/videos/"+video.video_name;
    return this.httpClient.delete<HttpResponse<any>>(url,{ headers })
  }
}
