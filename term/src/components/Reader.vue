<template>
    <div id="reader-overlay">
        <div id="reader-popup">
            <div id="reader" ref="reader">
                <ul id="reader-container" ref="readercontainer">
                    <li class="reader-line"
                         tabindex="-1"
                         v-for="line in contents"
                         :key="line"
                         v-html="line">
                    </li>
                </ul>
            </div>
        </div>
        <div id="reader-helper">
            <p class="reader-helper-text">[{{ status }}] </p>
            <p class="reader-helper-text">You are in Vi mode</p>
            <kbd>gg</kbd>
            <kbd>G</kbd>
            <kbd>j</kbd>
            <kbd>k</kbd>
            <kbd>q</kbd><p class="reader-helper-text">- quit</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Reader",
        //props: ['contents'],
        props: ['reader_mounted'],
        data() {
            return {
                rawcontents: Array.from({length: 240}, () => '<p>'+Math.floor(Math.random() * 240)+'</p>'),
                awaits_scroll: false,
                awaits_scroll_jump: '',
                status: ''
            }
        },

        computed: {
            contents: function () {
                let copy = [...this.rawcontents];
                this.rawcontents.forEach(function(value, index) {
                    copy[index] = `<span class="counter">${index}</span>` + String(value);
                });
                return copy;
            }
        },

        methods: {
            scroll(e) {
                let top = document.querySelector('div#reader').offsetTop;
                let last_elem = document.querySelector('ul#reader-container')
                                        .lastElementChild;
                let max_pos = -last_elem.offsetTop;

                if ('deltaY' in e) {
                    if (e.deltaY < 0) {
                        // scroll up
                        console.log('up');
                        if (top > 0) {
                            top = 0;
                        }
                        this.$refs.reader.style.top = (top + 24)+'px';
                    } else {
                        // scroll up
                        if (top < max_pos) {
                            top = max_pos;
                        }
                        this.$refs.reader.style.top = (top - 24)+'px';
                    }
                    this.status = 'whl';
                }

                if (e.key === 'j') {
                    if (top < max_pos) {
                        top = max_pos;
                    }
                    this.$refs.reader.style.top = (top - 24)+'px';
                    this.status = e.key;
                }

                else if (e.key === 'k') {
                    if (top > 0) {
                        top = 0;
                    }
                    this.$refs.reader.style.top = (top + 24)+'px';
                    this.status = e.key;
                }

                if(e.key === 'G') {
                    this.$refs.reader.style.top = max_pos+'px';
                    this.awaits_scroll = false;
                    this.status = e.key;
                }

                let removeActive = function(elems) {
                    elems.forEach(function(value) {
                        let cls = value.getAttribute('class');
                        if (cls.includes('line-active')) {
                            value.setAttribute('class',  'reader-line');
                        }
                    });
                }

                if(e.key === 'g') {
                    if (this.awaits_scroll_jump) {
                        let last_key = this.awaits_scroll_jump
                                       .slice(this.awaits_scroll_jump.length - 1);
                        let arr = Number(this.awaits_scroll_jump.slice(0, -1));

                        if (last_key === 'g') {
                            // jump to line
                            let elems = document.querySelectorAll('ul#reader-container > li');
                            try {
                                let elem = elems[arr];
                                this.$refs.reader.style.top = -elem.offsetTop+'px';
                                this.awaits_scroll_jump = '';

                                removeActive(elems);

                                elem.setAttribute('class', 'reader-line line-active');
                            } catch(e) {
                                // if line doesn't exist
                                this.awaits_scroll_jump = '';
                                this.status = '';
                            }
                        } else {
                            // prepare to jump on next keypress
                            this.awaits_scroll_jump += 'g';
                            this.status += 'g';
                        }
                        return;
                    }

                    if (this.awaits_scroll) {
                        this.$refs.reader.style.top = '0px';
                        this.awaits_scroll = false;
                        this.status += e.key;
                    } else {
                        this.awaits_scroll = true;
                        this.status = e.key;
                    }
                }

                if(!isNaN(e.key)) {
                    if (!this.awaits_scroll_jump) {
                        if (this.status) {
                            this.status = '';
                            this.awaits_scroll = false;
                        }
                    }
                    this.status += e.key;
                    this.awaits_scroll_jump += e.key;
                }

                if(e.key === 'q') {
                    document.removeEventListener("keydown", this.scroll, true);
                    document.removeEventListener("wheel", this.scroll, true);
                    this.$emit('reader_mounted', false);
                }

                if (e.key === 'Escape') {
                    this.status = '';
                    this.awaits_scroll = false;
                    this.awaits_scroll_jump = '';

                    let elems = document.querySelectorAll('ul#reader-container > li');
                    removeActive(elems);

                }

            }
        },

        mounted() {
            document.addEventListener("keydown", this.scroll, true);
            document.addEventListener("wheel", this.scroll, true);
        },

    }
</script>

<style scoped>

</style>