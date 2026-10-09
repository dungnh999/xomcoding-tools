import type { Language } from '../i18n'
import type { Category, Tool } from '../types/tool'

function pickLocalized(value: string, en: string | undefined, vi: string | undefined, lang: Language): string {
  if (lang === 'en') return en?.trim() || value
  return vi?.trim() || value
}

export function getToolName(tool: Tool, lang: Language): string {
  return pickLocalized(tool.name, tool.nameEn, tool.nameVi, lang)
}

export function getToolShortDescription(tool: Tool, lang: Language): string {
  return pickLocalized(tool.shortDescription, tool.shortDescriptionEn, tool.shortDescriptionVi, lang)
}

export function getToolDescription(tool: Tool, lang: Language): string {
  return pickLocalized(tool.description, tool.descriptionEn, tool.descriptionVi, lang)
}

export function getCategoryName(category: Category, lang: Language): string {
  return pickLocalized(category.name, category.nameEn, category.nameVi, lang)
}
