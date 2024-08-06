import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../../../services/role.service';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import { TitleServiceService } from '../../../../../services/title-service.service';
import { PlantService } from '../../../../../services/plant.service';
import { DepartementService } from '../../../../../services/departement.service';
import * as XLSX from 'xlsx';
import { AreaService } from '../../../../../services/area.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent implements OnInit {
  visible: boolean = false;
  displayModal: boolean = false;
  displayUpdateModal: boolean = false;
  displayViewModal: boolean = false;

  first = 0;
  rows = 10;
  loading: boolean = true;
  searchValue: string | undefined;
  activityValues: number[] = [0, 100];
  public searchtext: string = '';

  isAreaOverlayOpen: boolean = false;

  searchText: string = ''; 
  sortOrder: string = 'asc';
  AreaId: number = 0;
  selectedArea: any = null;
  showUpdateUplantModal: boolean = false;
  editingplantId: number | null = null;
  editUserForm!: FormGroup;
  AreaForm!: FormGroup;
  UpdateAreaForm!: FormGroup;
  ViewArea!: FormGroup;
  currentPageArea: number = 1;

 
  public user: any = [];
  plants:any=[];
  Areas:any=[];

  currentPage: number = 1;
  AreaPerPage: number = 5; // Number of titles to display per page

 
  public searchtextplantupdate: string = '';
  public searchtextplantadd: string = '';
 

  UAreaId: any = null;
  selectedAreaId: any = null;
  isFormDisabled: boolean = false;



  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isUserOverlayOpen: boolean = false;
  isimportexportopen: boolean = false;
  filteredPlants: any[] = [];





  showColumns = {
    name_Area: true,
    Building_ID: true,
    date_delete: true,
    date_Update: true,
    date_Create: true,
    plant:false
};  
plant = {
  selectionunique:false
};  
public AreaList: any = [];
form!: FormGroup;
columns = ['Name', 'Plant'];
data = [ ];
name_Area: any[] = [];
plantID:  any[] = [];
  constructor(
    

    
    private AreaService :AreaService,
    private fb: FormBuilder,
    private PlantService:PlantService
  ) {
    this.form = this.fb.group({
      plantSelections: this.fb.array(this.plants.map(() => this.fb.control(false)))
    });
    this.AreaForm = this.fb.group({
      name_Area: ['', Validators.required],
      plantID: ['', Validators.required],
    });


    this.UpdateAreaForm = this.fb.group({
      name_Area: ['', Validators.required],
      plantID: ['', Validators.required] // Initialize plantID as an array
      //   plantID: [null, Validators.required]

    });
    
  }
  isActive: boolean = false;
  isActiveD: boolean = false;
  isActiveC: boolean = false;
  
  changeButtonColor() {
    this.isActive = !this.isActive;
  }
  
  changeButtonColorD() {
    this.isActiveD = !this.isActiveD;
  }
  changeButtonColorC() {
    this.isActiveC = !this.isActiveC;
  }
  
  onClose(){
    console.log('onClose called'); // Add this line to check if the method is called
    this.isActive = false;
    this.isActiveD = false;
    this.isActiveC = false;
    this.AreaForm.reset();
    this.name_Area = [];
    this.selectedPlantIds = [];

  }
  onClear(){
    console.log('onClear called'); // Add this line to check if the method is called
    this.isActive = false;
    this.isActiveD = false;
    this.isActiveC = false;
    this.AreaForm.reset();
  
    this.name_Area = [];
    this.plantID=[];
    this.selectedPlantIds = [];
  this.UpdateAreaForm.reset();
  this.selectedPlants = []; // Reset selected plants array
  }

  // filteredPlants = [...this.plants];
  searchControl = new FormControl('');
  filterPlants(searchTerm: string): void {
    this.filteredPlants = this.plants.filter((plant: any) =>
      plant.buildingID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.sapBuildingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }








  // -------------------------------------||||||    hi           ||||||||||||||---------------------------------------

  selectedPlantIds: number[] = [];
  selectedPlants: any[] = [];
  
  getSelectedPlantsText() {
    return this.selectedPlants.length > 0 && this.selectedPlantIds.length > 0
      ? this.selectedPlants.map(plant => plant.buildingID + ' (' + plant.sapBuildingNumber + ')').join(', ') 
      : 'Choose your plants';
  }
  
  
  isPlantSelected(plant: any): boolean {
    // Check if there are selected plants
    if (this.selectedPlants.length > 0) {
      return this.selectedPlantIds.includes(plant.id);
    }
    return false; // Return false if there are no selected plants
  }
  toggleSelection(plant: any) {
    // Check if the plant is already selected
    const isSelected = this.isPlantSelected(plant);
    
    if (isSelected) {
      // If the plant is already selected, clear the selection
      this.selectedPlantIds = [];
      this.selectedPlants = [];
    } else {
      // If the plant is not selected, select it
      this.selectedPlantIds = [plant.id];
      this.selectedPlants = [plant];
    }
    
    // Update the form control value
    this.AreaForm.patchValue({
      plantID: this.selectedPlantIds
    });
    this.UpdateAreaForm.patchValue({
      plantID: this.selectedPlantIds
    });
  }
  

isimportexportopenaddplant: boolean = false;
isimportexportopenupdateplant: boolean = false;
importexportopenAddPlant() {
  this.isimportexportopenaddplant = !this.isimportexportopenaddplant;
}
importexportopenUpdatePlant() {
  this.isimportexportopenupdateplant = !this.isimportexportopenupdateplant;
}

  // -------------------------------------||||||||||||||||||||||||---------------------------------------

  Export() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will export this areas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sure!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AreaService.getExportArea().subscribe({
          next: (res) => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Areas.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error('Export error:', err);
            Swal.fire('Error', 'An error occurred while exporting users', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'User export cancelled', 'info');
      }
    });
  }
  
  Import() {
    const style = document.createElement('style');
    style.textContent = `
        color :#3944BC;
        `;
    // Append the style to the head of the document
    document.head.appendChild(style);

    Swal.fire({
        title: 'Are you sure to import?',
        text: 'You will import the Excel file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, import it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Please import an Excel file (.xlsx)',
                input: 'file',
                inputAttributes: {
                    accept: '.xlsx',
                    'aria-label': 'Upload your Excel file'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                inputValidator: (file) => {
                    if (!file) {
                        return 'You need to select a file!';                        
                    } else {
                        console.log('Imported file:', file);
                        return null;
                    }
                },
                customClass: {
                    input: 'swal2-file-input',
                    cancelButton: 'swal2-cancel-button',
                    confirmButton: 'swal2-confirm-button'
                }
            }).then((fileResult) => {
                if (fileResult.isConfirmed) {
                    const file = fileResult.value;
                    // Here you can handle the imported file
                    console.log('Imported file:');

                    // Call importUser function from AuthService and pass the file
                    this.AreaService.importArea(file).subscribe({
                        next: (res) => {
                            // console.log('Import response:', res);
                            // const blob = new Blob([res], { type: 'application/octet-stream' });
                            // const url = window.URL.createObjectURL(blob);
                            // const a = document.createElement('a');
                            // a.href = url;
                            // document.body.appendChild(a);
                            // a.click();
                            // window.URL.revokeObjectURL(url);
                            Swal.fire('Imported!', 'User import done!', 'success').then((res)=>{
                              window.location.reload();
                            });
                        },
                        error: (err) => {
                            console.error('Import error:', err);
                            Swal.fire('Error', 'An error occurred while importing users', 'error');
                        }
                    });
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelled', 'File import cancelled', 'info');
        }
    });
}

  downloadExcel(): void {
    // Convert data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data, { header: this.columns });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Save the Excel file
    XLSX.writeFile(workbook, 'User.xlsx');
  }

  toggleDropdown() {
    this.isAreaOverlayOpen = !this.isAreaOverlayOpen;
  }
  importexportopen() {
    this.isimportexportopen = !this.isimportexportopen;
  }
ngOnInit() {
    
  this.filteredPlants = [...this.plants];
    this.searchControl.valueChanges.pipe(
      debounceTime(300)  // Optional: to add a delay before filtering
    ).subscribe(searchTerm => {
      this.filterPlants(searchTerm ?? ''); // Provide a default value if searchTerm is null
    });
    this.ViewArea = this.fb.group({
      name_Area: [{ value: '', disabled: true }, Validators.required],
      plantID: [{ value: '', disabled: true }, Validators.required],
      commenterDelete:['',Validators.required],
    });

    

    this.loadAreas();
  }
  
loadAreas(){
  

  this.PlantService.getAllPlant().subscribe((res) => {
    this.plants = res;
    this.filteredPlants = [...this.plants];
  });
  this.loading = true;
  this.AreaService.getAllArea().subscribe((res) => {
    this.Areas = res;
    this.loading = false;
  });
 
}


getPlantName(plantID: any): string {
  const selectedPlant = this.plants.find((plant: { id: any; }) => plant.id === plantID);
  return selectedPlant ? `${selectedPlant.buildingID} (${selectedPlant.sapBuildingNumber})` : '';
}

  sortData(columnName: string) {
    console.log("columnName   : => ",columnName);
    if (this.sortBy === columnName) {
     
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      
      this.sortBy = columnName;
      this.sortDirection = 1;
    }

    // Sort the data based on the selected column and direction
    this.plants.sort((a:any, b:any) => {
      if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
      if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
      return 0;
    });
  }
  
 
getArrowIcon(percentageChange: number): string {
  // Check if the percentage change is positive or negative
  if (percentageChange > 0) {
      return "fas fa-arrow-up text-success"; // Green color for arrow up icon
  } else {
      return "fas fa-arrow-down text-danger"; // Red color for arrow down icon
  }
}

onPlantChange(event: any): void {
  const selectedPlant = event.value;
  this.selectedPlantIds = [selectedPlant.id];
  this.selectedPlants = [selectedPlant];
  this.AreaForm.patchValue({
    plantID: this.selectedPlantIds
  });
}

onPlantChangeUpdate(event: any): void {
  const selectedPlant = event.value;
  this.selectedPlantIds = [selectedPlant.PlantID];
  this.selectedPlants = [selectedPlant];
  this.UpdateAreaForm.patchValue({
    plantID: this.selectedPlantIds
  });
}


SaveAreas() {
  if (this.AreaForm.valid) {
    const { name_Area, plantID } = this.AreaForm.value;
    this.AreaService.saveArea({ name_Area, plantID }).subscribe(response => {
      Swal.fire('Success', 'Area created successfully!', 'success').then(() => {
        window.location.reload();
      });
    }, error => {
      Swal.fire('Error', 'Error creating area', 'error');
    });
  }
}

clear(dt: any): void {
  dt.clear();
  this.searchText = '';
  this.loadAreas();
}



next() {
this.first = this.first + this.rows;
}

prev() {
this.first = this.first - this.rows;
}

reset() {
this.first = 0;
}

pageChange(event: { first: number; rows: number; }) {
this.first = event.first;
this.rows = event.rows;
}

isLastPage(): boolean {
return this.Areas? this.first === this.Areas.length - this.rows : true;
}

isFirstPage(): boolean {
return this.Areas ? this.first === 0 : true;
}


globalSearch() {
  const searchTerm = this.searchText.toLowerCase();

  this.Areas = this.Areas.filter((area: any) => {
    return Object.values(area).some((value: any) =>
      String(area.buildingID.buildingID).toLowerCase().includes(searchTerm) ||

      String(value).toLowerCase().includes(searchTerm)
    );
  });
}

  
  

  
  
changePage(page: number): void {
  this.currentPage = page;
}



  nextPage(): void {
    if (this.currentPage < this.totalArea) {
      this.currentPage++;
    }
  }

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  
 
changePageArea(page: number): void {
  this.currentPageArea = page;
}

nextPageArea(): void {
  if (this.currentPageArea < this.totalPagesArea) {
    this.currentPageArea++;
  }
}
  
prevPageArea(): void {
  if (this.currentPageArea > 1) {
    this.currentPageArea--;
  }
}
  
  
getDisplayedArea(): any[] {
  const startIndex = (this.currentPageArea - 1) * this.AreaPerPage;
  const endIndex = Math.min(startIndex + this.AreaPerPage, this.Areas.length);
  return this.Areas.slice(startIndex, endIndex);
}

  
get totalArea():number{
  return this.Areas.length;
}
get totalPagesArea(): number {
  return Math.ceil(this.totalArea / this.AreaPerPage);
  
}
 

 
get pagesArea(): number[] {
  const pagesArray = [];
  for (let i = 1; i <= this.totalPagesArea; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
}
 


// SaveArea() {
//   console.log(this.AreaForm.value);
//   if (this.AreaForm.valid) {
//     const selectedPlantIds = this.selectedPlants.map(plant => plant.id);
//     this.AreaForm.patchValue({ plantID: selectedPlantIds });

//     const { name_Area, plantID } = this.AreaForm.value;
//     const formData = { name_Area, plantIDs: plantID };

//     console.log("Form Values before saving:", formData); // Log the form values here

//     this.AreaService.saveArea(formData).subscribe({
//       next: (res) => {
//         Swal.fire('Done', 'Area saved successfully!', 'success').then((res) => {
//           window.location.reload();
//         });
//         this.AreaForm.reset();
        
//         const modal = document.getElementById("myModal");
//         if (modal != null) {
//           modal.classList.remove('show');
//           modal.style.display = 'none';
//         }
//       },
//       error: (err) => {
//         console.error('Error:', err);
//         Swal.fire('Error', 'An error occurred while saving the area', 'error');
//       },
//     });
//   } else {
//     Swal.fire('Error', 'Please provide valid information for the area', 'warning');
//   }
// }






updateAreas(AreaId: number, updatedAreaData: any) {
  console.log('UpdatedAreaaaaaaata',updatedAreaData);
  console.log(AreaId);
  

  if (AreaId !== null && this.UpdateAreaForm.valid) {
    // Check if any plant is selected
      //const selectedPlantIds = this.updatedAreaData.map(plant: (number: any) => plant.id);
      const selectedPlantIds = this.selectedPlants.map(plant => plant.id);
      this.UpdateAreaForm.patchValue({ plantID: selectedPlantIds });
    
       const { name_Area, plantID } = this.UpdateAreaForm.value;
       const formData = {
          ...updatedAreaData,
          name_Area, plantIDs: plantID };
          console.log('Form values:', this.UpdateAreaForm.value);
          console.log('Form validity:', this.UpdateAreaForm.valid);
          
          console.log('Updating area with data:', formData);

    this.AreaService.updateArea(AreaId, formData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Area updated successfully!', 'success').then(() => {
          window.location.reload();
        });
        console.log('Update successful', response);
      },
      error: (error) => {
        Swal.fire('Error', 'Error updating area', 'error');
        console.error('Error updating area:', error);
        this.UpdateAreaForm.reset();
      }
    });
  } else {
    console.error('Area ID is null or form is invalid');
    Swal.fire('Error', 'An error occurred while updating the area', 'error');
  }
}


