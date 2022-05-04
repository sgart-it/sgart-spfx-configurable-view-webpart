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
  DocumentCardTitle,
  IDocumentCardActivityPerson,
  IDocumentCardStyles,
  IIconProps,
  ImageFit,
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
      titleIsNull === false && isNullOrWhiteSpace(item.image) === false;
    const description = titleIsNull ? null : item.description;
    const url = titleIsNull ? null : item.url;
    const target = titleIsNull ? null : item.targetBlank ? "_blank" : "_self";
    const showUser = !isNullOrWhiteSpace(item.user);
    const showActivity =
      titleIsNull === false && (showUser || !isNullOrWhiteSpace(item.date));

    const cardStyles: IDocumentCardStyles = {
      root: {
        display: "inline-block",
        marginRight: 20,
        marginBottom: 20,
      },
    };

    /*const iconProps1: IIconProps = {
      iconName: item.image,
      styles: { root: { fontSize: "100px", width: "100px", height: "100px" } },
    };*/

    const fontIcon = fonts.xxLarge;

    const iconProps: IIconProps = {
      iconName: item.image,
      styles: {
        root: {
          width: '100%',
          height: '100%',
          lineHeight: 120,
          textAlign: 'center',
          verticalAlign: 'middle',
          fontSize: fontIcon.fontSize,
          fontWeight: fontIcon.fontWeight,
          color: item.inEvidence ? palette.themeLight : semanticColors.bodyText,
          backgroundColor: item.inEvidence
            ? palette.accent
            : null,
        },
      },
    };

    const people: IDocumentCardActivityPerson[] = [
      { name: showUser ? item.user : null, profileImageSrc: null },
    ];

    return (
      <DocumentCard
        aria-label={item.title}
        onClickHref={url}
        onClickTarget={target}
        styles={cardStyles}
      >
        <DocumentCardImage height={120} iconProps={iconProps} />
        <DocumentCardDetails>
          <DocumentCardTitle title={item.title} />
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
