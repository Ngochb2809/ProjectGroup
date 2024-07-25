import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { LoginsvService } from '../services/loginsv.service';
// import { Iempt } from '../models/empt-request.modules';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-empt-components',
  templateUrl: './empt-components.component.html',
  styleUrls: ['./empt-components.component.css']
})
export class EmptComponentsComponent implements OnInit {
  inputs!: string;
  inputsOld!: string;
  cities!: string[]
  selectedCity!: string[]
  language!: string[];
  selectedLanguage!: string[];
  // empt: Iempt;


  ngOnInit() {
    this.cities = [
      'Hải Phòng',
      'Tp.HCM',
      'Hà Nội',
    ];
    this.language = [
      'C#',
      'Angular++',
      'NodeJs',
    ];
  }

  constructor(private lgsv: LoginsvService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // this.empt = {
    //   UserId: '',
    // }
  }
  submit() {
    // this.lgsv.loginJWt(this.empt).subscribe((result) => {
    //   if (this.inputs == '' || this.inputsOld == null) {
    //     return
    //   }
      alert('xog' + this.inputs + ' ' + this.inputsOld + '  ' + this.selectedCity + ' ' + this.selectedLanguage.map((x) => x).join(','))
    // })
  }
  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/home')
  }
}






