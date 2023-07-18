import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss']
})
export class AdminSidenavComponent implements OnInit {
  isSidenavOpen = false;
  
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: any) => {
        if (state.matches) {
          this.isSidenavOpen = false;
        } else {
          this.isSidenavOpen = true;
        }
      });
  }
  

  

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  
  }
