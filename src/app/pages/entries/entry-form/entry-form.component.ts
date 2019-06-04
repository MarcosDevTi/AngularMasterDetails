import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import { ActivatedRoute, Route, Router} from "@angular/router"
import toastr from "toastr" 
import { switchMap } from 'rxjs/operators';
import { Category } from '../../categories/shared/category.model';
import { EntryService } from '../shared/entry.service.ts';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent  extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Array<Category>;

  constructor(
    protected entryService: EntryService,
    private categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson);
   }

  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const categoryName = this.resource.name || '';
    return 'Editando Lançamento: ' + categoryName;
  }
}