class ImgConvert {
    static name = "ImgConvert";
    static id = "imgconvert";

    static command = {
        'name': ImgConvert.name,
        'id': ImgConvert.id,
        'exec': ImgConvert.run
    }

    static run(args) {
        return new Promise((resolve) => {
            let format = args.split(' ')[1];
            let extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

            const noformat = `you haven't specified format to convert your image to.\nusage: imgconvert [${extensions.join('|')}]`;
            const wrongformat = `looks like extension you provided is invalid. Available formats: ${extensions}`;
            console.log(format);
            if(!format) {
                resolve({
                    'response': noformat
                })
            } else if (!extensions.includes(format)) {
                resolve({
                    'response': wrongformat
                })
            } else {
                resolve({
                    'intertype': 'convert',
                    'args': format
                })
            }
        })
    }
}

export default ImgConvert