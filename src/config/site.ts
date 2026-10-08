export interface SiteConfig {
  name: string
  tagline: string
  slogan: string
  description: string
  website: string
  mainSite: string
  repository: string | null
  links: {
    githubPersonal: string | null
    facebook: string | null
    youtube: string | null
    tiktok: null | string
  }
}

/**
 * Cấu hình chung của website.
 * Để `null` khi chưa có URL chính thức — link sẽ tự động bị ẩn,
 * không hiển thị URL đoán hoặc URL chết.
 */
export const site: SiteConfig = {
  name: 'XÓM CODING',
  tagline: 'Dev Tools',
  slogan: 'Code local, Connect global.',
  description:
    'Khám phá những công cụ hữu ích cho lập trình viên. Miễn phí, mã nguồn mở và được cộng đồng Xóm Coding cùng nhau đóng góp.',
  website: 'https://tools.xomcoding.me',
  mainSite: 'https://xomcoding.me',
  // URL repository GitHub — đổi nếu đổi tên repo
  repository: 'https://github.com/dungnh999/xomcoding-tools',
  links: {
    githubPersonal: null,
    facebook: null,
    youtube: null,
    tiktok: null,
  },
}
