import { getCachedGlobal } from '@/utilities/getGlobals'
import { FestivalTopBlockClient } from './Component.client'
import type { FestivalTopBlock as FestivalTopBlockProps } from '@/payload-types'
import type { Festival as FestivalGlobal } from '@/payload-types'

type Props = FestivalTopBlockProps & {
  id?: string
}

export const FestivalTopBlock: React.FC<Props> = async ({
  badgeText = '',
  showCountdown = false,
  showSlogan = false,
  showSchedule = false,
  showLocation = false,
  announcementText = '',
  slogan = '',
  noticeText = '',
  dateFormat,
}) => {
  const festivalData = await getCachedGlobal('festival', 1)() as FestivalGlobal

  return (
    <FestivalTopBlockClient
      festivalData={festivalData}
      badgeText={badgeText}
      showCountdown={showCountdown}
      showSlogan={showSlogan}
      showSchedule={showSchedule}
      showLocation={showLocation}
      announcementText={announcementText}
      slogan={slogan}
      noticeText={noticeText}
      dateFormat={dateFormat}
    />
  )
} 