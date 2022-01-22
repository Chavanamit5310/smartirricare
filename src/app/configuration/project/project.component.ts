import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/component/toast/toast.service';
import { Network, NetworkDDL, NodeModel, ProductTypes, Project } from './project.model';
import { ProjectService } from './project.service';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectInfo: Project = new Project();
  projectLst: Project[] = [];
  closeResult: string = "";
  networkInfo: Network = new Network();
  networkLst: Network[] = [];
  availableNetworks: NetworkDDL[] = [];
  nodeInfo: NodeModel = new NodeModel();
  nodeLst: NodeModel[] = [];
  gatewayNodeLst: NodeModel[] = [];
  producyTypeLstMain: ProductTypes[] = [];

  producyTypeLst: ProductTypes[] = [];
  selectedNetwork: string = "0";

  isEditNode: boolean = false;
  nodeId: number = 0;
    //Datatable
dtOptions: DataTables.Settings = {};
dtOptions1: DataTables.Settings = {};
data: any[] | undefined
dtTrigger: Subject<any> = new Subject<any>();
dtTrigger1: Subject<any> = new Subject<any>();
  dtElements!: QueryList<DataTableDirective>;
  modalReference!: NgbModalRef;

@ViewChildren(DataTableDirective)


@ViewChild(DataTableDirective, { static: false })
dtElement: DataTableDirective | undefined;
  constructor(private projectService: ProjectService, public toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [0, 'desc'],
      destroy: true,
      columnDefs: [
        { "orderable": false, "targets": [2]}
 
       ],
      //stateSave: true,
      //processing: true,

    };
    this.getProject();
    this.getNetworks();
    this.getAvailableNetworks();
    this.getProductTypes();
    this.getNodeLst(0);
  }
  getNetworks() {
    this.projectService.getNetworkList().subscribe(
      (response: Network[]) => {
        this.networkLst = response;
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Project list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  GetList(selectedNetwork: string) {
    if (selectedNetwork === null)
      this.selectedNetwork = "0";
    this.getNodeLst(+this.selectedNetwork);
  }

  getAvailableNetworks() {
    this.projectService.getAvailableNetworkList().subscribe(
      (response: NetworkDDL[]) => {
        this.availableNetworks = response;
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Project list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }
  getProject() {
    this.projectService.getProjectList().subscribe(
      (response: Project[]) => {
        this.projectLst = response;
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Project list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  public getProductTypes() {
    this.projectService.getProductTypes().subscribe(
      (response: ProductTypes[]) => {
        this.producyTypeLst = response;
        this.producyTypeLstMain = response;
      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Node list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  public getNodeLst(networkId: number) {
      $('#dt1').DataTable().destroy();
    this.projectService.getNodeList(networkId).subscribe(
      (response: NodeModel[]) => {
        this.nodeLst = response.filter(x => x.networkNo != 0);
    
        this.nodeLst.forEach(element => {
          element.productName = this.producyTypeLst.filter(x => x.id == element.productTypeId)[0].type;
        });
        this.dtTrigger1.next();
        this.gatewayNodeLst= response.filter(x => x.networkNo == 0);
        this.gatewayNodeLst.forEach(element => {
          element.productName = this.producyTypeLst.filter(x => x.id == element.productTypeId)[0].type;
        });

      },
      customError => {
        this.toastr.error(
          `Error happened while fetching Node list. <br />
                  ${customError.message}`,
          'Error'
        );
      }
    );
  }

  AddProject(content: any, id: number) {

  }

  calculateRtuId() {
    let shift = this.nodeInfo.networkNo << 10
    let rtuid = +this.nodeInfo.nodeNo + shift;
    this.nodeInfo.rtuId = rtuid;
  }

  AddNetwork(content: any, id: number) {
    //Open modal and ask to create new revision
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  AddNode(content: any, id: number,type:string) {
    if(type=== "Node")
    {
      if (this.selectedNetwork == null || this.selectedNetwork == "0") {
        this.toastr.error("Select Netwrok");
        return;
      }
      this.producyTypeLst = this.producyTypeLstMain.filter(x=>x.productNo == 1 ||x.productNo == 2);
    }  
    else
    {
      this.producyTypeLst = this.producyTypeLstMain.filter(x=>x.productNo == 4 || x.productNo == 3);
    }
    if (id == 0) {
      this.isEditNode = false;
      this.nodeInfo = new NodeModel();
      if (type=== "Node") {
        this.nodeInfo.networkId = +this.selectedNetwork;
        this.nodeInfo.networkNo = this.networkLst.filter(x => x.networkId == +this.selectedNetwork)[0].networkNo;
      }
      else
      {
        this.nodeInfo.networkId = 0;
        this.nodeInfo.networkNo = 0;
      }
    }
    else {
      this.isEditNode = true;
      this.nodeInfo = this.nodeLst.filter(x => x.id === id)[0]

    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  SaveNode(content: any) {
    //Add
    this.projectService.addNode(this.nodeInfo).subscribe(
      (response: any) => {
        this.toastr.success('Node added successfully.');
        this.getNodeLst(+this.selectedNetwork);
        this.nodeInfo = new NodeModel();
        this.isEditNode = false;
        this.modalService.dismissAll("Closed");
      },
      customError => {
        this.toastr.error(
          `Error happened while adding Node. <br />
      ${customError.message}`,
          'Error'
        );
      }
    );
  }

  UpdateNode(content: any) {
    //Update
    this.projectService.editNode(this.nodeInfo).subscribe(
      (response: any) => {
        this.toastr.success('Node Updated successfully.');
        this.getNodeLst(+this.selectedNetwork);
        this.nodeInfo = new NodeModel();
        this.isEditNode = false;
        this.modalService.dismissAll("Closed");
      },
      customError => {
        this.toastr.error(
          `Error happened while adding Node. <br />
      ${customError.message}`,
          'Error'
        );
      }
    );

  }

  setAddon() {
    if (this.nodeInfo.productTypeId === 1 || this.nodeInfo.productTypeId === 2) {
      this.nodeInfo.isAddonCard = false;
    }

  }
  openDeleteModalps(template: TemplateRef<any>, id: number) {
    this.nodeId = id;
    this.modalService.open(template, { size: 'lg' });
  }

  confirmps(): void {
    this.projectService.deleteNode(this.nodeId).subscribe(
      (response: any) => {
        this.getNodeLst(+this.selectedNetwork);
        this.toastr.success(
          "Node Deleted successfully!"
        );
        this.modalService.dismissAll();
      },
      customError => {
        this.toastr.error(
          `Error happened while deleting Node . <br />
              ${customError.message}`,
          'Error'
        );
      }
    );
  }

  declineps(): void {
    this.nodeId = 0;
    this.modalService.dismissAll();
  }
  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
      });
    });
  }
  getTabChange(event: any) {
   // this.rerender();
    if (event.nextId == "ngb-tab-0") {
     
    }
    if (event.nextId == "ngb-tab-1") {
      
    }
    if (event.nextId == "ngb-tab-2") {
      this.getNodeLst(0);
    }
    if (event.nextId == "ngb-tab-3") {
      
    }
  }
}
