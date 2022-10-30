import * as React from "react";
import { IViewProps } from "./IViewProps";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace, getClassNameCol } from "../../Helper";
import styles from "../ConfigurableView.module.scss";
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardType,
  IDocumentCardActivityPerson,
  IDocumentCardPreviewImage,
  IDocumentCardPreviewProps,
  IDocumentCardStyles,
  //IIconProps,
} from "office-ui-fabric-react";

const theme = getTheme();
const { fonts } = theme;

export default class BaseView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items, columns } = this.props;

    const controls = items.map((item: IItem) => {
      const classNameCol = columns > 0 && columns < 6
        ? getClassNameCol(columns)
        : styles.gridCol6;

      return <div className={classNameCol} key={item.id}>{this.getItem(item)}</div>;
    });

    return (
      <div className={styles.grid} dir="ltr">
        <div className={styles.gridRow}>{controls}</div>
      </div>
    );
  }

  private getItem(item: IItem): JSX.Element {
    const titleIsNull = item.title === "";
    //const showImage = titleIsNull === false && isNullOrWhiteSpace(item.image?.src) === false;
    //const description = titleIsNull ? null : item.description;
    const url = titleIsNull ? undefined : item.url;
    const target = titleIsNull ? undefined : item.targetBlank ? "_blank" : "_self";
    const showUser = !isNullOrWhiteSpace(item.user);
    const showActivity = titleIsNull === false && (showUser || !isNullOrWhiteSpace(item.date));

    // style
    //const fontIcon = fonts.xxLarge;
    const imageHeight = 120;

    const previewPropsUsingIcon: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewIconProps: {
            iconName: item.image.src,
            styles: {
              root: {
                fontSize: fonts.superLarge.fontSize,
              },
            },
          },
          width: 144,
        },
      ],
    };

    const cardClassName = item.inEvidence === true ? styles.borderColorPrimary : undefined;

    const previewImage: IDocumentCardPreviewImage = {
      previewImageSrc: item.image.src,
      height: imageHeight,
    };

    /*const iconProps: IIconProps = {
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
    };*/

    const titleClassName =
      item.inEvidence === true ? styles.colorPrimary : undefined;

    const previewStyles: IDocumentCardStyles = {
      root: {
        display: "flex",
        justifyContent: "center",
      },
    };

    const imageControl =
      item.image.isIcon === true ? (
        <DocumentCardPreview {...previewPropsUsingIcon} />
      ) : (
        <DocumentCardPreview
          previewImages={[previewImage]}
          styles={previewStyles}
        />
      );

    const people: IDocumentCardActivityPerson[] = [
      { name: showUser ? item.user : undefined, profileImageSrc: undefined },
    ];

    return (
      <DocumentCard
        aria-label={item.title}
        onClickHref={url}
        onClickTarget={target}
        className={cardClassName}
        type={DocumentCardType.compact}
      >
        {imageControl}
        <DocumentCardDetails>
          <DocumentCardTitle title={item.title} className={titleClassName} />
          {showActivity && (
            <DocumentCardActivity
              activity={item.date}
              people={people}
              className={showUser ? undefined : styles.cardDateOnly}
            />
          )}
        </DocumentCardDetails>
      </DocumentCard>
    );
  }
}
