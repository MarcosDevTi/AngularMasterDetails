import { BaseResource } from 'src/app/shared/base-resource.model.ts';

export class Category extends BaseResource {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string
    ) {
        super();
    }

    static fromJson(jsonData: any): Category {
        return Object.assign(new Category(), jsonData);
    }
}