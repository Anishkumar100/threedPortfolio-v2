// ─── Admin entity pages — each configures the reusable AdminCrudPage ─────────
import AdminCrudPage from '../components/AdminCrudPage';
import { adminProjects, adminServices, adminSkills, adminExperience, adminEducation, adminLeadership, adminTestimonials, adminMessages, adminInquiries } from '../../services/api';

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminProjects() {
  return <AdminCrudPage
    title="Projects" subtitle="Portfolio projects"
    api={adminProjects}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'year', label: 'Year', width: '70px' },
      { key: 'featured', label: 'Featured', width: '80px' },
    ]}
    formFields={[
      { key: 'projectId', label: 'Project ID', required: true, placeholder: 'unique-slug' },
      { key: 'title', label: 'Title', required: true },
      { key: 'subtitle', label: 'Subtitle', required: true },
      { key: 'description', label: 'Short Description', type: 'textarea', rows: 2, required: true },
      { key: 'longDescription', label: 'Long Description', type: 'textarea', rows: 5 },
      { key: 'category', label: 'Category', type: 'select', options: ['Full Stack', 'Frontend', 'Backend', 'Mobile', '3D & Interactive'] },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'role', label: 'Role' },
      { key: 'imageUrl', label: 'Image URL' },
      { key: 'projectUrl', label: 'Live URL' },
      { key: 'githubLink', label: 'GitHub URL' },
      { key: 'tags', label: 'Tags', type: 'array' },
      { key: 'features', label: 'Features', type: 'array' },
      { key: 'screenshots', label: 'Screenshot URLs', type: 'array' },
      { key: 'featured', label: 'Featured', type: 'checkbox', checkLabel: 'Show as featured project' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    defaultValues={{ projectId: '', title: '', subtitle: '', description: '', longDescription: '', category: 'Full Stack', year: 2025, role: '', imageUrl: '', projectUrl: '', githubLink: '', tags: '', features: '', screenshots: '', featured: false, order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminServices() {
  return <AdminCrudPage
    title="Services" subtitle="Service offerings"
    api={adminServices}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'hourlyRate', label: 'Rate', width: '80px', render: v => `$${v}/hr` },
      { key: 'isFeatured', label: 'Featured', width: '80px' },
    ]}
    formFields={[
      { key: 'title', label: 'Title', required: true },
      { key: 'shortDescription', label: 'Short Description', required: true },
      { key: 'description', label: 'Full Description', type: 'textarea', rows: 4, required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Web Development', 'Mobile Development', 'UI/UX Design', '3D & Interactive', 'Backend & API', 'Consulting'], required: true },
      { key: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', required: true },
      { key: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'INR'] },
      { key: 'estimatedTimeline', label: 'Estimated Timeline', placeholder: '2-4 weeks' },
      { key: 'minHours', label: 'Min Hours', type: 'number' },
      { key: 'maxHours', label: 'Max Hours', type: 'number' },
      { key: 'techStack', label: 'Tech Stack', type: 'array' },
      { key: 'deliverables', label: 'Deliverables', type: 'array' },
      { key: 'tags', label: 'Tags', type: 'array' },
      { key: 'icon', label: 'Icon Name', placeholder: 'layers' },
      { key: 'isFeatured', label: 'Featured', type: 'checkbox', checkLabel: 'Show as featured service' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    defaultValues={{ title: '', shortDescription: '', description: '', category: 'Web Development', hourlyRate: 35, currency: 'USD', estimatedTimeline: '2-4 weeks', minHours: 10, maxHours: 200, techStack: '', deliverables: '', tags: '', icon: 'code', isFeatured: false, order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminSkills() {
  return <AdminCrudPage
    title="Skill Categories" subtitle="Skill groups & individual skills"
    api={adminSkills}
    columns={[
      { key: 'label', label: 'Category' },
      { key: 'icon', label: 'Icon', width: '50px' },
      { key: 'skills', label: 'Skills', render: v => `${v?.length || 0} skills` },
      { key: 'order', label: 'Order', width: '60px' },
    ]}
    formFields={[
      { key: 'categoryId', label: 'Category ID', required: true, placeholder: 'frontend' },
      { key: 'label', label: 'Label', required: true, placeholder: 'Frontend & UI' },
      { key: 'icon', label: 'Icon Character', placeholder: '⬡' },
      { key: 'accent', label: 'Accent Color', placeholder: '#52aeff' },
      { key: 'glow', label: 'Glow Color', placeholder: 'rgba(82,174,255,0.15)' },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    nameKey="label"
    defaultValues={{ categoryId: '', label: '', icon: '⬡', accent: '#52aeff', glow: 'rgba(82,174,255,0.15)', summary: '', order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminExperience() {
  return <AdminCrudPage
    title="Experience" subtitle="Work experience entries"
    api={adminExperience}
    columns={[
      { key: 'role', label: 'Role' },
      { key: 'company', label: 'Company' },
      { key: 'period', label: 'Period' },
      { key: 'current', label: 'Current', width: '70px' },
    ]}
    formFields={[
      { key: 'experienceId', label: 'ID', required: true, placeholder: 'kairox' },
      { key: 'role', label: 'Role', required: true },
      { key: 'company', label: 'Company', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'] },
      { key: 'period', label: 'Period', required: true, placeholder: 'Jan 2025 – Present' },
      { key: 'duration', label: 'Duration', placeholder: '6 months' },
      { key: 'location', label: 'Location' },
      { key: 'current', label: 'Currently Working Here', type: 'checkbox', checkLabel: 'Yes' },
      { key: 'accent', label: 'Accent Color', placeholder: '#52aeff' },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
      { key: 'points', label: 'Bullet Points', type: 'array' },
      { key: 'tags', label: 'Tags', type: 'array' },
      { key: 'impact', label: 'Impact Statement' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    nameKey="role"
    defaultValues={{ experienceId: '', role: '', company: '', type: 'Internship', period: '', duration: '', location: '', current: false, accent: '#52aeff', summary: '', points: '', tags: '', impact: '', order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminEducation() {
  return <AdminCrudPage
    title="Education" subtitle="Educational background"
    api={adminEducation}
    columns={[
      { key: 'degree', label: 'Degree' },
      { key: 'institution', label: 'Institution' },
      { key: 'grade', label: 'Grade' },
    ]}
    formFields={[
      { key: 'educationId', label: 'ID', required: true, placeholder: 'btech' },
      { key: 'degree', label: 'Degree', required: true },
      { key: 'institution', label: 'Institution', required: true },
      { key: 'shortName', label: 'Short Name', placeholder: 'BSACIST' },
      { key: 'period', label: 'Period', required: true },
      { key: 'grade', label: 'Grade' },
      { key: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed'] },
      { key: 'location', label: 'Location' },
      { key: 'highlights', label: 'Highlights', type: 'array' },
      { key: 'courses', label: 'Courses', type: 'array' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    nameKey="degree"
    defaultValues={{ educationId: '', degree: '', institution: '', shortName: '', period: '', grade: '', status: 'Completed', location: '', highlights: '', courses: '', order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminLeadership() {
  return <AdminCrudPage
    title="Leadership" subtitle="Leadership & initiatives"
    api={adminLeadership}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'org', label: 'Organization' },
      { key: 'badge', label: 'Badge', width: '100px' },
    ]}
    formFields={[
      { key: 'leadershipId', label: 'ID', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'org', label: 'Organization', required: true },
      { key: 'period', label: 'Period', required: true },
      { key: 'url', label: 'URL' },
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
      { key: 'highlights', label: 'Highlights', type: 'array' },
      { key: 'badge', label: 'Badge Text', placeholder: 'Founder' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    defaultValues={{ leadershipId: '', title: '', org: '', period: '', url: '', summary: '', highlights: '', badge: '', order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminTestimonials() {
  return <AdminCrudPage
    title="Testimonials" subtitle="Client reviews"
    api={adminTestimonials}
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'mentions', label: 'Handle' },
      { key: 'review', label: 'Review' },
    ]}
    formFields={[
      { key: 'name', label: 'Name', required: true },
      { key: 'mentions', label: 'Handle', placeholder: '@username' },
      { key: 'review', label: 'Review', type: 'textarea', rows: 3, required: true },
      { key: 'imgPath', label: 'Avatar Image Path', placeholder: '/images/client1.png' },
      { key: 'order', label: 'Sort Order', type: 'number' },
    ]}
    nameKey="name"
    defaultValues={{ name: '', mentions: '', review: '', imgPath: '', order: 0 }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminMessages() {
  return <AdminCrudPage
    title="Messages" subtitle="Contact form submissions"
    api={adminMessages}
    showStatus={false}
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status', width: '90px', render: v => v || 'unread' },
      { key: 'createdAt', label: 'Date', width: '100px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    ]}
    formFields={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      { key: 'message', label: 'Message', type: 'textarea', rows: 5 },
      { key: 'status', label: 'Status', type: 'select', options: ['unread', 'read', 'replied', 'archived'] },
    ]}
    nameKey="name"
    defaultValues={{ name: '', email: '', subject: '', message: '', status: 'unread' }}
  />;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function AdminInquiries() {
  return <AdminCrudPage
    title="Inquiries" subtitle="Service inquiry submissions"
    api={adminInquiries}
    showStatus={false}
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'serviceName', label: 'Service' },
      { key: 'budget', label: 'Budget', width: '110px' },
      { key: 'status', label: 'Status', width: '100px', render: v => v || 'new' },
      { key: 'createdAt', label: 'Date', width: '100px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    ]}
    formFields={[
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'serviceName', label: 'Service Name' },
      { key: 'message', label: 'Message', type: 'textarea', rows: 4 },
      { key: 'budget', label: 'Budget' },
      { key: 'timeline', label: 'Timeline' },
      { key: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'in-progress', 'completed', 'cancelled'] },
      { key: 'adminNotes', label: 'Admin Notes', type: 'textarea', rows: 3 },
    ]}
    nameKey="name"
    defaultValues={{ name: '', email: '', phone: '', serviceName: '', message: '', budget: '', timeline: '', status: 'new', adminNotes: '' }}
  />;
}
