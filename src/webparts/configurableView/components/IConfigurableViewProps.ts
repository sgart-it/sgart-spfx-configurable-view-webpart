import { ViewType } from "./ViewTypeEnum";

export interface IConfigurableViewProps {
  title: string;
  isPropertyPaneOpen: boolean;
  viewType: ViewType;
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

  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
