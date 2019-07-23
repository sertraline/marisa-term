
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

let commands = [
    {
        "name": "list",
        "command": "ls",
        "exec": listDirectory
    },
    {
        "name": "changedir",
        "command": "cd",
        "exec": changeDirectory
    },
    {
        "name": "cat",
        "command": "cat",
        "exec": cat
    }
]

function listDirectory() {
    directories = "..";
    hierarchy.forEach(function(item) {
        if(item.current && !item.filedata) { item.command = "." }
        directories += '	' + item.command;
    })
    return directories;
}

function changeDirectory(new_dir) {
    if(!new_dir) { new_dir = "." }
    msg = undefined;
    new_dir = new_dir.replace('~', '/home/anon/')
    hierarchy.forEach(function(item) {
        if(new_dir == item.name) {
            if(item.filedata) {
                msg = `cd: not a directory: ${new_dir}`;
                return msg;
            }
        }
        if(new_dir == ".") {
            msg = " ";
            return msg;
        }
        if(new_dir == "..") {
            path = ""
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

function cat(file) {
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

function evaluate(value) {
    result = undefined;
    value = value.split(" ");
    commands.forEach(function(item) {
        if(item.command == value[0]) {
            result = item.exec(value[1]);
            return result;
        }
    })
    result = result ? result : `marisa-term: command not found: ${value}`;
    return result;
}

function getKeyPress(element) {
    if(event.key === 'Enter') {
        event.preventDefault();
        let val = element.value;

        let history = document.createElement("p");
        history.innerHTML = val;
        history.setAttribute("class", "inline");
        element.parentElement.appendChild(history);

        if(val) {
            exec = evaluate(val);
        }
        if(exec.trim()) {
            let output = document.createElement("p");
            output.innerHTML = exec;
            output.setAttribute("class", "inline-output");
            element.parentElement.appendChild(output);
        }

        element.outerHTML = "";  
        getPrompt(); 
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
            prompt_message = `[${item.name.replace("/home/anon/", "~")}] 良い `;
        }
    })
    let container = document.createElement("div");
    container.setAttribute("class", "container");

    let user = document.createElement("p");
    user.innerHTML = prompt_message;
    user.setAttribute("class", "inline-pre")

    let inp = document.createElement("textarea");
    inp.setAttribute("type", "text");
    inp.setAttribute("class", "shell");
    inp.setAttribute("onkeydown", "getKeyPress(this)");
    inp.setAttribute("oninput", "autoGrow(this)");

    let screen = document.getElementById("screen");

    container.appendChild(user);
    container.appendChild(inp);
    screen.appendChild(container);
    inp.focus();
}

document.addEventListener('DOMContentLoaded', async function() {
    promise_finish = greeting().then(async function(is_finished) {
        while(true) {
            if(is_finished != "done") {
                await sleep(100);
            }
            else {
                getPrompt();
                break;
            }
        }
    })
 }, false);