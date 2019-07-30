import * as Raw from '/css/raw.js';

var shell_history = []

let commands = [
    {
        "name": "list directories",
        "command": "ls",
        "help": `lists directories.\n\nusage:\nls`,
        "exec": listDirectory
    },
    {
        "name": "change directory",
        "command": "cd",
        "help": `changes directory.\n\nusage:\ncd .\ncd ..\ncd ~/`,
        "exec": changeDirectory
    },
    {
        "name": "concatenate",
        "command": "cat",
        "help": `outputs text file.\n\nusage:\ncat [file]\ncat links`,
        "exec": cat
    },
    {
        "name": "whoami",
        "command": "whoami",
        "help": `displays current user.\n\nusage:\nwhoami`,
        "exec": whoami
    },
    {
        "name": "groups",
        "command": "groups",
        "help": `displays list of groups.\n\nusage:\ngroups`,
        "exec": groups
    },
    {
        "name": "hostname",
        "command": "hostname",
        "help": `displays hostname.\n\nusage:\nhostname`,
        "exec": hostname
    },
    {
        "name": "hex code -> rgb",
        "command": "hextorgb",
        "help": `converts hex code to RGB value.\n\nusage:\nhextorgb [hex code]\nhextorgb #00000`,
        "exec": hextorgb
    },
    {
        "name": "echo line",
        "command": "echo",
        "help": `echo - displays a line of text.\n\nusage:\necho [string]\n
base64 encoding: echo [string] | base64
base64 decoding: echo [string] | base64 -d\n
rot13 encoding: echo [string] | rot13
rot13 decoding: echo [string] | rot13 -d`,
        "exec": echo
    },
    {
        "name": "get host by name",
        "command": "host",
        "help": `returns ip of specified domain.\n\nusage:\nhost [domain]\nhost google.com`,
        "callback": true,
        "exec": host
    },
    {
        "name": "get weather",
        "command": "weather",
        "help": `returns weather for specified city.\n\nusage:\nweather [city]\nweather Luhansk`,
        "callback": true,
        "exec": weather
    },
    {
        "name": "encode image",
        "command": "encode",
        "help": `encodes red channel's Least Significant Bits of specified image with your message.\n
usage:\nencode [message]\nencode message desu.`,
        "callback": true,
        "exec": encode
    },
    {
        "name": "decode image",
        "command": "decode",
        "help": `decodes red channel's Least Significant Bits of specified image and returns hidden message.\n
usage:\ndecode`,
        "callback": true,
        "exec": decode
    },
    {
        "name": "convert image",
        "command": "imgconvert",
        "help": `converts image to specified format.\nusage: imgconvert [format to convert]\n
Formats supported: png, jpg, jpeg, webp, gif`,
        "callback": true,
        "exec": imgconvert
    },
    {
        "name": "convert webpage to pdf",
        "command": "htmltopdf",
        "help": `converts webpage to pdf.\nusage: imgconvert [website]`,
        "callback": true,
        "exec": htmltopdf
    },
    {
        "name": "type help [command] to get detailed command usage.",
        "command": "help",
        "help": "shows help. Unexpected, huh?",
        "exec": help
    }
]

function help(params) {
    let msg = ""
    if(params.slice(1).length == 0) {
        commands.forEach(function(item) {
            msg += item.command + ': ' + item.name + '\n';
        })
        msg += "\nEsc: set/unset focus\n^L: clear terminal\n^C: cancel\nArrow up: navigate through history";
        return msg;
    } else {
        let command = params[1];
        commands.forEach(function(item) {
            if(item.command == command) {
                msg = item.help;
                return msg;
            }
        })
    }
    return msg;
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}  

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name) {
    document.cookie = name;
}

async function greeting() {
    let par = document.createElement("p");

    let screen = document.getElementById("screen");
    screen.appendChild(par);

    // iterate through boot sequence list with random delays
    if(getCookie('boot') != 'true') {
        for (let i=0; i<Raw.boot_sequence.length; i++) {
            await sleep(Math.floor(Math.random() * 40));
            par.innerHTML += Raw.boot_sequence[i] + '\n';
            window.scrollTo(0,document.body.scrollHeight);
        }
    await sleep(1220);
    }
    // message = actual greeting message
    par.innerHTML += Raw.message;
    par.innerHTML += '<p class="image">'+'</p>';
    window.scrollTo(0,document.body.scrollHeight);

    setCookie("boot=true");
    return new String("done")
}

