import { IItem, IResult } from "../../data/IItem";
import { ViewType } from "../ViewTypeEnum";

export interface IViewProps {
  viewType: ViewType;
  columns?: number;
  items: IItem[];
  responseJson?: any;
}
