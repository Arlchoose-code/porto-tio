export interface Skill {
  id: number;
  category_id: number;
  name: string;
  proficiency: number;
  level?: string;
  icon?: string;
  order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
  skills?: Skill[];
}