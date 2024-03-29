import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';

import {
  DefaultButton,
  PrimaryButton,
} from "office-ui-fabric-react/lib/Button";
import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";

export default class ButtonView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items } = this.props;

    const stackTokens: IStackTokens = { childrenGap: 15 };

    const buttons = items.map((item: IItem, index: number) => {
      const target = item.targetBlank === true ? "_blank" : "_self";
      const icon = typeof item.image.src === 'string' ? { iconName: item.image.src } : undefined;
      const url = isNullOrWhiteSpace(item.url) ? undefined : item.url;

      return (
        <Stack.Item grow={1} key={index}>
          {item.inEvidence === true ? (
            <PrimaryButton
              text={item.title}
              iconProps={icon}
              href={url}
              target={target}
              className={styles.btnMax}
            />
          ) : (
            <DefaultButton
              text={item.title}
              iconProps={icon}
              href={url}
              target={target}
              className={styles.btnMax}
            />
          )}
        </Stack.Item>
      );
    });

    return (
      <Stack
        horizontal
        wrap={true}
        horizontalAlign={"space-between"}
        verticalAlign={"space-between"}
        tokens={stackTokens}
      >
        {buttons}
      </Stack>
    );
  }
}
