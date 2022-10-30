export interface IConfigurableViewWebPartProps {
  webpartTitle: string;
  viewType: string;
  viewModel: string;
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