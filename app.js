const app = new Vue({
  el: '#root',
  data: {
    setName: 'my-set',
    trackCount: 1,
    trackVariations: [
      [3, 8, 15, 24],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [3, 8],
      [1, 2, 3, 4],
      [3]
    ],
    selectedVariationsIndex: 0,
    BPM: 143,
    loopBars: 4,
    formats: [
      { label: 'wav', desc: 'wav 44100Hz 16bit/s', bytesPerSecond: 0.2 },
      { label: 'mp3', desc: 'mp3 44100Hz', bytesPerSecond: 0.032 },
    ],
    selectedFormatIndex: 0,
  },
  mounted() {
    requestAnimationFrame(() => {
      draw(this.gridSideLength);
    });
  },
  computed: {
    variations() {
      return this.trackVariations[this.trackCount - 1];
    },
    selectedVariation() {
      return this.variations[this.selectedVariationsIndex];
    },
    sampleDurationInSeconds() {
      return this.loopBars * 4 * 60 / this.BPM;
    },
    format() {
      return this.formats[this.selectedFormatIndex];
    },
    permutationsCount() {
      return (this.selectedVariation + 1) ** this.trackCount;
    },
    gridSideLength() {
      return this.permutationsCount ** 0.5;
    },
    totalBytes() {
      const accurateValue = this.trackCount * this.selectedVariation * this.sampleDurationInSeconds * this.format.bytesPerSecond;
      return Math.round(accurateValue * 10) / 10;
    }
  },
  methods: {
    onVariationChange(e) {
      this.selectedVariationsIndex = e.target.value;
      requestAnimationFrame(() => {
        draw(this.gridSideLength);
      });
    },
    onFormatChange(e) {
      this.selectedFormatIndex = e.target.value;
    },
    addTrack() {
      this.selectedVariationsIndex = 0;
      this.trackCount = Math.min(this.trackVariations.length, this.trackCount + 1)
      requestAnimationFrame(() => {
        draw(this.gridSideLength);
      });
    },
    removeTrack() {
      this.selectedVariationsIndex = 0;
      this.trackCount = Math.max(1, this.trackCount - 1)
      requestAnimationFrame(() => {
        draw(this.gridSideLength);
      });
    }
  }
});

const canvas = document.getElementById('vibe-grid');
const ctx = canvas.getContext('2d');

function draw(sideLength) {
  canvas.width = canvas.width;
  const cellSize = canvas.width / sideLength;
  for (let i = 1; i < sideLength; i++) {
    ctx.fillRect(cellSize * i, 0, 1, canvas.clientHeight);
    ctx.fillRect(0, cellSize * i, canvas.clientWidth, 1);
  }
}