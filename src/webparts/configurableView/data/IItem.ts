export interface IItem {
    id: number;
    title: string;
    description: string | undefined;
    date: string | undefined;
    user: string | undefined;
    image: IItemImage;
    url: string;
    targetBlank: boolean;
    inEvidence: boolean;
    buttonText: string;
}

export interface IItemImage {
    src: string | undefined;
    isIcon: boolean;
}

export interface IResult {
    success: boolean;
    items: IItem[];
    responseJson: any;
    error: string | undefined;
    url: string;
}