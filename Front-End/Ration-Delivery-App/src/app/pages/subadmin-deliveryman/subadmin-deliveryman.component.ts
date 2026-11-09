import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryMan, Region, DeliveryOrder } from '../../class/delivery-man';
import { DeliveryManService } from '../../services/delivery-man.service';


@Component({
  selector: 'app-subadmin-deliveryman',
  templateUrl: './subadmin-deliveryman.component.html',
  styleUrls: ['./subadmin-deliveryman.component.css']
})
export class SubadminDeliverymanComponent implements OnInit {
  deliveryMen: DeliveryMan[] = [];
  filteredDeliveryMen: DeliveryMan[] = [];
  selectedMan: DeliveryMan | null = null;
  deliveryManForm!: FormGroup;

  isEditing = false;
  searchText = '';
  selectedRegionId = 1;
  regions: Region[] = [new Region(1), new Region(2), new Region(3)];

  // Modal flags
  showAddModal = false;
  showDetailsModal = false;

  constructor(private fb: FormBuilder, private deliveryManService: DeliveryManService) { }

  ngOnInit(): void {
    this.initForm();
    const userdetails = localStorage.getItem('user');
    if (userdetails) {
      const parsedUser = JSON.parse(userdetails);
      this.selectedRegionId = parsedUser.regionId;  // Set it from user object
      this.loadByRegion(this.selectedRegionId);
      console.log(this.selectedRegionId)
    }
  }

  initForm(): void {
    this.deliveryManForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      phoneNO: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNum: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]]
    });
  }

  get f() {
    return this.deliveryManForm.controls;
  }
  filterDeliveryMen(): void {
    const term = this.searchText?.toLowerCase().trim();

    this.filteredDeliveryMen = term === ''
      ? [...this.deliveryMen]
      : this.deliveryMen.filter(man =>
        man.name.toLowerCase().includes(term) ||
        man.phoneNO.toString().includes(term) ||
        man.aadharNum.toString().includes(term)
      );
  }



  loadByRegion(regionId: number): void {
    this.deliveryManService.getByRegion(regionId).subscribe(data => {
      console.log('Delivery Men from API:', data);
      this.deliveryMen = data;
      this.filteredDeliveryMen = [...data];
      this.searchText = '';
      // this.filterDeliveryMen();
      console.log(this.deliveryMen)
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.selectedMan = null;  // VERY IMPORTANT to reset
    this.deliveryManForm.reset();
    this.showAddModal = true;
  }


  closeAddModal(): void {
    this.showAddModal = false;
  }

  editDeliveryMan(man: DeliveryMan): void {
    this.isEditing = true;
    this.selectedMan = man;
    this.deliveryManForm = this.fb.group({
      name: [man.name, [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      phoneNO: [man.phoneNO, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadharNum: [man.aadharNum, [Validators.required, Validators.pattern(/^\d{12}$/)]]
    });
    this.showAddModal = true;
  }

  orders: DeliveryOrder[] = []; // Store delivery orders for selected delivery man

  viewDetails(man: DeliveryMan): void {
    this.selectedMan = man;
    this.showDetailsModal = true;
    this.deliveryManService.getDeliveriesByManId(man.id!).subscribe({
      next: (data) => {
        this.orders = data.deliveries || [];
      },
      error: (err) => {
        console.error('Failed to fetch delivery orders', err);
        this.orders = [];
      }
    });
  }



  closeDetailsModal(): void {
    this.showDetailsModal = false;
  }

  deleteDeliveryMan(id: number | undefined): void {
    if (id && confirm('Are you sure to delete this delivery man?')) {
      this.deliveryManService.delete(id).subscribe(() => this.loadByRegion(this.selectedRegionId));
    }
  }
  isSaving: boolean = false;
  onSave(): void {
    if (this.deliveryManForm.valid) {
       this.isSaving = true;
      const formVal = this.deliveryManForm.value;
      const idToSend = this.isEditing && this.selectedMan ? this.selectedMan.id : undefined;

      const newMan = new DeliveryMan(
        +formVal.aadharNum,
        formVal.name,
        +formVal.phoneNO,
        new Region(this.selectedRegionId),
        idToSend
      );


      console.log(newMan)

      const saveObs = this.isEditing && this.selectedMan?.id
        ? this.deliveryManService.update(this.selectedMan.id, newMan)
        : this.deliveryManService.add(newMan);

       saveObs.subscribe({
      next: () => {
        this.loadByRegion(this.selectedRegionId);
        this.deliveryManForm.reset();
        this.closeAddModal();
        this.isSaving = false; // ✅ Stop loader
      },
      error: (err) => {
        console.error("Save failed", err);
        this.isSaving = false; // ❌ Stop loader on error too
      }
    });
    } else {
      this.deliveryManForm.markAllAsTouched();
    }
  }
}
