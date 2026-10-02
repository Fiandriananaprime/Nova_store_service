export type SpecType =
    | "TEXT"
    | "NUMBER"
    | "BOOLEAN"
    | "SELECT"
    | "MULTI_SELECT";

export type CategoryTree = {
    id: string;
    name: string;
    children: CategoryTree[];
};

export interface Category {
    id: string;
    name: string;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryDetail extends Category {
    parent: Category | null;
    children: Category[];
    specs: CategorySpec[];
}

export interface CategorySpec {
    id: string;
    categoryId: string;
    key: string;
    name: string;
    type: SpecType;
    required: boolean;
    filterable: boolean;
    searchable: boolean;
    options: unknown | null;

    createdAt: Date;
    updatedAt: Date;
}