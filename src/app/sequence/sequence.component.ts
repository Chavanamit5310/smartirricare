import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SequenceShortViewModel, SequenceValveDataViewModel } from './sequence..model';
import { SequenceService } from './sequence.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent implements OnInit {
  seqLst: SequenceShortViewModel[] = [];
  seqValve:SequenceValveDataViewModel[]=[];
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
  constructor(public router: Router, private sequenceService: SequenceService, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.dtOptions = {
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [1, 'desc'],
      destroy: true,
      columnDefs: [
        { "orderable": false, "targets": [4]}
 
       ],
      //stateSave: true,
      //processing: true,

    };
    this.getSequences();
  }

  getSequences() {
    $('#dt1').DataTable().destroy();
    this.sequenceService.getSequenceList(0).subscribe(
      (response: SequenceShortViewModel[]) => {
        this.seqLst = response;
        this.dtTrigger.next();
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Sequence list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  getSequencesValve(id:number) {
    this.sequenceService.getSequenceValveList(id).subscribe(
      (response: SequenceValveDataViewModel[]) => {
        this.seqValve = response;
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

  getIndividualSeqValve(id:number){
    this.getSequencesValve(id);
  }

  editSequence(Id:number, seqName:string){
    this.router.navigate(['/sequence/addedit'], { queryParams: { seqId: Id, seqName: seqName } });
  }

}
