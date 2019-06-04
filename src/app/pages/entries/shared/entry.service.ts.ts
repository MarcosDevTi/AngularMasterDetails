
import { Entry } from './entry.model';
import { Injectable, Injector } from '@angular/core';
import {Observable, throwError} from 'rxjs'
import {map, catchError, flatMap} from 'rxjs/operators'
import { BaseResourceRervice } from 'src/app/shared/services/base.resource.service.ts';
import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceRervice<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, Entry.fromJson);
 }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }
}
