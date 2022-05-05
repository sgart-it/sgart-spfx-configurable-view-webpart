import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'ConfigurableViewWebPartStrings';
import ConfigurableView from './components/ConfigurableView';
import { IConfigurableViewProps } from './components/IConfigurableViewProps';
import { IConfigurableViewWebPartProps } from './IConfigurableViewWebPartProps';
import { initDataService } from './data/DataService';
import { ViewType } from './components/ViewTypeEnum';

export default class ConfigurableViewWebPart extends BaseClientSideWebPart<IConfigurableViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    initDataService(this.context);

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IConfigurableViewProps> = React.createElement(
      ConfigurableView,
      {
        title: this.properties.webpartTitle,
        isPropertyPaneOpen: this.context.propertyPane.isPropertyPaneOpen(),
        viewType: this.properties.viewType,
        columns: this.properties.columns,

        webRelativeUrl: this.properties.webRelativeUrl,
        listName: this.properties.listName,
        filtersParam: this.properties.filtersParam,
        orderByParam: this.properties.orderByParam,
        topParam: this.properties.topParam,

        titleFieldName: this.properties.titleFieldName,
        descriptionFieldName: this.properties.descriptionFieldName,
        dateFieldName: this.properties.dateFieldName,
        userFieldName: this.properties.userFieldName,
        imageFieldName: this.properties.imageFieldName,
        urlFieldName: this.properties.urlFieldName,
        targetBlankFieldName: this.properties.targetBlankFieldName,
        inEvidenceFieldName: this.properties.inEvidenceFieldName,

        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this.render();

    // carico i valori dell'enum
    const viewTypeOptions = Object.keys(ViewType).filter((v) => isNaN(Number(v))).map(item => {
      return { key: ViewType[item], text: item };
    });

    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.PresentationGroupName,
              groupFields: [
                PropertyPaneTextField('webpartTitle', {
                  label: strings.WebPartTitleLabel
                }),
                PropertyPaneDropdown('viewType', {
                  label: strings.ViewTypeLabel,
                  options: viewTypeOptions
                }),
                PropertyPaneSlider('columns', {
                  label: strings.ColumnsLabel,
                  min: 1,
                  max: 6,
                  step: 1,
                  showValue: true
                })
              ]
            },
            {
              groupName: strings.ListGroupName,
              groupFields: [
                PropertyPaneTextField('webRelativeUrl', {
                  label: strings.WebRelativeUrlLabel,
                  description: strings.WebRelativeUrlDescription
                }),
                PropertyPaneTextField('listName', {
                  label: strings.ListNameLabel,
                  description: strings.ListNameDescription
                }),
                PropertyPaneTextField('filtersParam', {
                  label: strings.FltersParamdLabel,
                  description: strings.FltersParamdDescription
                }),
                PropertyPaneTextField('orderByParam', {
                  label: strings.OrderByParamyLabel,
                  description: strings.OrderByParamyDescription
                }),
                PropertyPaneSlider('topParam', {
                  label: strings.TopParamLabel,
                  min: 1,
                  max: 50,
                  step: 1,
                  showValue: true
                })
              ]
            },
            {
              groupName: strings.FieldsGroupName,
              groupFields: [
                PropertyPaneTextField('titleFieldName', {
                  label: strings.TitleFieldNameLabel,
                  description: strings.TitleFieldNameDescription
                }),
                PropertyPaneTextField('descriptionFieldName', {
                  label: strings.DescriptionFieldNameLabel,
                  description: strings.DescriptionFieldNameDescription
                }),
                PropertyPaneTextField('dateFieldName', {
                  label: strings.DateFieldNameLabel,
                  description: strings.DateFieldNameDescription
                }),
                PropertyPaneTextField('userFieldName', {
                  label: strings.UserFieldNameLabel,
                  description: strings.UserFieldNameDescription
                }),
                PropertyPaneTextField('imageFieldName', {
                  label: strings.ImageFieldNameLabel,
                  description: strings.ImageFieldNameDescription
                }),
                PropertyPaneTextField('urlFieldName', {
                  label: strings.UrlFieldNameLabel,
                  description: strings.UrlFieldNameDescription
                }),
                PropertyPaneTextField('targetBlankFieldName', {
                  label: strings.TargetBlankFieldNameLabel,
                  description: strings.TargetBlankFieldNameDescription
                }),
                PropertyPaneTextField('inEvidenceFieldName', {
                  label: strings.InEvidenceFieldNameLabel,
                  description: strings.InEvidenceFieldNameDescription
                })
              ]
            },
            {
              groupName: strings.AboutGroupName,
              groupFields: [
                PropertyPaneLink('linkField', {
                  text: "Sgart.it",
                  href: "https://www.sgart.it/?SPFxConfigurableView",
                  target: "_blank"
                })
              ]
            }
            /*,
            {
              groupName: "About",
              groupFields: [
                PropertyPaneLabel('titleFieldName', {
                  label: strings.TitleFieldNameLabel,
                  description: strings.TitleFieldNameDescription
                })
              ]
            }*/
          ]
        }
      ]
    };
  }

  protected onPropertyPaneConfigurationComplete(): void {
    this.render();
  }
  /*protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  }*/

}
