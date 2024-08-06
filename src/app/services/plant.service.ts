import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private baseUrl:string="http://162.109.85.69:1211/api/Plant";
  constructor(private http: HttpClient) { }


  getAllPlant(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getPlantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  getPlantByIdBUidinding(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getPlantIdByBuildingId/${id}`);
  }
  GetPlantIdByBuilding(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getPlantIdByBuilding/${id}`);
  }
  savePlant(PlantObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, PlantObj);
  }

  deletePlant(PlantId: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deletePlant/' + PlantId+'/'+comementer);
  }

  updatePlant(id: number, titleObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, titleObj);
  }

  importPlant(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/importPlants', formData, { responseType: 'blob' });
  }
  getExportPlant(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/exportPlants', { responseType: 'blob' });
  }

}
