export interface Restaurant {
  title: string;
  data: Category[];
  photo: string;
  etaRange: string;
  location: string;
  fareBadge: string;
}

export interface Category {
  itemUuids: string[];
  title: string;
  uuid: string;
  displayType: string | null;
  recipes: Recipe[];
}

export interface Recipe {
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  uuid: string;
  nutritionalInfo: NutritionalInfo;
  suspendUntil: number;
  classifications: string[];
  hasCustomizations: boolean;
  itemAttributeInfo: ItemAttributeInfo;
  tagSection: TagSection | null;
}

export type SimplifiedRecipe = Pick<Recipe, 'uuid' | 'title' | 'description' | 'price'>;

export interface NutritionalInfo {
  allergens: string;
  displayString: string;
}

export interface ItemAttributeInfo {
  dietaryLabels: string[] | null;
}

export interface TagSection {
  tags: Tag[];
  type: string;
}

export interface Tag {
  actionUuid: string;
  leadingIcon: string;
  text: string;
  bottomSheet: BottomSheet;
}

export interface BottomSheet {
  title: { text: string };
  body: { text: string };
  buttonText: string;
  heroImgUrl: string;
  paragraphs: string[] | null;
}
