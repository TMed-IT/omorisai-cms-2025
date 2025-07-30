import React from "react";

import type { Props } from "./types";

import { ImageMedia } from "./ImageMedia";
import { VideoMedia } from "./VideoMedia";

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = "div", resource } = props;

  const isVideo = typeof resource === "object" &&
    resource?.mimeType?.includes("video");

  if (htmlElement === null) {
    return isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />;
  }

  const content = isVideo
    ? <VideoMedia {...props} />
    : <ImageMedia {...props} />;

  if (htmlElement === "div") {
    return (
      <div className={className}>
        {content}
      </div>
    );
  }

  if (htmlElement === "span") {
    return (
      <span className={className}>
        {content}
      </span>
    );
  }

  // その他の要素の場合はcreateElementを使用
  return React.createElement(htmlElement, { className }, content);
};
