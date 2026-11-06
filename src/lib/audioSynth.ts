"use client";

// Web Audio API ambient sitar/harp pentatonic synthesizer for wedding romance ambiance
class AmbientWeddingAudio {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: NodeJS.Timeout | null = null;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.0,  // G4
    440.0,  // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  public start() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isPlaying = true;

      // Play soft ambient pentatonic notes periodically
      let step = 0;
      this.intervalId = setInterval(() => {
        if (!this.ctx || this.ctx.state === "suspended") {
          this.ctx?.resume();
        }
        this.playSoftNote(step % this.notes.length);
        step++;
      }, 900);
    } catch {
      // Audio not permitted or supported
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // Closed
      }
      this.ctx = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  private playSoftNote(index: number) {
    if (!this.ctx) return;
    try {
      const freq = this.notes[index];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Soft attack, gentle decay like a temple bell / harp
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.9);
    } catch {
      // Ignore audio synthesis glitches
    }
  }
}

export const weddingAudio = new AmbientWeddingAudio();

