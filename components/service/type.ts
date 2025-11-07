
export interface Package {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

export interface PackageMap {
  silver?: Package;
  golden?: Package;
  diamond?: Package;
}
