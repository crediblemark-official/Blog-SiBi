export const CATEGORY_MAP_ID_TO_EN: Record<string, string> = {
  'strategi-bisnis': 'business-strategy',
  'monetisasi': 'monetization',
  'funnel-penjualan': 'sales-funnel',
  'audience-growth': 'audience-growth',
  'email-marketing': 'email-marketing',
};

export const CATEGORY_MAP_EN_TO_ID: Record<string, string> = {
  'business-strategy': 'strategi-bisnis',
  'monetization': 'monetisasi',
  'sales-funnel': 'funnel-penjualan',
  'sales-funnels': 'funnel-penjualan',
  'audience-growth': 'audience-growth',
  'email-marketing': 'email-marketing',
};

export const CATEGORY_NAMES_ID: Record<string, string> = {
  'strategi-bisnis': 'Strategi Bisnis',
  'monetisasi': 'Monetisasi',
  'funnel-penjualan': 'Funnel Penjualan',
  'audience-growth': 'Audience Growth',
  'email-marketing': 'Email Marketing',
};

export const CATEGORY_NAMES_EN: Record<string, string> = {
  'business-strategy': 'Business Strategy',
  'monetization': 'Monetization',
  'sales-funnel': 'Sales Funnels',
  'sales-funnels': 'Sales Funnels',
  'audience-growth': 'Audience Growth',
  'email-marketing': 'Email Marketing',
};

/**
 * Returns alternate language URLs for category pages
 */
export function getAlternateCategoryUrl(pathname: string): { idUrl?: string; enUrl?: string } {
  const clean = pathname.replace(/\/$/, '') || '/';

  // 1. Indonesian Category Index: /kategori
  if (clean === '/kategori') {
    return {
      idUrl: '/kategori/',
      enUrl: '/en/kategori/',
    };
  }

  // 2. English Category Index: /en/kategori or /en/categories
  if (clean === '/en/kategori' || clean === '/en/categories') {
    return {
      idUrl: '/kategori/',
      enUrl: '/en/kategori/',
    };
  }

  // 3. Indonesian Category Page: /kategori/:slug
  const idMatch = clean.match(/^\/kategori\/([^/]+)$/);
  if (idMatch) {
    const idSlug = idMatch[1];
    const enSlug = CATEGORY_MAP_ID_TO_EN[idSlug] || idSlug;
    return {
      idUrl: `/kategori/${idSlug}/`,
      enUrl: `/en/kategori/${enSlug}/`,
    };
  }

  // 4. English Category Page: /en/kategori/:slug or /en/categories/:slug
  const enMatch = clean.match(/^\/en\/(?:kategori|categories)\/([^/]+)$/);
  if (enMatch) {
    const enSlug = enMatch[1];
    const idSlug = CATEGORY_MAP_EN_TO_ID[enSlug] || enSlug;
    return {
      idUrl: `/kategori/${idSlug}/`,
      enUrl: `/en/kategori/${enSlug}/`,
    };
  }

  return {};
}
