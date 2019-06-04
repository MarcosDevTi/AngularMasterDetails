import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import { ActivatedRoute, Route, Router} from "@angular/router"
import toastr from "toastr" 
import { switchMap } from 'rxjs/operators';
import { Category } from '../../categories/shared/category.model';
import { EntryService } from '../shared/entry.service.ts';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  selectedCategory

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }


  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildEntryForm()
    this.loadEntry()
    this.loadCategories()
  }

  ngAfterContentChecked():void {
    this.setPageTitle()
  }

  submitForm(){
    this.submittingForm = true
    if(this.currentAction == 'new')
      this.createEntry()
    else
      this.updateEntry()
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new")
    this.currentAction = 'new'
    else
    this.currentAction = 'edit'
  }

  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
     
    })
  }

  private loadEntry(){
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry
          this.entryForm.patchValue(entry)
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      )
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private setPageTitle(){
    if(this.currentAction == 'new')
    this.pageTitle = 'Cadastro de Novo Laçamento'
    else{
      const entryName = this.entry.name || ''
      this.pageTitle = 'Editando Lançamento: ' + entryName
    }
  }

  public createEntry(){
    const entry:Entry = Object.assign(new Entry(), this.entryForm.value)
    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private updateEntry(){
    const entry:Entry = Object.assign(new Entry(), this.entryForm.value)

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(entry: Entry){
    toastr.success('Solicitação processada com sucesso!')
    
    //redirect/reload component page
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar sua solicitação!')
    this.submittingForm = false

    if(error.status === 422)
    this.serverErrorMessages = JSON.parse(error._body).errors
    else
    this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
  }
}