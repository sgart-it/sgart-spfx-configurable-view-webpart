import * as React from "react";
import { IItemImage } from "../../data/IItem";
import { isNullOrWhiteSpace } from "../../Helper";
import { DocumentCardImage } from "office-ui-fabric-react";
import { ViewModel } from "../ViewModelEnum";

export interface IImageOrIconProps {
  image: IItemImage;
  viewModel: ViewModel;
}

export default class ImageOrIcon extends React.Component<
  IImageOrIconProps,
  {}
> {
  public render(): React.ReactElement<IImageOrIconProps> {
    const { image, viewModel } = this.props;

    const showIconOrImage =
      !isNullOrWhiteSpace(image?.src) &&
      (viewModel === ViewModel.Button ||
        viewModel === ViewModel.ButtonIcon ||
        viewModel === ViewModel.ButtonMax ||
        viewModel === ViewModel.ButtonImageFull ||
        viewModel === ViewModel.Card);

    if (showIconOrImage === false) return null;

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
