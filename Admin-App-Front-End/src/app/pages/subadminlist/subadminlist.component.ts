import { Component, OnInit } from '@angular/core';
import { UserService } from './subadminlist.service';
import { User } from './subadminlist.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Region interface (optional if not already defined in region.model.ts)
interface Region {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './subadminlist.component.html',
  styleUrls: ['./subadminlist.component.css']
})
export class SubAdminsListComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    phone: '',
    smartcardNo: null,
    role: '',
    cardType: null,
    address: '',
    regionId: null
  };

  users: User[] = [];
  filteredUsers: User[] = []; // 👈 Store filtered users based on region
  showModal: boolean = false; // 👈 for modal control
  editingUserId: number | null = null;
  selectedRegion: number | '' = ''; // 👈 Track selected region for filtering

  regions: Region[] = []; // Now correctly typed as Region[]

  // Boolean to control the visibility of the dropdown
  showRegionDropdown: boolean = false;

  // New property for delete confirmation modal
  showDeleteConfirm: boolean = false;
  userToDeleteId: number | null = null; // Store the id of the user to delete

  constructor(
    private userService: UserService,
    private http: HttpClient // Injecting HttpClient for region service call
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRegions();  // Fetch the regions dynamically when the component loads
  }

  // Fetch regions from the backend dynamically
  loadRegions() {
    this.http.get<Region[]>('http://192.168.18.49:8080/regions') // Replace with your actual API URL
      .subscribe({
        next: (data) => {  // Define the type of 'data' as Region[]
          this.regions = data;
        },
        error: (err) => {  // Define the type of 'err' as any
          console.error('Error loading regions:', err);
        }
      });
  }

   // Toggle the visibility of the dropdown when the icon is clicked
  toggleRegionDropdown() {
    this.showRegionDropdown = !this.showRegionDropdown;
  }

  openModal() {
    this.resetForm();
    this.editingUserId = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingUserId = null; // ✅ reset editing state
  }

  resetForm() {
    this.user = {
      name: '',
      email: '',
      phone: '',
      smartcardNo: null,
      role: '',
      cardType: null,
      address: '',
      regionId: null
    };
  }

  onSubmit() {
    const payload = {
      ...this.user,
      smartcardNo: this.user.smartcardNo ? Number(this.user.smartcardNo) : null,
      phone: this.user.phone ? Number(this.user.phone) : null,
      role: this.user.role?.toUpperCase(),
      cardType: this.user.cardType?.toUpperCase(),
      region: { id: Number(this.user.regionId) }
    };

    console.log('Sending payload:', payload); // ✅ Log to verify

    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, payload).subscribe({
        next: () => {
          alert('User successfully updated!');
          this.resetForm();
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Failed to update user.');
        }
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => {
          alert('User successfully created!');
          this.resetForm();
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error creating user:', err);
          alert('Failed to create user.');
        }
      });
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterByRegion();  // Apply the region filter when loading users
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  filterByRegion(): void {
    if (this.selectedRegion !== '') {
      this.filteredUsers = this.users.filter(user => user.regionId === +this.selectedRegion);
    } else {
      this.filteredUsers = [...this.users];  // Show all users if no region is selected
    }
  }

  getRegionName(regionId: number | string | null | undefined): string {
    const id = Number(regionId);
    const found = this.regions.find(r => r.id === id);
    return found ? found.name : `Unknown`;
  }

editUser(user: User) {
  this.user = {
    id: user.id, // ✅ no fallback to null
    name: user.name ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    smartcardNo: user.smartcardNo ?? null,
    role: user.role ?? '',
    cardType: user.cardType ?? null,
    address: user.address ?? '',
    regionId: user.region?.id ?? user.regionId ?? null
  };

  this.editingUserId = user.id ?? null;
  this.showModal = true;  // ✅ DO NOT call openModal() which resets the form
  console.log('Editing user:', this.user);
}


  // Method to trigger delete confirmation modal
  deleteUser(userId: number) {
    this.userToDeleteId = userId;
    this.showDeleteConfirm = true; // Show confirmation modal
  }

  // Method to cancel the delete operation
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.userToDeleteId = null;
  }

  // Method to perform the actual deletion
  performDelete() {
    if (this.userToDeleteId !== null) {
      this.userService.deleteUser(this.userToDeleteId).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers(); // Refresh the list after deletion
          this.cancelDelete(); // Hide the modal after deletion
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }
}