openModelUpdate(AreaId: any) {

  this.displayUpdateModal = true;

  this.selectedPlantIds = [];

  this.selectedAreaId = AreaId;  
  
  console.log("selection Area id :+++>", this.selectedAreaId );
  console.log("selection PlantIDs-----> :", this.selectedPlantIds );

  console.log("Area  id :", AreaId );
  // Get the modal element
  const modal = document.getElementById("updateAreaModule");
  // console.log(AreaId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#updateAreaModule');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', AreaId);
      }

      // Show the modal
      modal.classList.add('show');
      modal.style.display = 'block';
      this.selectGetAreabyid(AreaId);

      // Add event listeners to close the modal
      const modalCloseButton = modal.querySelector('.modal-header .btn-close');
      if (modalCloseButton != null) {
          modalCloseButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const closeButton = modal.querySelector('.modal-footer .btn-danger');
      if (closeButton != null) {
          closeButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const modalBackdrop = modal.querySelector('.modal-backdrop');
      if (modalBackdrop != null) {
          modalBackdrop.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }
  }
}
  
openModelView(AreaId: any) {
  this.displayViewModal = true;

  this.selectedAreaId = AreaId;  
  
console.log("selection id :", this.selectedAreaId );
console.log("Area  id :", AreaId );
  // Get the modal element
  const modal = document.getElementById("ViewAreaModule");
  console.log(AreaId);
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ViewAreaModule');
      if (userIdInput != null) {
          userIdInput.setAttribute('value', AreaId);
      }

      // Show the modal
      modal.classList.add('show');
      modal.style.display = 'block';
      
      // Add event listeners to close the modal
      const modalCloseButton = modal.querySelector('.modal-header .btn-close');
      if (modalCloseButton != null) {
          modalCloseButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const closeButton = modal.querySelector('.modal-footer .btn-danger');
      if (closeButton != null) {
          closeButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const modalBackdrop = modal.querySelector('.modal-backdrop');
      if (modalBackdrop != null) {
          modalBackdrop.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }
  }
}
  
openModelImportExcelUser() {
  
  
  // Get the modal element
  const modal = document.getElementById("ImportExcelUser");
  
  if (modal != null) {
    
      // Set the user ID in the modal
      // For example, if you have an input field with id="userId" in the modal, you can set its value
      const userIdInput = modal.querySelector('#ImportExcelUser');
      
      // Show the modal
      modal.classList.add('show');
      modal.style.display = 'block';
      
      // Add event listeners to close the modal
      const modalCloseButton = modal.querySelector('.modal-header .btn-close');
      if (modalCloseButton != null) {
          modalCloseButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const closeButton = modal.querySelector('.modal-footer .btn-danger');
      if (closeButton != null) {
          closeButton.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }

      const modalBackdrop = modal.querySelector('.modal-backdrop');
      if (modalBackdrop != null) {
          modalBackdrop.addEventListener('click', () => {
              modal.classList.remove('show');
              modal.style.display = 'none';
          });
      }
  }
}

openModel() {

  this.displayModal = true;

  this.selectedPlantIds = [];
  this.selectedPlants = [];
  this.visible = true;

 
  const modal = document.getElementById("AddArea");
  if (modal != null) {
    modal.classList.add('show'); // Add 'show' class to display the modal
    modal.style.display = 'block';

  }

  // Add event listener to the close button
  const closeButton = document.querySelector('.modal-footer .btn-danger');
  if (closeButton != null) {
    closeButton.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';

      }
    });
  }

  // Add event listener to the modal backdrop to close the modal when clicked outside the modal
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop != null) {
    modalBackdrop.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';
      }
    });
  }

  // Add event listener to the close button in the modal header
  const modalCloseButton = document.querySelector('.modal-header .btn-close');
  if (modalCloseButton != null) {
    modalCloseButton.addEventListener('click', () => {
      if (modal != null) {
        modal.classList.remove('show'); // Remove 'show' class to hide the modal
        modal.style.display = 'none';
      }
    });
  }
}




