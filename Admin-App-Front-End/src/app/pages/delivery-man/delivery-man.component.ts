import { Component, OnInit } from '@angular/core';
import { DeliveryMan } from './delivery-man.model';
import { Region } from '../../models/region.model';
import { DeliveryManService } from '../../Services/deliveryman-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delivery-man',
  templateUrl: './delivery-man.component.html',
  styleUrls: ['./delivery-man.component.css']
})
export class DeliveryManComponent implements OnInit {
  deliveryMen: DeliveryMan[] = [];
  filteredDeliveryMen: DeliveryMan[] = [];
  regionOptions: Region[] = [];

  selectedRegion: number | '' = '';
  currentDeliveryMan: DeliveryMan = {
    name: '',
    phoneNO: 0,
    aadharNum: 0,
    region: { id: 0, name: '' }
  };
  selectedDeliveryMan: DeliveryMan | null = null;

  isEdit = false;
  showModal = false;
  showDeleteConfirm = false;
  viewMode = false;
  deleteIdToConfirm: number | null = null;

  deliveryManOrders: string[] = [];
  mockOrders: { [key: number]: string[] } = {
    6: ['Order #X101', 'Order #X102'],
    7: ['Order #Y201'],
    8: ['Order #Z301']
  };

  constructor(
    private deliveryManService: DeliveryManService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchRegions();
    this.fetchDeliveryMen();
  }

  fetchRegions(): void {
    this.deliveryManService.getRegions().subscribe({
      next: (data) => this.regionOptions = data,
      error: (err) => console.error('Failed to fetch regions:', err)
    });
  }

  fetchDeliveryMen(): void {
    this.deliveryManService.getAllDeliveryMen().subscribe({
      next: (data) => {
        this.deliveryMen = data;
        this.filterByRegion();
      },
      error: (err) => console.error('Failed to fetch delivery men:', err)
    });
  }

filterByRegion(): void {
  if (this.selectedRegion !== '') {
    const regionObj = this.regionOptions.find(r => r.id === +this.selectedRegion);

    this.deliveryManService.getDeliveryManByRegion(+this.selectedRegion).subscribe({
      next: (data) => {
        // ✅ Manually add region to each delivery man
        this.filteredDeliveryMen = data.map(dm => ({
          ...dm,
          region: regionObj || { id: 1, name: 'Unknown' }
        }));
      },
      error: (err) => console.error('Failed to fetch filtered delivery men:', err)
    });
  } else {
    this.filteredDeliveryMen = [...this.deliveryMen];
  }
}



  openCreateModal(): void {
    this.currentDeliveryMan = {
      name: '',
      phoneNO: 0,
      aadharNum: 0,
      region: { id: 0, name: '' }
    };
    this.isEdit = false;
    this.viewMode = false;
    this.showModal = true;
  }

  openViewModal(dm: DeliveryMan): void {
    this.selectedDeliveryMan = dm;
    this.viewMode = true;
    this.showModal = true;
    this.deliveryManOrders = this.mockOrders[dm.id!] || [];
  }

  openEditModal(dm: DeliveryMan): void {
    this.currentDeliveryMan = {
      ...dm,
      region: typeof dm.region === 'object' ? dm.region : { id: Number(dm.region), name: '' }
    };
    this.isEdit = true;
    this.viewMode = false;
    this.showModal = true;
  }

  saveDeliveryMan(form: NgForm): void {
  // Step 1: Check if form is valid
  if (form.invalid) {
    this.toastr.error('Please fill all required fields correctly.', 'Form Error');
    return;
  }

  // Step 2: Extract and validate region
  const regionId = +this.currentDeliveryMan.region?.id || +this.currentDeliveryMan.region;
  const regionObj = this.regionOptions.find(r => r.id === regionId);

  if (!regionObj) {
    this.toastr.error("Invalid Region selected.", "Error");
    return;
  }

  this.currentDeliveryMan.region = regionObj;

  const deliveryManPayload: DeliveryMan = {
    ...this.currentDeliveryMan,
    phoneNO: Number(this.currentDeliveryMan.phoneNO),
    region: regionObj
  };

  if (this.isEdit && this.currentDeliveryMan.id != null) {
    this.deliveryManService.updateDeliveryMan(deliveryManPayload).subscribe({
      next: (updated) => {
        const index = this.deliveryMen.findIndex(dm => dm.id === updated.id);
        if (index !== -1) this.deliveryMen[index] = updated;
        this.resetAfterSave("Delivery Man updated successfully!");
      },
      error: (err) => {
        console.error('Failed to update:', err);
        this.toastr.error("Failed to update Delivery Man.", "Error");
      }
    });
  } else {
    this.deliveryManService.addDeliveryMan(deliveryManPayload).subscribe({
      next: (created) => {
        this.deliveryMen.push(created);
        this.resetAfterSave("Delivery Man created successfully!");
      },
      error: (err) => {
        console.error('Failed to create:', err);
        this.toastr.error("Failed to create Delivery Man.", "Error");
      }
    });
  }
}

  resetAfterSave(successMessage: string): void {
    this.selectedRegion = '';
    this.filterByRegion();
    this.closeModal();
    this.toastr.success(successMessage, "Success");
  }

  confirmDelete(id: number): void {
    this.deleteIdToConfirm = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.deleteIdToConfirm = null;
    this.showDeleteConfirm = false;
  }

  performDelete(): void {
    const id = this.deleteIdToConfirm;
    if (id !== null) {
      this.deliveryManService.deleteDeliveryMan(id).subscribe({
        next: () => {
          this.deliveryMen = this.deliveryMen.filter(dm => dm.id !== id);
          this.filterByRegion();
          this.cancelDelete();
          this.toastr.success("Delivery Man deleted successfully.", "Success");
        },
        error: (err: any) => {
          console.error('Failed to delete:', err);
          this.toastr.error("Failed to delete Delivery Man.", "Error");
        }
      });
    }
  }

  updateRegionInline(dm: DeliveryMan): void {
    this.deliveryManService.updateDeliveryMan(dm).subscribe({
      next: () => this.toastr.success("Region updated successfully.", "Success"),
      error: (err) => {
        console.error('Failed to update region:', err);
        this.toastr.error("Failed to update region.", "Error");
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.viewMode = false;
    this.isEdit = false;
    this.currentDeliveryMan = {
      name: '',
      phoneNO: 0,
      aadharNum: 0,
      region: { id: 0, name: '' }
    };
    this.selectedDeliveryMan = null;
    this.deliveryManOrders = [];
  }
}
