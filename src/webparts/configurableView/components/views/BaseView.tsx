import * as React from "react";
import { IViewProps } from "./IViewProps";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { IItem } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import styles from "../ConfigurableView.module.scss";
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardType,
  IDocumentCardActivityPerson,
  IDocumentCardPreviewProps,
} from "office-ui-fabric-react";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";

const theme = getTheme();
const { palette, fonts } = theme;

const stackTokens: IStackTokens = { childrenGap: 20 };

export default class BaseView extends React.Component<IViewProps, {}> {
  public render(): React.ReactElement<IViewProps> {
    const { items } = this.props;

    return (
      <Stack
        wrap={false}
        horizontalAlign={"space-between"}
        verticalAlign={"space-between"}
        tokens={stackTokens}
      >
        {this.getItems(items)}
      </Stack>
    );
  }

  private getItems(items: IItem[]) {
    const controls = items.map((item) => {
      const titleIsNull = item.title === "";
      const showImage =
        titleIsNull === false && isNullOrWhiteSpace(item.image) === false;

      const previewPropsUsingIcon: IDocumentCardPreviewProps = {
        previewImages: [
          {
            previewIconProps: {
              iconName: item.image,
              styles: {
                root: {
                  fontSize: fonts.superLarge.fontSize,
                  color: palette.white,
                },
              },
            },
            width: 144,
          },
        ],
        styles: {
          previewIcon: {
            backgroundColor: item.inEvidence
              ? palette.neutralPrimaryAlt
              : palette.themePrimary,
          },
        },
      };

      const showUser = !isNullOrWhiteSpace(item.user);
      const showActivity =
        titleIsNull === false && (showUser || !isNullOrWhiteSpace(item.date));

      const people: IDocumentCardActivityPerson[] = [
        { name: showUser ? item.user : null, profileImageSrc: null },
      ];

      const description = titleIsNull ? null : item.description;
      const url = titleIsNull ? null : item.url;
      const target = titleIsNull ? null : item.targetBlank ? "_blank" : "_self";

      return (
        <DocumentCard
          aria-label={item.title}
          type={DocumentCardType.compact}
          onClickHref={url}
          onClickTarget={target}
        >
          {showImage && <DocumentCardPreview {...previewPropsUsingIcon} />}
          <DocumentCardDetails>
            <DocumentCardTitle title={item.title} />
            <DocumentCardTitle showAsSecondaryTitle title={description} />
            {showActivity && (
              <DocumentCardActivity
                activity={item.date}
                people={people}
                className={showUser ? null : styles.cardDateOnly}
              />
            )}
          </DocumentCardDetails>
        </DocumentCard>
      );
    });

    return controls;
  }
}
