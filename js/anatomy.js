/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Anatomy Guide Module
 * Poli International Widget Suite
 *
 * Body location recommendations with anatomy information
 */

const AnatomyGuide = {
    currentLocation: null,

    // Anatomy database
    anatomyData: {
        ear: {
            name: 'Ear Piercings',
            jewelryTypes: ['Labret Studs', 'Rings', 'Barbells', 'Clickers', 'Plugs/Tunnels'],
            gauges: ['20g', '18g', '16g', '14g', '12g', '10g', '8g', '6g', '4g', '2g', '0g', '00g'],
            sizes: [
                { type: 'Lobe', gauge: '20g-14g', size: '1/4"-3/8" (6-10mm)' },
                { type: 'Helix', gauge: '18g-14g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Tragus', gauge: '18g-14g', size: '1/4"-5/16" (6-8mm)' },
                { type: 'Daith', gauge: '16g-14g', size: '3/8"-1/2" (10-12mm)' },
                { type: 'Rook', gauge: '18g-14g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Conch', gauge: '16g-12g', size: '3/8"-1/2" (10-12mm)' },
                { type: 'Industrial', gauge: '14g', size: '1-3/8"-1-1/2" (35-38mm)' }
            ],
            notes: 'Ear piercings are the most versatile. Lobe piercings heal in 6-8 weeks, cartilage in 6-12 months. Use titanium or gold for initial jewelry. Consider anatomy for industrial and daith piercings.'
        },
        nose: {
            name: 'Nose Piercings',
            jewelryTypes: ['Nose Screws', 'L-Shaped Studs', 'Labret Studs', 'Rings', 'Clickers'],
            gauges: ['20g', '18g', '16g'],
            sizes: [
                { type: 'Nostril', gauge: '20g-18g', size: '1/4"-5/16" (6-8mm) post' },
                { type: 'Nostril Ring', gauge: '20g-18g', size: '5/16"-3/8" (8-10mm) diameter' },
                { type: 'Septum', gauge: '16g-14g', size: '3/8"-1/2" (10-12mm) diameter' }
            ],
            notes: 'Nostril piercings heal in 4-6 months. Septum piercings heal in 6-8 weeks (sweet spot). 18g is most common for nostrils. Titanium or gold recommended for healing.'
        },
        lip: {
            name: 'Lip Piercings',
            jewelryTypes: ['Labret Studs', 'Rings', 'Circular Barbells'],
            gauges: ['16g', '14g'],
            sizes: [
                { type: 'Labret (center)', gauge: '16g-14g', size: '5/16"-1/2" (8-12mm)' },
                { type: 'Monroe/Madonna', gauge: '16g', size: '1/4"-5/16" (6-8mm)' },
                { type: 'Medusa', gauge: '16g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Snake Bites', gauge: '16g-14g', size: '5/16"-1/2" (8-12mm)' }
            ],
            notes: 'Lip piercings heal in 6-8 weeks. Start with longer posts for swelling (10-12mm), downsize after healing. Flat-back labrets recommended to protect teeth and gums.'
        },
        tongue: {
            name: 'Tongue Piercing',
            jewelryTypes: ['Straight Barbells'],
            gauges: ['14g'],
            sizes: [
                { type: 'Tongue (standard)', gauge: '14g', size: '5/8"-3/4" (16-19mm) initial' },
                { type: 'Tongue (healed)', gauge: '14g', size: '1/2"-5/8" (12-16mm) final' }
            ],
            notes: 'Tongue piercings heal in 4-6 weeks but significant swelling first 10-14 days. Start with 7/8" or 3/4" barbell for swelling, downsize to 5/8" or 1/2" after healing. Use plastic or bioflex balls to protect teeth.'
        },
        eyebrow: {
            name: 'Eyebrow Piercing',
            jewelryTypes: ['Curved Barbells', 'Circular Barbells'],
            gauges: ['16g'],
            sizes: [
                { type: 'Eyebrow', gauge: '16g', size: '3/8"-1/2" (10-12mm)' }
            ],
            notes: 'Eyebrow piercings heal in 6-8 weeks but can migrate or reject. Curved barbells reduce rejection risk. Avoid makeup and facial products during healing. Consider placement carefully for anatomy.'
        },
        navel: {
            name: 'Navel (Belly Button)',
            jewelryTypes: ['Curved Barbells'],
            gauges: ['14g'],
            sizes: [
                { type: 'Navel (standard)', gauge: '14g', size: '7/16"-1/2" (11-12mm)' },
                { type: 'Navel (deep)', gauge: '14g', size: '1/2"-5/8" (12-16mm)' }
            ],
            notes: 'Navel piercings heal in 6-12 months. Anatomy is crucial - not everyone can be pierced. Avoid tight clothing and sleeping on stomach during healing. Floating navels available for different anatomy.'
        },
        nipple: {
            name: 'Nipple Piercings',
            jewelryTypes: ['Straight Barbells', 'Rings', 'Circular Barbells'],
            gauges: ['14g', '12g'],
            sizes: [
                { type: 'Nipple (male)', gauge: '14g', size: '1/2"-5/8" (12-16mm)' },
                { type: 'Nipple (female)', gauge: '14g', size: '1/2"-3/4" (12-19mm)' }
            ],
            notes: 'Nipple piercings heal in 6-12 months. Straight barbells recommended for healing. Size varies significantly by anatomy - professional measurement essential. Rings after healing only.'
        },
        surface: {
            name: 'Surface & Dermal Piercings',
            jewelryTypes: ['Surface Bars', 'Dermal Anchors'],
            gauges: ['14g', '12g'],
            sizes: [
                { type: 'Surface Bar', gauge: '12g-14g', size: '1/2"-3/4" (12-19mm) between holes' },
                { type: 'Dermal Anchor', gauge: '14g-12g', size: '1/4" (6mm) depth' }
            ],
            notes: 'Surface piercings have high rejection risk (months to years). Placement and angle critical. Surface bars with 90° bends reduce rejection vs curved barbells. Dermals more stable but permanent removal may scar. Professional placement essential.'
        },
        'male-genital': {
            name: 'Male Genital Piercings',
            jewelryTypes: ['Circular Barbells', 'Straight Barbells', 'Rings', 'Curved Barbells'],
            gauges: ['14g', '12g', '10g', '8g', '6g', '4g', '2g'],
            sizes: [
                { type: 'Prince Albert', gauge: '10g-6g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Reverse PA', gauge: '10g-6g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Apadravya', gauge: '10g-8g', size: '5/8"-3/4" (16-19mm) straight barbell' },
                { type: 'Ampallang', gauge: '10g-8g', size: '3/4"-1" (19-25mm) straight barbell' },
                { type: 'Frenum', gauge: '12g-10g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Lorum', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Hafada', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Guiche', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Dydoe', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Foreskin', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) ring' }
            ],
            notes: 'Male genital piercings heal in 4-12 weeks depending on type. PA piercings heal fastest (4-6 weeks), while transurethral piercings (apadravya/ampallang) take longer (8-12 weeks). Professional piercer consultation essential for proper placement. Anatomy varies significantly - not all piercings suitable for all individuals. Use implant-grade materials only. Sexual activity should wait until fully healed. Many piercings can be stretched over time with proper care.'
        },
        'female-genital': {
            name: 'Female Genital Piercings',
            jewelryTypes: ['Curved Barbells', 'Circular Barbells', 'Rings', 'Labret Studs'],
            gauges: ['14g', '12g', '10g', '8g'],
            sizes: [
                { type: 'Clitoral Hood (VCH)', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Horizontal CH (HCH)', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Clitoris', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Inner Labia', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Outer Labia', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Triangle', gauge: '12g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Fourchette', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Christina', gauge: '14g', size: '1/2"-5/8" (12-16mm) surface bar' },
                { type: 'Princess Albertina', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' }
            ],
            notes: 'Female genital piercings heal in 4-12 weeks depending on type and location. VCH is most common and heals quickly (4-6 weeks). Clitoral piercings require specific anatomy - professional assessment essential. Inner labia piercings heal faster than outer (4-6 weeks vs 8-10 weeks). Triangle piercing is advanced and anatomy-dependent. Use implant-grade materials only. Avoid tight clothing during healing. Sexual activity should wait until fully healed. Some piercings enhance sensation - discuss with professional piercer.'
        }
    },

    init() {
        // Bind location button clicks
        document.querySelectorAll('.anatomy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const location = btn.dataset.location;
                this.showLocation(location);
            });
        });

        const browseBtn = document.getElementById('browse-location-jewelry');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => this.browseJewelry());
        }

        console.log('🎯 Anatomy Guide initialized');
    },

    showLocation(location) {
        const data = this.anatomyData[location];
        if (!data) return;

        this.currentLocation = location;

        // Update active state
        document.querySelectorAll('.anatomy-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.location === location);
        });

        // Show details
        const details = document.getElementById('anatomy-details');
        if (details) details.style.display = 'grid';

        // Update title
        const title = document.getElementById('anatomy-title');
        if (title) title.textContent = data.name;

        // Update jewelry types
        const typesList = document.getElementById('anatomy-jewelry-types');
        if (typesList) {
            typesList.innerHTML = data.jewelryTypes.map(type =>
                `<li>${type}</li>`
            ).join('');
        }

        // Update gauges
        const gaugesDiv = document.getElementById('anatomy-gauges');
        if (gaugesDiv) {
            gaugesDiv.innerHTML = data.gauges.map(gauge => {
                const mm = (ScaleRenderer.gaugeToInches(gauge) * 25.4).toFixed(1);
                return `<span class="gauge-chip">${gauge} (${mm}mm)</span>`;
            }).join('');
        }

        // Update sizes table
        const sizesBody = document.getElementById('anatomy-sizes');
        if (sizesBody) {
            sizesBody.innerHTML = data.sizes.map(size =>
                `<tr>
                    <td>${size.type}</td>
                    <td>${size.gauge}</td>
                    <td>${size.size}</td>
                </tr>`
            ).join('');
        }

        // Update notes
        const notes = document.getElementById('anatomy-notes');
        if (notes) notes.textContent = data.notes;

        // Update anatomy diagram
        const diagram = document.getElementById('anatomy-diagram');
        if (diagram) {
            // Map location to SVG filename (all locations now have SVGs!)
            const svgFile = location;
            diagram.src = `images/${svgFile}.svg`;
            diagram.alt = `${data.name} anatomy diagram`;
            diagram.style.display = 'block';
        }

        console.log('🎯 Showing anatomy for:', location);
    },

    browseJewelry() {
        if (!this.currentLocation) return;

        // Switch to visualizer tab with location filter
        const visualizerTab = document.querySelector('[data-tab="visualizer"]');
        if (visualizerTab) visualizerTab.click();

        // Set location filter
        const locationFilter = document.getElementById('filter-location');
        if (locationFilter) {
            // Map anatomy locations to filter values
            let filterValue = this.currentLocation;

            // Both male-genital and female-genital should show genital jewelry
            if (this.currentLocation === 'male-genital' || this.currentLocation === 'female-genital') {
                filterValue = 'genital';
            }

            locationFilter.value = filterValue;
            locationFilter.dispatchEvent(new Event('change'));
        }
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.AnatomyGuide = AnatomyGuide;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnatomyGuide;
}
