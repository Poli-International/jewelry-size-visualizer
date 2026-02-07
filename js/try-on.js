/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Virtual Try-On Module
 * Poli International Widget Suite
 *
 * Handles:
 * - Photo upload (drag & drop, file select)
 * - Jewelry overlay at calibrated scale
 * - Position, rotation, scale, opacity controls
 * - Save and share try-on results
 */

const TryOnModule = {
    uploadArea: null,
    workspace: null,
    canvas: null,
    ctx: null,

    // Current state
    uploadedImage: null,
    selectedJewelry: null,
    jewelryPosition: { x: 0, y: 0 },
    jewelryScale: 100,
    jewelryRotation: 0,
    jewelryOpacity: 100,
    isDragging: false,

    /**
     * Initialize try-on module
     */
    init() {
        this.uploadArea = document.getElementById('upload-area');
        this.workspace = document.getElementById('try-on-workspace');
        this.canvas = document.getElementById('try-on-canvas');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }

        // Bind events
        this.bindUploadEvents();
        this.bindControlEvents();
        this.bindCanvasEvents();

        console.log('📸 Try-On module initialized');
    },

    /**
     * Bind upload area events
     */
    bindUploadEvents() {
        const fileInput = document.getElementById('photo-upload');
        const uploadButton = document.getElementById('upload-button');

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
            });
        }

        // Upload button click
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        // Drag and drop
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('dragover');
            });

            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('dragover');
            });

            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('dragover');

                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleFile(file);
                }
            });

            // Click to upload
            this.uploadArea.addEventListener('click', () => {
                fileInput?.click();
            });
        }
    },

    /**
     * Bind control slider events
     */
    bindControlEvents() {
        // Scale controls
        const scaleSlider = document.getElementById('scale-slider');
        const scaleUp = document.getElementById('scale-up');
        const scaleDown = document.getElementById('scale-down');
        const scaleValue = document.getElementById('scale-value');

        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                this.jewelryScale = parseInt(e.target.value);
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        if (scaleUp) {
            scaleUp.addEventListener('click', () => {
                this.jewelryScale = Math.min(150, this.jewelryScale + 5);
                if (scaleSlider) scaleSlider.value = this.jewelryScale;
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        if (scaleDown) {
            scaleDown.addEventListener('click', () => {
                this.jewelryScale = Math.max(50, this.jewelryScale - 5);
                if (scaleSlider) scaleSlider.value = this.jewelryScale;
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        // Rotation controls
        const rotationSlider = document.getElementById('rotation-slider');
        const rotateLeft = document.getElementById('rotate-left');
        const rotateRight = document.getElementById('rotate-right');
        const rotationValue = document.getElementById('rotation-value');

        if (rotationSlider) {
            rotationSlider.addEventListener('input', (e) => {
                this.jewelryRotation = parseInt(e.target.value);
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        if (rotateLeft) {
            rotateLeft.addEventListener('click', () => {
                this.jewelryRotation = (this.jewelryRotation - 15 + 360) % 360;
                if (rotationSlider) rotationSlider.value = this.jewelryRotation;
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        if (rotateRight) {
            rotateRight.addEventListener('click', () => {
                this.jewelryRotation = (this.jewelryRotation + 15) % 360;
                if (rotationSlider) rotationSlider.value = this.jewelryRotation;
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        // Opacity control
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');

        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                this.jewelryOpacity = parseInt(e.target.value);
                if (opacityValue) opacityValue.textContent = `${this.jewelryOpacity}%`;
                this.redraw();
            });
        }

        // Action buttons
        const saveTryOnBtn = document.getElementById('save-try-on');
        if (saveTryOnBtn) {
            saveTryOnBtn.addEventListener('click', () => this.saveTryOn());
        }

        const newPhotoBtn = document.getElementById('new-photo');
        if (newPhotoBtn) {
            newPhotoBtn.addEventListener('click', () => this.reset());
        }

        const shareTryOnBtn = document.getElementById('share-try-on');
        if (shareTryOnBtn) {
            shareTryOnBtn.addEventListener('click', () => this.shareTryOn());
        }
    },

    /**
     * Bind canvas interaction events
     */
    bindCanvasEvents() {
        if (!this.canvas) return;

        let startX = 0;
        let startY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if clicking near jewelry position
            const distance = Math.sqrt(
                Math.pow(x - this.jewelryPosition.x, 2) +
                Math.pow(y - this.jewelryPosition.y, 2)
            );

            if (distance < 100) { // Click tolerance
                this.isDragging = true;
                startX = x;
                startY = y;
                this.canvas.style.cursor = 'grabbing';
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.jewelryPosition.x += x - startX;
            this.jewelryPosition.y += y - startY;

            startX = x;
            startY = y;

            this.redraw();
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'move';
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'move';
        });
    },

    /**
     * Handle uploaded file
     */
    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image file is too large. Please use an image under 10MB.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.showWorkspace();
                this.initializeCanvas();
                console.log('📷 Photo uploaded:', file.name);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    },

    /**
     * Show workspace and hide upload area
     */
    showWorkspace() {
        if (this.uploadArea) {
            this.uploadArea.parentElement.style.display = 'none';
        }
        if (this.workspace) {
            this.workspace.style.display = 'grid';
        }
    },

    /**
     * Initialize canvas with uploaded photo
     */
    initializeCanvas() {
        if (!this.canvas || !this.uploadedImage) return;

        // Set canvas size to match image (with max dimensions)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = this.uploadedImage.width;
        let height = this.uploadedImage.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        // Set initial jewelry position (center)
        this.jewelryPosition = {
            x: width / 2,
            y: height / 2
        };

        // Draw initial state
        this.redraw();
    },

    /**
     * Redraw canvas with photo and jewelry overlay
     */
    redraw() {
        if (!this.ctx || !this.uploadedImage) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw uploaded photo
        this.ctx.drawImage(this.uploadedImage, 0, 0, this.canvas.width, this.canvas.height);

        // Draw jewelry overlay if selected
        if (this.selectedJewelry) {
            this.drawJewelryOverlay();
        }
    },

    /**
     * Draw jewelry overlay on canvas
     */
    drawJewelryOverlay() {
        if (!this.ctx || !this.selectedJewelry) return;

        // Create temporary canvas for jewelry
        const tempCanvas = document.createElement('canvas');
        const maxDim = Math.max(
            this.selectedJewelry.diameter || 0,
            this.selectedJewelry.length || 0,
            0.5
        );
        const jewelrySize = ScaleRenderer.inchesToPixels(maxDim) * 3;

        tempCanvas.width = jewelrySize;
        tempCanvas.height = jewelrySize;

        // Render jewelry on temp canvas
        ScaleRenderer.renderJewelry(tempCanvas, this.selectedJewelry, {
            showRuler: false,
            showLabels: false,
            rotation: 0,
            opacity: 1
        });

        // Apply transformations and draw on main canvas
        this.ctx.save();

        // Set opacity
        this.ctx.globalAlpha = this.jewelryOpacity / 100;

        // Translate to jewelry position
        this.ctx.translate(this.jewelryPosition.x, this.jewelryPosition.y);

        // Apply rotation
        this.ctx.rotate((this.jewelryRotation * Math.PI) / 180);

        // Apply scale
        const scale = this.jewelryScale / 100;
        this.ctx.scale(scale, scale);

        // Draw jewelry
        this.ctx.drawImage(tempCanvas, -jewelrySize / 2, -jewelrySize / 2);

        this.ctx.restore();
    },

    /**
     * Set jewelry for try-on (called from visualizer)
     */
    setJewelry(jewelry) {
        this.selectedJewelry = jewelry;
        if (this.uploadedImage) {
            this.redraw();
        }
        console.log('💍 Set jewelry for try-on:', jewelry.name);
    },

    /**
     * Save try-on result as image
     */
    saveTryOn() {
        if (!this.canvas) return;

        try {
            // Convert canvas to data URL
            const dataURL = this.canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            link.download = `jewelry-tryon-${Date.now()}.png`;
            link.href = dataURL;
            link.click();

            console.log('💾 Try-on saved');
            this.showSaveMessage('Try-on saved successfully!');
        } catch (error) {
            console.error('Failed to save try-on:', error);
            alert('Failed to save image. Please try again.');
        }
    },

    /**
     * Share try-on result
     */
    shareTryOn() {
        if (!this.canvas) return;

        this.canvas.toBlob((blob) => {
            if (!blob) {
                alert('Failed to create shareable image');
                return;
            }

            const file = new File([blob], 'jewelry-tryon.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'My Jewelry Try-On',
                    text: 'Check out how this jewelry looks on me!',
                    files: [file]
                }).then(() => {
                    console.log('📤 Shared successfully');
                }).catch((error) => {
                    console.log('Share cancelled or failed:', error);
                });
            } else {
                // Fallback: copy link or download
                alert('Sharing not supported on this device. Image will be downloaded instead.');
                this.saveTryOn();
            }
        });
    },

    /**
     * Reset try-on (load new photo)
     */
    reset() {
        // Clear state
        this.uploadedImage = null;
        this.selectedJewelry = null;
        this.jewelryPosition = { x: 0, y: 0 };
        this.jewelryScale = 100;
        this.jewelryRotation = 0;
        this.jewelryOpacity = 100;

        // Reset sliders
        const scaleSlider = document.getElementById('scale-slider');
        const rotationSlider = document.getElementById('rotation-slider');
        const opacitySlider = document.getElementById('opacity-slider');

        if (scaleSlider) scaleSlider.value = 100;
        if (rotationSlider) rotationSlider.value = 0;
        if (opacitySlider) opacitySlider.value = 100;

        // Show upload area
        if (this.workspace) {
            this.workspace.style.display = 'none';
        }
        if (this.uploadArea) {
            this.uploadArea.parentElement.style.display = 'block';
        }

        console.log('🔄 Try-on reset');
    },

    /**
     * Show save success message
     */
    showSaveMessage(message) {
        const msgEl = document.createElement('div');
        msgEl.style.cssText = `
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
        `;
        msgEl.textContent = message;

        document.body.appendChild(msgEl);

        setTimeout(() => {
            msgEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => msgEl.remove(), 300);
        }, 3000);
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.TryOnModule = TryOnModule;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TryOnModule;
}
