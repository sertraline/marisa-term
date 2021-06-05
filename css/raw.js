let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+ today.getSeconds();

export var boot_sequence = `
voltage set from 0x18 to 0x24, addr:0x36
voltage set from 0x18 to 0x2c, addr:0x37
voltage set from 0x38 to 0x48, addr:0x38
voltage set from 0x4e to 0x50, addr:0x4c
                                                                            
CPU clock is ${Math.floor(Math.random() * 1925)}MHz

Aml log : DDR0 - init pass with
PGSR0 : 0x80000fff
                                                                    
DDR clock is 696MHz with 1T mode

DRAM:  2 GiB
relocation Offset is: 6fed4000

RN5T618]rn5t618_set_gpio, gpio:3, output:0
[RN5T618]rn5t618_set_gpio, gpio:1, output:0
[RN5T618] DUMP ALL REGISTERS

0x00 - 0f: 04 0c 10 00 00 00 00 00   00 01 00 03 9f 00 00 00
0x10 - 1f: 69 05 00 00 00 0f cc 99   dd 00 00 bf 22 ee dd ee
0x20 - 2f: 00 00 00 00 00 ff ff ff   0f 00 cc 00 13 03 13 03
0x30 - 3f: 13 03 00 00 00 00 24 2c   48 00 00 18 18 38 00 00

NAND:  SPI BOOT: boot_device_flag 0
Nand PHY driver Version: 1.01.001.0003 (c) 2013 Amlogic Inc.
NAND device id: 2c 64 44 4b a9 0 0 0
detect NAND device: B revision NAND 8GiB MT29F64G08CBABA
AML_NAND_NEW_OOB : new oob
bus_cycle=5, bus_timing=7,system=3.9ns,flash->T_REA =16,flash->T_RHOH=15
NAND CKECK  : arg nbbt: arg_valid= 1, valid_blk_addr = 5, valid_page_addr = 0
NAND CKECK  : arg nkey: arg_valid= 1, valid_blk_addr = 4, valid_page_addr = 0
i=0,register --- nand_key

nfcache   : offset: 0x000006000000 -0x000024800000 : partitons 1 : single_chip e
nfcode    : offset: 0x00002a800000 -0x000050000000 : partitons 5 : single_chip e
nfdata    : offset: 0x00007a800000 -0x000185800000 : partitons 1 : single_chip e

and init success, change the device_boot_flag to 4 : spi+nand
SPI BOOT,spi_env_relocate_spec : env_relocate_spec 53
SF: Detected MX25L1605D with page size 256, total 2 MiB


Starting udev:                                              <span class="hg-succ">[  OK  ]</span>
Setting hostname horizon:                                   <span class="hg-succ">[  OK  ]</span>
Checking filesystems
/dev/sda1: clean, 45838/50857856 files, 1563123/183223421 blocks

Remounting root filesystem in read-write mode:              <span class="hg-succ">[  OK  ]</span>
Mounting local filesystems:                                 <span class="hg-succ">[  OK  ]</span>
Entering non-interactive startup

Bringing up loopback interface:                             <span class="hg-succ">[  OK  ]</span>
Bringing up interface eth0:  
Determining IP information for eth0... done.
                                                            <span class="hg-succ">[  OK  ]</span>
Starting system message bus:                                <span class="hg-succ">[  OK  ]</span>
Mounting filesystems:                                       <span class="hg-succ">[  OK  ]</span>
Starting acpi daemon:                                       <span class="hg-succ">[  OK  ]</span>
Starting sshd:                                              <span class="hg-succ">[  OK  ]</span>
Starting mysqld:                                            <span class="hg-succ">[  OK  ]</span>
Starting postfix:                                           <span class="hg-fail">[FAILED]</span>

SETTING FILE PERMISSIONS...................Done
Removing any dangling symlinks
Dangling symlinks removed

STARTING ASTERISK
Asterisk Started
Starting REST applications daemon:                          <span class="hg-succ">[  OK  ]</span>`.split('\n');

export var version = `0.08`;

export var message = `
Welcome to <a class="term-link" href="https://github.com/sertraline/marisa-term">marisa-term</a>!
marisa-term ${version} ${date} (horizon) (tty1)
type 'help' to get a list of available commands.
`;

export var user = "anon";

export var groupsls = [
    "anon",
    "aurora"
]

export var user_hostname = "horizon";

export var lsblk = `NAME            MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
sda               8:0    0 465.8G  0 disk  
└─sda1            8:1    0     1G  0 part  /
`;

export function fetch_file(arg, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/fetch', true);
    xhr.onload = function() {
        callback(xhr.responseText);
    };
    let data = new FormData();
    data.append('filename', arg);
    xhr.send(data);
}

export var hierarchy = [
    {
        "name": `${user}`,
        "command": "~",
        "current": true,
        "filedata": false,
        "parent": false,
        "childs": [1, 2, 3, 4]
    },
    {
        "name": "pale_fire.txt",
        "command": "<span class='file'>pale_fire.txt</span>",
        "current": false,
        "filedata": false,
	    "fetch": "pale_fire",
        "parent": "anon"
    },
    {
        "name": "marisa_gifs",
        "command": "marisa_gifs",
        "current": false,
        "filedata": false,
        "parent": "anon",
        "childs": [4, 5, 6, 7, 8]
    },
    {
        "name": "marisa1",
        "command": "<span class='file'>marisa1</span>",
        "current": false,
        "filedata": "<img class='smol' src='/css/img/marisa1.gif'></img>",
        "parent": "marisa_gifs"
    },
    {
        "name": "marisa2",
        "command": "<span class='file'>marisa2</span>",
        "current": false,
        "filedata": "<img class='smol' src='/css/img/marisa2.gif'></img>",
        "parent": "marisa_gifs"
    },
    {
        "name": "marisa3",
        "command": "<span class='file'>marisa3</span>",
        "current": false,
        "filedata": "<img class='smol' src='/css/img/marisa3.gif'></img>",
        "parent": "marisa_gifs"
    },
    {
        "name": "marisa4",
        "command": "<span class='file'>marisa4</span>",
        "current": false,
        "filedata": "<img class='smol' src='/css/img/marisa4.gif'></img>",
        "parent": "marisa_gifs"
    },
    {
        "name": "marisa_big",
        "command": "<span class='file'>marisa_big</span>",
        "current": false,
        "filedata": "<img class='smol' src='/css/img/marisa_big.gif'></img>",
        "parent": "marisa_gifs"
    }
]

export var prompt = `${user}@${user_hostname}:[${hierarchy[0].name}]$`
