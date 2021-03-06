declare interface IConfigurableViewWebPartStrings {
  PropertyHeaderDescription: string;
  PresentationGroupName: string;
  SourceGroupName: string;
  FieldsGroupName: string;
  AboutGroupName: string;

  WebPartTitleLabel: string;
  ViewTypeLabel: string;
  ViewModelLabel: string;
  ColumnsLabel: string;

  WebRelativeUrlLabel: string;
  WebRelativeUrlDescription: string;
  ListNameLabel: string;
  ListNameDescription: string;
  FltersParamdLabel: string;
  FltersParamdDescription: string;
  OrderByParamyLabel: string;
  OrderByParamyDescription: string;
  TopParamLabel: string;

  TitleFieldNameLabel: string;
  TitleFieldNameDescription: string;
  DescriptionFieldNameLabel: string;
  DescriptionFieldNameDescription: string;
  DateFieldNameLabel: string;
  DateFieldNameDescription: string;
  UserFieldNameLabel: string;
  UserFieldNameDescription: string;
  ImageFieldNameLabel: string;
  ImageFieldNameDescription: string;
  UrlFieldNameLabel: string;
  UrlFieldNameDescription: string;
  TargetBlankFieldNameLabel: string;
  TargetBlankFieldNameDescription: string;
  InEvidenceFieldNameLabel: string;
  InEvidenceFieldNameDescription: string;
  ButtonTextFieldNameLabel: string;
  ButtonTextFieldNameDescription: string;

  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'ConfigurableViewWebPartStrings' {
  const strings: IConfigurableViewWebPartStrings;
  export = strings;
}
