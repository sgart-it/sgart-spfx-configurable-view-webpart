import { IItem } from "../data/IItem";

export interface IConfigurableViewState {
  success: boolean;
  items: IItem[];
  resultJson?: any;
  error: string;
  url: string;
}
