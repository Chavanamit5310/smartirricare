import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceComponent } from './sequence.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddeditsequenceComponent } from './addeditsequence/addeditsequence.component';
import { DataTablesModule } from "angular-datatables";
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: SequenceComponent,
        data: {
          title: 'Sequence',
          urls: [
            { title: 'Sequence', url: '/sequence' },
            { title: 'ngComponent' },
            { title: 'Sequence' }
          ]
        },
      },   
      {
        path: 'addedit',
        component: AddeditsequenceComponent,
        data: {
          title: 'Sequence Edit',
          urls: [
            { title: 'Sequence Edit', url: '/addedit' },
            { title: 'ngComponent' },
            { title: 'Sequence Edit' }
          ]
        },
      },     
    ]
  }
];


@NgModule({
  declarations: [SequenceComponent, AddeditsequenceComponent],
  imports: [
    CommonModule,   
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTablesModule
  ]
})
export class SequenceModule { }
