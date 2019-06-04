import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntriesRoutingModule } from './entries-routing.module';
import { EntryFormComponent } from './entry-form/entry-form.component';

import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EntryListComponent } from './entry-list/entry-list.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [EntryFormComponent, EntryListComponent],
  imports: [
    CommonModule,
    EntriesRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class EntriesModule { }
