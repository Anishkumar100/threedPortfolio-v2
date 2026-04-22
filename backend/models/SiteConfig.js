import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    // About page stats
    aboutStats: {
      type: [{ value: String, label: String }],
      default: [],
    },
    // Skills page stats
    heroStats: {
      type: [{ value: String, label: String }],
      default: [],
    },
    // Quick facts sidebar
    quickFacts: {
      type: [{ icon: String, label: String, value: String }],
      default: [],
    },
    // Philosophy / values
    values: {
      type: [{ icon: String, title: String, body: String }],
      default: [],
    },
    // Hobbies
    hobbies: {
      type: [{ id: String, icon: String, title: String, description: String, tag: String }],
      default: [],
    },
    // Achievements
    achievements: {
      type: [{ id: String, title: String, body: String, icon: String, year: String }],
      default: [],
    },
    // Currently learning
    currentlyLearning: {
      type: [{ label: String, progress: Number, color: String }],
      default: [],
    },
    // Home page hero words carousel
    words: {
      type: [{ text: String, imgPath: String }],
      default: [],
    },
    // Home page counter items (stats bar)
    counterItems: {
      type: [{ value: Number, suffix: String, label: String }],
      default: [],
    },
    // Home abilities section
    abilities: {
      type: [{ imgPath: String, title: String, desc: String }],
      default: [],
    },
    // Social links
    socialLinks: {
      type: [{ name: String, url: String, imgPath: String }],
      default: [],
    },
    // Logo icons (tech stack marquee)
    logoIcons: {
      type: [{ imgPath: String }],
      default: [],
    },
  },
  { timestamps: true }
);

siteConfigSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) instance = await this.create({});
  return instance;
};

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
export default SiteConfig;
