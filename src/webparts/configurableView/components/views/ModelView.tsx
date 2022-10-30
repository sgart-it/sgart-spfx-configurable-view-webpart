import * as React from "react";
import { IItem } from "../../data/IItem";
import { getClassNameCol, getClassViewModel, isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";
import { ViewModel } from "../ViewModelEnum";
import ImageOrIcon, { IImageOrIconProps } from "../others/ImageOrIcon";

export default class ModelView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, viewModel, columns } = this.props;

    const showImage =
      viewModel === ViewModel.Button ||
      viewModel === ViewModel.ButtonIcon ||
      viewModel === ViewModel.ButtonMax ||
      viewModel === ViewModel.ButtonImageFull ||
      viewModel === ViewModel.Card ||
      viewModel === ViewModel.ListAlternate ||
      viewModel === ViewModel.UserMini;

    const showDescription =
      viewModel === ViewModel.ButtonMax ||
      viewModel === ViewModel.Card ||
      viewModel === ViewModel.UserMini;

    const controls = this.getControls(
      items,
      columns,
      showImage,
      showDescription
    );

    const modelClassName = getClassViewModel(viewModel);
      //styles[`viewModel${ViewModel[viewModel]}`] ?? `__?${viewModel}?__`;

    const rootClassName = `${styles.grid} ${styles.viewModelBase} ${modelClassName}`;

    return (
      <div className={rootClassName} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }

  private getControls(
    items: IItem[],
    columns: number,
    showImage: boolean,
    showDescription: boolean
  ) {
    return items.map((item: IItem) => {
      const titleIsNull = item.title === "";
      const target = item.targetBlank === true ? "_blank" : "_self";
      const url = isNullOrWhiteSpace(item.url) ? null : item.url;
      const inEvidenceClassName =
        item.inEvidence === true ? " sgart-spfx-cv-evidence" : "";

      const showButtonText = !isNullOrWhiteSpace(item.buttonText);

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
      };

      // responsive
      const classNameCol = getClassNameCol(columns);

      return (
        <div className={classNameCol}>
          {titleIsNull ? (
            <div className="sgart-spfx-cv-button sgart-spfx-cv-disabled"></div>
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
              {showImage && <ImageOrIcon {...imgProps} />}
              <span className="sgart-spfx-cv-text-container">
                <span className="sgart-spfx-cv-text">{item.title}</span>
                {showDescription && (
                  <span className="sgart-spfx-cv-description">
                    {item.description}
                  </span>
                )}
                {showButtonText && (
                  <a
                    className="sgart-spfx-cv-button-text"
                    href={url}
                    target={target}
                  >
                    {item.buttonText}
                  </a>
                )}
              </span>
              <span className="sgart-spfx-cv-evidence-flag"></span>
            </a>
          )}
        </div>
      );
    });
  }
}
