import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project/project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Routes } from '@angular/router';
import { NodesconfigurationComponent } from './nodesconfiguration/nodesconfiguration.component';
import { NonrechablenodeComponent } from './nodesconfiguration/nonrechablenode/nonrechablenode.component';
import { RechablenodeComponent } from './nodesconfiguration/rechablenode/rechablenode.component';
import { GatewaynodeComponent } from './nodesconfiguration/gatewaynode/gatewaynode.component';
import { NodeupdatedataComponent } from './nodesconfiguration/nodeupdatedata/nodeupdatedata.component';
import { NodesettingComponent } from './nodesconfiguration/nodesetting/nodesetting.component';
import { NodelivedataComponent } from './nodesconfiguration/nodelivedata/nodelivedata.component';
import { UploadconfigurationComponent } from './uploadconfiguration/uploadconfiguration.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from "angular-datatables";

const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'estimate/:id',
      //   component: EstimateComponent,
      //   data: {
      //     title: 'Estimate',
      //     urls: [
      //       { title: 'Estimate', url: '/estimate' },
      //       { title: 'ngComponent' },
      //       { title: 'Estimate' }
      //     ]
      //   },
      // },
      {
        path: 'project',
        component: ProjectComponent,
        data: {
          title: 'Project Configuration',
          urls: [
            { title: 'Project Configuration', url: '/project' },
            { title: 'ngComponent' },
            { title: 'Project Configuration' }
          ]
        },
      },
      {
        path: 'node',
        component: NodesconfigurationComponent,
        data: {
          title: 'Node Configuration',
          urls: [
            { title: 'Node Configuration', url: '/node' },
            { title: 'ngComponent' },
            { title: 'Node Configuration' }
          ]
        },
      },
      {
        path: 'upload',
        component: UploadconfigurationComponent,
        data: {
          title: 'Upload Configuration',
          urls: [
            { title: 'Upload Configuration', url: '/upload' },
            { title: 'ngComponent' },
            { title: 'Upload Configuration' }
          ]
        },
      },
    ]
  }
];

@NgModule({
  declarations: [
    ProjectComponent,
    NodesconfigurationComponent,
    NonrechablenodeComponent,
    RechablenodeComponent,
    GatewaynodeComponent,
    NodeupdatedataComponent,
    NodesettingComponent,
    NodelivedataComponent,
    UploadconfigurationComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    RouterModule.forChild(routes),
    DataTablesModule
  ],
  exports: [RouterModule],
})
export class ConfigurationModule { }
