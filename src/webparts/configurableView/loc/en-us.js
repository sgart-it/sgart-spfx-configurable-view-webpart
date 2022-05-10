define([], function () {
  return {
    "PropertyHeaderDescription": "Flexible view web part (Sgart.it)",
    "PresentationGroupName": "Presentation",
    "SourceGroupName": "Source",
    "FieldsGroupName": "Field mappings",
    "AboutGroupName" : "About",

    "WebPartTitleLabel": "Web part title",
    "ViewTypeLabel": "View type",
    "ViewModelLabel": "View model",
    "ColumnsLabel": "Columns",

    "WebRelativeUrlLabel": "Web relative url",
    "WebRelativeUrlDescription": "/ for root site or /sites/name for a specific site collection or blank for current site",
    "ListNameLabel": "List or document library title",
    "ListNameDescription": "Display name of list or guid in the form {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx} or list (/Lists/listName or /DocLibName or /lists or /folders or /webinfos)",
    "FltersParamdLabel": "Filters",
    "FltersParamdDescription": "ex.: Title eq 'xyz' or Modified gt datetime'2021-01-01T00:00:00Z' or startswith(Title, 'xyz') or month(PubDate) gt 6 or substringof('xyz', Title) eq true",
    "OrderByParamyLabel": "Order by",
    "OrderByParamyDescription": "ex.: Title, Modified desc",
    "TopParamLabel": "Max items",

    "TitleFieldNameLabel": "Title",
    "TitleFieldNameDescription": "FieldName (Title, FileLeafRef, ...) or #Static text",
    "DescriptionFieldNameLabel": "Description",
    "DescriptionFieldNameDescription": "FieldName or FieldName:html or * for debug",
    "DateFieldNameLabel": "Date",
    "DateFieldNameDescription": "FieldName (Modified, Created,...) or FieldName:date",
    "UserFieldNameLabel": "User name",
    "UserFieldNameDescription": "FieldName or FieldName/LinkedFieldName (Author/Title)",
    "ImageFieldNameLabel": "Image",
    "ImageFieldNameDescription": "FieldName or FieldName:image or #StaticIconName or FieldName/FieldName|string and palceholder {{value}} (ex. Author/Name|/_layouts/15/userphoto.aspx?size=S&accountname={{value}})",
    "UrlFieldNameLabel": "Url",
    "UrlFieldNameDescription": "FieldName (FileRef, Url, ...) or FieldName:url or FieldName:description",
    "TargetBlankFieldNameLabel": "Open in new window",
    "TargetBlankFieldNameDescription": "FieldName or #true",
    "InEvidenceFieldNameLabel": "In evidence",
    "InEvidenceFieldNameDescription": "FieldName or #true",
    "ButtonTextFieldNameLabel": "Button text",
    "ButtonTextFieldNameDescription": "",

    "AppLocalEnvironmentSharePoint": "The app is running on your local environment as SharePoint web part",
    "AppLocalEnvironmentTeams": "The app is running on your local environment as Microsoft Teams app",
    "AppSharePointEnvironment": "The app is running on SharePoint page",
    "AppTeamsTabEnvironment": "The app is running in Microsoft Teams"
  }
});