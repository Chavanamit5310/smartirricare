import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SequenceValveDataViewModel } from '../sequence..model';
import { SequenceService } from '../sequence.service';

@Component({
  selector: 'app-addeditsequence',
  templateUrl: './addeditsequence.component.html',
  styleUrls: ['./addeditsequence.component.css']
})
export class AddeditsequenceComponent implements OnInit {
  seqId:number = 0;
  seqValve:SequenceValveDataViewModel[]=[];
  seqName:string ="";
    //Datatable
dtOptions: DataTables.Settings = {};
dtOptions1: DataTables.Settings = {};
data: any[] | undefined
dtTrigger: Subject<any> = new Subject<any>();
dtTrigger1: Subject<any> = new Subject<any>();

modalReference: NgbModalRef | undefined;

@ViewChildren(DataTableDirective)
dtElements: QueryList<DataTableDirective> | undefined;

@ViewChild(DataTableDirective, { static: false })
dtElement: DataTableDirective | undefined;
  constructor(private sequenceService: SequenceService,private toastr: ToastrService,private activatedRoute: ActivatedRoute, public router: Router,) { }

  ngOnInit(): void {
    this.dtOptions = {
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [1, 'desc'],
      destroy: true
      // columnDefs: [
      //   { "orderable": false, "targets": [4]}
 
      //  ],
      //stateSave: true,
      //processing: true,

    };
    this.seqId = +this.activatedRoute.snapshot.pathFromRoot[0].queryParams["seqId"];
    this.seqName= this.activatedRoute.snapshot.pathFromRoot[0].queryParams["seqName"];
    if(this.seqId > 0)
    {
      this.getSequencesValve(this.seqId);
    }
    
  }

  getSequencesById(id:number) {
    this.sequenceService.getSequenceById(id).subscribe(
      (response: SequenceValveDataViewModel[]) => {
        this.seqValve = response;
        console.log(response);
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Sequence Valve list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  getSequencesValve(id:number) {
    $('#dt1').DataTable().destroy();
    this.sequenceService.getSequenceValveList(id).subscribe(
      (response: SequenceValveDataViewModel[]) => {
        this.seqValve = response;
        this.dtTrigger.next();
        console.log(response);
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Sequence Valve list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  goToList()
  {
    this.router.navigate(['/sequence/list']);
  }
}
