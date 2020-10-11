# Vue Fretboard

Vue Fretboard is a customizable component for making fretboards for guitars,
ukuleles, basses, etc.

# Example Usage

See [kitchen-sink.html](https://theriault.github.io/vue-fretboard/kitchen-sink.html) for all options available.

```
<script type="module">
import {fretboard} from '/v-fretboard.js';

// override defaults for all instances
fretboard.props.frets.default = 4;
fretboard.props.reference.default = '3 5 7 9 12';
fretboard.props.tuning.default = 'E A D G B E';
fretboard.props.strings.default = 6;
fretboard.props.orientation.default = 'vertical';

let app = Vue.createApp({});
app.component('v-fretboard', fretboard);
app.mount('#app');
</script>

<section id="app">
    <v-fretboard scale="C E G" title="C Major"></v-fretboard>
    <v-fretboard scale="A C E" title="A Minor"></v-fretboard>
</section>
```

# Available Attributes

- `scale`: individual notes separated by a space or a preprogrammed scale such
  as `C# Major` or `A Aeolian` (default: `C D E F G A B`)
- `tuning`: individual notes separated by a space (default: `G C E A`)
- `orientation`: either `horizontal` or `vertical` (default: `horizontal`)
- `strumming-hand`: either `right` or `left` (default: `right`)
- `frets`: number of frets to display (default: `5`)
- `start`: which fret to start on or 0 for open (default: `0`)
- `nut-size`: width of the nut (default: `10`)
- `fret-size`: width of each fret (default: `2`)
- `fret-space`: amount of space between each fret (default: `30`)
- `fret-color`: color of the frets (default: `#777777`)
- `strings`: number of strings (default: `4`)
- `string-size`: width of each string. enter one or more space separated values (default: `1`)
- `string-space`: amount of space between each string (default: `25`)
- `string-color`: color of the strings (default: `#777777`)
- `note-radius`: radius of each note circle (default: `12`)
- `note-color`: fill color of each note that is not a root note (default: `#555555`)
- `root-color`: fill color of each root note (default: `#880000`)
- `note-text-color`: text color on each note that is not a root note (default: `#EEEEEE`)
- `root-text-color`: text color on each root notes (default: `#EEEEEE`)
- `reference`: zero or more space separated reference dots to show on the neck. enter a number twice to get two dots (default: `5 7 10 12 12 15`)
- `reference-radius`: size of each reference dot (default: `5`)
- `reference-color`: fill color of reference dots (default: `#777777`)