function apiCall(params, callback) {
    // params = {
    // "req": command,
    // "args": args }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api', true);
    xhr.onload = function() {
        callback(xhr.responseText);
    };
    let data = new FormData();
    Object.keys(params).forEach(function(key) {
        data.append(key, params[key]);
    })
    xhr.send(data);
}

function imgconvert(args) {
    let format = args[1];
    let extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    if(!format) { 
        display_error(`you haven't specified format to convert your image to.\nusage: imgconvert [${extensions.join('|')}]`); 
    } else if (!extensions.includes(format)) {
        display_error(`looks like extension you provided is invalid. Available formats: ${extensions}`);
    } else {
        interrupt(args);
    }
}

function htmltopdf(args, callback) {
    let website = args[1];
    if(!website) { callback(`htmltopdf: please, specify a website.`); }
    else {
        let history = document.createElement("p");
        history.innerHTML = `Processing link...`;
        history.setAttribute("class", "inline-output");
        let screen = document.getElementById("screen");
        screen.appendChild(history);  
        apiCall({ req: 'htmltopdf', args: args[1]}, function(response) {
            history.outerHTML = '';
            callback(response);
        });
    }
}

function encode(args) {
    if(args.slice(1).length == 0 || !args.slice(1).join(' ').trim()) {
        display_error("your message is empty.\nusage: encode [your message]");
    } else {
        interrupt(args);
    }  
}

function decode(args) {
    interrupt(args);
}

function getSubmit(params, event) {
    // gets submit event, extracts values, makes apiCall
    event.preventDefault();
    let output = document.getElementById('plain');
    let type = params[0];
    params = params.slice(1);
    let form = document.getElementById(type);
    let tg = form.getElementsByTagName('input');
    let file = tg[0].files[0];

    if(type === 'encode') { params = params.join(' ') }
    if(!params) { output.innerHTML = "<span class='hg-fail'>error:</span> your message is empty.\nusage: encode [your message]" }

    if(file) {
        apiCall({ req: `${type}`, args: params, file: file }, async function(response) {
            output.innerHTML = response;
            await sleep(200);
            window.scrollTo(0,document.body.scrollHeight);
        })
    }
}

function interrupt(args) {
    // creates a <div> that contains upload form with type given
    // e.g 'encode'
    let type = args[0];
    // type = 'encode', 'decode', etc

    let window = document.createElement("div");
    window.setAttribute("id", "interrupt");

    let screen = document.getElementById("screen");
    screen.appendChild(window);
    let header = document.createElement("p");
    header.setAttribute("class", "plain");
    header.innerHTML = "upload your file (^C to exit):";
    let br = document.createElement("br");
    let form = document.createElement("form");

    form.setAttribute("id", type);

    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("action", "#");

    form.addEventListener('submit', getSubmit.bind(null, args));

    let btn_wrapper = document.createElement("div");
    btn_wrapper.setAttribute("class", "btn-wrapper");
    let btn_upload_wrapper = document.createElement("div");
    btn_upload_wrapper.setAttribute("class", "btn-wrapper");
    let button = document.createElement("button");
    button.innerHTML = "Browse";
    let button_upload = document.createElement("button");
    button_upload.innerHTML = "Upload";
    button.setAttribute("class", "btn");
    button_upload.setAttribute("class", "btn");
    let input_o = document.createElement("input");
    input_o.setAttribute("type", "file");
    input_o.setAttribute("name", "file");
    let input_t = document.createElement("input");
    input_t.setAttribute("type", "submit");
    input_t.setAttribute("value", "Upload");
    btn_wrapper.appendChild(button);
    btn_wrapper.appendChild(input_o);
    btn_upload_wrapper.appendChild(button_upload);
    btn_upload_wrapper.appendChild(input_t)
    form.appendChild(btn_wrapper);
    form.appendChild(btn_upload_wrapper);

    window.appendChild(header);
    window.appendChild(br);
    window.appendChild(form);
    
    let output = document.createElement("p");
    output.setAttribute("id", "plain");
    window.appendChild(output);
}

function weather(args, callback) {
    let city = args.slice(1).join(' ');
    if(!city) { callback("weather: please, specify your city.")}
    else {
        apiCall({ req: "weather", args: city }, function(response) {
            callback(response);
        });
    }
}

function host(args, callback) {
    let website = args[1];
    if(!website) { callback("host: please, specify a website.") }
    else {
        apiCall({ req: "host", args: website }, function(response) {
            callback(response);
        });
    }
}

