import { Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {Clipboard} from '@angular/cdk/clipboard';

import { BraodcasterService } from '../../services/braodcaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrl: './video-table.component.css'
})
export class VideoTableComponent implements OnInit{

  private timeIntevalSeconds:number = 2;

  videos:any = [];
  displayedColumns: string[] = ['video_name', 'status'];
  dataSource = new MatTableDataSource(this.videos);

  constructor(private broadcasetrService: BraodcasterService, private _liveAnnouncer: LiveAnnouncer, private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.loadData();
    
    setInterval(()=> { this.loadData() }, this.timeIntevalSeconds * 1000);
  }

  

  loadData(){
    var that = this;
    this.broadcasetrService.getVideos().subscribe(
      res => {console.log('HTTP response', res);this.videos = res;},
      err => {console.log('HTTP Error', err); console.error('Failed to getVideos.'+ err.status+"," +err.error);},
      () => console.log('HTTP request completed.')
      
    );
  }


  playVideo(item: any){
    this.broadcasetrService.playVideo(item).subscribe(res => {
      console.log("playVideo table",res)
    }); 
  }

  stopVideo(item: any){
    this.broadcasetrService.stopVideo(item).subscribe(res => {
      console.log("stopVideo table",res)
    });
  }

  deleteVideo(item: any) {

    if (confirm('Do you want to remove this Video :' + item.video_name)) {
      var that = this;
      this.broadcasetrService.deleteVideo(item).subscribe(
        res => {console.log('HTTP response', res);},
        err => {console.log('HTTP Error', err); },
        () => console.log('HTTP request completed.')

      )
    }
  }
  copyRtspLink(link:any) {
    this.clipboard.copy('link');
  }

}
