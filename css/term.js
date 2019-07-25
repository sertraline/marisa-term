
shell_history = []

let commands = [
    {
        "name": "list directories",
        "command": "ls",
        "help": `lists directories.\nusage: ls`,
        "exec": listDirectory
    },
    {
        "name": "change directory",
        "command": "cd",
        "help": `changes directory.\nusage: cd .\ncd ..\ncd ~/`,
        "exec": changeDirectory
    },
    {
        "name": "concatenate",
        "command": "cat",
        "help": `outputs text file.\nusage: cat [file]\ncat links`,
        "exec": cat
    },
    {
        "name": "whoami",
        "command": "whoami",
        "help": `displays current user.\nusage: whoami`,
        "exec": whoami
    },
    {
        "name": "groups",
        "command": "groups",
        "help": `displays list of groups.\nusage: groups`,
        "exec": groups
    },
    {
        "name": "hostname",
        "command": "hostname",
        "help": `displays hostname.\nusage: hostname`,
        "exec": hostname
    },
    {
        "name": "hex code -> rgb",
        "command": "hextorgb",
        "help": `converts hex code to RGB value.\nusage: hextorgb [hex code]\nhextorgb #00000`,
        "exec": hextorgb
    },
    {
        "name": "get host by name",
        "command": "host",
        "help": `returns ip of specified domain.\nusage: host [domain]\nhost google.com`,
        "callback": true,
        "exec": host
    },
    {
        "name": "get weather",
        "command": "weather",
        "help": `returns weather for specified city.\nusage: weather [city]\nweather Luhansk`,
        "callback": true,
        "exec": weather
    },
    {
        "name": "encode image",
        "command": "encode",
        "help": `encodes specified image red channel's Least Significant Bit with your message.
usage: encode [message]\nencode watashi wa coolhacker desu.`,
        "callback": true,
        "exec": encode
    },
    {
        "name": "decode image",
        "command": "decode",
        "help": `decodes specified image red channel's Least Significant Bit and returns hidden message.
usage: decode`,
        "callback": true,
        "exec": decode
    },
    {
        "name": "show help",
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
        for (let i=0; i<boot_sequence.length; i++) {
            await sleep(Math.floor(Math.random() * 40));
            par.innerHTML += boot_sequence[i] + '\n';
            window.scrollTo(0,document.body.scrollHeight);
        }
    await sleep(1220);
    }
    // message = actual greeting message
    par.innerHTML += message;
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

function encode(args) {
    interrupt(args);
}

function decode(args) {
    interrupt(args);
}

function getSubmit(params, event) {
    // gets submit event, extracts values, makes apiCall
    event.preventDefault();
    let output = document.getElementById('plain');
    let type = params[0];
    let form = document.getElementById(type);
    let tg = form.getElementsByTagName('input');
    file = tg[0].files[0];

    if(type === 'encode') { params = params.slice(1).join(' ') }
    if(!params) { output.innerHTML = "Your message is empty. Usage: encode [your message]" }

    if(file) {
        response = apiCall({ req: `${type}`, args: params, file: file }, async function(response) {
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
        response = apiCall({ req: "weather", args: city }, function(response) {
            callback(response);
        });
    }
}

function host(args, callback) {
    let website = args[1];
    if(!website) { callback("host: please, specify a website.") }
    else {
        response = apiCall({ req: "host", args: website }, function(response) {
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

function whoami() {
    return user;
}

function groups(args) {
    let user = args[1];
    if(!user) { return groupsls.join(' ') }
    let msg = "";
    groupsls.forEach(function(item) {
        if(item == user) {
            msg = item;
            return msg;
        }
    })
    return msg;
}

function hostname() {
    return user_hostname;
}

function listDirectory() {
    let directories = "..";
    hierarchy.forEach(function(item) {
        if(item.current && !item.filedata) { item.command = "." }
        directories += '	' + item.command;
    })
    return directories;
}

function changeDirectory(args) {
    let new_dir = args[1];
    if(!new_dir) { new_dir = "." }
    let msg = undefined;
    new_dir = new_dir.replace('~', `/home/${user}/`)
    hierarchy.forEach(function(item) {
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
            hierarchy.forEach(function(item) {
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
        hierarchy.forEach(function(item) {
            item.current = false;
        })
        hierarchy.forEach(function(item) {
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
        return `cat: ${file}: is a directory.`
    }
    let counter = 0;
    hierarchy.forEach(function(item) {
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
    if(Object.keys(hierarchy).length == counter) { console.log("a"); return `${file}: No such file or directory (os error 2)`; }
    return msg;
}

function evaluate(value, callback) {
    let result = undefined;
    values = value.split(" ");
    let counter = 0;
    commands.forEach(function(item) {
        if(item.command == values[0]) {
            if(item.callback) {
                response = item.exec(values, function(response) {
                    callback(response);
                })
            } else {
                response = item.exec(values);
                callback(response);
            }
        } else {
            counter++;
        }
    })
    if(Object.keys(commands).length == counter) { callback(`marisa-term: command not found: ${value}`)}
}

function getKeyPress(element) {
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

            exec = evaluate(val, async function(response) {
                if(response.trim()) {
                    output.innerHTML = response;
                    output.setAttribute("class", "inline-output");
                    val = undefined;
                    window.scrollTo(0,document.body.scrollHeight);
                }
                getPrompt();         
            });
        } else { getPrompt(); }

        element.parentNode.appendChild(output);
        element.outerHTML = "";   

        window.scrollTo(0,document.body.scrollHeight);
    }
}

function autoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

function getPrompt(prompt_message) {
    hierarchy.forEach(function(item) {
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
    inp.setAttribute("onkeydown", "getKeyPress(this)");
    inp.setAttribute("oninput", "autoGrow(this)");

    let screen = document.getElementById("screen");

    container.appendChild(user);
    container.appendChild(inp);
    screen.appendChild(container);
    inp.focus();
    window.scrollTo(0,document.body.scrollHeight);
}

document.addEventListener("keydown", globalHotkeys, false);

function globalHotkeys(event) {
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
        getPrompt();
        event.preventDefault(); 
    }
    if(event.keyCode == 38) {
        // arrow up
        value = shell_history[shell_history.length - 1]
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
            getPrompt();
        }
        catch(TypeError) {
            // val is null == interrupt is present
            let form = document.getElementById("interrupt");
            let container = form.parentElement;
            form.outerHTML = "";

            let history = document.createElement("p");
            history.innerHTML = `^C`;
            history.setAttribute("class", "inline-output");
            container.appendChild(history);

            getPrompt();
        }
        event.preventDefault(); 
    }
}



document.addEventListener('DOMContentLoaded', async function() {
    promise_finish = greeting().then(function() {
        getPrompt();
    })
 }, false);