import { Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
//import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

import { BraodcasterService } from '../../services/braodcaster.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToasterService } from '../../services/toaster.service';

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

  constructor(private broadcasetrService: BraodcasterService, 
    private _liveAnnouncer: LiveAnnouncer, 
    private clipboard: Clipboard, 
    private toasterService:ToasterService) {}

  ngOnInit(): void {
    this.loadData();
    
    setInterval(()=> { this.loadData() }, this.timeIntevalSeconds * 1000);
  }

  

  loadData(){
    var that = this;
    this.broadcasetrService.getVideos().subscribe(
      res => {this.videos = res;},
      err => {console.log('HTTP Error', err); console.error('Failed to getVideos.'+ err.status+"," +err.error.message);},
      () => {}
      
    );
  }


  playVideo(item: any){
    this.broadcasetrService.playVideo(item).subscribe(
      res => {console.log('HTTP response', res); this.toasterService.popToasterMessage("Video "+ item.video_name+ " play request sent", "regular")},
      err => {console.log('HTTP Error', err); this.toasterService.popToasterMessage('Failed to play video ['+ err.status+"],\n" + err.error.message, "error");},
      () => {console.log('HTTP response'); this.toasterService.popToasterMessage("Video "+ item.video_name+ " playe request sent", "regular")}
    ); 
  }

  stopVideo(item: any){
    this.broadcasetrService.stopVideo(item).subscribe(
      res => {console.log('HTTP response', res); this.toasterService.popToasterMessage("Video "+ item.video_name+ " stop request sent", "regular")},
      err => {console.log('HTTP Error', err); this.toasterService.popToasterMessage('Failed to stop video ['+ err.status+"],\n" + err.error.message, "error");},
      () => {console.log('HTTP response'); this.toasterService.popToasterMessage("Video "+ item.video_name+ " stop request sent", "regular")}
    );
  }

  deleteVideo(item: any) {

    if (item.status != "PLAYING"){
      if (confirm('Do you want to remove this Video :' + item.video_name)) {
        var that = this;
        this.broadcasetrService.deleteVideo(item).subscribe(
          res => {console.log('HTTP response', res); this.toasterService.popToasterMessage("Video "+ item.video_name+ " delete request sent", "regular")},
          err => {console.log('HTTP Error', err); this.toasterService.popToasterMessage('Failed to delete video ['+ err.status+"],\n" + err.error.message, "error");},
          () => {console.log('HTTP response'); this.toasterService.popToasterMessage("Video "+ item.video_name+ " delete request sent", "regular")}
        );
      }
    } else {
      this.toasterService.popToasterMessage('Please stop  ['+ item.video_name +"] before stopping", "error");
    }
  }
  copyRtspLink(link:any) {
    this.clipboard.copy('link');
  }

}
