export enum RewardType {
  HAT = 'hat',
  COAT = 'coat',
  PANTS = 'pants',
  SHOES = 'shoes',
  ACCESSORY = 'accessory'
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  image: string;
  type: RewardType;
}

export const REWARDS: Reward[] = [
  {
    id: 'cap',
    title: 'Cap',
    description: 'A stylish cap to protect you from the sun.',
    image: 'cap.png',
    type: RewardType.HAT
  },
  {
    id: 'high_hat',
    title: 'High Hat',
    description: 'A tall hat that makes you look important.',
    image: 'high_hat.png',
    type: RewardType.HAT
  },
  {
    id: 'bucket_hat',
    title: 'Bucket Hat',
    description: 'A casual bucket hat for a relaxed look.',
    image: 'bucket_hat.png',
    type: RewardType.HAT
  },
  {
    id: 'cowboy_hat',
    title: 'Cowboy Hat',
    description: 'A classic cowboy hat for the adventurous spirit.',
    image: 'cowboy_hat.png',
    type: RewardType.HAT
  },
  {
    id: 'beanie',
    title: 'Beanie',
    description: 'A warm beanie for cold weather.',
    image: 'beanie.png',
    type: RewardType.HAT
  },
  {
    id: 'detective_hat',
    title: 'Detective Hat',
    description: 'A detective hat for solving mysteries.',
    image: 'detective_hat.png',
    type: RewardType.HAT
  },

  {
    id: 'trench_coat',
    title: 'Trench Coat',
    description: 'A classic trench coat for a sophisticated look.',
    image: 'trench_coat.png',
    type: RewardType.COAT
  },
  {
    id: 'leather_jacket',
    title: 'Leather Jacket',
    description: 'A stylish leather jacket for a rugged look.',
    image: 'leather_jacket.png',
    type: RewardType.COAT
  },
  {
    id: 'raincoat',
    title: 'Raincoat',
    description: 'A waterproof raincoat for wet weather.',
    image: 'raincoat.png',
    type: RewardType.COAT
  },

  {
    id: 'jeans',
    title: 'Jeans',
    description: 'A pair of classic jeans for everyday wear.',
    image: 'jeans.png',
    type: RewardType.PANTS
  },
  {
    id: 'shorts',
    title: 'Shorts',
    description: 'A pair of comfortable shorts for warm weather.',
    image: 'shorts.png',
    type: RewardType.PANTS
  },
  {
    id: 'briefs',
    title: 'Briefs',
    description: 'A pair of comfortable briefs for everyday use.',
    image: 'briefs.png',
    type: RewardType.PANTS
  },

  {
    id: 'sneakers',
    title: 'Sneakers',
    description: 'A pair of stylish sneakers for casual outings.',
    image: 'sneakers.png',
    type: RewardType.SHOES
  },
  {
    id: 'boots',
    title: 'Boots',
    description: 'A pair of sturdy boots for outdoor adventures.',
    image: 'boots.png',
    type: RewardType.SHOES
  },
  {
    id: 'sandal',
    title: 'Sandal',
    description: 'A pair of comfortable sandals for warm weather.',
    image: 'sandal.png',
    type: RewardType.SHOES
  },

  {
    id: 'watch',
    title: 'Watch',
    description: 'A stylish watch to keep track of time.',
    image: 'watch.png',
    type: RewardType.ACCESSORY
  },
  {
    id: 'handbag',
    title: 'Handbag',
    description: 'A fashionable handbag for carrying your essentials.',
    image: 'handbag.png',
    type: RewardType.ACCESSORY
  },
  {
    id: 'notebook',
    title: 'Notebook',
    description: 'A notebook for jotting down your thoughts and ideas.',
    image: 'notebook.png',
    type: RewardType.ACCESSORY
  },
  {
    id: 'gloves',
    title: 'Gloves',
    description: 'A pair of warm gloves for cold weather.',
    image: 'gloves.png',
    type: RewardType.ACCESSORY
  }
];
