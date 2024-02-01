import { Component, OnInit} from '@angular/core';

import { BraodcasterService } from '../../services/braodcaster.service';

@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrl: './video-table.component.css'
})
export class VideoTableComponent implements OnInit{

  videos:any = [];

  constructor(private broadcasetrService: BraodcasterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    var that = this;
    this.broadcasetrService.getVideos().subscribe(
      res => {console.log('HTTP response', res);this.videos = res;},
      err => {console.log('HTTP Error', err); console.error('Failed to getVideos.'+ err.status+"," +err.error);},
      () => console.log('HTTP request completed.')
      
    );
  }



}
