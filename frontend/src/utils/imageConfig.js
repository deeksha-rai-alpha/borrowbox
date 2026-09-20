// ==========================================================================
// Default placeholder images shown for a category when an item has no
// uploaded photos yet. Swap any URL below to change the look — nothing
// else in the app needs to change.
//
// Currently pointing to royalty-free Unsplash source images. Replace with
// your own Cloudinary/CDN URLs any time.
// ==========================================================================

export const CATEGORY_IMAGES = {
  Books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  "Cameras & Electronics": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  Tools: "https://images.unsplash.com/photo-1581147036324-c1c89c2c8f5d?w=800&q=80",
  "Camping & Outdoor": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
  "Sports Equipment": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  "Party & Decorations": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  "Agricultural Tools": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80",
  "Study Materials": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  Other: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
};

export const FALLBACK_IMAGE = CATEGORY_IMAGES.Other;

// Returns the first uploaded image for an item, or a sensible category placeholder
export const getItemImage = (item) => {
  if (item?.images?.length > 0) return item.images[0].url;
  return CATEGORY_IMAGES[item?.category] || FALLBACK_IMAGE;
};

// Hero / marketing images used on the landing page - also easy to swap
export const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  camera: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80",
  books: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80",
  tools: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=500&q=80",
};
