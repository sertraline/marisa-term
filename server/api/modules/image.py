from PIL import Image
from os.path import join
import binascii


class Processor:

    DELIMITER = '001011110010110100101111'

    def __init__(self, config, support):
        self.config = config
        self.support = support

    def img_convert(self, **kwargs):
        file = kwargs['file']
        filename = kwargs['filename']
        target_ext = kwargs['target_ext']

        ext = self.support.get_extension(filename)
        if ext == target_ext:
            return "Your image is already %s." % target_ext

        image = Image.open(file)
        destination = join(self.config.UPLOAD_DIR, filename)
        saved = 0

        for extension in self.config.VALID['IMAGE']:
            if target_ext == extension:
                if target_ext in ('jpg', 'jpeg'):
                    image = image.convert('RGB')

                image.save(destination, extension)
                saved = 1
                break

        if not saved:
            return "Format was not recognized."
        return filename

    def get_image(self, file):
        image = Image.open(file)
        r, g, b, *alpha = image.convert('RGB').split()
        x, y = image.size[0], image.size[1]
        return r, g, b, alpha, x, y

    def bin_to_string(self, data):
        return (int(data, 2).to_bytes((len(data) + 7) // 8, 'big')).decode()

    def string_to_bin(self, data):
        return bin(int(binascii.hexlify(data.encode()), 16))[2:]

    def stegano_decode(self, file):
        r, g, b, alpha, x, y = self.get_image(file)
        text = ''

        for x_pixel in range(x):
            for y_pixel in range(y):
                bin_im_pixel = bin(r.getpixel((x_pixel, y_pixel)))
                text += bin_im_pixel[-1]
                if len(text) > len(self.DELIMITER):
                    # if delimiter is met, cut off and return
                    if self.DELIMITER in text[-24:]:
                        text = text[:-24]
                        return self.bin_to_string(text)
        try:
            return self.bin_to_string(text)
        except UnicodeDecodeError:
            return "Image is not encoded or is invalid."

    def stegano_encode(self, **kwargs):
        file = kwargs['file']
        filename = kwargs['filename']
        text = kwargs['text']

        r, g, b, alpha, x, y = self.get_image(file)

        filename = filename.rsplit('.')[0]
        filename = filename + '.' + 'png'

        counter = 0
        bin_text = self.string_to_bin(text)

        for x_cord in range(x):
            for y_cord in range(y):
                if counter >= len(bin_text):
                    if bin_text == self.DELIMITER:
                        if alpha:
                            result = Image.merge("RGBA", [r, g, b, alpha[0]])
                        else:
                            result = Image.merge("RGB", [r, g, b])
                        result.save(join(self.config.UPLOAD_DIR, filename), 'PNG')
                        return filename
                    counter = 0
                    bin_text = self.DELIMITER

                bin_im_pixel = bin(r.getpixel((x_cord, y_cord)))
                if bin_text[counter] == '1':
                    bin_im_pixel = bin_im_pixel[:-1] + '1'
                else:
                    bin_im_pixel = bin_im_pixel[:-1] + '0'

                r.putpixel((x_cord, y_cord), int(bin_im_pixel, base=2))
                counter += 1
