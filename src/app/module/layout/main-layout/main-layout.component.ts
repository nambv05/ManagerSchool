import { Component, OnInit, } from '@angular/core';
import { AuthService } from '../../../services/api-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  preserveWhitespaces: false,
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,

  ) {

  }

  ngOnInit(): void {

  }
}
