<template>
    <div id="reader-overlay">
        <div id="reader-popup">
            <div id="reader" ref="reader">
                <ul id="reader-container" ref="readercontainer">
                    <li class="reader-line" v-for="(line, index) in contents" :key="index">
                        <span
                                class="counter"
                                contenteditable="false"
                        >
                            {{ index }}
                        </span>
                        <div
                                :id="`content-container-${index}`"
                                class="content-container"
                                tabindex="-1"
                                :key="line"
                                v-html="line"
                                contenteditable="true"
                                @keydown="inputMovement"
                        />
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
            <kbd>i</kbd>
            <kbd>q</kbd><p class="reader-helper-text">- quit</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Reader",
        props: ['reader_mounted', 'plaintext'],
        data() {
            return {
                awaits_scroll: false,
                awaits_scroll_jump: '',
                input_mode: false,
                last_line: 0,
                status: '',
                plaintext_copy: this.plaintext.slice(0)
            }
        },

        computed: {
            contents() {
                return this.plaintext_copy.map(
                    (el) => {
                        return `<p>${el}</p>`
                    }
                )
            }

        },

        methods: {
            removeActive: function() {
                let elems = document.querySelectorAll('ul#reader-container > li');
                elems.forEach(function(value) {
                    let cls = value.getAttribute('class');
                    if (cls.includes('line-active')) {
                        value.setAttribute('class',  'reader-line');
                    }
                });
            },

            setLineActive: function(el) {
                this.removeActive();
                el.setAttribute('class', 'reader-line line-active');
            },

            memLastLine: function() {
                let elems = document.querySelectorAll('ul#reader-container > li');
                elems.forEach(function(value) {
                    let cls = value.getAttribute('class');
                    if (cls.includes('line-active')) {
                        let div = value.querySelector('div')
                        let attr = div.getAttribute('id').split('-');
                        this.last_line = attr.slice(-1)[0];
                    }
                }.bind(this));
            },

            isOnScreen: function(el) {
                let rect = el.getBoundingClientRect();

                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },

            scroll(e) {
                let top = document.querySelector('div#reader').offsetTop;
                let last_elem = document.querySelector('ul#reader-container')
                                        .lastElementChild;
                let max_pos = -last_elem.offsetTop;

                if(this.input_mode) {
                    if (e.key !== 'Escape') { return; }
                }

                if (e.key === 'i') {
                    this.input_mode = true;
                    this.status = 'input';
                    let div;

                    if(this.last_line === 0) {
                        // focus first line in reader
                        div = this.$refs.readercontainer
                                      .firstElementChild
                                      .querySelector('div');
                    } else {
                        let elems = document.querySelectorAll('ul#reader-container > li > div');
                        div = elems[this.last_line];
                    }

                    div.focus();
                    this.setLineActive(div.parentNode);

                    if (!this.isOnScreen(div.parentNode)) {
                        let top = div.parentNode.offsetTop;
                        this.$refs.reader.style.top = -top+'px';
                    }
                    e.preventDefault();
                    return;
                }

                if ('deltaY' in e) {
                    if (e.deltaY < 0) {
                        // wheel scroll up
                        if (top > 0) {
                            top = 0;
                        }
                        this.$refs.reader.style.top = (top + 24)+'px';
                    } else {
                        // wheel scroll down
                        if (top < max_pos) {
                            top = max_pos;
                        }
                        this.$refs.reader.style.top = (top - 24)+'px';
                    }
                    this.status = 'whl';
                }

                if (e.key === 'j') {
                    // scroll down
                    if (top < max_pos) {
                        top = max_pos;
                    }
                    this.$refs.reader.style.top = (top - 24)+'px';
                    this.status = e.key;
                }

                else if (e.key === 'k') {
                    // scroll up
                    if (top > 0) {
                        top = 0;
                    }
                    this.$refs.reader.style.top = (top + 24)+'px';
                    this.status = e.key;
                }

                if(e.key === 'G') {
                    // scroll to bottom
                    this.$refs.reader.style.top = max_pos+'px';
                    this.awaits_scroll = false;
                    this.status = e.key;
                }

                if(e.key === 'g') {
                    if (this.awaits_scroll_jump) {
                        let last_key = this.awaits_scroll_jump
                                       .slice(this.awaits_scroll_jump.length - 1);
                        let arr = Number(this.awaits_scroll_jump.slice(0, -1));

                        if (last_key === 'g') {
                            // jump to line (when user input is 123gg)
                            let elems = document.querySelectorAll('ul#reader-container > li');
                            try {
                                let elem = elems[arr];
                                this.$refs.reader.style.top = -elem.offsetTop+'px';
                                this.awaits_scroll_jump = '';
                                this.setLineActive(elem);
                                this.memLastLine();

                            } catch(e) {
                                // if line doesn't exist
                                this.awaits_scroll_jump = '';
                                this.status = '';
                            }
                        } else {
                            // prepare to jump on next keypress (123g + g)
                            this.awaits_scroll_jump += 'g';
                            this.status += 'g';
                        }
                        return;
                    }

                    if (this.awaits_scroll) {
                        // scroll to top if key is double pressed (gg)
                        this.$refs.reader.style.top = '0px';
                        this.awaits_scroll = false;
                        this.status += e.key;
                    } else {
                        // put first 'g' in a buffer
                        this.awaits_scroll = true;
                        this.status = e.key;
                    }
                }

                if(!isNaN(e.key)) {
                    // if key is a number, put it in buffer to jump between lines
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
                    // reset
                    this.status = '';
                    this.awaits_scroll = false;
                    this.awaits_scroll_jump = '';

                    if(this.input_mode) {
                        this.memLastLine();
                    }

                    this.input_mode = false;
                }

            },

            inputMovement(e) {
                console.log(e.key);
                if(e.key === 'Tab') {
                    e.preventDefault();
                    return;
                }
                if(e.key === 'ArrowUp') {
                    // focus previous element and scroll up
                    let div = e.target.parentNode.previousElementSibling;
                    if(div) {
                        div = div.querySelector('div');
                        setTimeout(function() {
                            div.focus();
                            this.setLineActive(div.parentNode);

                            if (!this.isOnScreen(div.parentNode)) {
                                let height = div.parentNode.offsetHeight;
                                let top = Number(this.$refs.reader.style.top.slice(0, -2));
                                top = (top + height - 6);
                                if(top > 0) { top = 0 }
                                this.$refs.reader.style.top = top+'px';
                            }

                        }.bind(this), 0);
                    }
                    return
                }

                if(e.key === 'ArrowDown') {
                    // focus next element and scroll down
                    let div = e.target.parentNode.nextElementSibling;
                    if(div) {
                        setTimeout(function() {
                            div = div.querySelector('div');
                            div.focus();
                            this.setLineActive(div.parentNode);

                            if (!this.isOnScreen(div.parentNode)) {
                                let top = div.parentNode.offsetTop;
                                top = (-top + 46);
                                if(top > 0) { top = 0 }
                                this.$refs.reader.style.top = top+'px';
                            }
                        }.bind(this), 0);
                    }
                    return
                }

                if(e.key === 'Enter') {
                    // append new element after current item in array
                    let node = document.createElement('p');
                    let active = document.activeElement;
                    let id = active.getAttribute('id')
                                   .split('-')
                                   .slice(-1)[0];
                    id = Number(id);
                    this.plaintext_copy.splice(id+1, 0, node.outerHTML);
                    setTimeout(function() {
                            let el = document.querySelector(`div#content-container-${id+1}`);
                            this.setLineActive(el.parentNode);
                            el.focus();
                            console.log('set focus')
                        }.bind(this), 0);
                    e.preventDefault();
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
.reader-line div, p {
    pointer-events: none;
}
</style>