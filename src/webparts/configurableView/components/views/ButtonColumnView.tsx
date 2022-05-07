import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";

import {
  DefaultButton,
  PrimaryButton,
} from "office-ui-fabric-react/lib/Button";
import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";

export default class ButtonColumnView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, columns } = this.props;
    const controls = items.map((item: IItem, index: number) => {
      const target = item.targetBlank === true ? "_blank" : "_self";
      const icon =
        typeof item.image.src === "string" ? { iconName: item.image.src } : null;
      const url = isNullOrWhiteSpace(item.url) ? null : item.url;
      let classNameCol = styles.gridCol6;
      switch (columns) {
        case 1:
          classNameCol = styles.gridCol;
          break;
        case 2:
          classNameCol = styles.gridCol2;
          break;
        case 3:
          classNameCol = styles.gridCol3;
          break;
        case 4:
          classNameCol = styles.gridCol4;
          break;
        case 5:
          classNameCol = styles.gridCol5;
          break;
      }

      return (
        <div className={classNameCol}>
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
        </div>
      );
    });

    return (
      <div className={styles.grid} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }
}
