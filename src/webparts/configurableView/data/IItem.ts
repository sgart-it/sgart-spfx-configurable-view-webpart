export interface IItem {
    id: number;
    title: string;
    description: string | null;
    date: string | null;
    user: string | null;
    image: IItemImage;
    url: string;
    targetBlank: boolean;
    inEvidence: boolean;
    buttonText: string;
}

export interface IItemImage {
    src: string | null;
    isIcon: boolean;
}

export interface IResult {
    success: boolean;
    items: IItem[];
    responseJson: any;
    error: string | null;
    url: string;
}