function hextorgb(args) {
    //https://github.com/30-seconds/30-seconds-of-code#hextorgb-
    let hex = args[1];
    if(!hex) { return "hextorgb: please, specify hex code: hextorgb #000000" }
    let alpha = false,
        h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) h = [...h].map(x => x + x).join('');
    else if(h.length === 8) alpha = true;
    h = parseInt(h, 16);
    return (
        'rgb' +
        (alpha ? 'a' : '') +
        '(' +
        (h >>> (alpha ? 24 : 16)) +
        ', ' +
        ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
        ', ' +
        ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
        (alpha ? `, ${h & 0x000000ff}` : '') +
        ')'
    );
}

function echo(args) {
    let index = args.length - 1;
    let pipe = undefined;
    let string = args.slice(1).join(' ');
    let enc = undefined;
    for(; index >= 0; index--) {
        if(args[index] === 'base64') {
            enc = 'base64';
            pipe = args.slice(index-1);
            string = args.slice(1, index-1).join(' ');
        } else if(args[index] === 'rot13') {
            enc = 'rot13';
            pipe = args.slice(index-1);
            string = args.slice(1, index-1).join(' ');
        }

    }
    if(pipe && enc === 'base64') {
        try {
        if(pipe.includes('-d')) {
            return decodeURIComponent(atob(string).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
        else {
            return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
            }));
        }
        } catch(URIError) {
            return "None";
        }
    } else if(pipe && enc === 'rot13') {
        let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        let beta = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklmМНОПРСТУФХЦЧШЩЪЫЬЭЮЯАБВГДЕЁЖЗИЙКЛмнопрстуфхцчшщъыьэюяабвгдеёжзийкл';
        if(pipe.includes('-d')) {
            // https://codereview.stackexchange.com/a/132140
            var input = beta;
            var output = alpha;
        } else {
            var input = alpha;
            var output = beta;
        }
        let index = x => input.indexOf(x);
        let translate = x => index(x) > -1 ? output[index(x)] : x;
        return string.split('').map(translate).join('');
    }
    return string;

}

function whoami() {
    return Raw.user;
}

function groups(args) {
    let user = args[1];
    if(!user) { return Raw.groupsls.join(' ') }
    let msg = "";
    Raw.groupsls.forEach(function(item) {
        if(item == user) {
            msg = item;
            return msg;
        }
    })
    return msg;
}

function hostname() {
    return Raw.user_hostname;
}

function listDirectory() {
    let directories = "..";
    Raw.hierarchy.forEach(function(item) {
        if(item.current && !item.filedata) { item.command = "." }
        directories += '	' + item.command;
    })
    return directories;
}

function changeDirectory(args) {
    let new_dir = args[1];
    if(!new_dir) { new_dir = "." }
    let msg = "";
    new_dir = new_dir.replace('~', `/home/${Raw.user}/`)
    Raw.hierarchy.forEach(function(item) {
        if(new_dir == item.name) {
            if(item.filedata) {
                msg = `cd: not a directory: ${new_dir}`;
                return msg;
            }
        }
        else if(new_dir == ".") {
            msg = " ";
            return msg;
        }
        else if(new_dir == "..") {
            let path = ""
            Raw.hierarchy.forEach(function(item) {
                if(item.current) {
                    if(item.parent) {
                        path = item.parent;
                    }
                }
                if(path == item.name) {
                    item.current = true;
                    return item;
                }
            })
        }
        msg = " ";
    })
    if (!msg) {
        Raw.hierarchy.forEach(function(item) {
            item.current = false;
        })
        Raw.hierarchy.forEach(function(item) {
            if(new_dir == item.name) {
                item.current = true;
                return item;
            }
        })
        msg = " ";
    }
    return msg;
}

function cat(args) {
    let file = args[1];
    if(!file) { return "cat: cat. Cat?"} else if(file === '.' || file === '..' || file === '~/') {
        return `cat: ${file}: is a directory.`;
    }
    let counter = 0;
    let msg = "";
    Raw.hierarchy.forEach(function(item) {
        if(file == item.name) {
            if(item.filedata) {
                msg = item.filedata;
                return msg;
            } else {
                msg = `cat: ${file}: is a directory.`;
                return msg;
            }
        } else {
            counter++;
        }
    })
    if(Object.keys(Raw.hierarchy).length == counter) { return `${file}: No such file or directory (os error 2)`; }
    return msg;
}

