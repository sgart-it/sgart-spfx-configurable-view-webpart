import { IItem, IResult } from "../../data/IItem";
import { ViewModel } from "../ViewModelEnum";
import { ViewType } from "../ViewTypeEnum";

export interface IViewProps {
  viewType: ViewType;
  viewModel: ViewModel;
  columns?: number;
  items: IItem[];
  responseJson?: any;
}
