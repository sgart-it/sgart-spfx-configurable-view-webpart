import * as React from "react";
import styles from "./ConfigurableView.module.scss";
import { IConfigurableViewProps } from "./IConfigurableViewProps";
import { IConfigurableViewState } from "./IConfigurableViewState";
import { escape } from "@microsoft/sp-lodash-subset";
import { isNullOrWhiteSpace } from "../Helper";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import { loadList } from "../data/DataService";
import { IListParams } from "../data/IListParam";
import { ViewType } from "./ViewTypeEnum";
import BaseView from "./views/BaseView";
import JsonView from "./views/JsonView";
import ButtonView from "./views/ButtonView";
import ButtonColumnView from "./views/ButtonColumnView";
import CardColumnView from "./views/CardColumnView";

const VERSION = "1.2022-05-03";

export default class ConfigurableView extends React.Component<
  IConfigurableViewProps,
  IConfigurableViewState
> {
  public constructor(
    props: IConfigurableViewProps,
    state: IConfigurableViewState
  ) {
    super(props);

    this.state = {
      success: false,
      items: [],
      error: null,
      url: null,
    };
  }

  public render(): React.ReactElement<IConfigurableViewProps> {
    const {
      title,
      isPropertyPaneOpen,
      viewType,
      listName,
      filtersParam,
      orderByParam,
      topParam,

      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    const isTitleVivible = !isNullOrWhiteSpace(title);

    let view: React.ReactElement<IConfigurableViewProps> = null;
    try {
      view = this.getView();
    } catch (error) {
      this.setState({
        success: false,
        error: error,
      });
    }

    return (
      <section
        className={`${styles.configurableView} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        {isTitleVivible && (
          <div className={styles.title}>
            <span role="heading">{escape(title)}</span>
          </div>
        )}

        {!isNullOrWhiteSpace(this.state.error) && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
            {this.state.error}
          </MessageBar>
        )}

        {view}

        {isPropertyPaneOpen && (
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            className={styles.debugInfo}
          >
            <div>Enviroment: {environmentMessage}</div>
            <div>Version: {VERSION}</div>
            <div>
              Author:{" "}
              <a
                href="https://www.sgart.it?SPFxConfigurableView"
                target="_blank"
              >
                Sgart.it
              </a>
            </div>
            <hr />
            <div>ViewType: {viewType}</div>
            <hr />
            <div>API url: {this.state.url}</div>
          </MessageBar>
        )}
      </section>
    );
  }

  private getView(): React.ReactElement<IConfigurableViewProps> {
    const { viewType, columns } = this.props;
    const { items } = this.state;
    try {
      switch (viewType) {
        case ViewType.Button:
          return <ButtonView viewType={viewType} items={items} />;

        case ViewType.ButtonColumn:
          return (
            <ButtonColumnView
              viewType={viewType}
              items={items}
              columns={columns}
            />
          );

        case ViewType.CardColumn:
          return (
            <CardColumnView
              viewType={viewType}
              items={items}
              columns={columns}
            />
          );

        case ViewType.Json:
          return (
            <JsonView
              viewType={viewType}
              items={items}
              responseJson={this.state.resultJson}
            />
          );

        default:
          return <BaseView viewType={viewType} items={items} />;
      }
    } catch (error) {
      console.error("getView", error);
      return <div>Error: {escape(error)}</div>;
    }
  }

  public async componentDidMount(): Promise<void> {
    this.loadItems();
  }

  public async componentDidUpdate(
    prevProps: IConfigurableViewProps,
    prevState: IConfigurableViewState
  ) {
    if (
      prevProps.webRelativeUrl !== this.props.webRelativeUrl ||
      prevProps.listName !== this.props.listName ||
      prevProps.filtersParam !== this.props.filtersParam ||
      prevProps.orderByParam !== this.props.orderByParam ||
      prevProps.topParam !== this.props.topParam ||
      prevProps.titleFieldName !== this.props.titleFieldName ||
      prevProps.descriptionFieldName !== this.props.descriptionFieldName ||
      prevProps.dateFieldName !== this.props.dateFieldName ||
      prevProps.userFieldName !== this.props.userFieldName ||
      prevProps.imageFieldName !== this.props.imageFieldName ||
      prevProps.urlFieldName !== this.props.urlFieldName ||
      prevProps.targetBlankFieldName !== this.props.targetBlankFieldName ||
      prevProps.inEvidenceFieldName !== this.props.inEvidenceFieldName
    ) {
      this.loadItems();
    }
  }

  private async loadItems() {
    const params: IListParams = {
      webRelativeUrl: this.props.webRelativeUrl,
      listName: this.props.listName,
      filters: this.props.filtersParam,
      orderBy: this.props.orderByParam,
      top: this.props.topParam,
      fields: {
        title: this.props.titleFieldName,
        description: this.props.descriptionFieldName,
        date: this.props.dateFieldName,
        user: this.props.userFieldName,
        image: this.props.imageFieldName,
        url: this.props.urlFieldName,
        targetBlank: this.props.targetBlankFieldName,
        inEvidence: this.props.inEvidenceFieldName,
      },
    };

    const result = await loadList(params);

    this.setState({
      success: result.success,
      items: result.items,
      resultJson: result.responseJson,
      error: result.error,
      url: result.url,
    });
  }
}