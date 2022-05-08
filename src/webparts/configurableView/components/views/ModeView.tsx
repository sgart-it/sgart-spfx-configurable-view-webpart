import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";
import { ViewModel } from "../ViewModelEnum";
import { DocumentCardImage } from "office-ui-fabric-react/lib/components/DocumentCard/DocumentCardImage";
import { IIconProps } from "office-ui-fabric-react/lib/components/Icon/Icon.types";

export default class ModeView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, viewModel, columns } = this.props;

    const controls = items.map((item: IItem, index: number) => {
      const titleIsNull = item.title === "";
      const target = item.targetBlank === true ? "_blank" : "_self";
      const showIcon = !isNullOrWhiteSpace(item.image?.src);
      const icon =
        showIcon && typeof item.image?.src === "string"
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
            <a
              href={url}
              target={target}
              className={"sgart-spfx-cv-button" + inEvidence}
            >
              {showIcon && (
                <DocumentCardImage
                  iconProps={icon}
                  className="sgart-spfx-cv-icon-container"
                />
              )}
              <span className="sgart-spfx-cv-text-container">{item.title}</span>
            </a>
          )}
        </div>
      );
    });

    let modelClassName = "";
    switch (viewModel) {
      case ViewModel.ButtonMini:
        modelClassName = styles.viewModelButtonMini;
        break;
    }

    return (
      <div
        className={
          styles.grid + " " + styles.viewModelBase + " " + modelClassName
        }
        dir="ltr"
      >
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }
}
