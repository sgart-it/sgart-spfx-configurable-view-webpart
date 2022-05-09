import * as React from "react";
import { IItemImage } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { DocumentCardImage } from "office-ui-fabric-react";

export interface IImageOrIconProps {
  image: IItemImage;
}

export default class ImageOrIcon extends React.Component<
  IImageOrIconProps,
  {}
> {
  public render(): React.ReactElement<IImageOrIconProps> {
    const { image } = this.props;

    if (isNullOrWhiteSpace(image?.src) ) return null;

    if (image.isIcon) {
      return (
        <DocumentCardImage
          iconProps={{ iconName: image.src }}
          className="sgart-spfx-cv-icon-container"
        />
      );
    }

    return (
      <div className="sgart-spfx-cv-icon-container">
        <img src={image.src} />
      </div>
    );
  }
}
