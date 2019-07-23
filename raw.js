let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+ today.getSeconds();

let boot_sequence = `
voltage set from 0x18 to 0x24, addr:0x36
voltage set from 0x18 to 0x2c, addr:0x37
voltage set from 0x38 to 0x48, addr:0x38
voltage set from 0x4e to 0x50, addr:0x4c
voltage set from 0x24 to 0x24, addr:0x4d                                                                   
voltage set from 0x30 to 0x30, addr:0x4e                                                                                                            
voltage set from 0x4e to 0x4e, addr:0x4f                                                                                                             
voltage set from 0x24 to 0x24, addr:0x50                                                                                                             
voltage set from 0x28 to 0x28, addr:0x56                                                                                                             
voltage set from 0x00 to 0x00, addr:0x57                                        
                                                                            
CPU clock is ${Math.floor(Math.random() * 1925)}MHz  

Aml log : DDR0 - init pass with                                     
PGSR0 : 0x80000fff                                                  
Aml log : DDR1 - init pass with                                     
PGSR0 : 0xc0000fff                                                  
                                                                    
DDR clock is 696MHz with 1T mode                                    
                                                                    
DDR check pass!                                                     

DRAM:  2 GiB                                                                    
relocation Offset is: 6fed4000  

show partition table:                                                          
part: 0, name :       logo, size : 2000000                                      
part: 1, name :   recovery, size : 2000000                                      
part: 2, name :       misc, size : 2000000                                      
part: 3, name :       boot, size : 2000000                                      
part: 4, name :     system, size : 40000000                                    
part: 5, name :      cache, size : 20000000                                    
part: 6, name :       data, size : end      

aml_card_type=0x100                                                            
MMC:   [mmc_register] add mmc dev_num=0, port=1, if_type=6                      
[mmc_register] add mmc dev_num=1, port=2, if_type=6                            
SDIO Port B: 0, SDIO Port C: 1                                                  
aml_i2c_init                                                                    
PMU fault status:                                                              
reg[0x9A] = 0x1d      

[RN5T618]rn5t618_set_gpio, gpio:3, output:0                                    
[RN5T618]rn5t618_set_gpio, gpio:1, output:0                                    
[RN5T618] DUMP ALL REGISTERS      

0x00 - 0f: 04 0c 10 00 00 00 00 00   00 01 00 03 9f 00 00 00                    
0x10 - 1f: 69 05 00 00 00 0f cc 99   dd 00 00 bf 22 ee dd ee                    
0x20 - 2f: 00 00 00 00 00 ff ff ff   0f 00 cc 00 13 03 13 03                    
0x30 - 3f: 13 03 00 00 00 00 24 2c   48 00 00 18 18 38 00 00                    
0x40 - 4f: 00 00 00 00 1f 30 ff 00   00 00 00 00 50 24 30 4e                    
0x50 - 5f: 24 00 00 00 00 00 28 00   4e 24 30 4e 24 00 00 00                    
0xb0 - bf: 06 07 00 23 00 21 18 05   02 3b 01 34 01 00 7f ff     

mcli -- wifi_power_init in uboot --       

NAND:  SPI BOOT: boot_device_flag 0                                            
Nand PHY driver Version: 1.01.001.0003 (c) 2013 Amlogic Inc.                    
amlnf_phy_init : amlnf init flag 0                                              
NAND device id: 2c 64 44 4b a9 0 0 0                                            
detect NAND device: B revision NAND 8GiB MT29F64G08CBABA                        
AML_NAND_NEW_OOB : new oob                                                      
bus_cycle=5, bus_timing=7,system=3.9ns,flash->T_REA =16,flash->T_RHOH=15        
NAND CKECK  : arg nbbt: arg_valid= 1, valid_blk_addr = 5, valid_page_addr = 0  
NAND CKECK  : arg ncnf: arg_valid= 1, valid_blk_addr = 8, valid_page_addr = 0  
NAND CKECK  : arg nkey: arg_valid= 1, valid_blk_addr = 4, valid_page_addr = 0  
i=0,register --- nand_key                      

nfcache   : offset: 0x000006000000 -0x000024800000 : partitons 1 : single_chip e
nfcode    : offset: 0x00002a800000 -0x000050000000 : partitons 5 : single_chip e
nfdata    : offset: 0x00007a800000 -0x000185800000 : partitons 1 : single_chip e

amlnf_logic_init: START                                                        
amlnf_logic_init:  COMPLETE                                                    
get_boot_device_flag: init_ret 0                                                
get_boot_device_flag   SPI BOOT:                                                
nand init success, change the device_boot_flag to 4 : spi+nand                  
SPI BOOT,spi_env_relocate_spec : env_relocate_spec 53                          
SF: Detected MX25L1605D with page size 256, total 2 MiB                        
                                                                                                                                            

Starting udev:                                              <span class="hg-succ">[  OK  ]</span>
Setting hostname horizon:                                   <span class="hg-succ">[  OK  ]</span>
Setting up Logical Volume Management:                       <span class="hg-succ">[  OK  ]</span>
Checking filesystems
/dev/sda1: clean, 45838/50857856 files, 1563123/183223421 blocks

Remounting root filesystem in read-write mode:              <span class="hg-succ">[  OK  ]</span>
Mounting local filesystems:                                 <span class="hg-succ">[  OK  ]</span>
Enabling local filesystem quotas:                           <span class="hg-succ">[  OK  ]</span>
Enabling /etc/fstab swaps:                                  <span class="hg-succ">[  OK  ]</span>
Entering non-interactive startup

Bringing up loopback interface:                             <span class="hg-succ">[  OK  ]</span>
Bringing up interface eth0:  
Determining IP information for eth0... done.
                                                            <span class="hg-succ">[  OK  ]</span>
Starting auditd:                                            <span class="hg-succ">[  OK  ]</span>
Starting system logger:                                     <span class="hg-succ">[  OK  ]</span>

Starting system message bus:                                <span class="hg-succ">[  OK  ]</span>
Starting Avahi daemon...                                    <span class="hg-succ">[  OK  ]</span>
Mounting filesystems:                                       <span class="hg-succ">[  OK  ]</span>
Starting acpi daemon:                                       <span class="hg-succ">[  OK  ]</span>
Starting HAL daemon:                                        <span class="hg-succ">[  OK  ]</span>
Retrigger failed udev events                                <span class="hg-succ">[  OK  ]</span>
Starting Queue callback daemon:                             <span class="hg-succ">[  OK  ]</span>
Starting REST applications daemon:                          <span class="hg-succ">[  OK  ]</span>
Starting dnsmasq:                                           <span class="hg-succ">[  OK  ]</span>
Starting sshd:                                              <span class="hg-succ">[  OK  ]</span>
Starting xinetd:                                            <span class="hg-succ">[  OK  ]</span>
Starting ntpd:                                              <span class="hg-succ">[  OK  ]</span>
Starting UPS monitoring:                                    <span class="hg-succ">[  OK  ]</span>
Starting mysqld:                                            <span class="hg-succ">[  OK  ]</span>
Starting postfix:                                           <span class="hg-fail">[FAILED]</span>

SETTING FILE PERMISSIONS...................Done
Removing any dangling symlinks
Dangling symlinks removed

STARTING ASTERISK
Asterisk Started
Starting REST applications daemon:                          <span class="hg-succ">[  OK  ]</span>`.split('\n');

let message = `
Welcome to marisa-term!
marisa-term 0.01 ${date} (horizon) (tty1)\n`;

let raw_links = `https://tsunagari.space/ `.split('\n');

function urlify(text) {
    let url_regex = /(https?:\/\/[^\s]+)/g;
    return text.replace(url_regex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
}

let links = "";
raw_links.forEach(function(item) {
    links += urlify(item) + '\n';
})

let hierarchy = [
    {
        "name": "/home/anon/",
        "command": "~",
        "current": true,
        "filedata": false,
        "parent": false
    },
    {
        "name": "links",
        "command": "<span class='file'>links</span>",
        "current": false,
        "filedata": links,
        "parent": "/home/anon/"
    }
]

let prompt = `[${hierarchy[0].name}] 良い `

