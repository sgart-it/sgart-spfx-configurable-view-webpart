import * as React from "react";
import { IViewProps } from "./IViewProps";
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react";
import { isNullOrWhiteSpace } from "../../Helper";

const options: IChoiceGroupOption[] = [
  { key: "JSON", text: "Json object", iconProps: { iconName: "Code" } },
  {
    key: "API",
    text: "API Response",
    iconProps: { iconName: "AzureAPIManagement" },
  },
];

export interface IJsonViewState {
  tabSelected: string;
  title: string;
}

export default class JsonView extends React.Component<
  IViewProps,
  IJsonViewState
> {
  public constructor(props: IViewProps, state: IJsonViewState) {
    super(props);

    this.state = {
      tabSelected: options[0].key,
      title: options[0].text,
    };
  }

  public render(): React.ReactElement<IViewProps> {
    const { items, responseJson } = this.props;
    const { tabSelected, title } = this.state;

    return (
      <div>
        <ChoiceGroup
          defaultSelectedKey={this.state.tabSelected}
          options={options}
          onChange={(
            ev: React.FormEvent<HTMLInputElement>,
            option: IChoiceGroupOption
          ) => {
            console.log(option);
            this.setState({ tabSelected: option.key, title: option.text });
          }}
        />
        <div>
          <h4>{title}</h4>
          <hr />
          <pre>
            {tabSelected === options[0].key && JSON.stringify(items, null, 2)}
            {tabSelected === options[1].key &&
              !isNullOrWhiteSpace(responseJson) &&
              JSON.stringify(responseJson, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}
