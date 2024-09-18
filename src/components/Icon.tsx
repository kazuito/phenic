import { cloneElement } from "react";

export type IconProps = {
  size?: number | string;
} & React.SVGProps<SVGSVGElement>;

const icon = (svg: React.ReactElement) => {
  const IconComponent = (props: IconProps) => {
    const { size = 24, ...p } = props;
    return cloneElement(svg, {
      width: size,
      height: size,
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...p,
    });
  };
  return IconComponent;
};

export const IconBarbell = icon(
  <svg viewBox="0 0 124 124">
    <path d="M3 62.022C3 59.1392 5.31712 56.8022 8.17544 56.8022H24.9195C26.5336 56.8022 27.8421 58.1219 27.8421 59.7498V64.2941C27.8421 65.9221 26.5336 67.2418 24.9195 67.2418H8.17544C5.31712 67.2418 3 64.9048 3 62.022Z" />
    <path d="M30.9474 50.5385C30.9474 48.2322 32.8011 46.3626 35.0877 46.3626C37.3744 46.3626 39.2281 48.2322 39.2281 50.5385V73.5055C39.2281 75.8117 37.3744 77.6813 35.0877 77.6813C32.8011 77.6813 30.9474 75.8117 30.9474 73.5055V50.5385Z" />
    <path d="M89.9474 54.7143C89.9474 52.408 91.8011 50.5385 94.0877 50.5385H116.86C119.146 50.5385 121 52.408 121 54.7143V69.3297C121 71.6359 119.146 73.5055 116.86 73.5055H94.0877C91.8011 73.5055 89.9474 71.6359 89.9474 69.3297V54.7143Z" />
    <path d="M58.8947 14C61.1814 14 63.0351 15.8696 63.0351 18.1758L63.0351 104.824C63.0351 107.13 61.1814 109 58.8947 109H46.4737C44.187 109 42.3333 107.13 42.3333 104.824L42.3333 18.1758C42.3333 15.8696 44.187 14 46.4737 14L58.8947 14Z" />
    <path d="M82.7018 14C84.9884 14 86.8421 15.8696 86.8421 18.1758V104.824C86.8421 107.13 84.9884 109 82.7018 109H70.2807C67.994 109 66.1403 107.13 66.1403 104.824L66.1404 18.1758C66.1404 15.8696 67.994 14 70.2807 14L82.7018 14Z" />
  </svg>,
);

export const IconDumbbell = icon(
  <svg viewBox="0 0 124 124">
    <path d="M15.2558 106.541C13.5307 104.799 13.5307 101.976 15.2558 100.234L16.0367 99.4459C17.3305 98.1397 19.4282 98.1397 20.7221 99.4459L25.4074 104.176C26.7013 105.482 26.7013 107.6 25.4074 108.906L24.6265 109.694C22.9014 111.436 20.1045 111.436 18.3794 109.694L15.2558 106.541Z" />
    <path d="M99.5926 19.8242C98.2988 18.518 98.2988 16.4003 99.5926 15.0942L100.373 14.3058C102.099 12.5643 104.896 12.5643 106.621 14.3058L109.744 17.4592C111.469 19.2007 111.469 22.0243 109.744 23.7658L108.963 24.5542C107.67 25.8603 105.572 25.8603 104.278 24.5542L99.5926 19.8242Z" />
    <path d="M51.9579 67.9125C50.6641 66.6064 50.6641 64.4887 51.9579 63.1825L63.6713 51.3575C64.9652 50.0514 67.0629 50.0514 68.3567 51.3575L73.0421 56.0875C74.3359 57.3937 74.3359 59.5114 73.0421 60.8175L61.3287 72.6425C60.0348 73.9487 57.9371 73.9487 56.6433 72.6425L51.9579 67.9125Z" />
    <path d="M72.2546 9.59682L82.0939 9.00783C83.3542 8.93239 84.5863 9.40493 85.479 10.3062L113.706 38.8022C113.706 38.8022 115.067 40.9472 114.992 42.2195L114.409 52.1525C114.345 53.242 113.887 54.2701 113.123 55.0418L103.242 65.0165C102.478 65.7883 101.459 66.2502 100.38 66.3148L90.5408 66.9038C89.2805 66.9793 88.0484 66.5067 87.1557 65.6055L58.9285 37.1095C58.0358 36.2083 57.5677 34.9645 57.6424 33.6922L58.2259 23.7592C58.2899 22.6696 58.7475 21.6416 59.512 20.8698L69.3925 10.8952C70.157 10.1234 71.1754 9.66143 72.2546 9.59682Z" />
    <path d="M24.62 57.6852L34.4592 57.0962C35.7195 57.0207 36.9577 57.4956 37.8443 58.3945L66.0715 86.8905C66.9665 87.7979 67.4323 89.0355 67.3576 90.3078L66.7741 100.241C66.7101 101.33 66.2525 102.358 65.488 103.13L55.6075 113.105C54.843 113.877 53.8246 114.339 52.7454 114.403L42.9061 114.992C41.6458 115.068 40.4137 114.595 39.521 113.694L11.2938 85.1978C10.4011 84.2966 9.93302 83.0528 10.0078 81.7805L10.5912 71.8475C10.6552 70.758 11.1128 69.73 11.8773 68.9582L21.7578 58.9835C22.5224 58.2117 23.5407 57.7498 24.62 57.6852Z" />
  </svg>,
);

export const IconRun = icon(
  <svg viewBox="0 0 24 24">
    <path d="M17.0392 7.30375C16.6929 9.30415 14.7904 10.645 12.79 10.2986C10.7896 9.95219 9.44877 8.04974 9.79517 6.04934C10.1416 4.04894 12.044 2.70811 14.0444 3.05451C16.0448 3.4009 17.3856 5.30336 17.0392 7.30375Z" />
    <path d="M13.3356 14.0877C12.9674 10.9712 8.38619 9.34909 8.38619 9.34909L5.48383 21.4305C5.48383 21.4305 13.8544 18.4801 13.3356 14.0877Z" />
    <path d="M16.7142 14.087L11.1645 12.5042L17.0088 19.1122L22.9529 8.32779L16.7142 14.087Z" />
    <path d="M5.50676 12.0707L10.8665 12.3594L4.227 7.73842L1 18.3322L5.50676 12.0707Z" />
  </svg>,
);

export const IconMachinePlates = icon(
  <svg viewBox="0 0 24 24">
    <path d="M11 2C11 1.44772 11.4477 1 12 1V1C12.5523 1 13 1.44772 13 2V6.72727C13 6.8779 12.8779 7 12.7273 7H11.2727C11.1221 7 11 6.8779 11 6.72727V2Z" />
    <rect x="4" y="8" width="16" height="3" rx="1" />
    <rect x="11" y="12" width="2" height="2" rx="0.5" />
    <rect x="4" y="15" width="16" height="3" rx="1" />
    <rect x="4" y="19" width="16" height="3" rx="1" />
  </svg>,
);