function evaluate(value, callback) {
    let result = undefined;
    let values = value.split(" ");
    let counter = 0;
    commands.forEach(function(item) {
        if(item.command == values[0]) {
            if(item.callback) {
                item.exec(values, function(response) {
                    callback(response);
                })
            } else {
                let response = item.exec(values);
                callback(response);
            }
        } else {
            counter++;
        }
    })
    if(Object.keys(commands).length == counter) { callback(`marisa-term: command not found: ${value}`)}
}

function get_key_press(element, event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        let val = element.value;
        let history = document.createElement("p");
        history.innerHTML = val;
        history.setAttribute("class", "inline");
        element.parentElement.appendChild(history);

        let output = document.createElement("p");
        output.setAttribute("class", "inline-hidden");

        if(val) {
            if(shell_history.length <= 25 && val) {
                shell_history.push(val);
            } else {
                shell_history.shift();
                shell_history.push(val);
            }

            evaluate(val, async function(response) {
                if(response.trim()) {
                    output.innerHTML = response;
                    output.setAttribute("class", "inline-output");
                    val = undefined;
                    window.scrollTo(0,document.body.scrollHeight);
                }
                get_prompt();         
            });
        } else { get_prompt(); }

        element.parentNode.appendChild(output);
        element.outerHTML = "";   

        window.scrollTo(0,document.body.scrollHeight);
    }
}

function display_error(message) {
    let history = document.createElement("p");
    history.innerHTML = `<span class='hg-fail'>error:</span> ${message}</span>`;
    history.setAttribute("class", "inline-output");
    let screen = document.getElementById("screen");
    screen.appendChild(history);  
    get_prompt();
}

function auto_grow(event) {
    event.target.style.height = "5px";
    event.target.style.height = (event.target.scrollHeight)+"px";
}

function get_prompt(prompt_message) {
    Raw.hierarchy.forEach(function(item) {
        if(item.current == true) {
            prompt_message = `[${item.name.replace(`/home/anon/`, "~")}] 良い `;
        }
    })
    let container = document.createElement("div");
    container.setAttribute("class", "container");

    let user = document.createElement("p");
    user.innerHTML = prompt_message;
    user.setAttribute("class", "inline-pre")

    let inp = document.createElement("textarea");
    inp.setAttribute("type", "text");
    inp.setAttribute("id", "shell");
    inp.setAttribute("rows", 1);
    inp.addEventListener("keydown", function(event) {
        get_key_press(this, event);
    });
    inp.addEventListener("input", event => { auto_grow(event); } );
    
    let screen = document.getElementById("screen");

    container.appendChild(user);
    container.appendChild(inp);
    screen.appendChild(container);
    inp.focus();
    window.scrollTo(0,document.body.scrollHeight);
}

document.addEventListener("keydown", global_hotkeys, false);

function global_hotkeys(event) {
    if(event.keyCode == 27) {
        // esc
        let inp = document.getElementById("shell");
        inp.focus();
    }
    if(event.ctrlKey && event.keyCode == 76) { 
        // ctrl+l
        let screen = document.getElementById("screen");
        screen.innerHTML = "";
        greeting();
        get_prompt();
        event.preventDefault(); 
    }
    if(event.keyCode == 38) {
        // arrow up
        let value = shell_history[shell_history.length - 1]
        if(value) {
            document.getElementById("shell").value = value;
        }
        shell_history.pop();
        shell_history.unshift(value);
        event.preventDefault(); 
    }
    if(event.ctrlKey && event.keyCode == 67) {
        // ctrl+c
        try {
            let val = document.getElementById("shell");
            let container = val.parentElement;

            let history = document.createElement("p");
            history.innerHTML = val.value;
            history.setAttribute("class", "inline");
            container.appendChild(history);

            document.getElementById("shell").outerHTML = "";
            get_prompt();
        }
        catch(TypeError) {
            // val is null == interrupt is present
            let form = document.getElementById("interrupt");
            let container = form.parentElement;
            form.outerHTML = "";

            let history = document.createElement("p");
            let vala = form.lastChild;
            history.innerHTML = vala.innerHTML ? vala.innerHTML + `\n^C` : '^C';

            history.setAttribute("class", "inline-output");
            container.appendChild(history);

            get_prompt();
        }
        event.preventDefault(); 
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    greeting().then(function() {
        get_prompt();
    })
 }, false);