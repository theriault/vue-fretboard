
let ariaUid = 0;

let getValues = function (values) {
	let noteValue = {
		C: 0,
		D: 2,
		E: 4,
		F: 5,
		G: 7,
		A: 9,
		B: 11,
	};
	return values.trim().toUpperCase().split(/\s+/).map((v) => {
		let accidental = ('0' + v.slice(1)).split(/(?=.)/).reduce((r, n) => r * 1 + (n === 'B' ? -1 : (n === '#' ? 1 : 0))) * 1;
		return Math.abs((noteValue[v[0]] + accidental) % 12);
	});
};

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const validColor = (color) => color.match(/^#[A-F0-9]{6}$/i);
const validNumber = (number) => number.match(/^[0-9]+([.][0-9]*)?$/);
const validNumberList = (list) => list.match(/^\s*[0-9]+(\s+[0-9]+)*\s*$/);
const validNoteList = (list) => list.match(/^\s*[A-F][#b]*(\s+[A-F][#b]*)*\s*$/);

export let fretboard = {
	props: {
		title: {
			type: String,
			default: "",
		},
		strummingHand: {
			type: String,
			default: "right",
			validator: (value) => value === 'left' || value === 'right',
		},
		orientation: {
			type: String,
			default: "horizontal",
			validator: (value) => value === 'vertical' || value === 'horizontal',
		},
		scale: {
			type: String,
			default: "C D E F G A B",
			validation: validNoteList,
		},
		tuning: {
			type: String,
			default: "G C E A",
			validation: validNoteList,
		},
		start: {
			type: Number,
			default: 0,
			validator: (v) => v >= 0 && v <= 30,
		},
		noteTextColor: {
			type: String,
			default: "#EEEEEE",
			validator: validColor,
		},
		rootTextColor: {
			type: String,
			default: "#EEEEEE",
			validator: validColor,
		},
		noteColor: {
			type: String,
			default: "#555555",
			validator: validColor,
		},
		rootColor: {
			type: String,
			default: "#880000",
			validator: validColor,
		},
		noteRadius: {
			type: Number,
			default: 12,
		},
		frets: {
			type: Number,
			default: 5,
			validator: (v) => v >= 1 && v <= 30,
		},
		fretColor: {
			type: String,
			default: '#777777',
			validator: validColor,
		},
		nutSize: {
			type: Number,
			default: 10,
		},
		fretSize: {
			type: Number,
			default: 2,
		},
		fretSpace: {
			type: String,
			default: "30",
			validator: validNumber,
		},
		strings: {
			type: Number,
			default: 4,
			validator: (v) => v >= 1 && v <= 12,
		},
		stringColor: {
			type: String,
			default: "#777777",
			validator: validColor,
		},
		stringSize: {
			type: String,
			default: "1",
			validator: validNumberList,
		},
		stringSpace: {
			type: String,
			default: "25",
			validator: validNumber,
		},
		reference: {
			type: String,
			default: "",
			validation: validNumberList,
		},
		referenceRadius: {
			type: Number,
			default: 7,
		},
		referenceColor: {
			type: String,
			default: "#777777",
			validator: validColor,
		},
	},

	computed: {

		ariaDescId: function () {
			return "dt-fretboard-desc-" + this.ariaId;
		},

		ariaDescText: function () {
			return "Scale: " + this.scale + "; Tuning: " + this.tuning;
		},

		ariaId: function () {
			return ariaUid++;
		},

		ariaIds: function () {
			return this.ariaTitleId + " " + this.ariaDescId;
		},

		ariaTitleId: function () {
			return "dt-fretboard-title-" + this.ariaId;
		},

		ariaTitleText: function () {
			return this.title;
		},

		fretsNormalized: function () {
			return Math.max(1, Math.min(30, this.frets));
		},

		fretRenderings: function () {
			let renderings = [];
			let oy = this.start == 0 ? this.noteRadius * 2 : 0;
			for (let fret = 0, length = this.fretsNormalized + 1; fret <= length; fret++) {
				let rendering = {
					height: fret == 0 && this.hasNut ? this.nutSize * 1 : this.fretSize * 1,
					width: (this.isHorizontal ? this.height : this.width) - this.noteRadius * 2,
					y: oy,
					x: this.noteRadius * 1,
					color: this.fretColor,
				};
				if (this.isHorizontal) {
					rendering = {
						height: rendering.width,
						width: rendering.height,
						y: rendering.x,
						x: rendering.y,
						color: rendering.color,
					};
					if (this.hasLeftStrummingHand) {
						rendering.x = this.width - rendering.x - rendering.width;
					}
				}
				renderings.push(rendering);
				oy += (fret == 0 && this.hasNut ? this.nutSize * 1 : this.fretSize * 1);
				oy += this.fretSpace * 1;
			}
			return renderings;
		},

		hasLeftStrummingHand: function () {
			return this.strummingHand === 'left';
		},

		hasNut: function () {
			return this.startNormalized <= 1;
		},

		isHorizontal: function () {
			return this.orientation === 'horizontal';
		},

		referenceRendering: function () {
			if (!(this.reference + '').length) {
				return [];
			}
			let neck = {};
			let referenceDots = this.reference.trim().split(/\s+/);
			referenceDots.forEach(function (referenceDot) {
				if (!neck.hasOwnProperty(referenceDot)) {
					neck[referenceDot] = 0;
				}
				++neck[referenceDot];
			});

			let ox = 0;
			let oy = 0;
			let renderings = [];
			Object.entries(neck).forEach((referenceDot) => {
				if (referenceDot[0] < this.startNormalized || referenceDot[0] > (this.frets - this.startNormalized)) return;
				for (let dot = 0; dot < referenceDot[1]; ++dot) {
					let rendering = {};
					rendering.radius = this.referenceRadius * 1;
					rendering.fill = this.referenceColor;
					let mid = Math.floor(this.strings / 2);
					rendering.cx = 1
							+ (mid > 0 ? this.stringSizeNormalized.slice(0, mid ).reduce((r, n) => r + n) : 0)
							+ this.stringSpace * (mid - 0.5)
							+ this.noteRadius / 2
							+ this.referenceRadius / 2
							+ ox;
					if (referenceDot[1] > 1) {
						rendering.cx += (this.stringSizeNormalized[mid + (dot === 0 ? -1 : 0)] + this.stringSpace * 1) * (dot === 0 ? -1 : 1);
					}
					let cy = 0;
					if (this.startNormalized === 0) cy += this.noteRadius * 2;
					let offset = referenceDot[0] - (this.startNormalized || 1);
					cy += this.hasNut ? this.nutSize * 1 : this.fretSize * 1;
					cy += this.fretSize * offset;
					cy += this.fretSpace * offset;
					cy += this.fretSpace / 2;
					rendering.cy = cy;
					renderings.push(rendering);
					if (this.isHorizontal) {
						let temp = rendering.cx;
						rendering.cx = rendering.cy;
						rendering.cy = temp;
						if (this.hasLeftStrummingHand) {
							rendering.cx = this.width - rendering.cx;
						}
					}
				}
			});
			return renderings;
		},

		scaleInfo: function () {
			if (!this.scaleNormalized.length || !this.tuningNormalized.length) {
				return [];
			}

			let renderings = [];
			let start = this.startNormalized;
			let frets = this.fretsNormalized;
			let ox = 0;
			for (let string = 0; string < this.stringsNormalized; ++string) {
				let oy = start > 0 ? (start === 1 ? this.nutSize : this.fretSize) * 1 : 0;
				for (let fret = start; fret <= frets; ++fret) {
					let rendering = {};
					rendering.x = ox
						+ (this.stringSizeNormalized[string] / 2)
						+ (this.noteRadius * 1);
					let value = (fret + this.tuningNormalized[string]) % 12;
					let index = this.scaleNormalized.indexOf(value);
					if (~index) {
						let ny = fret === 0 ? this.noteRadius * 1 : this.fretSpace / 2;
						rendering.y = oy + ny;
						rendering.fret = fret;
						rendering.note = noteNames[value];
						rendering.color = index === 0 ? this.rootColor : this.noteColor;
						rendering.textColor = index === 0 ? this.rootTextColor : this.noteTextColor;
						if (this.isHorizontal) {
							let temp = rendering.x;
							rendering.x = rendering.y;
							rendering.y = temp;
							if (this.hasLeftStrummingHand) {
								rendering.x = this.width - rendering.x;
							}
						}
						renderings.push(rendering);
					}
					if (fret === 0) {
						oy += this.noteRadius * 2 + this.nutSize * 1;
					} else {
						oy += this.fretSpace * 1 + this.fretSize * 1;
					}
				}
				ox += this.stringSpace * 1 + this.stringSizeNormalized[string];
			}
			return renderings;
		},

		scaleNormalized: function () {
			let noteValue = {
				C: 0,
				D: 2,
				E: 4,
				F: 5,
				G: 7,
				A: 9,
				B: 11,
			};
			let accidental = {
				B: -1,
				'#': 1,
				'': 0,
			};
			let v = this.scale.trim().toUpperCase();
			let m = null;
			if (m = v.match(/^([a-g])([#b]?)\s*(major|minor|acoustic|aeolian|ionian|dorian|algerian|locrian|lydian|major pentatonic|minor pentatonic|mixolydian|phrygian)$/i)) {
				let intervals = {
					'MAJOR': [0,2,2,1,2,2,2,1],
					'MINOR': [0,2,1,2,2,1,2,2],
					'ACOUSTIC': [0,2,2,2,1,2,1,2],
					'AEOLIAN': [0,2,1,2,2,1,2,2],
					'ALGERIAN': [0,2,1,3,1,1,3,1,2,1,2],
					'DORIAN': [0,2,1,2,2,2,1,2],
					'IONIAN': [0,2,2,1,2,2,2,1],
					'LOCRIAN': [0,1,2,2,1,2,2,2],
					'LYDIAN': [0,2,2,2,1,2,2,1],
					'MAJOR PENTATONIC': [0,2,2,3,2,3],
					'MINOR PENTATONIC': [0,3,2,2,3,2],
					'MIXOLYDIAN': [0,2,2,1,2,2,1,2],
					'PHRYGIAN': [0,1,2,2,2,1,2,2],
				};
				let notes = [];
				for (let i = 0, k = 0, l = intervals[m[3]].length; i < l; ++i) {
					k += intervals[m[3]][i];
					notes.push((noteValue[m[1]] + accidental[m[2]] + k) % 12);
				}
				return notes;
			} else {
				return getValues(this.scale);
			}
		},

		scaleRendering: function () {
			return this.scaleInfo.map((rendering) => {
				return ({
					radius: this.noteRadius,
					cx: rendering.x,
					cy: rendering.y,
					fill: rendering.fret === 0 ? "transparent" : rendering.color,
					stroke: rendering.fret === 0 ? rendering.color : "transparent",
				});
			});
		},

		scaleText: function () {
			return this.scaleInfo.map((rendering) => {
				return ({
					text: rendering.note,
					x: rendering.x,
					y: rendering.y,
					fill: rendering.fret === 0 ? rendering.color : rendering.textColor,
				});
			});
		},

		startNormalized: function () {
			if (!this.start) return 0;
			let v = Math.max(0, Math.min(30, this.start * 1));
			if ((this.fretsNormalized - v) < 1) return this.fretsNormalized;
			return v;
		},

		stringsNormalized: function () {
			return this.strings;
		},

		stringRenderings: function () {
			let renderings = [];
			let ox = this.noteRadius * 1;
			let oy = this.start == 0 ? this.noteRadius * 2 : 0;
			let height = (this.isHorizontal ? this.width : this.height) - (this.start == 0 ? this.noteRadius * 2 : 0);
			for (let string = 0; string < this.stringsNormalized; ++string) {
				let rendering = {
					x: ox,
					y: oy,
					height: height,
					width: this.stringSizeNormalized[string],
					color: this.stringColor,
				};
				if (this.isHorizontal) {
					rendering = {
						x: rendering.y,
						y: rendering.x,
						width: rendering.height,
						height: rendering.width,
						color: rendering.color,
					};
					if (this.hasLeftStrummingHand) {
						rendering.x = this.width - rendering.x - rendering.width;
					}
				}
				renderings.push(rendering);
				ox += this.stringSizeNormalized[string] + this.stringSpace * 1;
			}
			return renderings;
		},

		stringSizeNormalized: function () {
			let strings = [];
			let stringSizes = (this.stringSize + '').split(/[,\s]+/).filter((v) => v.match(/^[0-9]+([.][0-9]+)?$/));
			if (!stringSizes.length) stringSizes.push(1);
			for (let i = 0; i < this.stringsNormalized; i++) {
				strings.push(stringSizes.length > 1 ? stringSizes.shift() * 1 : stringSizes[0] * 1);
			}
			if (this.isHorizontal || this.hasLeftStrummingHand) {
				strings.reverse();
			}
			return strings;
		},

		tuningNormalized: function () {
			let tuning = getValues(this.tuning).reverse();
			if (!this.isHorizontal && !this.hasLeftStrummingHand) {
				return tuning.reverse();
			} else {
				return tuning;
			}
		},

		widthHeight: function () {
			let height = 0;
			if (this.hasNut) {
				height += this.nutSize * 1;
				if (this.start == 0) height += this.noteRadius * 2;
			} else {
				height += this.fretSize * 1;
			}
			let frets = this.fretsNormalized - Math.max(0, this.startNormalized - 1);
			height += frets * this.fretSpace;
			height += this.fretSize * frets

			let width = this.noteRadius * 2;
			width += ((this.stringsNormalized - 1) * this.stringSpace);
			for (let i = 0, l = this.stringSizeNormalized.length; i < l; i++) {
				width += this.stringSizeNormalized[i];
			}

			return {
				width: this.isHorizontal ? height : width,
				height: this.isHorizontal ? width : height,
			};
		},

		height: function () {
			return this.widthHeight.height;
		},

		width: function () {
			return this.widthHeight.width;
		},

		svgViewBox: function () {
			return `0 0 ${this.width} ${this.height}`;
		},

		svgStyle: function () {
			return `width:${this.width}px;height:${this.height}px;`;
		},
	},
	template: `
	<svg role="img" :aria-labelledby="ariaIds" :viewBox="svgViewBox" :style="svgStyle">
		<title :id="ariaTitleId">{{ariaTitleText}}</title>
		<desc :id="ariaDescId">{{ariaDescText}}</desc>
		<template v-for="ref in referenceRendering">
			<circle role="presentation" :cx="ref.cx" :cy="ref.cy" :r="ref.radius" :stroke="ref.stroke" :fill="ref.fill" />
		</template>
		<template v-for="fret in fretRenderings">
			<rect role="presentation" :x="fret.x" :y="fret.y" :height="fret.height" :width="fret.width" :fill="fret.color" />
		</template>
		<template v-for="string in stringRenderings">
			<rect role="presentation" :x="string.x" :y="string.y" :height="string.height" :width="string.width" :fill="string.color" />
		</template>
		<template v-for="note in scaleRendering">
			<circle role="presentation" :cx="note.cx" :cy="note.cy" :r="note.radius" :stroke="note.stroke" :fill="note.fill" />
		</template>
		<template v-for="text in scaleText">
			<text text-anchor="middle" dominant-baseline="middle" :x="text.x" :y="text.y" :fill="text.fill">{{text.text}}</text>
		</template>
	</svg>
	`
};