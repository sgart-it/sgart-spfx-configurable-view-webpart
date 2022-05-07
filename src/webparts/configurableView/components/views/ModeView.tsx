import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";
import { ViewMode } from "../ViewModeEnum";

export default class ModeView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, viewMode, columns } = this.props;

    let rootClassName = styles.modeButton;

    const controls = items.map((item: IItem, index: number) => {
      const titleIsNull = item.title === "";
      const target = item.targetBlank === true ? "_blank" : "_self";
      const showIcon = !isNullOrWhiteSpace(item.image?.src);
      const icon =
        showIcon && typeof item.image.src === "string"
          ? { iconName: item.image.src }
          : null;
      const url = isNullOrWhiteSpace(item.url) ? null : item.url;
      const inEvidence = item.inEvidence ? " sgart-spfx-cv-evidence" : "";

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
          {titleIsNull ? (
            <div className="sgart-spfx-cv-button sgart-spfx-cv-disbaled"></div>
          ) : (
            <a href={url} target={target} className={"sgart-spfx-cv-button" + inEvidence}>
              {showIcon && (
                <span className="sgart-spfx-cv-icon-container">
                  <i data-icon-name={icon} aria-hidden="true"></i>
                </span>
              )}
              <span className="sgart-spfx-cv-text-container">{item.title}</span>
            </a>
          )}
        </div>
      );
    });

    return (
      <div className={styles.grid + " " + rootClassName} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }
}
