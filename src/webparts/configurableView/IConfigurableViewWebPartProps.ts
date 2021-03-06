import { ViewModel } from "./components/ViewModelEnum";
import { ViewType } from "./components/ViewTypeEnum";

export interface IConfigurableViewWebPartProps {
  webpartTitle: string;
  viewType: ViewType;
  viewModel: ViewModel;
  columns: number;

  webRelativeUrl: string;
  listName: string;
  filtersParam: string;
  orderByParam: string;
  topParam: number;

  titleFieldName: string;
  descriptionFieldName: string;
  dateFieldName: string;
  userFieldName: string;
  imageFieldName: string;
  urlFieldName: string;
  targetBlankFieldName: string;
  inEvidenceFieldName: string;
  buttonTextFieldName: string;
}