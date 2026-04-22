import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    features: { type: [String], default: [] },
    role: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    screenshots: { type: [String], default: [] },
    projectUrl: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    year: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ projectId: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ isActive: 1, featured: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
