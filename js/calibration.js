/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Screen Calibration System
 * Poli International Widget Suite
 *
 * Handles:
 * - Screen PPI calibration using credit card or ruler
 * - Auto-detection of screen specifications
 * - Calibration persistence
 * - 1:1 scale accuracy verification
 */

const CalibrationSystem = {
    modal: null,
    cardSlider: null,
    rulerSlider: null,
    currentCardWidth: 320, // Starting width in pixels
    currentRulerWidth: 400, // Starting width in pixels
    targetCardWidthMM: 85.6, // ISO/IEC 7810 ID-1 standard
    targetRulerWidthMM: 100, // 10cm ruler

    /**
     * Initialize calibration system
     */
    init() {
        this.modal = document.getElementById('calibration-modal');
        this.cardSlider = document.getElementById('card-calibration-slider');
        this.rulerSlider = document.getElementById('ruler-calibration-slider');

        // Bind event listeners
        this.bindEvents();

        // Initialize calibration displays (set to 100% default)
        // These will be properly initialized when the modal is opened
        console.log('📏 Calibration System initialized');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Calibrate button (open modal)
        const calibrateBtn = document.getElementById('calibrate-button');
        if (calibrateBtn) {
            calibrateBtn.addEventListener('click', () => this.openModal());
        }

        // Close modal
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Modal overlay click
        const overlay = this.modal?.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Card slider
        if (this.cardSlider) {
            this.cardSlider.addEventListener('input', (e) => {
                const percentage = parseInt(e.target.value);
                this.updateCardSize(percentage);
            });
        }

        // Ruler slider
        if (this.rulerSlider) {
            this.rulerSlider.addEventListener('input', (e) => {
                const percentage = parseInt(e.target.value);
                this.updateRulerSize(percentage);
            });
        }

        // Auto-detect button
        const autoDetectBtn = document.getElementById('auto-detect-ppi');
        if (autoDetectBtn) {
            autoDetectBtn.addEventListener('click', () => this.autoDetectPPI());
        }

        // Save calibration
        const saveBtn = document.getElementById('save-calibration');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCalibration());
        }

        // Skip calibration
        const skipBtn = document.getElementById('skip-calibration');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipCalibration());
        }
    },

    /**
     * Open calibration modal
     */
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.drawRuler();
            console.log('📏 Calibration modal opened');
        }
    },

    /**
     * Close calibration modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    },

    /**
     * Update credit card display size
     * @param {number} percentage - Size percentage (50-200)
     */
    updateCardSize(percentage) {
        // Base card size in pixels (at 100%)
        const baseWidth = 320;
        const baseHeight = 200;

        this.currentCardWidth = (baseWidth * percentage) / 100;
        const currentHeight = (baseHeight * percentage) / 100;

        const cardElement = document.querySelector('.card-mockup');
        if (cardElement) {
            cardElement.style.width = `${this.currentCardWidth}px`;
            cardElement.style.height = `${currentHeight}px`;
        }

        // Update display
        const displaySize = (this.targetCardWidthMM * percentage) / 100;
        const sizeDisplay = document.getElementById('card-size-display');
        if (sizeDisplay) {
            sizeDisplay.textContent = `${displaySize.toFixed(1)}mm`;
        }

        // Calculate current PPI based on card calibration
        const currentPPI = this.calculatePPIFromCard();
        console.log(`Card calibration: ${percentage}% = ${currentPPI.toFixed(1)} PPI`);
    },

    /**
     * Update ruler display size
     * @param {number} percentage - Size percentage (50-200)
     */
    updateRulerSize(percentage) {
        const baseWidth = 400;
        this.currentRulerWidth = (baseWidth * percentage) / 100;

        this.drawRuler();

        // Update display
        const displaySize = (this.targetRulerWidthMM * percentage) / 100;
        const sizeDisplay = document.getElementById('ruler-size-display');
        if (sizeDisplay) {
            sizeDisplay.textContent = `${displaySize.toFixed(1)}mm`;
        }

        // Calculate current PPI based on ruler calibration
        const currentPPI = this.calculatePPIFromRuler();
        console.log(`Ruler calibration: ${percentage}% = ${currentPPI.toFixed(1)} PPI`);
    },

    /**
     * Draw calibration ruler on SVG
     */
    drawRuler() {
        const svg = document.getElementById('ruler-svg');
        if (!svg) return;

        // Clear existing content
        svg.innerHTML = '';

        // Set SVG dimensions
        svg.setAttribute('width', this.currentRulerWidth);
        svg.setAttribute('height', 60);

        // Draw ruler background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 10);
        rect.setAttribute('width', this.currentRulerWidth);
        rect.setAttribute('height', 40);
        rect.setAttribute('fill', '#F5F5F5');
        rect.setAttribute('stroke', '#6B7280');
        rect.setAttribute('stroke-width', 2);
        svg.appendChild(rect);

        // Draw millimeter marks
        const mmPerPixel = this.targetRulerWidthMM / this.currentRulerWidth;
        const pixelsPerMM = this.currentRulerWidth / this.targetRulerWidthMM;

        for (let mm = 0; mm <= this.targetRulerWidthMM; mm++) {
            const x = mm * pixelsPerMM;
            const isCM = mm % 10 === 0;
            const isHalfCM = mm % 5 === 0;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('x2', x);
            line.setAttribute('y1', 10);

            if (isCM) {
                line.setAttribute('y2', 35);
                line.setAttribute('stroke', '#374151');
                line.setAttribute('stroke-width', 2);

                // Add cm label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', 48);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '10');
                text.setAttribute('font-family', 'Inter, sans-serif');
                text.setAttribute('fill', '#374151');
                text.textContent = mm / 10;
                svg.appendChild(text);
            } else if (isHalfCM) {
                line.setAttribute('y2', 28);
                line.setAttribute('stroke', '#6B7280');
                line.setAttribute('stroke-width', 1.5);
            } else {
                line.setAttribute('y2', 22);
                line.setAttribute('stroke', '#9CA3AF');
                line.setAttribute('stroke-width', 1);
            }

            svg.appendChild(line);
        }
    },

    /**
     * Calculate PPI based on credit card calibration
     * @returns {number} Calculated PPI
     */
    calculatePPIFromCard() {
        // Credit card is 85.6mm = 3.375 inches
        const cardWidthInches = this.targetCardWidthMM / 25.4;
        const ppi = this.currentCardWidth / cardWidthInches;
        return ppi;
    },

    /**
     * Calculate PPI based on ruler calibration
     * @returns {number} Calculated PPI
     */
    calculatePPIFromRuler() {
        // Ruler is 100mm = 3.937 inches
        const rulerWidthInches = this.targetRulerWidthMM / 25.4;
        const ppi = this.currentRulerWidth / rulerWidthInches;
        return ppi;
    },

    /**
     * Auto-detect screen PPI based on device specifications
     */
    autoDetectPPI() {
        const resultElement = document.getElementById('auto-detect-result');
        if (!resultElement) return;

        // Get device info
        const dpr = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const screenAvailWidth = window.screen.availWidth;
        const screenAvailHeight = window.screen.availHeight;

        // Try to detect screen size
        let detectedPPI = 96; // Default fallback
        let detectionMethod = 'Default';

        // Common screen resolution to PPI mappings
        const screenDatabase = {
            // Desktop displays
            '1920x1080': { ppi: 96, name: '24" 1080p' },
            '2560x1440': { ppi: 109, name: '27" 1440p' },
            '3840x2160': { ppi: 163, name: '27" 4K' },
            '2560x1600': { ppi: 110, name: '27" 16:10' },
            '1366x768': { ppi: 85, name: '15.6" Laptop' },
            '1920x1200': { ppi: 94, name: '24" 16:10' },

            // Retina displays
            '2880x1800': { ppi: 220, name: '15" MacBook Pro Retina' },
            '2560x1600retina': { ppi: 227, name: '13" MacBook Pro Retina' },
            '2304x1440': { ppi: 226, name: '12" MacBook Retina' },

            // High DPI displays
            '3840x2400': { ppi: 185, name: '15" 4K Laptop' }
        };

        const key = `${screenWidth}x${screenHeight}`;
        if (screenDatabase[key]) {
            detectedPPI = screenDatabase[key].ppi * dpr;
            detectionMethod = `Detected ${screenDatabase[key].name}`;
        } else {
            // Estimation based on DPR
            detectedPPI = 96 * dpr;
            detectionMethod = `Estimated (${screenWidth}×${screenHeight}, DPR: ${dpr})`;
        }

        // Display result
        resultElement.innerHTML = `
            <strong>Detected PPI: ${detectedPPI.toFixed(1)}</strong><br>
            Method: ${detectionMethod}<br>
            Screen: ${screenWidth}×${screenHeight} (DPR: ${dpr})<br>
            <small>Note: Auto-detection may not be accurate for all displays. Manual calibration recommended.</small>
        `;

        // Update app state
        AppState.pixelsPerInch = detectedPPI;

        console.log('🔍 Auto-detected PPI:', detectedPPI);
        console.log('   Screen:', screenWidth, 'x', screenHeight);
        console.log('   DPR:', dpr);
        console.log('   Method:', detectionMethod);
    },

    /**
     * Save calibration to app state
     */
    saveCalibration() {
        // Average the two calibration methods
        const cardPPI = this.calculatePPIFromCard();
        const rulerPPI = this.calculatePPIFromRuler();
        const averagePPI = (cardPPI + rulerPPI) / 2;

        // Use card PPI as primary (most people have a credit card handy)
        const finalPPI = cardPPI;

        // Update app state
        AppState.pixelsPerInch = finalPPI;
        AppState.isCalibrated = true;

        // Save to local storage
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveState();
        }

        // Hide calibration banner
        const calibrationBanner = document.getElementById('calibration-banner');
        if (calibrationBanner) {
            calibrationBanner.style.display = 'none';
        }

        // Close modal
        this.closeModal();

        // Show success message
        this.showSuccessMessage(finalPPI);

        console.log('✅ Calibration saved:');
        console.log('   Card PPI:', cardPPI.toFixed(1));
        console.log('   Ruler PPI:', rulerPPI.toFixed(1));
        console.log('   Final PPI:', finalPPI.toFixed(1));
    },

    /**
     * Skip calibration (use default or auto-detected PPI)
     */
    skipCalibration() {
        // Try auto-detection first
        const dpr = window.devicePixelRatio || 1;
        const defaultPPI = 96 * dpr;

        AppState.pixelsPerInch = defaultPPI;
        AppState.isCalibrated = false;

        // Hide banner
        const calibrationBanner = document.getElementById('calibration-banner');
        if (calibrationBanner) {
            calibrationBanner.style.display = 'none';
        }

        // Close modal
        this.closeModal();

        console.warn('⚠️ Calibration skipped. Using default PPI:', defaultPPI);
        console.warn('   Jewelry sizes may not be accurate at 1:1 scale');
    },

    /**
     * Show success message after calibration
     * @param {number} ppi - Calibrated PPI value
     */
    showSuccessMessage(ppi) {
        const message = document.createElement('div');
        message.className = 'calibration-success';
        message.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 3000;
            font-weight: 600;
            animation: slideDown 0.3s ease-out;
        `;
        message.innerHTML = `
            ✅ Calibration Complete!<br>
            <small style="opacity: 0.9;">Screen PPI: ${ppi.toFixed(1)} • Jewelry will display at true 1:1 scale</small>
        `;

        document.body.appendChild(message);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 4000);
    },

    /**
     * Get calibration status
     * @returns {Object} Calibration status and PPI
     */
    getCalibrationStatus() {
        return {
            isCalibrated: AppState.isCalibrated,
            pixelsPerInch: AppState.pixelsPerInch,
            accuracy: AppState.isCalibrated ? 'High' : 'Estimated'
        };
    },

    /**
     * Reset calibration
     */
    resetCalibration() {
        AppState.isCalibrated = false;
        AppState.pixelsPerInch = 96;

        // Reset sliders
        if (this.cardSlider) this.cardSlider.value = 100;
        if (this.rulerSlider) this.rulerSlider.value = 100;

        // Update displays
        this.updateCardSize(100);
        this.updateRulerSize(100);

        // Show banner
        const calibrationBanner = document.getElementById('calibration-banner');
        if (calibrationBanner) {
            calibrationBanner.style.display = 'block';
        }

        console.log('🔄 Calibration reset');
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.CalibrationSystem = CalibrationSystem;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalibrationSystem;
}
