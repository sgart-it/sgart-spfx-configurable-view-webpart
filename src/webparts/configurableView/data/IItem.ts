export interface IItem {
    id: number;
    title: string;
    description: string | null;
    date: string | null;
    user: string | null;
    image: string | null;
    url: string;
    targetBlank: boolean;
    inEvidence: boolean;
}

export interface IResult {
    success: boolean;
    items: IItem[];
    responseJson: any;
    error: string | null;
    url: string;
}