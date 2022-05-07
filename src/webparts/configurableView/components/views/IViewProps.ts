import { IItem, IResult } from "../../data/IItem";
import { ViewMode } from "../ViewModeEnum";
import { ViewType } from "../ViewTypeEnum";

export interface IViewProps {
  viewType: ViewType;
  viewMode: ViewMode;
  columns?: number;
  items: IItem[];
  responseJson?: any;
}
