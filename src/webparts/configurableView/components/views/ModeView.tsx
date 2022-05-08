import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";
import { ViewModel } from "../ViewModelEnum";
import ImageOrIcon, { IImageOrIconProps } from "../others/ImageOrIcon";

export default class ModeView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, viewModel, columns } = this.props;

    const controls = this.getControls(items, viewModel, columns);

    const modelClassName = styles[`viewModel${ViewModel[viewModel]}`] ?? '';

    const rootClassName = `${styles.grid} ${styles.viewModelBase} ${modelClassName}`;

    return (
      <div className={rootClassName} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }

  private getControls(items: IItem[], viewModel: ViewModel, columns: number) {
    return items.map((item: IItem) => {
      const titleIsNull = item.title === "";
      const target = item.targetBlank === true ? "_blank" : "_self";
      const url = isNullOrWhiteSpace(item.url) ? null : item.url;
      const inEvidenceClassName =
        item.inEvidence === true ? " sgart-spfx-cv-evidence" : "";
      const showDescription = viewModel === ViewModel.ButtonMax;

      // icon or image
      const noIconOrImageClassName = isNullOrWhiteSpace(item.image?.src)
        ? " sgart-spfx-cv-no-icon"
        : "";
      const imageClassName =
        item.image?.isIcon === false ? " sgart-spfx-cv-image" : "";
      const imgProps: IImageOrIconProps = {
        image: {
          src: item.image?.src,
          isIcon: item.image?.isIcon,
        },
        viewModel: viewModel,
      };

      // responsive
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
              className={
                "sgart-spfx-cv-button" +
                inEvidenceClassName +
                noIconOrImageClassName +
                imageClassName
              }
            >
              <ImageOrIcon {...imgProps} />
              <span className="sgart-spfx-cv-text-container">
                <span className="sgart-spfx-cv-text">{item.title}</span>
                {showDescription && (
                  <span className="sgart-spfx-cv-description">
                    {item.description}
                  </span>
                )}
              </span>
            </a>
          )}
        </div>
      );
    });
  }
}
