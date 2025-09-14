import React, { Fragment } from "react";

import type { Page } from "@/payload-types";

import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { ContentBlock } from "@/blocks/Content/Component";

import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { FestivalInfoBlock } from "@/blocks/FestivalInfo/Component";
import { CountdownBlock } from "@/blocks/Countdown/Component";
import { SloganBlock } from "@/blocks/Slogan/Component";
import { CollectionGrid } from "@/blocks/CollectionGrid/Component";
import { CollectionList } from "@/blocks/CollectionList/Component";
import { SponsorBlock } from "@/blocks/SponsorBlock/Component";

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,

  mediaBlock: MediaBlock,
  festivalInfo: FestivalInfoBlock,
  countdown: CountdownBlock,
  slogan: SloganBlock,
  collectionGrid: CollectionGrid,
  collectionList: CollectionList,
  sponsorBlock: SponsorBlock,
};

export const RenderBlocks: React.FC<{
  blocks: Page["layout"][0][];
}> = (props) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
