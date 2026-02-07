/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Style Selector Module
 * Poli International Widget Suite
 *
 * Interactive style quiz to recommend jewelry based on preferences
 */

const StyleSelector = {
    currentQuestion: 0,
    answers: [],

    quiz: [
        {
            question: 'What describes your everyday style?',
            options: [
                { text: 'Minimal & Classic', value: 'minimal' },
                { text: 'Bold & Statement', value: 'bold' },
                { text: 'Elegant & Sophisticated', value: 'elegant' },
                { text: 'Alternative & Edgy', value: 'alternative' }
            ]
        },
        {
            question: 'How much jewelry do you typically wear?',
            options: [
                { text: 'Just one or two pieces', value: 'minimal' },
                { text: 'A curated collection', value: 'moderate' },
                { text: 'Fully stacked/layered', value: 'maximal' }
            ]
        },
        {
            question: 'What metal finish attracts you most?',
            options: [
                { text: 'Silver/White Gold/Titanium', value: 'silver' },
                { text: 'Yellow Gold', value: 'gold' },
                { text: 'Rose Gold', value: 'rose' },
                { text: 'Black/Gunmetal', value: 'dark' }
            ]
        },
        {
            question: 'Do you prefer gems or plain metal?',
            options: [
                { text: 'Plain metal only', value: 'plain' },
                { text: 'Subtle accent gems', value: 'subtle-gems' },
                { text: 'Statement gems', value: 'bold-gems' }
            ]
        },
        {
            question: 'What vibe are you going for?',
            options: [
                { text: 'Professional & Refined', value: 'professional' },
                { text: 'Casual & Comfortable', value: 'casual' },
                { text: 'Artistic & Unique', value: 'artistic' },
                { text: 'Bold & Rebellious', value: 'rebellious' }
            ]
        }
    ],

    styleProfiles: {
        minimalist: {
            name: 'Minimalist',
            description: 'You appreciate clean lines, subtle elegance, and timeless pieces. Small studs, delicate hoops, and simple bars are your go-to choices.',
            keywords: ['minimal', 'plain', 'silver', 'professional', 'casual'],
            recommendations: ['labret-001', 'ring-002', 'ear-001', 'special-003']
        },
        bold: {
            name: 'Bold Statement',
            description: 'You love to stand out! Large pieces, stacked jewelry, and eye-catching designs define your style.',
            keywords: ['bold', 'maximal', 'bold-gems', 'rebellious', 'artistic'],
            recommendations: ['clicker-002', 'clicker-005', 'ear-002', 'curved-002']
        },
        elegant: {
            name: 'Elegant & Refined',
            description: 'Sophistication is your signature. You gravitate toward gold, gems, and pieces that elevate any look.',
            keywords: ['elegant', 'gold', 'rose', 'subtle-gems', 'professional'],
            recommendations: ['labret-007', 'clicker-004', 'nose-001', 'special-004']
        },
        alternative: {
            name: 'Alternative Edge',
            description: 'You march to your own beat. Unique materials, bold placements, and unconventional pieces speak to you.',
            keywords: ['alternative', 'dark', 'rebellious', 'artistic', 'maximal'],
            recommendations: ['barbell-008', 'plug-003', 'special-001', 'surface-001']
        }
    },

    init() {
        this.bindEvents();
        this.showQuestion(0);
        console.log('✨ Style Selector initialized');
    },

    bindEvents() {
        const retakeBtn = document.getElementById('retake-quiz');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.resetQuiz());
        }

        const viewAllBtn = document.getElementById('view-all-style');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.viewAllMatches());
        }
    },

    showQuestion(index) {
        if (index >= this.quiz.length) {
            this.calculateResults();
            return;
        }

        this.currentQuestion = index;
        const question = this.quiz[index];
        const content = document.getElementById('quiz-content');

        if (!content) return;

        content.innerHTML = `
            <div class="quiz-question">
                <h3 class="quiz-question__title">${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((opt, i) => `
                        <button class="quiz-option" data-value="${opt.value}">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Update progress
        const progress = document.getElementById('quiz-progress');
        const current = document.getElementById('quiz-current');
        if (progress && current) {
            const percent = ((index + 1) / this.quiz.length) * 100;
            progress.style.width = `${percent}%`;
            current.textContent = index + 1;
        }

        // Bind option clicks
        content.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.answers.push(btn.dataset.value);
                this.showQuestion(index + 1);
            });
        });
    },

    calculateResults() {
        // Count answer frequencies
        const counts = {};
        this.answers.forEach(answer => {
            counts[answer] = (counts[answer] || 0) + 1;
        });

        // Match to style profile
        let bestMatch = 'minimalist';
        let bestScore = 0;

        Object.entries(this.styleProfiles).forEach(([key, profile]) => {
            let score = 0;
            this.answers.forEach(answer => {
                if (profile.keywords.includes(answer)) score++;
            });
            if (score > bestScore) {
                bestScore = score;
                bestMatch = key;
            }
        });

        this.showResults(bestMatch);
    },

    showResults(profileKey) {
        const profile = this.styleProfiles[profileKey];
        if (!profile) return;

        // Hide quiz, show results
        document.getElementById('style-quiz').style.display = 'none';
        document.getElementById('style-results').style.display = 'block';

        // Update profile info
        const nameEl = document.getElementById('style-name');
        const descEl = document.getElementById('style-description');

        if (nameEl) nameEl.textContent = profile.name;
        if (descEl) descEl.innerHTML = `<p>${profile.description}</p>`;

        // Show recommendations
        this.showRecommendations(profile.recommendations);

        console.log('✨ Style profile:', profile.name);
    },

    showRecommendations(itemIds) {
        const gallery = document.getElementById('style-gallery');
        if (!gallery) return;

        const items = itemIds.map(id => getJewelryById(id)).filter(Boolean);

        gallery.innerHTML = items.map(item => `
            <div class="jewelry-card" data-id="${item.id}">
                <div class="jewelry-card__image">
                    <canvas class="jewelry-card__canvas" width="200" height="200" data-jewelry-id="${item.id}"></canvas>
                </div>
                <h3 class="jewelry-card__title">${item.name}</h3>
                <div class="jewelry-card__specs">
                    <span>${item.gauge}</span>
                </div>
            </div>
        `).join('');

        // Bind card clicks
        gallery.querySelectorAll('.jewelry-card').forEach(card => {
            card.addEventListener('click', () => {
                if (typeof Visualizer !== 'undefined') {
                    Visualizer.openDetailView(card.dataset.id);
                }
            });
        });

        // Render canvases
        setTimeout(() => {
            gallery.querySelectorAll('.jewelry-card__canvas').forEach(canvas => {
                const item = getJewelryById(canvas.dataset.jewelryId);
                if (item) {
                    ScaleRenderer.renderJewelry(canvas, item, { showLabels: false });
                }
            });
        }, 100);
    },

    resetQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        document.getElementById('style-quiz').style.display = 'block';
        document.getElementById('style-results').style.display = 'none';
        this.showQuestion(0);
    },

    viewAllMatches() {
        // Switch to visualizer to see all jewelry
        const visualizerTab = document.querySelector('[data-tab="visualizer"]');
        if (visualizerTab) visualizerTab.click();
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.StyleSelector = StyleSelector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleSelector;
}
