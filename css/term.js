
shell_history = []

let commands = [
    {
        "name": "list directories",
        "command": "ls",
        "exec": listDirectory
    },
    {
        "name": "change directory",
        "command": "cd",
        "exec": changeDirectory
    },
    {
        "name": "concatenate",
        "command": "cat",
        "exec": cat
    },
    {
        "name": "whoami",
        "command": "whoami",
        "exec": whoami
    },
    {
        "name": "groups",
        "command": "groups",
        "exec": groups
    },
    {
        "name": "hostname",
        "command": "hostname",
        "exec": hostname
    },
    {
        "name": "hex code -> rgb",
        "command": "hextorgb",
        "exec": hextorgb
    },
    {
        "name": "get host by name",
        "command": "host",
        "callback": true,
        "exec": host
    },
    {
        "name": "get weather",
        "command": "weather",
        "callback": true,
        "exec": weather
    },
    {
        "name": "show help",
        "command": "help",
        "exec": help
    }
]

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


function help() {
    let msg = ""
    commands.forEach(function(item) {
        msg += item.command + ': ' + item.name + '\n';
    })
    msg += "\nEsc: set/unset focus\nCtrl+L: clear terminal\nArrow up: navigate through history";
    return msg;
}

function apiCall(params, callback) {
    // params = {
    // "req": command,
    // "args": args }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        callback(xhr.responseText);
    };
    payload = ""
    Object.keys(params).forEach(function(key) {
        payload += key + '=' + params[key] + '&';
    })
    xhr.send(payload);
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
    if(!file) { msg = "cat: cat. Cat?"}
    hierarchy.forEach(function(item) {
        if(file == item.name) {
            if(item.filedata) {
                msg = item.filedata;
                return msg;
            }
        }
    })
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
        if(shell_history.length <= 25 && val) {
            shell_history.push(val);
        } else {
            shell_history.shift();
            shell_history.push(val);
        }
        let history = document.createElement("p");
        history.innerHTML = val;
        history.setAttribute("class", "inline");
        element.parentElement.appendChild(history);

        let output = document.createElement("p");
        output.setAttribute("class", "inline-hidden");

        if(val) {
            exec = evaluate(val, async function(response) {
                if(response.trim()) {
                    output.innerHTML = response;
                    output.setAttribute("class", "inline-output");
                    val = undefined;
                    window.scrollTo(0,document.body.scrollHeight);
                }
                getPrompt();
                window.scrollTo(0,document.body.scrollHeight);         
            });
        }

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
        // enter
        let val = document.getElementById("shell");
        let container = val.parentElement;

        let history = document.createElement("p");
        history.innerHTML = val.value;
        history.setAttribute("class", "inline");
        container.appendChild(history);

        document.getElementById("shell").outerHTML = "";
        getPrompt();
        event.preventDefault(); 
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    promise_finish = greeting().then(function() {
        getPrompt();
    })
 }, false);