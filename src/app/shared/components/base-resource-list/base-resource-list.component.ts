import { Component, OnInit } from '@angular/core';
import { BaseResource } from '../../base-resource.model.ts';
import { BaseResourceService } from '../../services/base.resource.service.ts';

export abstract class BaseResourceListComponent<T extends BaseResource> implements OnInit {

  abstract displayedColumns: string[] = [];

  resources: T[] = [];
  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteResource(resurce: T){
    const mustDelete = confirm('Deseja realmente excluir este item?')

    if(mustDelete) {
    this.resourceService.delete(resurce.id).subscribe(
      () => this.resources = this.resources.filter(element => element != resurce),
      () => alert("Erro ao tentar excluir!")
    )
    }
  }

}
