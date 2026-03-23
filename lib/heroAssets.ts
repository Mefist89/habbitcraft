const DEFAULT_HERO_ID = "puf";

const heroImageMap: Record<string, string> = {
  puf: "/assets/characters/puf1.png",
  bruno: "/assets/characters/bruno1.png",
  felix: "/assets/characters/felix1.png",
  leo: "/assets/characters/leo1.png",
  luna: "/assets/characters/luna1.png",
  melisa: "/assets/characters/melisa1.png",
};

export function getHeroImageSrc(heroId?: string | null) {
  return heroImageMap[heroId ?? ""] ?? heroImageMap[DEFAULT_HERO_ID];
}

export function getHeroAvatarSrc(heroId?: string | null) {
  return heroId
    ? `/assets/circle-characters/${heroId}-c.png`
    : `/assets/circle-characters/${DEFAULT_HERO_ID}-c.png`;
}
