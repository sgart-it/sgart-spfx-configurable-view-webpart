export interface IFields {
    title: string;
    description: string;
    date: string;
    user: string;
    image: string;
    url: string;
    targetBlank: string;
    inEvidence: string;
}

export interface IListParams {
    webRelativeUrl: string;
    listName: string;
    filters: string;
    orderBy: string;
    top: number;
    fields: IFields;
}
