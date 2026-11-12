/** Vimeo player URL. `background`: muted, looped autoplay without player UI (for pieces). */
export const vimeoSrc = (id: string, background: boolean) =>
  `https://player.vimeo.com/video/${id}?${
    background
      ? "autoplay=1&muted=1&loop=1&autopause=0&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1"
      : "title=0&byline=0&portrait=0&dnt=1"
  }`;
