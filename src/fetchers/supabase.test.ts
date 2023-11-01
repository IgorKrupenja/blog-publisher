import { describe, expect, it, spyOn } from 'bun:test';
import mime from 'mime';

import { expectToHaveBeenCalledWith } from '../test/test-util';

import { getImageOptions } from '.';

describe.skip('getImageOptions', () => {
  it('should return correct cache control and content type', () => {
    const imagePath = 'path/to/image.jpg';
    const expectedOptions = {
      cacheControl: '604800',
      contentType: 'image/jpeg',
    };
    const getTypeSpy = spyOn(mime, 'getType').mockReturnValueOnce('image/jpeg');

    expect(getImageOptions(imagePath)).toEqual(expectedOptions);

    expectToHaveBeenCalledWith(getTypeSpy, [imagePath]);
  });

  it('should return default content type if mime type is not found', () => {
    const imagePath = 'path/to/image.xyz';
    const expectedOptions = {
      cacheControl: '604800',
      contentType: 'image/jpg',
    };
    const getTypeSpy = spyOn(mime, 'getType').mockReturnValueOnce(null);

    expect(getImageOptions(imagePath)).toEqual(expectedOptions);
    expectToHaveBeenCalledWith(getTypeSpy, [imagePath]);
  });
});
