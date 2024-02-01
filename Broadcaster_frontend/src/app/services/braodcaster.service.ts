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
}