SaveArea() {
  console.log(this.AreaForm.value);
  if (this.AreaForm.valid) {
    const selectedPlantIds = this.selectedPlants.map(plant => plant.id);
    this.AreaForm.patchValue({ plantID: selectedPlantIds });

    const { name_Area, plantID } = this.AreaForm.value;
    const formData = { name_Area, plantIDs: plantID };

    console.log("Form Values before saving:", formData); // Log the form values here

    this.AreaService.saveArea(formData).subscribe({
      next: (res) => {
        Swal.fire('Done', 'Area saved successfully!', 'success').then((res) => {
          window.location.reload();
        });
        this.AreaForm.reset();
        
        const modal = document.getElementById("myModal");
        if (modal != null) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'An error occurred while saving the area', 'error');
      },
    });
  } else {
    Swal.fire('Error', 'Please provide valid information for the area', 'warning');
  }
}



DeleteArea(AreaId: number) {
  // Assuming you have a confirmation dialog before deleting the user
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this area!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // Prompt user for commenter before deleting
      Swal.fire({
        title: 'Please provide your name or a commenter for deletion',
        input: 'textarea',
        inputPlaceholder: 'Enter your name or a commenter here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to provide a commenter!';
          }
          // Add a return statement here to handle the case where validation passes
          return null;
        }

      }).then((commenterResult) => {
        if (commenterResult.isConfirmed) {
          // If user provides a commenter and confirms deletion, send delete request to backend
          const commenter = commenterResult.value;
          this.AreaService.deleteArea(AreaId, commenter).subscribe({
            next: (res) => {
              // Handle success response
              Swal.fire('Deactivate!', 'area has been Deactivate.', 'success').then((res)=>{
                window.location.reload();
              })

              // Optionally, you can refresh the user list or perform any other action
              
            },
            error: (err) => {
              // Handle error response
              console.error('Error:', err);
              Swal.fire('Error', 'An error occurred while deleting the user', 'error');
            }
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // If user cancels deletion, show a message
      Swal.fire('Cancelled', 'User deletion cancelled', 'info');
    }
  });
}






  

 


closeModal() {
  const modal = document.getElementById("updateAreaModule");
  if (modal != null) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }}

  selectGetAreabyid(id: number) {
    this.UAreaId = id;
    console.log(`Selected area ID----->: ${id}`);

    this.AreaService.getAreaById(id).subscribe((Area) => {
      this.selectedPlantIds = [Area.plantID];
      this.selectedPlants = this.plants.filter((plant: any) => plant.id === Area.plantID);

      this.UpdateAreaForm.patchValue({
        name_Area: Area.name_Area,
        plantID: Area.plantID,

      });
      console.log('***************** ',this.UpdateAreaForm)

    });
  }
selectView(id: number) {
  this.UAreaId = id;
  
    this.AreaService.getAreaById(id).subscribe((Area) => {
      this.selectedPlantIds = [Area.plantID];
      this.selectedPlants = this.plants.filter((plant: any) => plant.id === Area.plantID);

      this.ViewArea.patchValue({
        name_Area: Area.name_Area,
        plantID: Area.plantID,
        commenterDelete:Area.commenterDelete
      });
    });
  console.log('++++++++++++ ',this.ViewArea)
 }


}