// Generated transparent illustrations, shared by the 3D cards and category picker.
export const CATEGORY_ART={"food": "assets/categories/food.png", "everyday": "assets/categories/everyday.png", "entertainment": "assets/categories/entertainment.png", "out": "assets/categories/out.png", "travel": "assets/categories/travel.png", "habits": "assets/categories/habits.png"};
export function categoryArt(id){return CATEGORY_ART[id]||null;}
export function categoryArtMarkup(id){const src=categoryArt(id);return src?`<img class="category-art" src="${src}" alt="" width="64" height="64">`:'';}
