import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  fetchContentConfig,
  fetchContentProfile,
  fetchContentProjects,
  fetchContentSkills,
  fetchContentExperience,
  fetchContentEducation,
  fetchContentLeadership,
  fetchContentTestimonials,
} from '../services/api';

// ─── Complete defaults — nothing is ever undefined ───────────────────────────
const EMPTY = {
  config: {
    aboutStats: [], heroStats: [], quickFacts: [], values: [],
    hobbies: [], achievements: [], currentlyLearning: [],
    counterItems: [], abilities: [], socialLinks: [],
    words: [], logoIcons: [],
  },
  profile: {
    name: '', firstName: '', lastName: '', initials: '', role: '', roleAlt: '',
    tagline: '', location: '', locationShort: '', timezone: '',
    email: '', phone: '', linkedin: '', github: '', resume: '',
    avatar: '', available: true, bio: '',
  },
  projects: [],
  skills: [],
  experience: [],
  education: [],
  leadership: [],
  testimonials: [],
};

const SiteDataContext = createContext({ ...EMPTY, loaded: false });

// ─── Field mappers — API model fields → what frontend components expect ──────

const mapProject = (p) => ({
  ...p,
  id: p.projectId || p.id || p._id,
});

const mapExperience = (e) => ({
  ...e,
  id: e.experienceId || e.id || e._id,
});

const mapEducation = (e) => ({
  ...e,
  id: e.educationId || e.id || e._id,
});

const mapLeadership = (l) => ({
  ...l,
  id: l.leadershipId || l.id || l._id,
});

const mapSkillCategory = (s) => ({
  ...s,
  id: s.categoryId || s.id || s._id,
});

// Testimonials: API has {name, mentions, review, imgPath}
// Frontend Testimonials.jsx uses {name, role, company, avatar, quote, rating}
const mapTestimonial = (t) => ({
  ...t,
  id: t._id || t.id,
  name: t.name || '',
  avatar: t.imgPath || t.avatar || '',
  quote: t.review || t.quote || '',
  role: t.mentions || t.role || '',
  company: t.company || '',
  rating: t.rating ?? 5,
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function SiteDataProvider({ children }) {
  const [state, setState] = useState({ ...EMPTY, loaded: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.allSettled([
          fetchContentConfig(),       // 0
          fetchContentProfile(),      // 1
          fetchContentProjects(),     // 2
          fetchContentSkills(),       // 3
          fetchContentExperience(),   // 4
          fetchContentEducation(),    // 5
          fetchContentLeadership(),   // 6
          fetchContentTestimonials(), // 7
        ]);

        if (cancelled) return;

        const get = (idx) => {
          const r = results[idx];
          return r.status === 'fulfilled' && r.value?.data?.data ? r.value.data.data : null;
        };

        const rawConfig = get(0);
        const rawProfile = get(1);
        const rawProjects = get(2);
        const rawSkills = get(3);
        const rawExp = get(4);
        const rawEdu = get(5);
        const rawLead = get(6);
        const rawTest = get(7);

        setState({
          config: rawConfig ? { ...EMPTY.config, ...rawConfig } : EMPTY.config,
          profile: rawProfile ? { ...EMPTY.profile, ...rawProfile } : EMPTY.profile,
          projects: rawProjects?.length > 0 ? rawProjects.map(mapProject) : [],
          skills: rawSkills?.length > 0 ? rawSkills.map(mapSkillCategory) : [],
          experience: rawExp?.length > 0 ? rawExp.map(mapExperience) : [],
          education: rawEdu?.length > 0 ? rawEdu.map(mapEducation) : [],
          leadership: rawLead?.length > 0 ? rawLead.map(mapLeadership) : [],
          testimonials: rawTest?.length > 0 ? rawTest.map(mapTestimonial) : [],
          loaded: true,
        });
      } catch {
        if (!cancelled) setState(prev => ({ ...prev, loaded: true }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => state, [state]);

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
