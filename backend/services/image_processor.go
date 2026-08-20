package services

import (
	"image"
	"io"

	"github.com/disintegration/imaging"
)

type ProcessedImageResult struct {
	OriginalPath  string
	MediumPath    string
	ThumbnailPath string
}

func ResizeAndSaveImage(src image.Image, maxWidth int, destPath string, quality int) error {
	var target image.Image
	bounds := src.Bounds()
	if bounds.Dx() > maxWidth {
		target = imaging.Resize(src, maxWidth, 0, imaging.Lanczos)
	} else {
		target = src
	}

	return imaging.Save(target, destPath, imaging.JPEGQuality(quality))
}

func DecodeImage(r io.Reader) (image.Image, error) {
	return imaging.Decode(r, imaging.AutoOrientation(true))
}
