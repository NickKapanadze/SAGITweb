// Dynamic Content Generator for SAGIT Website
// This module generates HTML elements dynamically based on JSON data

class DynamicContentGenerator {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('language') || 'ge';
    }

    // Initialize with translations data
    init(translations) {
        this.translations = translations;
    }

    // Generate team member cards
    generateTeamCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.translations[this.currentLang]?.team?.members) return;

        const members = this.translations[this.currentLang].team.members;
        container.innerHTML = '';

        members.forEach(member => {
            const card = this.createTeamCard(member);
            container.appendChild(card);
        });
    }

    createTeamCard(member) {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.setAttribute('data-member-id', member.id);

        card.innerHTML = `
            <div class="team-card-image">
                <img src="${member.image || '/assets/images/bg.png'}" alt="${member.name}" class="team-image">
            </div>
            <div class="team-card-content">
                <h3 class="team-name">${member.name}</h3>
                <p class="team-position">${member.position}</p>
                ${member.bio ? `<p class="team-bio">${member.bio}</p>` : ''}
                ${member.expertise ? `
                    <div class="team-expertise">
                        <h4>Expertise:</h4>
                        <div class="expertise-tags">
                            ${member.expertise.map(skill => `<span class="expertise-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${member.email ? `<a href="mailto:${member.email}" class="team-email"><i class="fas fa-envelope"></i> ${member.email}</a>` : ''}
            </div>
        `;

        return card;
    }

    // Generate program category cards
    generateProgramCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.translations[this.currentLang]?.programs?.categories) return;

        const categories = this.translations[this.currentLang].programs.categories;
        container.innerHTML = '';

        categories.forEach(category => {
            const card = this.createProgramCard(category);
            container.appendChild(card);
        });
    }

    createProgramCard(category) {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.setAttribute('data-category-id', category.id);
        card.style.borderLeft = `4px solid ${category.color}`;

        card.innerHTML = `
            <div class="program-card-header" style="background: linear-gradient(135deg, ${category.color}20, ${category.color}10)">
                <div class="program-icon" style="color: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="program-title">${category.name}</h3>
            </div>
            <div class="program-card-content">
                <p class="program-description">${category.description}</p>
                <div class="program-list">
                    ${category.programs.map(program => `
                        <div class="program-item" data-program-id="${program.id}">
                            <div class="program-header">
                                <h4 class="program-name">${program.name}</h4>
                                <div class="program-meta">
                                    <span class="program-duration">${program.duration}</span>
                                    <span class="program-degree">${program.degree}</span>
                                </div>
                            </div>
                            <p class="program-desc">${program.description}</p>
                            <div class="program-skills">
                                ${program.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn program-details-btn" onclick="this.showProgramDetails(${category.id})">
                    Learn More
                </button>
            </div>
        `;

        return card;
    }

    // Generate contact information
    generateContactInfo(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.translations[this.currentLang]?.contact) return;

        const contact = this.translations[this.currentLang].contact;
        container.innerHTML = '';

        // Main contact info
        const infoSection = document.createElement('div');
        infoSection.className = 'contact-info-section';
        
        Object.entries(contact.info).forEach(([key, info]) => {
            const infoCard = document.createElement('div');
            infoCard.className = 'contact-info-card';
            infoCard.innerHTML = `
                <div class="contact-icon">
                    <i class="${info.icon}"></i>
                </div>
                <div class="contact-details">
                    <h4>${info.title}</h4>
                    <p>${info.value}</p>
                </div>
            `;
            infoSection.appendChild(infoCard);
        });

        container.appendChild(infoSection);

        // Departments
        if (contact.departments) {
            const departmentsSection = document.createElement('div');
            departmentsSection.className = 'contact-departments';
            departmentsSection.innerHTML = `
                <h3>Departments</h3>
                <div class="departments-grid">
                    ${contact.departments.map(dept => `
                        <div class="department-card" data-department-id="${dept.id}">
                            <h4>${dept.name}</h4>
                            <p>${dept.description}</p>
                            <div class="department-contact">
                                <a href="mailto:${dept.email}"><i class="fas fa-envelope"></i> ${dept.email}</a>
                                <a href="tel:${dept.phone}"><i class="fas fa-phone"></i> ${dept.phone}</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(departmentsSection);
        }
    }

    // Generate social media links
    generateSocialLinks(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.translations[this.currentLang]?.social?.links) return;

        const socialLinks = this.translations[this.currentLang].social.links;
        container.innerHTML = '';

        socialLinks.forEach(social => {
            const link = this.createSocialLink(social);
            container.appendChild(link);
        });
    }

    createSocialLink(social) {
        const link = document.createElement('a');
        link.href = social.url;
        link.target = '_blank';
        link.className = 'social-card';
        link.setAttribute('data-social-id', social.id);
        link.style.borderTop = `3px solid ${social.color}`;

        link.innerHTML = `
            <div class="social-icon" style="color: ${social.color}">
                <i class="${social.icon}"></i>
            </div>
            <div class="social-content">
                <h4>${social.name}</h4>
                <p class="social-description">${social.description}</p>
                <div class="social-stats">
                    <span class="followers">${social.followers} followers</span>
                </div>
            </div>
        `;

        return link;
    }

    // Generate all dynamic content
    generateAllContent() {
        this.generateTeamCards('team-container');
        this.generateProgramCards('programs-container');
        this.generateContactInfo('contact-info-container');
        this.generateSocialLinks('social-links-container');
    }

    // Update content when language changes
    updateLanguage(newLang) {
        this.currentLang = newLang;
        this.generateAllContent();
    }

    // Add new team member dynamically
    addTeamMember(memberData) {
        if (!this.translations[this.currentLang]?.team?.members) return;
        
        // Add to both languages if provided
        this.translations.ge.team.members.push({
            ...memberData.ge,
            id: this.getNextId(this.translations.ge.team.members)
        });
        this.translations.en.team.members.push({
            ...memberData.en,
            id: this.getNextId(this.translations.en.team.members)
        });

        this.generateTeamCards('team-container');
    }

    // Remove team member by ID
    removeTeamMember(memberId) {
        ['ge', 'en'].forEach(lang => {
            const members = this.translations[lang]?.team?.members;
            if (members) {
                const index = members.findIndex(member => member.id === memberId);
                if (index > -1) {
                    members.splice(index, 1);
                }
            }
        });

        this.generateTeamCards('team-container');
    }

    // Add new program
    addProgram(categoryId, programData) {
        ['ge', 'en'].forEach(lang => {
            const category = this.translations[lang]?.programs?.categories?.find(cat => cat.id === categoryId);
            if (category) {
                category.programs.push({
                    ...programData[lang],
                    id: this.getNextId(category.programs)
                });
            }
        });

        this.generateProgramCards('programs-container');
    }

    // Add new social link
    addSocialLink(socialData) {
        ['ge', 'en'].forEach(lang => {
            const socialLinks = this.translations[lang]?.social?.links;
            if (socialLinks) {
                socialLinks.push({
                    ...socialData[lang],
                    id: this.getNextId(socialLinks)
                });
            }
        });

        this.generateSocialLinks('social-links-container');
    }

    // Helper function to get next available ID
    getNextId(array) {
        const maxId = Math.max(...array.map(item => item.id || 0));
        return maxId + 1;
    }

    // Search functionality
    searchContent(query, type = 'all') {
        const results = {
            team: [],
            programs: [],
            social: []
        };

        const currentData = this.translations[this.currentLang];
        if (!currentData) return results;

        // Search team members
        if (type === 'all' || type === 'team') {
            currentData.team?.members?.forEach(member => {
                if (this.matchesSearch(member, query, ['name', 'position', 'bio', 'expertise'])) {
                    results.team.push(member);
                }
            });
        }

        // Search programs
        if (type === 'all' || type === 'programs') {
            currentData.programs?.categories?.forEach(category => {
                category.programs?.forEach(program => {
                    if (this.matchesSearch(program, query, ['name', 'description', 'skills']) || 
                        this.matchesSearch(category, query, ['name', 'description'])) {
                        results.programs.push({...program, category: category.name});
                    }
                });
            });
        }

        // Search social links
        if (type === 'all' || type === 'social') {
            currentData.social?.links?.forEach(social => {
                if (this.matchesSearch(social, query, ['name', 'description'])) {
                    results.social.push(social);
                }
            });
        }

        return results;
    }

    // Helper function for search matching
    matchesSearch(item, query, fields) {
        const searchText = query.toLowerCase();
        return fields.some(field => {
            const value = item[field];
            if (Array.isArray(value)) {
                return value.some(v => v.toLowerCase().includes(searchText));
            }
            return typeof value === 'string' && value.toLowerCase().includes(searchText);
        });
    }
}

// Export for use in other modules
window.DynamicContentGenerator = DynamicContentGenerator;

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicContent = new DynamicContentGenerator();
});