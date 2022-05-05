import * as React from "react";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { IViewProps } from "./IViewProps";
import styles from "../ConfigurableView.module.scss";
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardImage,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardActivityPerson,
  IDocumentCardPreviewImage,
  IDocumentCardStyles,
  IIconProps,
} from "office-ui-fabric-react";
import { getTheme } from "office-ui-fabric-react/lib/Styling";

const theme = getTheme();
const { palette, fonts, semanticColors } = theme;

export default class CardColumnView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, columns } = this.props;

    const controls = items.map((item: IItem, index: number) => {
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

      return <div className={classNameCol}>{this.getCard(item)}</div>;
    });

    return (
      <div className={styles.grid} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }

  private getCard(item: IItem) {
    const titleIsNull = item.title === "";
    const showImage =
      titleIsNull === false && isNullOrWhiteSpace(item.image?.src) === false;
    const description = titleIsNull ? null : item.description;
    const url = titleIsNull ? null : item.url;
    const target = titleIsNull ? null : item.targetBlank ? "_blank" : "_self";
    const showUser = !isNullOrWhiteSpace(item.user);
    const showActivity =
      titleIsNull === false && (showUser || !isNullOrWhiteSpace(item.date));

    // style
    const fontIcon = fonts.xxLarge;
    const imageHeight = 120;

     const cardStyles: IDocumentCardStyles = {
      root: {
        display: "block",
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 20,
        minWidth: "100px",
        maxWidth: "auto",
      },
    };
    const cardClassName = item.inEvidence === true ? styles.borderColorPrimary : null;

    const previewImage : IDocumentCardPreviewImage = {
      previewImageSrc: item.image.src,
      height: imageHeight
    };

    const iconProps: IIconProps = {
      iconName: item.image.src,
      styles: {
        root: {
          width: "100%",
          height: "100%",
          lineHeight: imageHeight,
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: fontIcon.fontSize,
          fontWeight: fontIcon.fontWeight,
          //color: item.inEvidence ? palette.themeLight : semanticColors.bodyText,
          backgroundColor: item.inEvidence ? palette.accent : null,
        },
      },
    };

    const titleClassName = item.inEvidence === true ? styles.colorPrimary : null;
    const titleStyles: IDocumentCardStyles = {
      root: {
        color: item.inEvidence === true ? palette.themePrimary : semanticColors.bodyText,
      },
    };

    const previewStyles: IDocumentCardStyles = {
      root: {
        display: "flex",
        justifyContent: "center"
      },
    };

    const imageControl = item.image.isIcon === true
      ? <DocumentCardImage height={imageHeight} iconProps={iconProps} />
      : <DocumentCardPreview previewImages={[previewImage]} styles={previewStyles} />
      ;

    const people: IDocumentCardActivityPerson[] = [
      { name: showUser ? item.user : null, profileImageSrc: null },
    ];

    return (
      <DocumentCard
        aria-label={item.title}
        onClickHref={url}
        onClickTarget={target}
        styles={cardStyles}
        className={cardClassName}
      >
        {imageControl}
        <DocumentCardDetails>
          <DocumentCardTitle title={item.title} className={titleClassName} />
          <DocumentCardTitle showAsSecondaryTitle title={description} />
        </DocumentCardDetails>
        {showActivity && (
          <DocumentCardActivity
            activity={item.date}
            people={people}
            className={showUser ? null : styles.cardDateOnly}
          />
        )}
      </DocumentCard>
    );
  }
}
