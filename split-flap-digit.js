class SplitFlapDigit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentValue = '0';
    this.isAnimating = false;
    this.flipSound = null;
    this.setupAudio();
    this.render();
  }

  static get observedAttributes() {
    return ['value', 'alphabet'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && oldValue !== newValue && !this.isAnimating) {
      this.setValue(newValue);
    }
    if (name === 'alphabet' && oldValue !== newValue) {
      // Alphabet changed, no immediate action needed
    }
  }

  getAlphabet() {
    return this.getAttribute('alphabet') || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  setupAudio() {
    try {
      // Base64 encoded light-switch sound
      const audioData = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//PkZAAAAAGkAAAAAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      
      this.audio = new Audio(audioData);
      this.audio.volume = 0.3;
    } catch (e) {
      console.warn('Audio not available');
    }
  }

  playFlipSound() {
    if (!this.audio) return;
    
    try {
      // Randomize start position by 0-50ms to make parallel flips distinguishable
      const randomOffset = Math.random() * 0.05;
      this.audio.currentTime = randomOffset;
      this.audio.play();
    } catch (e) {
      console.warn('Could not play flip sound');
    }
  }

  setValue(newValue) {
    if (this.isAnimating) return;
    
    const targetValue = newValue.toString().slice(0, 1);
    
    if (this.currentValue !== targetValue) {
      this.animateSequential(targetValue);
    }
  }

  animateSequential(targetValue) {
    const sequence = this.getSequence(this.currentValue, targetValue);
    let index = 0;
    
    const nextFlip = () => {
      if (index < sequence.length) {
        const nextValue = sequence[index];
        this.animateFlip(this.currentValue, nextValue, () => {
          this.currentValue = nextValue;
          index++;
          setTimeout(nextFlip, 15);
        });
      }
    };
    
    nextFlip();
  }

  getSequence(from, to) {
    const chars = this.getAlphabet();
    const fromIndex = chars.indexOf(from);
    const toIndex = chars.indexOf(to);
    
    if (fromIndex === -1 || toIndex === -1) return [to];
    
    const sequence = [];
    let current = fromIndex;
    
    while (current !== toIndex) {
      current = (current + 1) % chars.length;
      sequence.push(chars[current]);
    }
    
    return sequence;
  }

  animateFlip(oldValue, newValue, callback) {
    this.isAnimating = true;
    
    const topFlap = this.shadowRoot.querySelector('.top-flap');
    const bottomFlap = this.shadowRoot.querySelector('.bottom-flap');
    const newTopFlap = this.shadowRoot.querySelector('.new-top-flap');
    const newBottomFlap = this.shadowRoot.querySelector('.new-bottom-flap');
    
    // Set up the new top flap - stationary behind the dropping flap
    newTopFlap.setAttribute('data-value', newValue);
    newTopFlap.style.display = 'flex';
    newTopFlap.style.transform = 'rotateX(0deg)';
    newTopFlap.style.zIndex = '1';
    
    // Set up the new bottom flap (hidden initially, will slide in)
    newBottomFlap.setAttribute('data-value', newValue);
    newBottomFlap.style.display = 'flex';
    newBottomFlap.style.transform = 'rotateX(90deg)';
    newBottomFlap.style.zIndex = '5';
    
    this.playFlipSound();
    
    // Start the top flap animation - new top flap stays stationary behind
    topFlap.style.animation = 'flip-top 0.02s ease-in-out forwards';
    
    setTimeout(() => {
      // Reveal the new bottom half
      newBottomFlap.style.animation = 'flip-bottom 0.06s ease-out forwards';
      
      setTimeout(() => {
        // Clean up and set final state
        topFlap.setAttribute('data-value', newValue);
        bottomFlap.setAttribute('data-value', newValue);
        topFlap.style.animation = '';
        topFlap.style.transform = '';
        topFlap.style.zIndex = '';
        newBottomFlap.style.animation = '';
        newBottomFlap.style.transform = '';
        newTopFlap.style.display = 'none';
        newTopFlap.style.transform = '';
        newTopFlap.style.zIndex = '';
        newBottomFlap.style.display = 'none';
        this.isAnimating = false;
        
        if (callback) callback();
      }, 60);
    }, 60);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        
        :host {
          display: inline-block;
          width: 60px;
          height: 80px;
          perspective: 1000px;
        }
        
        .digit-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: #1a1a1a;
          border-radius: 4px;
          border: 2px solid #333;
          overflow: hidden;
        }
        
        .flap {
          position: absolute;
          width: 100%;
          height: 50%;
          background: #000;
          color: #fff;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-weight: 700;
          font-size: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #333;
          transform-origin: center bottom;
          backface-visibility: hidden;
        }
        
        .top-flap {
          top: 0;
          border-bottom: 1px solid #555;
          overflow: hidden;
          align-items: center;
          line-height: 1;
        }
        
        .top-flap::before {
          content: attr(data-value);
          transform: translateY(29%);
        }
        
        .bottom-flap {
          bottom: 0;
          border-top: 1px solid #555;
          overflow: hidden;
          align-items: center;
          line-height: 1;
        }
        
        .bottom-flap::before {
          content: attr(data-value);
          transform: translateY(-29%);
        }
        
        .new-top-flap,
        .new-bottom-flap {
          display: none;
        }
        
        .new-top-flap {
          top: 0;
          background: #000;
          border-bottom: 1px solid #555;
          overflow: hidden;
          align-items: center;
          line-height: 1;
          z-index: 10;
          transform-origin: center bottom;
        }
        
        .new-top-flap::before {
          content: attr(data-value);
          transform: translateY(25%);
        }
        
        .new-bottom-flap {
          bottom: 0;
          background: #000;
          border-top: 1px solid #555;
          overflow: hidden;
          align-items: center;
          line-height: 1;
          z-index: 5;
        }
        
        .new-bottom-flap::before {
          content: attr(data-value);
          transform: translateY(-25%);
        }
        
        .divider {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #555;
          z-index: 15;
          transform: translateY(-50%);
        }
        
        @keyframes flip-top {
          0% {
            transform: rotateX(0deg);
            z-index: 3;
          }
          100% {
            transform: rotateX(-90deg);
            z-index: 3;
          }
        }
        
        @keyframes flip-back {
          0% {
            transform: rotateX(180deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
        
        @keyframes flip-bottom {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      </style>
      
      <div class="digit-container">
        <div class="flap top-flap" data-value="${this.currentValue}"></div>
        <div class="flap bottom-flap" data-value="${this.currentValue}"></div>
        <div class="flap new-top-flap" data-value="${this.currentValue}"></div>
        <div class="flap new-bottom-flap" data-value="${this.currentValue}"></div>
        <div class="divider"></div>
      </div>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute('value')) {
      this.currentValue = this.getAttribute('value').toString().slice(0, 1);
      this.render();
    }
  }
}

customElements.define('split-flap-digit', SplitFlapDigit);