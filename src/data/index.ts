import raw from './catalog.json';
import type { Product, Menu } from './types';
export const products = raw.products as Product[];
export const menus = raw.menus as Menu[];
export const subcategories = raw.subcategories as Record<string, string[]>;
export const img = (p: Product) => `/images/${p.image}`;
export const money = (n: number) => n.toLocaleString('ko-KR') + '원';

