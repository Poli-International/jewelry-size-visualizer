/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Gauge Stretching Calculator Module
 * Poli International Widget Suite
 *
 * Safe stretching timeline calculator with European measurement standards
 */

const StretchingCalculator = {
    // Gauge progression chart (inches and mm)
    gaugeChart: [
        { gauge: '20g', inches: 0.032, mm: 0.8 },
        { gauge: '18g', inches: 0.040, mm: 1.0 },
        { gauge: '16g', inches: 0.047, mm: 1.2 },
        { gauge: '14g', inches: 0.063, mm: 1.6 },
        { gauge: '12g', inches: 0.079, mm: 2.0 },
        { gauge: '10g', inches: 0.094, mm: 2.4 },
        { gauge: '8g', inches: 0.126, mm: 3.2 },
        { gauge: '6g', inches: 0.157, mm: 4.0 },
        { gauge: '4g', inches: 0.197, mm: 5.0 },
        { gauge: '2g', inches: 0.236, mm: 6.0 },
        { gauge: '0g', inches: 0.315, mm: 8.0 },
        { gauge: '00g', inches: 0.394, mm: 10.0 },
        { gauge: '7/16', inches: 0.4375, mm: 11.0 },
        { gauge: '1/2', inches: 0.5, mm: 12.7 },
        { gauge: '9/16', inches: 0.5625, mm: 14.3 },
        { gauge: '5/8', inches: 0.625, mm: 15.9 },
        { gauge: '3/4', inches: 0.75, mm: 19.1 },
        { gauge: '7/8', inches: 0.875, mm: 22.2 },
        { gauge: '1', inches: 1.0, mm: 25.4 }
    ],

    // Healing time recommendations (in weeks)
    healingTimes: {
        'conservative': {
            '20g-14g': 6,
            '12g-6g': 8,
            '4g-0g': 10,
            '00g+': 12
        },
        'moderate': {
            '20g-14g': 4,
            '12g-6g': 5,
            '4g-0g': 6,
            '00g+': 8
        },
        'aggressive': {
            '20g-14g': 2,
            '12g-6g': 3,
            '4g-0g': 3,
            '00g+': 4
        }
    },

    init() {
        const calculateBtn = document.getElementById('calculate-stretching');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }

        console.log('📊 Stretching Calculator initialized');
    },

    calculate() {
        const currentGauge = document.getElementById('current-gauge').value;
        const goalGauge = document.getElementById('goal-gauge').value;
        const healingSpeed = document.getElementById('healing-speed').value;

        if (!currentGauge || !goalGauge) {
            alert('Please select both current and goal gauges');
            return;
        }

        // Find indices in gauge chart
        const startIndex = this.gaugeChart.findIndex(g => g.gauge === currentGauge);
        const endIndex = this.gaugeChart.findIndex(g => g.gauge === goalGauge);

        if (startIndex === -1 || endIndex === -1) {
            alert('Invalid gauge selection');
            return;
        }

        if (startIndex >= endIndex) {
            alert('Goal gauge must be larger than current gauge');
            return;
        }

        // Generate timeline
        const timeline = this.generateTimeline(startIndex, endIndex, healingSpeed);

        // Display results
        this.displayResults(timeline, healingSpeed);

        console.log(`📊 Calculated stretching from ${currentGauge} to ${goalGauge}`);
    },

    generateTimeline(startIndex, endIndex, speed) {
        const steps = [];
        let currentDate = new Date();

        for (let i = startIndex; i <= endIndex; i++) {
            const gauge = this.gaugeChart[i];
            const waitTime = this.getWaitTime(gauge.gauge, speed);

            steps.push({
                step: i - startIndex + 1,
                gauge: gauge.gauge,
                inches: gauge.inches,
                mm: gauge.mm,
                date: new Date(currentDate),
                waitWeeks: i === startIndex ? 0 : waitTime,
                isCurrent: i === startIndex
            });

            currentDate = new Date(currentDate.getTime() + waitTime * 7 * 24 * 60 * 60 * 1000);
        }

        return steps;
    },

    getWaitTime(gauge, speed) {
        const times = this.healingTimes[speed];
        const gaugeNum = parseFloat(gauge.replace(/[^\d.]/g, '')) || parseInt(gauge.replace(/g/, ''));

        if (gauge.includes('g')) {
            if (gaugeNum >= 14) return times['20g-14g'];
            if (gaugeNum >= 6) return times['12g-6g'];
            if (gaugeNum >= 0) return times['4g-0g'];
        }

        return times['00g+'];
    },

    displayResults(timeline, speed) {
        // Show results section
        const results = document.getElementById('stretching-results');
        if (results) results.style.display = 'flex';

        // Update summary stats
        const totalSteps = timeline.length;
        const startDate = timeline[0].date;
        const endDate = timeline[timeline.length - 1].date;
        const totalWeeks = Math.round((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        const totalMonths = (totalWeeks / 4.33).toFixed(1);
        const sizeIncrease = `${timeline[0].mm}mm → ${timeline[timeline.length - 1].mm}mm`;

        document.getElementById('total-steps').textContent = totalSteps;
        document.getElementById('total-time').textContent =
            totalWeeks < 52 ? `${totalWeeks} weeks (${totalMonths} months)` : `${(totalWeeks / 52).toFixed(1)} years`;
        document.getElementById('size-increase').textContent = sizeIncrease;

        // Render timeline visualization
        this.renderTimelineTrack(timeline);

        // Render step-by-step guide
        this.renderStepsGuide(timeline, speed);
    },

    renderTimelineTrack(timeline) {
        const track = document.getElementById('timeline-track');
        if (!track) return;

        track.innerHTML = timeline.map((step, index) => `
            <div class="timeline-node">
                <div class="timeline-node__circle" style="${step.isCurrent ? 'background: var(--color-rose-gold)' : ''}">
                    ${step.gauge}
                </div>
                <div class="timeline-node__label">
                    ${step.mm}mm<br>
                    <small>${this.formatDate(step.date)}</small>
                </div>
            </div>
        `).join('');
    },

    renderStepsGuide(timeline, speed) {
        const container = document.getElementById('steps-container');
        if (!container) return;

        container.innerHTML = timeline.map((step, index) => `
            <div class="step-card">
                <div class="step-card__header">
                    <span class="step-card__number">Step ${step.step} of ${timeline.length}</span>
                    <span class="step-card__date">${this.formatDate(step.date)}</span>
                </div>
                <div class="step-card__size">
                    ${step.gauge} - ${step.inches}" (${step.mm}mm)
                </div>
                <div class="step-card__details">
                    ${step.isCurrent
                        ? '<strong>Starting size</strong> - Your current gauge'
                        : `<strong>Wait ${step.waitWeeks} weeks</strong> from previous size before stretching`
                    }
                    <br>
                    ${this.getStepRecommendations(step, speed)}
                </div>
            </div>
        `).join('');
    },

    getStepRecommendations(step, speed) {
        const recommendations = [
            'Use water-based lubricant or jojoba oil',
            'Never force - if resistance, wait longer',
            'Clean jewelry and piercing before stretching',
            'Massage lobes daily with vitamin E oil'
        ];

        if (step.mm >= 10) {
            recommendations.push('Consider taping method for larger sizes');
        }

        if (speed === 'aggressive') {
            return '<em>⚠️ Aggressive timeline - Monitor closely for thinning tissue</em>';
        }

        return recommendations[Math.floor(Math.random() * recommendations.length)];
    },

    formatDate(date) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.StretchingCalculator = StretchingCalculator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StretchingCalculator;
}
