import mime from 'mime';
import { describe, expect, it, vi } from 'vitest';

import { getImageOptions } from '.';

describe('getImageOptions', () => {
  it('should return correct cache control and content type', () => {
    const imagePath = 'path/to/image.jpg';
    const expectedOptions = {
      cacheControl: '604800',
      contentType: 'image/jpeg',
    };
    const getTypeSpy = vi.spyOn(mime, 'getType').mockReturnValueOnce('image/jpeg');

    expect(getImageOptions(imagePath)).toEqual(expectedOptions);
    expect(getTypeSpy).toHaveBeenCalledWith(imagePath);
  });

  it('should return default content type if mime type is not found', () => {
    const imagePath = 'path/to/image.xyz';
    const expectedOptions = {
      cacheControl: '604800',
      contentType: 'image/jpg',
    };
    const getTypeSpy = vi.spyOn(mime, 'getType').mockReturnValueOnce(null);

    expect(getImageOptions(imagePath)).toEqual(expectedOptions);
    expect(getTypeSpy).toHaveBeenCalledWith(imagePath);
  });
});
